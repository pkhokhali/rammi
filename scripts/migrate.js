require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function migrate() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Running database migrations...');
    await pool.query(schema);
    console.log('✓ Database schema created successfully');

    const seedPath = path.join(__dirname, 'seed.sql');
    const seed = fs.readFileSync(seedPath, 'utf8');

    console.log('Seeding database...');
    await pool.query(seed);
    console.log('✓ Database seeded successfully');

    console.log('\n✅ Migration completed!');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();

