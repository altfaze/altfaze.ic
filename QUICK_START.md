# 🚀 Quick Start Guide - Altfaze Freelance Marketplace

Complete setup guide to get Altfaze running locally and deploying to production.

---

## 📋 Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- PostgreSQL 14+ ([Download](https://www.postgresql.org/download))
- Git ([Download](https://git-scm.com))
- A code editor (VS Code recommended)

---

## 🔧 Local Development Setup

### Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/altfaze/altfaze.git
cd altfaze

# Install dependencies
npm install
# or
yarn install
pnpm install
```

### Step 2: Setup Database

```bash
# Create PostgreSQL database
createdb altfaze_db

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database with test data
npx prisma db seed
```

### Step 3: Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your credentials
nano .env.local
# or
code .env.local
```

**Minimal Setup for Testing:**
```env
NEXTAUTH_SECRET=your-test-secret-key-generate-with-openssl
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL="postgresql://user:password@localhost:5432/altfaze_db"

# Leave OAuth/Stripe/Cloudinary commented for local testing
# CLIENT and FREELANCER auth will work with email/password
```

### Step 4: Start Development Server

```bash
npm run dev
# or
yarn dev
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👤 First-Time User Flow

### 1. Register Account
- Go to **Sign Up** page
- Enter email, password, and name
- Choose role: CLIENT or FREELANCER

### 2. Complete Onboarding
- If CLIENT: Add company info
- If FREELANCER: Add skills, hourly rate, bio
- Verify email (if configured)

### 3. Access Dashboard
- Redirected to appropriate dashboard
- Start creating/applying to projects

---

## 🧪 Testing Endpoints

### Using cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Create project (CLIENT)
curl -X POST http://localhost:3000/api/projects \
  -H "Authorization: Bearer your_session_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build a website",
    "description": "Need a React website",
    "budget": 500,
    "category": "Web Development"
  }'

# Apply to project (FREELANCER)
curl -X POST http://localhost:3000/api/projects/proj_123/apply \
  -H "Authorization: Bearer your_session_token" \
  -H "Content-Type: application/json" \
  -d '{
    "proposal": "I can build this website in 2 weeks",
    "bidAmount": 450
  }'
```

### Using Postman

1. Import the provided Postman collection
2. Set environment variables (session token, IDs)
3. Run requests in order

[Download Postman Collection](./postman-collection.json)

---

## 🌍 External Services Setup

### Cloudinary (File Upload)

1. Go to [Cloudinary Dashboard](https://cloudinary.com)
2. Sign up for free account
3. Copy credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=abc123
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=my_preset
   CLOUDINARY_API_KEY=123456
   CLOUDINARY_API_SECRET=secret
   ```
4. Create upload preset: Settings → Upload → Add upload preset

### OpenAI (AI Features)

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create account and API key
3. Add to `.env.local`:
   ```env
   OPENAI_API_KEY=sk-...
   ```
4. Set usage limits to prevent costs

### Stripe (Payments)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create account and get API keys
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_SECRET_KEY=sk_live_...
   ```
4. (Optional) Setup webhooks for production

### Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project → OAuth consent screen → Create credentials (OAuth 2.0 Client ID)
3. Set authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google
   ```
4. Add to `.env.local`:
   ```env
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```

---

## 📊 Database Commands

```bash
# View database UI
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset --force

# Push schema to database (no migration)
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

---

## 🧹 Development Commands

```bash
# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Build for production
npm run build

# Run production build locally
npm run start

# Reset everything
npm run db:reset
```

---

## 📁 Project Structure

```
altfaze/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── projects/         # Project endpoints
│   │   ├── wallet/           # Wallet endpoints
│   │   ├── templates/        # Template endpoints
│   │   ├── users/            # User endpoints
│   │   ├── dashboard/        # Dashboard endpoints
│   │   └── ai/               # AI endpoints
│   ├── (auth)/               # Auth pages
│   ├── (client)/             # Client routes
│   ├── (freelancer)/         # Freelancer routes
│   └── (marketing)/          # Marketing pages
├── components/               # React components
├── hooks/                    # React hooks
│   └── use-realtime.ts       # Real-time subscriptions
├── lib/                      # Utilities & services
│   ├── api-utils.ts          # API response helpers
│   ├── auth-middleware.ts    # Auth helpers
│   ├── upload.ts             # File upload service
│   ├── ai.ts                 # AI service
│   ├── realtime.ts           # Real-time events
│   ├── commission.ts         # Commission calculations
│   └── validations/          # Input validation
├── prisma/                   # Database
│   ├── schema.prisma         # Data models
│   └── migrations/           # Migration history
├── public/                   # Static files
├── middleware.ts             # Route middleware
├── next.config.js            # Next.js config
├── tsconfig.json             # TypeScript config
└── .env.example              # Environment template
```

---

## 🚀 Deployment to Production

### Option 1: Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Settings → Environment Variables
```

### Option 2: Deploy to Docker

```bash
# Build image
docker build -t altfaze:latest .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  altfaze:latest
```

### Option 3: Deploy to AWS/DigitalOcean

```bash
# Build
npm run build

# Start on server
export NODE_ENV=production
npm start
```

### Pre-Deployment Checklist

- [ ] Set `NEXTAUTH_SECRET` to random secure value
- [ ] Use production PostgreSQL (Supabase, AWS RDS, etc.)
- [ ] Enable HTTPS/SSL
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS for your domain
- [ ] Setup Stripe webhooks
- [ ] Setup email service (SendGrid, Mailgun)
- [ ] Enable monitoring (Sentry, DataDog)
- [ ] Setup backups for database
- [ ] Test all features on staging before production
- [ ] Setup CI/CD pipeline (GitHub Actions, etc.)
- [ ] Enable rate limiting
- [ ] Setup CDN for static assets

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -U postgres

# Verify DATABASE_URL format
# postgresql://user:password@localhost:5432/database_name

# Reset connection
npx prisma generate
npx prisma migrate dev
```

### Environment Variables Not Loaded

```bash
# Check .env.local exists in root directory
ls -la .env.local

# Restart dev server
npm run dev

# Verify in terminal - should not be undefined
console.log(process.env.NEXTAUTH_SECRET)
```

### File Upload Failing

- Verify Cloudinary credentials
- Check upload preset exists
- Ensure file size < 50MB
- Check browser console for errors

### Authentication Issues

- Clear browser cookies
- Check `NEXTAUTH_URL` matches app URL
- Verify session token not expired
- Check middleware configuration

### Role-Based Access Denied

- Verify user role in database
  ```bash
  npx prisma studio
  # Check User.role field
  ```
- Complete onboarding
- Clear session and re-login

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 💬 Getting Help

- Check documentation: `PRODUCTION_UPGRADE.md`, `API_COMPLETE.md`
- Review error logs in console
- Check GitHub Issues
- Contact support or admin

---

## 📄 License

MIT License - See LICENSE file for details

---

**Last Updated**: April 14, 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
