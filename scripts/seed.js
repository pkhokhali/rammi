// Load environment variables (works in both local and production)
require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // Also try root .env

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function seed() {
  try {
    console.log('Seeding database...');

    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@healthfitness.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await pool.query(
      `INSERT INTO users (email, password_hash, name, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO UPDATE SET password_hash = $2`,
      [adminEmail, passwordHash, 'Super Admin', 'super_admin']
    );

    console.log(`✓ Admin user created/updated: ${adminEmail} / ${adminPassword}`);

    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      const seed = fs.readFileSync(seedPath, 'utf8');
      await pool.query(seed);
      console.log('✓ Seed data inserted');
    }

    console.log('✅ Seeding completed!');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();

