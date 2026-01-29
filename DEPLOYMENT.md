# Deployment Guide - Lakshika Jewellers System

Complete guide for deploying the billing system to production.

## Production Deployment

### Option 1: Vercel (Recommended)

#### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Connect your repository

#### Step 2: Deploy
1. Click "New Project"
2. Import your repository
3. Vercel auto-detects Next.js
4. Click "Deploy"

#### Step 3: Configure Environment Variables
In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add `DATABASE_URL`: Your Supabase or Neon PostgreSQL URL
3. Redeploy the project

#### Step 4: Database Setup
```bash
# Locally or in Vercel CLI
npx prisma migrate deploy
npx prisma db seed
```

#### Result
Your app is live at: `https://your-app.vercel.app`

---

### Option 2: Supabase + Vercel

#### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy the connection string

#### Step 2: Update Database URL
```
DATABASE_URL="postgresql://postgres.XXX:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres"
```

#### Step 3: Run Migrations
```bash
npx prisma migrate deploy
npx prisma db seed --with-reset
```

#### Step 4: Deploy to Vercel
- Push to GitHub
- Vercel auto-deploys on push
- Set `DATABASE_URL` in Vercel environment

---

### Option 3: Self-Hosted (Node.js)

#### Prerequisites
- Node.js 18+
- PostgreSQL database
- Server/VPS

#### Step 1: Setup Server
```bash
# SSH into your server
ssh user@your-server.com

# Clone repository
git clone https://github.com/yourusername/lakshika-jewellers.git
cd lakshika-jewellers
```

#### Step 2: Install Dependencies
```bash
npm install --production
npm run build
```

#### Step 3: Configure Environment
```bash
# Create .env
DATABASE_URL="postgresql://user:password@localhost/lakshika"
NODE_ENV="production"
NEXT_PUBLIC_CURRENT_ROLE="Admin"
```

#### Step 4: Run Database Migrations
```bash
npx prisma migrate deploy
npx prisma db seed
```

#### Step 5: Start Application
```bash
npm run start
```

Or use PM2 for production:
```bash
npm install -g pm2
pm2 start "npm run start" --name "lakshika-jewellers"
pm2 save
pm2 startup
```

#### Step 6: Setup Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name jewellers.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Database Migration (SQLite to PostgreSQL)

### Before Deploying to Production

If migrating from SQLite development database:

#### Step 1: Backup Existing Data
```bash
# Export data
npm run prisma:export > backup.json
```

#### Step 2: Update Prisma Schema
Change datasource in `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### Step 3: Create New Migration
```bash
npx prisma migrate dev --name migrate_to_postgres
```

#### Step 4: Seed Production Data
```bash
npx prisma db seed
```

---

## Production Checklist

### Security
- [ ] Change `NEXT_PUBLIC_CURRENT_ROLE` to "Admin"
- [ ] Set strong database password
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Configure CORS if needed
- [ ] Set up database backups
- [ ] Enable SSL for database connection

### Performance
- [ ] Test database queries
- [ ] Configure caching headers
- [ ] Enable compression
- [ ] Monitor API response times
- [ ] Set up CDN (optional)

### Monitoring
- [ ] Setup error tracking (Sentry, etc.)
- [ ] Monitor database performance
- [ ] Setup uptime monitoring
- [ ] Configure log collection
- [ ] Setup alerts for errors

### Backups
- [ ] Enable automatic backups
- [ ] Test backup restoration
- [ ] Document recovery procedures
- [ ] Keep backups off-site

---

## Environment Variables (Production)

```env
# Database - Supabase PostgreSQL
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres"

# Application
NODE_ENV="production"
NEXT_PUBLIC_CURRENT_ROLE="Admin"

# Optional - Monitoring
SENTRY_DSN="https://..."
```

---

## Post-Deployment

### Verify Installation
```bash
# Check health endpoint
curl https://your-app.vercel.app/

# Test billing page
https://your-app.vercel.app/billing/ready-made
```

### Initial Setup
1. Login as Admin
2. Update company details in sidebar
3. Add real customers
4. Update inventory items
5. Configure payment settings

### Backup Strategy
- Daily automated backups
- Monthly long-term storage
- Test restore procedures monthly
- Document all backup locations

---

## Scaling (Future)

### When to Scale
- > 10,000 bills/month
- > 1000 concurrent users
- > 100GB database size

### Scaling Options
1. **Database**: Upgrade Supabase tier
2. **Caching**: Add Redis
3. **CDN**: Add Vercel Edge Functions
4. **Regions**: Distribute across regions

---

## Monitoring & Maintenance

### Weekly
- [ ] Check error logs
- [ ] Verify backup completion
- [ ] Monitor database size

### Monthly
- [ ] Review performance metrics
- [ ] Test disaster recovery
- [ ] Update dependencies
- [ ] Security audit

### Quarterly
- [ ] Full system backup test
- [ ] Capacity planning review
- [ ] Security penetration test

---

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL

# Check migrations
npx prisma migrate status

# View logs
npx prisma studio
```

### Build Errors on Vercel
```bash
# Clear cache and rebuild
# In Vercel: Settings → Deployments → Rebuild
```

### Performance Issues
```bash
# Check database query performance
npx prisma studio

# Analyze slow queries
# Database provider's query insights
```

---

## Rollback Plan

If deployment fails:

### Immediate Actions
1. Revert code to last working version
2. Trigger Vercel redeployment
3. Check database integrity

### Recovery Steps
```bash
# Restore from backup
npx prisma migrate resolve --rolled-back migration_name

# Reapply migrations
npx prisma migrate deploy
```

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## Deployment Success! 🎉

Your Lakshika Jewellers system is now live and ready for production use.

### Next Steps
1. Train staff on the system
2. Migrate existing data
3. Setup daily backups
4. Monitor for issues
5. Gather user feedback

### Keep it Running
- Regular backups
- Security updates
- Performance monitoring
- User support

Happy billing! 🚀
