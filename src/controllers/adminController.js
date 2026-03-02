const { pool } = require('../config/database');

class AdminController {
  // Get all contacts
  async getAllContacts(req, res) {
    try {
      const query = `
        SELECT * FROM "Contact" 
        WHERE "deletedAt" IS NULL 
        ORDER BY "createdAt" ASC, id ASC
      `;
      const result = await pool.query(query);
      
      res.status(200).json({
        total: result.rows.length,
        contacts: result.rows
      });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  }

  // Clear all contacts
  async clearAllContacts(req, res) {
    try {
      const result = await pool.query('DELETE FROM "Contact"');
      await pool.query('ALTER SEQUENCE "Contact_id_seq" RESTART WITH 1');
      
      res.status(200).json({
        message: 'Database cleared successfully',
        deleted: result.rowCount
      });
    } catch (error) {
      console.error('Error clearing database:', error);
      res.status(500).json({ error: 'Failed to clear database' });
    }
  }

  // Delete specific contact by ID
  async deleteContact(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query('DELETE FROM "Contact" WHERE id = $1', [id]);
      
      if (result.rowCount === 0) {
        res.status(404).json({ error: 'Contact not found' });
        return;
      }
      
      res.status(200).json({
        message: `Contact ${id} deleted successfully`
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({ error: 'Failed to delete contact' });
    }
  }
}

const adminController = new AdminController();

module.exports = { adminController };
