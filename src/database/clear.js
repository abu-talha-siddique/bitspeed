const { pool } = require('../config/database');

async function clearDatabase() {
  try {
    console.log('🗑️  Deleting all contacts from database...');
    
    // Delete all rows from Contact table
    const result = await pool.query('DELETE FROM "Contact"');
    
    console.log(`✅ Deleted ${result.rowCount} contacts successfully!`);
    console.log('🔄 Resetting ID sequence...');
    
    // Reset auto-increment sequence
    await pool.query('ALTER SEQUENCE "Contact_id_seq" RESTART WITH 1');
    
    console.log('✅ Database cleared! IDs will start from 1 again.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

clearDatabase();
