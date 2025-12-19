# Automatic Database Setup on Deployment

## Overview

The application now automatically sets up the database (migrations and seeding) during deployment on Vercel. No manual steps required!

## How It Works

1. **During Build**: The `vercel-build` script runs `setup-db.js` before building Next.js
2. **Database Setup**: The script:
   - Checks if `DATABASE_URL` is set
   - Creates tables if they don't exist (idempotent)
   - Creates/updates admin user
   - Seeds initial data (if needed)

3. **Graceful Handling**: 
   - If `DATABASE_URL` is not set, setup is skipped (won't fail build)
   - If database connection fails, build continues (unless `FAIL_ON_DB_ERROR=true`)

## Vercel Environment Variables

Set these in your Vercel project settings:

### Required
- `DATABASE_URL` - PostgreSQL connection string
  ```
  postgresql://username:password@host:port/database
  ```

### Optional
- `ADMIN_EMAIL` - Admin user email (default: `admin@healthfitness.com`)
- `ADMIN_PASSWORD` - Admin user password (default: `admin123`)
- `JWT_SECRET` - Secret for JWT tokens (required for auth)
- `GEMINI_API_KEY` - Google Gemini API key (for AI chatbot)
- `NODE_ENV` - Set to `production`

### Advanced
- `FAIL_ON_DB_ERROR` - Set to `true` to fail build if database setup fails (default: continues)

## Deployment Flow

```
1. Vercel clones repository
2. Runs: npm install
3. Runs: npm run vercel-build
   ├── Runs: node scripts/setup-db.js
   │   ├── Connects to database
   │   ├── Creates tables (if missing)
   │   ├── Creates admin user
   │   └── Seeds initial data
   └── Runs: next build
4. Deployment complete ✅
```

## First Deployment

1. **Set Environment Variables** in Vercel Dashboard:
   - Go to Project → Settings → Environment Variables
   - Add `DATABASE_URL` with your PostgreSQL connection string
   - Add `JWT_SECRET` (generate a random string)
   - Add `GEMINI_API_KEY` (if using AI chatbot)
   - Optionally set `ADMIN_EMAIL` and `ADMIN_PASSWORD`

2. **Deploy**: Push to GitHub or trigger deployment
   - Database tables will be created automatically
   - Admin user will be created automatically
   - Initial seed data will be inserted (if seed.sql exists)

3. **Access Admin Panel**:
   - Go to: `https://your-app.vercel.app/admin/login`
   - Login with:
     - Email: Value of `ADMIN_EMAIL` (or `admin@healthfitness.com`)
     - Password: Value of `ADMIN_PASSWORD` (or `admin123`)

## Database Providers

### Recommended: Vercel Postgres
1. Go to Vercel Dashboard → Your Project → Storage
2. Click "Create Database" → "Postgres"
3. Vercel automatically sets `POSTGRES_URL` (use this as `DATABASE_URL`)

### Alternative: External PostgreSQL
- **Supabase**: Free tier available, easy setup
- **Neon**: Serverless PostgreSQL, free tier
- **Railway**: Simple PostgreSQL hosting
- **AWS RDS**: For production scale

## Verification

After deployment, check the build logs:

```
✓ Connected to database
📦 Running database migrations...
✓ Database schema created successfully
👤 Setting up admin user...
✓ Admin user ready: admin@healthfitness.com
🌱 Seeding initial data...
✓ Initial data seeded
✅ Database setup completed successfully!
```

## Troubleshooting

### Build Fails with Database Error

**Option 1**: Skip database setup (if database not ready yet)
- Don't set `DATABASE_URL` (setup will be skipped)
- Set up database later and redeploy

**Option 2**: Make database setup required
- Set `FAIL_ON_DB_ERROR=true`
- Build will fail if database setup fails

### Admin User Not Created

- Check build logs for errors
- Verify `DATABASE_URL` is correct
- Check database permissions
- Manually run: `npm run db:setup` locally with production `DATABASE_URL`

### Tables Already Exist

- This is fine! The script is idempotent
- It checks if tables exist before creating
- Safe to run multiple times

## Manual Setup (If Needed)

If automatic setup doesn't work, you can run manually:

```bash
# Set environment variable
export DATABASE_URL=your_connection_string

# Run setup
npm run db:setup
```

## Security Notes

⚠️ **Important for Production**:
1. Change default admin password after first login
2. Use strong `JWT_SECRET` (random string, 32+ characters)
3. Use strong `ADMIN_PASSWORD` in production
4. Enable SSL for database connections
5. Restrict database access to Vercel IPs if possible

## Example Vercel Environment Variables

```
DATABASE_URL=postgresql://user:pass@host:5432/dbname?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
GEMINI_API_KEY=AIzaSy...
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecurePassword123!
NODE_ENV=production
```

## Next Steps After Deployment

1. ✅ Database is set up automatically
2. ✅ Admin user is created automatically
3. ⚠️ Change admin password (important!)
4. ⚠️ Update `JWT_SECRET` to a strong random value
5. ✅ Start managing content via admin panel

