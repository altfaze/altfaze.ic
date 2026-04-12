# 🚀 Altfaze - Freelance Marketplace Platform

**The #1 Freelance Marketplace to Hire Developers, Buy Website Templates & Earn Money Online**

A full-stack modern web application for connecting freelancers with clients, selling premium website templates, and managing projects with secure payments and escrow protection.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication & Authorization](#authentication--authorization)
- [Payment Integration](#payment-integration)
- [SEO Implementation](#seo-implementation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Project Overview

**Altfaze** is a comprehensive freelance marketplace platform built with modern web technologies. It serves three main user groups:

1. **Clients** - Post projects and hire freelancers
2. **Freelancers** - Offer services and earn money
3. **Vendors** - Sell premium website templates

### Core Value Propositions
- ✅ Secure escrow payment system
- ✅ 25,000+ verified freelancers
- ✅ 100+ premium website templates
- ✅ Real-time project management
- ✅ Built-in collaboration tools
- ✅ Fast onboarding (< 5 minutes)

---

## ⭐ Key Features

### For Clients
- **Post Projects** - Create detailed project briefs with budgets
- **Hire Freelancers** - Browse 25K+ verified professionals
- **Manage Projects** - Track progress, communicate, manage files
- **Secure Payments** - Escrow protection until completion
- **Buy Templates** - Access 100+ ready-to-deploy templates

### For Freelancers
- **Find Jobs** - Browse thousands of active projects
- **Build Portfolio** - Showcase work and ratings
- **Earn Money** - Set rates and get paid securely
- **Sell Services** - Offer custom services to clients
- **Sell Templates** - Create and sell website templates

### For Platform
- **Admin Dashboard** - Manage users, transactions, disputes
- **Analytics** - Track platform metrics and health
- **Moderation** - Review content and handle disputes
- **Commission Tracking** - Automated payment splitting
- **Wallet System** - Balance management and withdrawals

---

## 💻 Technology Stack

### Frontend
- **Framework**: Next.js 14.2+ (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **UI Library**: Radix UI components
- **Animations**: Framer Motion
- **Theme**: next-themes (Dark/Light mode)

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Authentication**: NextAuth.js v4 (JWT-based)
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Validation**: Zod, custom validators

### Payments
- **Provider**: Stripe
- **Payment Mode**: Invoice & Direct Payment
- **Escrow**: Custom implementation

### Hosting
- **Deployment**: Vercel
- **Database Hosting**: AWS RDS / Supabase
- **CDN**: Vercel Edge Network

### Additional Tools
- **Analytics**: Vercel Web Analytics + Speed Insights
- **Rate Limiting**: Custom middleware
- **Email**: Nodemailer (configurable)
- **Session Management**: NextAuth.js with database

---

## 🚀 Quick Start

### 5-Minute Setup
```bash
# 1. Clone the repository
git clone https://github.com/altfaze/altfaze.git
cd altfaze

# 2. Install dependencies
npm install
# or
pnpm install

# 3. Set up environment variables
cp .env.example .env.local

# 4. Set up database
npx prisma db push

# 5. Run development server
npm run dev

# 6. Open browser
# Go to http://localhost:3000
```

Your site is now running! 🎉

---

## 📦 Prerequisites

Before you begin, ensure you have:

### Required
- **Node.js**: v18.0.0 or higher
  ```bash
  node --version  # Check version
  ```
- **npm/pnpm**: Latest version
  ```bash
  npm --version
  pnpm --version
  ```
- **PostgreSQL**: v12 or higher (local or cloud)
- **Git**: For version control

### Accounts Needed
- GitHub account (for deployment)
- Stripe account (for payment processing)
- Email service account (Gmail, SendGrid, etc.)
- Database hosting (AWS RDS, Supabase, Railway, etc.)

---

## 📥 Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/altfaze/altfaze.git
cd altfaze
```

### Step 2: Install Dependencies
```bash
# Using npm
npm install

# Using pnpm (faster)
pnpm install

# Using yarn
yarn install
```

### Step 3: Verify Installation
```bash
npm run type-check  # Check TypeScript types
npm run lint        # Run eslint
```

---

## ⚙️ Environment Setup

### Create .env.local File
```bash
# Copy example file
cp .env.example .env.local
```

### Required Environment Variables

#### Database Configuration
```env
# PostgreSQL connection string
# Format: postgresql://user:password@host:port/database
DATABASE_URL=postgresql://admin:password@localhost:5432/altfaze_db
```

#### Authentication
```env
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your_super_secret_key_here

# Your app URL (for OAuth redirects)
NEXTAUTH_URL=http://localhost:3000
# In production:
# NEXTAUTH_URL=https://your-domain.com
```

#### Stripe Payments
```env
# Get from https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx

# Get from Stripe Webhooks page
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
```

#### Email Service (Optional)
```env
# Email provider configuration
EMAIL_FROM=noreply@altfaze.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

#### Optional Services
```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXX

# Vercel Analytics (auto-added)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=

# AWS S3 for file storage (optional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_BUCKET_NAME=altfaze-files
```

### Verify Environment Setup
```bash
# Check if .env.local exists and has required keys
cat .env.local

# Verify database connection
npx prisma db execute --stdin < /dev/null
```

---

## 🗄️ Database Setup

### Option 1: Local PostgreSQL

#### On Windows
```bash
# Using Docker (Recommended)
docker run --name altfaze-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=altfaze_db \
  -p 5432:5432 \
  -d postgres:15

# Update .env.local
# DATABASE_URL=postgresql://postgres:password@localhost:5432/altfaze_db
```

#### On macOS
```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb altfaze_db

# Create user
createuser altfaze_user
psql postgres -c "ALTER USER altfaze_user WITH PASSWORD 'password';"
psql postgres -c "ALTER DATABASE altfaze_db OWNER TO altfaze_user;"
```

### Option 2: Cloud Database

#### Using Supabase (Recommended for beginners)
1. Go to https://supabase.com
2. Create new project
3. Copy connection string from Settings → Database

#### Using AWS RDS
1. Create RDS PostgreSQL instance
2. Copy endpoint URL
3. Format: `postgresql://user:password@endpoint:5432/altfaze_db`

#### Using Railway.app
1. Sign up at https://railway.app
2. Click "New Project" → "Provision PostgreSQL"
3. Copy DATABASE_URL

### Initialize Database

#### Step 1: Push Prisma Schema
```bash
# Create tables from Prisma schema
npx prisma db push

# Or use migrations (recommended for production)
npx prisma migrate dev --name init
```

#### Step 2: Generate Prisma Client
```bash
npx prisma generate
```

#### Step 3: View Data (Optional)
```bash
# Open Prisma Studio to view/edit data
npx prisma studio

# Runs on http://localhost:5555
```

#### Step 4: Seed Database (Optional)
```bash
# Add sample data
npm run seed

# Or manually via Prisma Studio
```

---

## ▶️ Running the Project

### Development Mode
```bash
# Full-featured development with hot reload
npm run dev

# Runs on: http://localhost:3000

# Features:
# - Hot reload on file changes
# - Better error messages
# - TypeScript checking
# - Debug logs enabled
```

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start

# Verify build
npm run type-check
```

### Other Commands
```bash
# Type checking
npm run type-check

# Code formatting
npm run format

# Linting
npm run lint

# Database commands
npm run db:push      # Push schema to database
npm run db:migrate   # Create migration
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database (DANGER!)
```

### Check if Everything Works
1. Navigate to http://localhost:3000
2. You should see the landing page
3. Try to sign up / log in
4. Create a project or browse freelancers

---

## 📁 Project Structure

```
altfaze/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth routes (login, register)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (client)/                     # Client routes (protected)
│   │   ├── dashboard/
│   │   ├── freelancers/
│   │   ├── projects/
│   │   ├── requests/
│   │   ├── profile/
│   │   ├── wallet/
│   │   └── layout.tsx
│   ├── (freelancer)/                 # Freelancer routes
│   │   ├── my-dashboard/
│   │   ├── my-requests/
│   │   └── layout.tsx
│   ├── (marketing)/                  # Public marketing pages
│   │   ├── page.tsx                  # Homepage
│   │   ├── hero/page.tsx             # Hero section
│   │   ├── templates/page.tsx        # Templates marketplace
│   │   ├── hire/page.tsx             # Hire freelancers
│   │   ├── keywords/page.tsx         # SEO keyword pages
│   │   ├── faq/page.tsx              # FAQ
│   │   └── layout.tsx
│   ├── api/                          # Backend API routes
│   │   ├── auth/                     # Authentication endpoints
│   │   ├── freelancers/              # Freelancer endpoints
│   │   ├── projects/                 # Project endpoints
│   │   ├── payments/                 # Payment processing
│   │   ├── templates/                # Template endpoints
│   │   ├── transactions/             # Transaction history
│   │   └── stripe/                   # Stripe webhooks
│   ├── onboard/                      # Onboarding flow
│   ├── layout.tsx                    # Root layout
│   ├── globals.css                   # Global styles
│   └── error.tsx                     # Error handling
│
├── components/                       # React components
│   ├── ui/                           # shadcn/ui components
│   ├── magicui/                      # Magic UI animations
│   ├── main-nav.tsx                  # Navigation
│   ├── user-account-nav.tsx          # User menu
│   ├── dashboard-sidebar.tsx         # Dashboard sidebar
│   ├── error-boundary.tsx            # Error boundary
│   └── providers.tsx                 # Context providers
│
├── lib/                              # Utility functions
│   ├── auth.ts                       # NextAuth config
│   ├── db.ts                         # Prisma client
│   ├── api-utils.ts                  # API helpers
│   ├── session.ts                    # Session management
│   ├── seo/                          # SEO utilities
│   │   ├── keywords.ts               # 200+ SEO keywords
│   │   └── metadata-generator.ts     # Metadata utilities
│   ├── validations/                  # Input validation
│   ├── validators/                   # Zod schemas
│   └── utils.ts                      # General utilities
│
├── prisma/                           # Database
│   ├── schema.prisma                 # Data models
│   └── migrations/                   # Database migrations
│
├── public/                           # Static files
│   ├── logo.png
│   ├── og-image.png
│   └── video/
│
├── types/                            # TypeScript definitions
│   ├── index.d.ts                    # Custom types
│   └── next-auth.d.ts                # NextAuth types
│
├── hooks/                            # Custom React hooks
│   ├── use-mounted.ts
│   ├── use-toast.ts
│   └── use-lock-body.ts
│
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.js                    # Next.js config
├── tailwind.config.ts                # Tailwind config
├── postcss.config.js                 # PostCSS config
└── .env.example                      # Environment template
```

---

## 🔌 API Documentation

### Authentication Endpoints

#### Login
```
POST /api/auth/signin
Body: { email, password }
Response: { success, user, token }
```

#### Register
```
POST /api/auth/signup
Body: { email, password, name, role }
Response: { success, user, token }
```

#### Session Verification
```
GET /api/auth/verify-role
Response: { role, verified, user }
```

### Freelancer Endpoints

#### Get All Freelancers
```
GET /api/freelancers?page=1&limit=20&search=react
Response: { freelancers, pagination, total }
```

#### Get Freelancer Profile
```
GET /api/freelancers/[id]
Response: { freelancer, portfolio, ratings, reviews }
```

#### Update Profile
```
PUT /api/freelancers/[id]
Body: { bio, skills, hourlyRate, portfolio }
Response: { success, freelancer }
```

### Project Endpoints

#### Create Project
```
POST /api/projects
Body: { title, description, budget, deadline, skills }
Response: { success, project }
```

#### Get Projects
```
GET /api/projects?status=open&category=web-dev
Response: { projects, pagination }
```

#### Update Project
```
PUT /api/projects/[id]
Body: { status, updates }
Response: { success, project }
```

### Payment Endpoints

#### Create Checkout
```
POST /api/checkout
Body: { projectId, amount }
Response: { sessionId, url }
```

#### Webhook Handler
```
POST /api/stripe/webhook
Headers: { stripe-signature }
```

### Templates Endpoints

#### Get All Templates
```
GET /api/templates?category=saas&limit=20
Response: { templates, pagination }
```

#### Create Template
```
POST /api/templates
Body: FormData with file, metadata
Response: { success, template }
```

---

## 🔐 Authentication & Authorization

### NextAuth.js Configuration

**Location**: `lib/auth.ts`

### How It Works
1. User logs in with email/password
2. Credentials verified against database
3. JWT token created and signed with `NEXTAUTH_SECRET`
4. Token stored in secure HTTP-only cookie
5. Token refreshed on each request

### Role-Based Access Control

**Three Roles:**
- `CLIENT` - Post projects, hire freelancers
- `FREELANCER` - Browse projects, offer services
- `ADMIN` - Manage platform, disputes, users

**Route Protection:**
```typescript
// Protected routes
/dashboard          → CLIENT only
/my-dashboard       → FREELANCER only
/admin              → ADMIN only
```

### Middleware Authentication

**File**: `middleware.ts`

- Validates JWT on protected routes
- Redirects to login if not authenticated
- Checks role for authorization
- Refreshes token if expired

### Session Information
```typescript
// Access current session
import { getServerSession } from "next-auth"

const session = await getServerSession(authOptions)
// Returns: { user: { id, email, name, role } }
```

---

## 💳 Payment Integration

### Stripe Setup

#### Get Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Copy Publishable and Secret keys
3. Add to `.env.local`

#### Create Products
```bash
# Use Stripe Dashboard to create:
# - Platform Commission Product
# - Template Purchase Product
# - Project Payment Product
```

#### Webhook Configuration
1. Go to Webhooks: https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhook`
3. Select events:
   - `charge.succeeded`
   - `charge.failed`
   - `invoice.payment_succeeded`

#### Payment Flow
```
User initiates payment
    ↓
Create Stripe session
    ↓
User completes payment
    ↓
Stripe webhook received
    ↓
Process transaction
    ↓
Update database
    ↓
Send confirmation email
```

---

## 🔍 SEO Implementation

### 200+ Optimized Keywords

**Location**: `lib/seo/keywords.ts`

### 10 Keyword Categories
1. Freelance Marketplace (20 keywords)
2. Website Templates (20 keywords)
3. Buy/Sell Templates (20 keywords)
4. Hire Web Developers (20 keywords)
5. Build Website (20 keywords)
6. Client Projects (20 keywords)
7. Design UI/UX (20 keywords)
8. Money Earning (20 keywords)
9. Long-tail Keywords (30 keywords)
10. High-Intent Keywords (10 keywords)

### Dynamic Landing Pages
- `/keywords` - Master category listing
- `/keywords/[category]` - Category-specific pages

### Schema Markup
- Organization schema
- Local business schema
- Service schema
- Product schema
- FAQ schema

### Optimized Pages
- Homepage with keyword-rich copy
- Meta descriptions on all pages
- OpenGraph tags for social sharing
- Twitter cards
- Sitemap with priorities
- Robots.txt for crawlers

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

#### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Import to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure settings:
   - Build Command: `next build`
   - Start Command: `next start`
   - Output Directory: `.next`

#### Step 3: Add Environment Variables
```
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```

#### Step 4: Deploy
- Click "Deploy"
- Wait 3-5 minutes for build
- Visit your live URL

#### Step 5: Setup Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records
4. SSL certificate auto-generated

### Environment-Specific Configuration

#### Development
```env
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

#### Production
```env
NEXTAUTH_URL=https://altfaze.com
NODE_ENV=production
VERCEL_ENV=production
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Issue: "Cannot find module 'prisma'"
```bash
# Solution: Regenerate Prisma client
npx prisma generate
npm install @prisma/client
```

#### Issue: Database connection error
```bash
# Check connection string
echo $DATABASE_URL

# Verify PostgreSQL is running
pg_isready -h localhost -p 5432

# Test connection
npx prisma db execute --stdin
```

#### Issue: NextAuth login not working
```bash
# Verify environment variables
NEXTAUTH_SECRET=set?
NEXTAUTH_URL matches your domain?

# Check JWT callback
npm run dev  # See console logs
```

#### Issue: Build fails on Vercel
```bash
# Check local build first
npm run build

# Verify all dependencies installed
npm install

# Check TypeScript errors
npm run type-check
```

#### Issue: 404 after role selection
```bash
# Force JWT refresh
# Clear cookies in browser
# Try onboarding again

# Check middleware.ts
# Make sure role verification endpoint exists
```

#### Issue: Stripe webhook not triggering
```bash
# Verify webhook secret is correct
# Check Stripe dashboard for delivery logs
# Verify endpoint URL is correct (https)
# Check firewall allows Stripe IPs
```

#### Issue: Email not sending
```bash
# Verify SMTP credentials
# Check email provider settings
# Use Gmail app password (not main password)
# Allow "less secure apps" if using Gmail
```

### Debug Mode

Enable detailed logging:
```typescript
// In lib/auth.ts
debug: true  // Enable NextAuth debug logs

// In api routes
console.log('Debug info:', data)

// Check terminal output
npm run dev
```

### Performance Issues

```bash
# Analyze bundle size
npm run build
# Check .next/static/chunks

# Profile performance
npm install -g lighthouse
lighthouse https://localhost:3000

# Database query optimization
# Enable query logging in Prisma
```

---

## 👥 Contributing

### Development Workflow

#### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

#### 2. Make Changes
```bash
npm run dev      # Development mode
npm run lint     # Check code style
npm run type-check  # TypeScript validation
```

#### 3. Test Changes
- Manual testing on http://localhost:3000
- Test all user roles
- Test on mobile (Chrome DevTools)

#### 4. Commit & Push
```bash
git add .
git commit -m "feat: describe your changes"
git push origin feature/your-feature-name
```

#### 5. Create Pull Request
- Describe changes
- Link related issues
- Request review

### Code Style

- **TypeScript** - Type everything
- **Formatting** - `npm run format` 
- **Naming** - camelCase for variables, PascalCase for components
- **Comments** - Comment complex logic
- **Components** - Keep components under 500 lines

### Testing

```bash
# Component testing
npm test

# E2E testing (if set up)
npm run test:e2e
```

---

## 📞 Support & Contact

### Documentation
- Full docs: https://docs.altfaze.com
- API reference: https://api.altfaze.com/docs
- FAQ: https://altfaze.com/faq

### Help & Support
- Email: support@altfaze.com
- Discord: https://discord.gg/altfaze
- Twitter: @altfaze

### Report Issues
- GitHub Issues: https://github.com/altfaze/altfaze/issues
- Bug Report: https://altfaze.com/report-bug

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🎉 Summary

You now have a fully-functional freelance marketplace with:

✅ User authentication & authorization  
✅ Role-based access control  
✅ Project management system  
✅ Secure payment processing  
✅ Template marketplace  
✅ SEO optimization (200+ keywords)  
✅ Real-time collaboration  
✅ Analytics & reporting  
✅ Production-ready deployment  

**Ready to launch? Deploy to Vercel in 5 minutes!**

For questions or issues, check the troubleshooting section or reach out to support.

Happy coding! 🚀
