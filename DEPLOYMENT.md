# Vercel Deployment Guide

## Quick Deploy

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   In Vercel dashboard, add these environment variables:
   - `GEMINI_API_KEY` - Your Google Gemini API key
   - `DATABASE_URL` - PostgreSQL connection string (if using database)
   - `JWT_SECRET` - Secret key for JWT tokens
   - `NODE_ENV` - Set to `production`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your Next.js app

## Troubleshooting

### Error: "react-scripts: command not found"

**Solution**: This happens when Vercel detects the wrong framework. The `vercel.json` file in the root should fix this. If it persists:

1. In Vercel dashboard, go to Project Settings → General
2. Under "Framework Preset", select "Next.js"
3. Under "Build Command", ensure it's set to `npm run build` or leave empty (auto-detected)
4. Under "Output Directory", leave empty (auto-detected for Next.js)

### Build Fails

**Common causes:**
- Missing environment variables
- TypeScript errors
- Missing dependencies

**Fix:**
1. Check build logs in Vercel dashboard
2. Run `npm run build` locally to test
3. Fix any errors locally before pushing

### Database Connection Issues

If using PostgreSQL on Vercel:
- Use Vercel Postgres or external database (e.g., Supabase, Neon)
- Ensure `DATABASE_URL` is set correctly
- Database migrations need to run separately (not during build)

## Environment Variables Setup

Required for production:
```
GEMINI_API_KEY=your_api_key_here
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET=your_secret_here
NODE_ENV=production
```

## Post-Deployment

✅ **Database setup is now automatic!** 

The database migrations and seeding run automatically during deployment. No manual steps needed!

If you need to run setup manually:
```bash
# Set DATABASE_URL environment variable first
export DATABASE_URL=your_connection_string
npm run db:setup
```

3. **Test the deployment**
   - Visit your Vercel URL
   - Test all features
   - Check admin panel login

## Notes

- Vercel automatically handles Next.js builds
- No need for custom build scripts
- Static assets are automatically optimized
- API routes work out of the box
- Edge functions are supported
