# 🚀 ATXEP Platform - Production Setup Guide

## Overview
This document covers all the critical setup steps needed to run ATXEP as a fully working production-ready SaaS platform.

---

## 1. **Environment Variables Configuration**

Create or update `.env.local` with the following:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/atxep_db"

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 32)"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="https://yourdomain.com"

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your_secret"

# GitHub OAuth (get from GitHub Settings)
GITHUB_CLIENT_ID="your_client_id"
GITHUB_CLIENT_SECRET="your_secret"

# Stripe (get from Stripe Dashboard)
STRIPE_SECRET_KEY="sk_live_xxxxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"

# App URL
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"
```

---

## 2. **Database Setup**

### Prerequisites
- PostgreSQL 12+ installed and running
- Prisma Client with database connection

### Steps
1. **Create database:**
```bash
createdb atxep_db
```

2. **Run migrations:**
```bash
npx prisma migrate deploy
```

3. **Verify database:**
```bash
npx prisma studio  # View database in web UI
```

---

## 3. **Payment System (Stripe)**

### Setup
1. **Create Stripe Account**: https://stripe.com
2. **Get API Keys**:
   - Secret Key (sk_live_...)
   - Publishable Key (pk_live_...)
   - Webhook Secret (whsec_...)

3. **Configure Webhooks**:
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
   - Select events: `payment_intent.succeeded`, `charge.refunded`

4. **Test with Stripe CLI**:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
stripe trigger payment_intent.succeeded
```

---

## 4. **OAuth Setup**

### Google OAuth
1. Go to: https://console.cloud.google.com
2. Create OAuth 2.0 credentials (Desktop application)
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### GitHub OAuth
1. Go to: GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL:
   - `http://localhost:3000/api/auth/callback/github` (development)
   - `https://yourdomain.com/api/auth/callback/github` (production)

---

## 5. **Critical Features Checklist**

✅ **Authentication**
- [ ] Email/Password registration & login working
- [ ] Google OAuth redirect functional
- [ ] GitHub OAuth redirect functional
- [ ] Session persistence across page refreshes
- [ ] Role selection on onboarding

✅ **Dashboard Features**
- [ ] Hire page loads freelancers from `/api/freelancers`
- [ ] Templates page loads from `/api/templates`
- [ ] Requests page displays sent/received offers
- [ ] Wallet page shows balance and transactions
- [ ] AI Help page returns suggestions

✅ **APIs & Endpoints**
- [ ] `GET /api/freelancers` - Returns freelancer list
- [ ] `GET /api/templates` - Returns templates
- [ ] `GET /api/requests` - Returns work requests
- [ ] `GET /api/wallet` - Returns wallet data
- [ ] `POST /api/ai/suggestions` - Returns AI suggestions
- [ ] `POST /api/payments/checkout` - Initiates payment

✅ **Performance**
- [ ] Pages load in < 2 seconds
- [ ] Loading states show spinners
- [ ] Error messages display properly
- [ ] Smooth animations on transitions

---

## 6. **Testing Endpoints Locally**

###  Test Freelancer API
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/freelancers?limit=10&page=1
```

### Test AI Suggestions
```bash
curl -X POST http://localhost:3000/api/ai/suggestions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "project",
    "input": "I need a React website with payment integration",
    "context": {"category": "web-development", "budget": 50000}
  }'
```

### Test Payment Checkout
```bash
curl -X POST http://localhost:3000/api/payments/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "freelancerId": "user_id",
    "amount": 5000,
    "description": "Project Payment"
  }'
```

---

## 7. **Deployment Checklist**

### Before Going Live
- [ ] All environment variables configured
- [ ] Database migrations completed
- [ ] Stripe webhooks configured
- [ ] OAuth credentials set for production domain
- [ ] NEXTAUTH_SECRET is secure random string
- [ ] SSL certificate installed
- [ ] Database backups configured
- [ ] Error logging set up (Sentry, LogRocket, etc.)

### Build & Deploy
```bash
# Build
npm run build

# Start server
npm start

# Or use PM2 for production
pm2 start npm --name "atxep" -- start
```

---

## 8. **Monitoring & Maintenance**

### Key Metrics to Monitor
- Page load time (target: < 2s)
- API response time (target: < 500ms)
- Error rate (target: < 0.1%)
- User signup/login success rate (target: > 95%)
- Payment success rate (target: > 98%)

### Database Maintenance
```bash
# Weekly backup
pg_dump atxep_db > backup-$(date +%Y%m%d).sql

# Check database size
du -sh /var/lib/postgresql/data/base/
```

---

## 9. **Troubleshooting**

### Issue: "Invalid credentials" on login
**Solution**: Ensure user exists in database and password is hashed with bcrypt

### Issue: OAuth redirect fails
**Solution**: Check NEXTAUTH_URL and callback URLs match exactly

### Issue: API returns 401 Unauthorized
**Solution**: Verify JWT token/session is valid in request headers

### Issue: Payment fails
**Solution**: Check Stripe keys and webhook configuration

### Issue: Freelancers page returns no data
**Solution**: Ensure users exist with `freelancer` profile in database

---

## 10. **Quick Start Scripts**

### Development
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Run migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

### Testing
```bash
# Test all APIs
npm run test

# Generate test data
npx ts-node scripts/seed.ts
```

---

##  11. **Key Files Reference**

| File | Purpose |
|------|---------|
| `lib/auth.ts` | NextAuth configuration |
| `app/api/**` | All API endpoints |
| `app/(dashboard)/` | Dashboard pages |
| `prisma/schema.prisma` | Database schema |
| `middleware.ts` | Route protection |
| `lib/stripe.ts` | Stripe integration |

---

## 12. **Support & Resources**

- **NextAuth Docs**: https://next-auth.js.org
- **Stripe Docs**: https://stripe.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## ✅ Final Verification

After setup, test the complete flow:
1. Sign up with email
2. Select role (Client/Freelancer)
3. Browse freelancers/templates
4. Create a project
5. Make a payment
6. Verify transaction in database

If all steps work ✅, you're production-ready!

