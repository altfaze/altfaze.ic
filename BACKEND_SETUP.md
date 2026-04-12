# Backend Setup Guide - Quick Start

Get your ALTFaze production backend running in 10 minutes.

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (https://stripe.com)
- npm or pnpm

## Step 1: Environment Configuration

### 1.1 Copy `.env.example` to `.env.local`

```bash
cp .env.example .env.local
```

### 1.2 Fill in PostgreSQL Connection

```env
DATABASE_URL=postgresql://username:password@localhost:5432/ALTFaze_db
```

### 1.3 Generate NextAuth Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate NEXTAUTH_URL
NEXTAUTH_URL=http://localhost:3002
```

### 1.4 Set Up Stripe Keys

1. Go to https://dashboard.stripe.com
2. Get API Keys from Settings → API Keys
3. Add to `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 1.5 Set Up Stripe Webhook

1. In Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Events to listen: `checkout.session.completed`, `charge.refunded`, `charge.dispute.created`
4. Copy signing secret to `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 1.6 OAuth (Optional - Already Configured)

Google and GitHub OAuth are already set up in `lib/auth.ts`. If you need to update:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

## Step 2: Database Setup

### 2.1 Push Schema to Database

```bash
pnpm prisma db push
```

### 2.2 Verify Connection

```bash
pnpm prisma studio
```

This opens Prisma Studio at http://localhost:5555 - verify database connection.

## Step 3: Dependencies

```bash
# All dependencies are already installed
# Stripe SDK was added during implementation
pnpm ls | grep stripe
```

## Step 4: Run Development Server

```bash
pnpm dev
```

Server runs at http://localhost:3002

## Step 5: Test Payment Flow

### 5.1 Create Test User

1. Go to http://localhost:3002/register
2. Sign up with Google or GitHub
3. Select role (CLIENT or FREELANCER)

### 5.2 Test Checkout

```bash
curl -X POST http://localhost:3002/api/payments/checkout \
  -H "Content-Type: application/json" \
  -D "cookie: <your-session-cookie>" \
  -d '{
    "freelancerId": "freelancer-id",
    "amount": 1000,
    "description": "Test payment"
  }'
```

### 5.3 Use Stripe Test Card

Visit the checkout URL and use test card:
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- Billing: Any details

### 5.4 Verify Webhook

1. Check Stripe Dashboard → Webhooks
2. See `checkout.session.completed` event
3. Verify database transaction updated to "COMPLETED"
4. Check wallet balances updated

## API Endpoints Quick Reference

### Payments
- `POST /api/payments/checkout` - Create payment session
- `GET /api/payments/checkout?sessionId=...` - Get transaction details

### Wallet
- `GET /api/wallet` - Get wallet and transactions
- `POST /api/wallet` - Add balance (admin)

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `PATCH /api/projects` - Update project status

### Templates
- `GET /api/templates` - Browse templates
- `POST /api/templates` - Upload template
- `PUT /api/templates` - Purchase template

### Requests
- `GET /api/requests` - Get requests
- `POST /api/requests` - Send request
- `PATCH /api/requests` - Accept/reject request

### Webhooks
- `POST /api/webhooks/stripe` - Stripe events

## Common Issues & Solutions

### "STRIPE_SECRET_KEY not found"
- Add `STRIPE_SECRET_KEY` to `.env.local`
- Restart development server
- Check no typos in key

### "Webhook signature invalid"
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Test locally with Stripe CLI
- Ensure raw body is used for verification

### "Payment not appearing in wallet"
- Check webhook endpoint in Stripe Dashboard
- Verify webhook is receiving events
- Check application logs for any errors
- Manually retry webhook in Stripe Dashboard

### "Database connection failed"
- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running
- Test connection: `psql $DATABASE_URL`
- Run migrations: `pnpm prisma db push`

## Production Deployment

### 1. Environment Variables
Set all variables in your hosting platform (Vercel, AWS, etc.)

### 2. Database
- Use managed PostgreSQL (AWS RDS, Heroku, etc.)
- Enable SSL connections
- Set up automated backups

### 3. Stripe
- Switch to live keys (remove `_test` from key names)
- Configure production webhook endpoint
- Enable fraud detection settings

### 4. Monitoring
- Set up error logging (Sentry, LogRocket)
- Monitor payment failures
- Track webhook retries
- Set up alerts

### 5. Security
- Enable rate limiting
- Use environment variables (no hardcoded keys)
- Enable HTTPS
- Set CORS correctly
- Validate JWTs

## Test Wallet Balance

### Add Test Funds

```bash
curl -X POST http://localhost:3002/api/wallet \
  -H "Content-Type: application/json" \
  -D "cookie: <your-session-cookie>" \
  -d '{
    "amount": 10000,
    "description": "Test balance"
  }'
```

### Check Balance

```bash
curl -X GET http://localhost:3002/api/wallet \
  -D "cookie: <your-session-cookie>"
```

## File Structure

```
app/
├── api/
│   ├── payments/
│   │   └── checkout/route.ts        (Stripe checkout)
│   ├── webhooks/
│   │   └── stripe/route.ts          (Webhook handler)
│   ├── wallet/route.ts              (Wallet operations)
│   ├── projects/route.ts            (Project management)
│   ├── templates/route.ts           (Template operations)
│   └── requests/route.ts            (Request management)
lib/
├── auth.ts                          (NextAuth config)
├── auth-middleware.ts               (Auth utilities)
├── api.ts                           (Response helpers)
├── commission.ts                    (Commission logic)
├── stripe.ts                        (Stripe utilities)
├── activity.ts                      (Activity logging)
└── db.ts                            (Prisma client)
prisma/
├── schema.prisma                    (Database schema)
└── migrations/                      (Database migrations)
```

## Next Steps

1. ✅ Local development environment ready
2. ✅ Database configured with production schema
3. ✅ Stripe integration working
4. ✅ API endpoints ready

### Additional Setup

- [ ] Implement email notifications (SendGrid, Mailgun)
- [ ] Set up analytics (Google Analytics, Mixpanel)
- [ ] Add payment plan management
- [ ] Implement escrow system (advanced)
- [ ] Add dispute resolution
- [ ] Set up refund policy

## Support

For issues:
1. Check `BACKEND_GUIDE.md` for detailed documentation
2. Review Stripe documentation: https://stripe.com/docs
3. Check application logs
4. Review Prisma documentation: https://www.prisma.io/docs

## Security Reminders

⚠️ **Never commit `.env.local` to git**
⚠️ **Use test keys during development**
⚠️ **Verify webhook signatures always**
⚠️ **Validate all user input**
⚠️ **Use HTTPS in production**
⚠️ **Keep dependencies updated**

