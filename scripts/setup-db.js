/**
 * Database Setup Script for Deployment
 * This script runs migrations and seeding automatically during deployment
 * It's safe to run multiple times (idempotent)
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables (works in both local and Vercel)
// Vercel provides env vars directly, no need for .env.local
require('dotenv').config({ path: '.env.local' });
require('dotenv').config(); // Also try root .env

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.warn('⚠️  DATABASE_URL not set. Skipping database setup.');
  console.warn('   This is normal if you haven\'t configured a database yet.');
  console.warn('   To enable database features, set DATABASE_URL in your environment variables.');
  process.exit(0); // Exit gracefully, don't fail the build
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function setupDatabase() {
  let client;
  try {
    client = await pool.connect();
    console.log('✓ Connected to database');

    // Check if tables exist
    const tablesCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'blogs', 'workouts', 'diet_content', 'categories', 'media', 'chat_logs')
    `);

    const existingTables = tablesCheck.rows.map(row => row.table_name);
    const requiredTables = ['users', 'blogs', 'workouts', 'diet_content', 'categories', 'media', 'chat_logs'];
    const missingTables = requiredTables.filter(t => !existingTables.includes(t));

    // Run migrations if tables are missing
    if (missingTables.length > 0) {
      console.log('📦 Running database migrations...');
      const schemaPath = path.join(__dirname, 'schema.sql');
      
      if (!fs.existsSync(schemaPath)) {
        console.error('❌ schema.sql not found');
        process.exit(1);
      }

      const schema = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schema);
      console.log('✓ Database schema created successfully');
    } else {
      console.log('✓ Database tables already exist, skipping migration');
    }

    // Seed admin user
    console.log('👤 Setting up admin user...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@healthfitness.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await client.query(
      `INSERT INTO users (email, password_hash, name, role) 
       VALUES ($1, $2, $3, $4) 
       ON CONFLICT (email) DO UPDATE SET 
         password_hash = EXCLUDED.password_hash,
         name = EXCLUDED.name,
         role = EXCLUDED.role`,
      [adminEmail, passwordHash, 'Super Admin', 'super_admin']
    );

    console.log(`✓ Admin user ready: ${adminEmail}`);
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️  Using default password in production. Please change it!');
    }

    // Seed initial data (optional, only if seed.sql exists)
    const seedPath = path.join(__dirname, 'seed.sql');
    if (fs.existsSync(seedPath)) {
      const seedCheck = await client.query('SELECT COUNT(*) as count FROM categories');
      const categoryCount = parseInt(seedCheck.rows[0]?.count || '0');
      
      if (categoryCount === 0) {
        console.log('🌱 Seeding initial data...');
        const seed = fs.readFileSync(seedPath, 'utf8');
        await client.query(seed);
        console.log('✓ Initial data seeded');
      } else {
        console.log('✓ Seed data already exists, skipping');
      }
    }

    console.log('\n✅ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Database setup error:', error.message);
    // Don't fail the build if database setup fails (might be intentional)
    if (process.env.NODE_ENV === 'production' && process.env.FAIL_ON_DB_ERROR !== 'true') {
      console.warn('⚠️  Continuing build despite database error (set FAIL_ON_DB_ERROR=true to fail)');
      process.exit(0);
    } else {
      process.exit(1);
    }
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

setupDatabase();

