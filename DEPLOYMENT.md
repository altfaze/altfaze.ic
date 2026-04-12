# 🚀 Deployment Guide

Complete guide to deploying Altfaze to production.

## Table of Contents
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Deploy to Vercel](#deploy-to-vercel)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Domain & SSL](#domain--ssl)
- [Monitoring](#monitoring)
- [Rollback](#rollback)

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] No console errors
- [ ] TypeScript strict mode enabled
- [ ] ESLint passing
- [ ] Code reviewed

### Configuration
- [ ] `.env.local` NOT committed to git
- [ ] All environment variables defined
- [ ] Prisma migrations up to date
- [ ] Next.js config optimized
- [ ] Database backups configured

### Security
- [ ] NEXTAUTH_SECRET generated
- [ ] Stripe keys secured
- [ ] API rate limiting enabled
- [ ] CORS configured
- [ ] HTTPS enforced

### Performance
- [ ] `next.config.js` optimized
- [ ] Images optimized
- [ ] Bundle size checked
- [ ] Database indexed
- [ ] Cache headers set

---

## Deploy to Vercel

### Step 1: Prepare Code

```bash
# Ensure everything is committed
git status

# Push to GitHub (main branch)
git add .
git commit -m "Ready for production"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to https://vercel.com/signup
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access repositories

### Step 3: Import Project

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your `altfaze` repository
4. Click **"Import"**

### Step 4: Configure Build Settings

On the configuration page, ensure these are set:

```
Project Name: altfaze
Framework: Next.js
Root Directory: ./

Build Command: next build
Output Directory: .next
Install Command: npm install
```

### Step 5: Add Environment Variables

**CRITICAL**: Add these BEFORE deploying:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/altfaze_db

# Authentication
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=https://your-domain.vercel.app

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Optional
NEXT_PUBLIC_GA_ID=G-XXXXXXXX
NODE_ENV=production
```

### Step 6: Deploy

1. Review all settings
2. Click **"Deploy"** button
3. Wait 3-5 minutes for build
4. You'll receive confirmation email

Your site is now at: `https://altfaze.vercel.app`

---

## Environment Variables

### Database
```env
DATABASE_URL=postgresql://user:password@host:5432/altfaze_db
```

**Get from:**
- AWS RDS: After creating instance
- Supabase: Settings → Database → URI
- Railway: Database connection string
- PlanetScale: Connection string

Format: `postgresql://[user]:[password]@[host]:[port]/[database]`

### Authentication
```env
NEXTAUTH_SECRET=your_super_secret_key

# Generate with:
openssl rand -base64 32
```

```env
NEXTAUTH_URL=https://your-domain.com
```

⚠️ Must match your actual domain in production

### Stripe Keys

**Get from**: https://dashboard.stripe.com/apikeys

```env
# Publishable (safe to expose)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Secret (NEVER expose)
STRIPE_SECRET_KEY=sk_live_...
```

**Get webhook secret from**: Settings → Webhooks

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Optional Services
```env
# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXX

# Sentry error tracking (optional)
SENTRY_AUTH_TOKEN=...

# Email service (optional)
EMAIL_FROM=noreply@altfaze.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=app-password
```

### Environment Variable Best Practices
- ✅ Rotate secrets every 90 days
- ✅ Use different keys for dev/prod
- ✅ Store in Vercel Secrets, not gitignore
- ✅ Never log sensitive values
- ✅ Use strong random secrets (32+ chars)

---

## Database Setup

### Option 1: Supabase (Recommended)

1. Go to https://supabase.com
2. Click "New Project"
3. Select region
4. Copy connection string
5. Add to Vercel as `DATABASE_URL`

**Benefits:**
- ✅ Automatic backups
- ✅ Built-in monitoring
- ✅ Easy scaling
- ✅ Free tier available

### Option 2: AWS RDS

1. Go to AWS Console → RDS
2. Create PostgreSQL instance
3. Copy endpoint URL
4. Create database: `altfaze_db`
5. Format URL: `postgresql://user:password@endpoint:5432/altfaze_db`

### Option 3: Railway

1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL
4. Copy DATABASE_URL
5. Database is auto-created

### Apply Migrations

After deployment:

```bash
# Via Vercel CLI
vercel env pull
npx prisma migrate deploy

# Or manually in Vercel:
# Go to Deployment → Logs → Functions
# Run: npx prisma migrate deploy
```

### Verify Database

```bash
# Check connection
npx prisma db execute --stdin

# View data
npx prisma studio
```

---

## Domain & SSL

### Connect Custom Domain

1. Go to Vercel Project → Settings → Domains
2. Click "Add" → Enter your domain
3. Choose:
   - Vercel Nameservers (easier)
   - Manual DNS (more control)

### Vercel Nameservers
1. Add nameservers to domain registrar:
   ```
   ns1.vercel.com
   ns2.vercel.com
   ns3.vercel.com
   ns4.vercel.com
   ```
2. Wait up to 48 hours for DNS propagation
3. Vercel auto-generates SSL certificate

### Manual DNS (CNAME)
1. Find CNAME value in Vercel
2. Add CNAME record to registry:
   ```
   Name: www or subdomain
   Value: cname.vercel-dns.com.
   TTL: 3600
   ```
3. SSL certificate auto-generated

### SSL Certificate
- ✅ Automatically managed by Vercel
- ✅ Renewed every 90 days
- ✅ Supports TLS 1.3
- ✅ Wildcard support

### Enforce HTTPS
```javascript
// In next.config.js
headers: async () => {
  return [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload'
        }
      ]
    }
  ]
}
```

---

## Monitoring

### Vercel Analytics

1. Go to Project → Analytics
2. Enable Web Analytics (free)
3. View real-time metrics:
   - Page views
   - Core Web Vitals
   - User interactions

### Error Tracking

1. Go to Project → Functions
2. View deployment logs
3. Check for errors:
   - Database errors
   - API errors
   - Build errors

### Performance Monitoring

```bash
# Check build size
vercel logs build

# Monitor function execution
vercel logs function
```

### Monitoring Commands

```bash
# View all logs
vercel logs

# Filter by deployment
vercel logs --deployment <deploy-id>

# Real-time logs
vercel logs --follow
```

### Set Up Alerts

In Vercel Project Settings:
- Enable error emails
- Set failure notifications
- Configure Slack/Discord webhooks

### Sentry Integration (Optional)

```bash
# Install Sentry
npm install @sentry/nextjs

# Configure in next.config.js
```

---

## Rollback

### Rollback to Previous Deployment

1. Go to Vercel Project → Deployments
2. Find previous working version
3. Click "..." menu
4. Click "Promote to Production"

### Automatic Rollback

Failed deployments don't auto-rollback. To prevent issues:
- ✅ Test locally before pushing
- ✅ Use preview deployments
- ✅ Enable branch protection
- ✅ Require code reviews

### Roll Back Database

```bash
# View migration status
npx prisma migrate status

# Rollback last migration
npx prisma migrate resolve --rolled-back <migration_name>

# Then fix schema and re-deploy
```

---

## CI/CD Pipeline

### Automatic Deployments

- Push to `main` → Automatic production deploy
- Push to other branches → Preview deploy
- Pull requests → Preview URLs

### Deployment Preview

Every PR gets a unique preview URL:
```
https://altfaze-pr-123.vercel.app
```

Useful for testing before merging.

### Production Deployment

```
main branch → Always deployed
Branching strategy:
├── main (production)
├── staging (staging)
└── develop (development)
```

---

## Performance Optimization

### Edge Functions
```javascript
// Runs globally on Vercel Edge Network
export const config = {
  runtime: 'edge'
}
```

### Image Optimization
```javascript
import Image from 'next/image'

<Image
  src="/image.png"
  alt="..."
  width={1200}
  height={630}
  priority
/>
```

### Database Connection Pooling
- Configured automatically with Vercel & Supabase
- Max connections: Dependent on plan

---

## Troubleshooting

### Build Fails
```bash
# Check local build first
npm run build

# Verify TypeScript
npm run type-check

# Check dependencies
npm list
```

### Database Connection Error
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### NextAuth Issues
```bash
# Verify NEXTAUTH_SECRET is set
# Verify NEXTAUTH_URL matches domain

# Check logs
vercel logs --follow
```

### Stripe Webhooks Not Working
1. Verify endpoint URL in Stripe dashboard
2. Check webhook secret matches
3. View Stripe logs for delivery status
4. Test webhook manually from Stripe dashboard

---

## Security Checklist

- [ ] HTTPS only (no HTTP)
- [ ] All secrets in environment variables
- [ ] Database backups enabled
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection enabled
- [ ] CSRF tokens on forms
- [ ] Security headers set
- [ ] Regular dependencies updates

---

## Support

For deployment issues:
1. Check Vercel logs: Project → Deployments → Logs
2. Check build output
3. Verify environment variables
4. Check database connection
5. Email support@vercel.com or support@altfaze.com

---

## Post-Deployment

### Day 1
- [ ] Test all core features
- [ ] Check analytics dashboard
- [ ] Monitor error logs
- [ ] Test payment flow

### Week 1
- [ ] Monitor performance
- [ ] Check SEO indexing
- [ ] Review user feedback
- [ ] Monitor error rates

### Ongoing
- [ ] Weekly backups verification
- [ ] Monthly dependency updates
- [ ] Quarterly security audit
- [ ] Annual infrastructure review

---

## Success!

Your Altfaze platform is now live in production! 🎉

**Next steps:**
1. Submit sitemap to Google Search Console
2. Set up monitoring and alerts
3. Enable analytics
4. Configure email notifications
5. Plan marketing campaign
