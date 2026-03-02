const { pool } = require('../config/database');

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS "Contact" (
    id SERIAL PRIMARY KEY,
    "phoneNumber" VARCHAR(20),
    email VARCHAR(255),
    "linkedId" INTEGER REFERENCES "Contact"(id),
    "linkPrecedence" VARCHAR(10) NOT NULL CHECK ("linkPrecedence" IN ('primary', 'secondary')),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "deletedAt" TIMESTAMP WITH TIME ZONE
  );

  CREATE INDEX IF NOT EXISTS idx_contact_email ON "Contact"(email) WHERE "deletedAt" IS NULL;
  CREATE INDEX IF NOT EXISTS idx_contact_phone ON "Contact"("phoneNumber") WHERE "deletedAt" IS NULL;
  CREATE INDEX IF NOT EXISTS idx_contact_linked ON "Contact"("linkedId") WHERE "deletedAt" IS NULL;
`;

async function migrate() {
  try {
    console.log('Running database migrations...');
    await pool.query(createTableQuery);
    console.log('Database migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
