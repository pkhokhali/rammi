# Admin Panel Setup Guide

## Common Issues and Solutions

### Issue 1: "Database not configured" Error

**Problem**: `DATABASE_URL` environment variable is not set.

**Solution**:
1. Create a `.env.local` file in the root directory
2. Add your PostgreSQL connection string:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   ```
3. Restart your development server

### Issue 2: "Invalid email or password" Error

**Problem**: No admin user exists in the database.

**Solution**: Run the database seed script to create default admin user:

```bash
npm run db:seed
```

This will create a default admin user:
- **Email**: `admin@healthfitness.com`
- **Password**: `admin123` (change this in production!)
- **Role**: `super_admin`

### Issue 3: Database Tables Don't Exist

**Problem**: Database migrations haven't been run.

**Solution**: Run the migration script:

```bash
npm run db:migrate
```

This will create all necessary tables (users, blogs, workouts, diet_content, categories, media, chat_logs).

### Issue 4: Login Works But Dashboard Shows Errors

**Problem**: Database connection issues or missing tables.

**Solution**:
1. Check that `DATABASE_URL` is correct
2. Verify database is accessible
3. Run migrations: `npm run db:migrate`
4. Check browser console for specific errors

## Setup Steps

### 1. Database Setup

```bash
# Install PostgreSQL (if not already installed)
# Create a database
createdb health_fitness_db

# Or using psql:
psql -U postgres
CREATE DATABASE health_fitness_db;
```

### 2. Environment Variables

Create `.env.local`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/health_fitness_db
JWT_SECRET=your-secret-key-change-in-production
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=development
```

### 3. Run Migrations

```bash
npm run db:migrate
```

### 4. Seed Database

```bash
npm run db:seed
```

### 5. Access Admin Panel

1. Go to `http://localhost:3000/admin/login`
2. Login with:
   - Email: `admin@healthfitness.com`
   - Password: `admin123`

### 6. Change Default Password (Important!)

After first login, you should change the default password. You can do this by:
- Updating the database directly, or
- Creating a password change feature in the admin panel

## Production Deployment

### On Vercel:

1. Add environment variables in Vercel Dashboard:
   - `DATABASE_URL` - Your production PostgreSQL connection string
   - `JWT_SECRET` - A strong random secret
   - `GEMINI_API_KEY` - Your Gemini API key
   - `NODE_ENV` - Set to `production`

2. Run migrations on production database:
   ```bash
   # Connect to production database
   DATABASE_URL=your_production_url npm run db:migrate
   ```

3. Seed production database (optional):
   ```bash
   DATABASE_URL=your_production_url npm run db:seed
   ```

## Troubleshooting

### Check Database Connection

Test your database connection:

```bash
psql $DATABASE_URL
```

### Check if Tables Exist

```sql
\dt
```

Should show: users, blogs, workouts, diet_content, categories, media, chat_logs

### Check if Admin User Exists

```sql
SELECT email, name, role FROM users;
```

### Reset Admin Password

```sql
-- Update password hash (use bcrypt to hash new password first)
UPDATE users SET password_hash = '$2a$10$...' WHERE email = 'admin@healthfitness.com';
```

Or use the seed script which will update the password if user exists.

## Default Admin Credentials

⚠️ **IMPORTANT**: Change these in production!

- **Email**: `admin@healthfitness.com`
- **Password**: `admin123`
- **Role**: `super_admin`

