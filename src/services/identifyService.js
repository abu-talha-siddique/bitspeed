const { pool } = require('../config/database');

class IdentifyService {
  /**
   * Find all contacts matching the given email or phone number
   */
  async findMatchingContacts(email, phoneNumber) {
    if (!email && !phoneNumber) {
      return [];
    }

    let query = `
      SELECT * FROM "Contact"
      WHERE "deletedAt" IS NULL AND (
    `;
    const params = [];
    const conditions = [];

    if (email) {
      params.push(email);
      conditions.push(`email = $${params.length}`);
    }

    if (phoneNumber) {
      params.push(phoneNumber);
      conditions.push(`"phoneNumber" = $${params.length}`);
    }

    query += conditions.join(' OR ') + ')';

    const result = await pool.query(query, params);
    return result.rows;
  }

  /**
   * Get all linked contacts (primary + all secondaries)
   */
  async getAllLinkedContacts(primaryId) {
    const query = `
      SELECT * FROM "Contact"
      WHERE "deletedAt" IS NULL 
        AND (id = $1 OR "linkedId" = $1)
      ORDER BY "createdAt" ASC, id ASC
    `;
    const result = await pool.query(query, [primaryId]);
    return result.rows;
  }

  /**
   * Create a new contact
   */
  async createContact(email, phoneNumber, linkedId, linkPrecedence) {
    const query = `
      INSERT INTO "Contact" (email, "phoneNumber", "linkedId", "linkPrecedence")
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [email || null, phoneNumber || null, linkedId, linkPrecedence]);
    return result.rows[0];
  }

  /**
   * Update a contact to secondary and link it to a primary
   */
  async updateToSecondary(contactId, primaryId) {
    const query = `
      UPDATE "Contact"
      SET "linkedId" = $1, "linkPrecedence" = 'secondary', "updatedAt" = NOW()
      WHERE id = $2
    `;
    await pool.query(query, [primaryId, contactId]);
  }

  /**
   * Update all secondaries of one primary to point to another primary
   */
  async relinkSecondaries(oldPrimaryId, newPrimaryId) {
    const query = `
      UPDATE "Contact"
      SET "linkedId" = $1, "updatedAt" = NOW()
      WHERE "linkedId" = $2
    `;
    await pool.query(query, [newPrimaryId, oldPrimaryId]);
  }

  /**
   * Main identify logic
   */
  async identify(request) {
    const { email, phoneNumber } = request;

    // Find all matching contacts
    const matchingContacts = await this.findMatchingContacts(email, phoneNumber);

    if (matchingContacts.length === 0) {
      // No existing contact - create new primary
      const newContact = await this.createContact(email, phoneNumber, null, 'primary');
      return this.formatResponse([newContact]);
    }

    // Get all primary contacts from matches
    const primaryContacts = matchingContacts.filter((c) => c.linkPrecedence === 'primary');
    const secondaryContacts = matchingContacts.filter((c) => c.linkPrecedence === 'secondary');

    // Get all unique primary IDs (from primary contacts and linkedIds of secondary contacts)
    const primaryIds = new Set();
    primaryContacts.forEach((c) => primaryIds.add(c.id));
    secondaryContacts.forEach((c) => {
      if (c.linkedId) primaryIds.add(c.linkedId);
    });

    const primaryIdsArray = Array.from(primaryIds).sort((a, b) => a - b);

    let finalPrimaryId;

    if (primaryIdsArray.length === 0) {
      // Should not happen, but handle edge case
      const newContact = await this.createContact(email, phoneNumber, null, 'primary');
      return this.formatResponse([newContact]);
    } else if (primaryIdsArray.length === 1) {
      // All contacts already linked to same primary
      finalPrimaryId = primaryIdsArray[0];
    } else {
      // Multiple primaries need to be merged - keep oldest as primary
      finalPrimaryId = primaryIdsArray[0]; // Oldest primary (lowest ID)

      // Convert other primaries to secondary and relink their secondaries
      for (let i = 1; i < primaryIdsArray.length; i++) {
        const otherPrimaryId = primaryIdsArray[i];
        await this.updateToSecondary(otherPrimaryId, finalPrimaryId);
        await this.relinkSecondaries(otherPrimaryId, finalPrimaryId);
      }
    }

    // Get all linked contacts after merge
    const allLinkedContacts = await this.getAllLinkedContacts(finalPrimaryId);

    // Check if we need to create a new secondary contact
    const needsNewContact = this.shouldCreateNewContact(allLinkedContacts, email, phoneNumber);

    if (needsNewContact) {
      const newSecondary = await this.createContact(email, phoneNumber, finalPrimaryId, 'secondary');
      allLinkedContacts.push(newSecondary);
    }

    return this.formatResponse(allLinkedContacts);
  }

  /**
   * Check if the incoming request contains new information
   */
  shouldCreateNewContact(existingContacts, email, phoneNumber) {
    // Check if exact combination already exists
    const exactMatch = existingContacts.some(
      (c) => c.email === (email || null) && c.phoneNumber === (phoneNumber || null)
    );

    if (exactMatch) {
      return false;
    }

    // Check if both email and phone are provided and bring new information
    if (email && phoneNumber) {
      const hasEmail = existingContacts.some((c) => c.email === email);
      const hasPhone = existingContacts.some((c) => c.phoneNumber === phoneNumber);

      // If we have either email or phone, but not the exact combination, create new contact
      if (hasEmail || hasPhone) {
        return true;
      }
    }

    // If only email is provided
    if (email && !phoneNumber) {
      const hasEmail = existingContacts.some((c) => c.email === email);
      return !hasEmail;
    }

    // If only phone is provided
    if (phoneNumber && !email) {
      const hasPhone = existingContacts.some((c) => c.phoneNumber === phoneNumber);
      return !hasPhone;
    }

    return false;
  }

  /**
   * Format the response
   */
  formatResponse(contacts) {
    // Sort by createdAt to ensure primary is first
    const sortedContacts = contacts.sort((a, b) => {
      if (a.createdAt.getTime() !== b.createdAt.getTime()) {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
      return a.id - b.id;
    });

    const primary = sortedContacts.find((c) => c.linkPrecedence === 'primary');
    const secondaries = sortedContacts.filter((c) => c.linkPrecedence === 'secondary');

    if (!primary) {
      throw new Error('No primary contact found');
    }

    // Collect unique emails (primary first)
    const emailsSet = new Set();
    const emails = [];
    if (primary.email) {
      emails.push(primary.email);
      emailsSet.add(primary.email);
    }
    secondaries.forEach((c) => {
      if (c.email && !emailsSet.has(c.email)) {
        emails.push(c.email);
        emailsSet.add(c.email);
      }
    });

    // Collect unique phone numbers (primary first)
    const phonesSet = new Set();
    const phoneNumbers = [];
    if (primary.phoneNumber) {
      phoneNumbers.push(primary.phoneNumber);
      phonesSet.add(primary.phoneNumber);
    }
    secondaries.forEach((c) => {
      if (c.phoneNumber && !phonesSet.has(c.phoneNumber)) {
        phoneNumbers.push(c.phoneNumber);
        phonesSet.add(c.phoneNumber);
      }
    });

    return {
      contact: {
        primaryContatctId: primary.id,
        emails,
        phoneNumbers,
        secondaryContactIds: secondaries.map((c) => c.id),
      },
    };
  }
}

const identifyService = new IdentifyService();

module.exports = { identifyService };
