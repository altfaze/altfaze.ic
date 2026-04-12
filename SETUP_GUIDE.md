# ALTFaze Setup Guide

## 🚀 Quick Start

### Step 1: Environment Setup

Create a `.env.local` file in the project root:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Google OAuth
# Get from: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# GitHub OAuth
# Get from: https://github.com/settings/developers
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Database
# Using PostgreSQL locally or on cloud
DATABASE_URL=postgresql://user:password@localhost:5432/ALTFaze

# Stripe (Optional for now)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Step 2: Create OAuth Credentials

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URI: `http://localhost:3002/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

#### GitHub OAuth Setup
1. Go to [GitHub Settings > Developer settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - Application name: ALTFaze
   - Homepage URL: http://localhost:3002
   - Authorization callback URL: http://localhost:3002/api/auth/callback/github
4. Copy Client ID and Client Secret to `.env.local`

### Step 3: Database Setup

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL
# macOS:
brew install postgresql@15

# Windows: Download from postgresql.org

# Start PostgreSQL
# macOS:
brew services start postgresql@15

# Create database
createdb ALTFaze

# Update DATABASE_URL in .env.local
DATABASE_URL=postgresql://localhost/ALTFaze
```

#### Option B: Cloud Database (Recommended)
- **Supabase**: https://supabase.com (PostgreSQL)
  - Sign up and create a project
  - Copy the connection string
  - Use as DATABASE_URL

- **Render**: https://render.com
  - Create a PostgreSQL instance
  - Copy the connection string

- **Railway**: https://railway.app
  - Add PostgreSQL service
  - Copy the connection string

### Step 4: Install & Run

```bash
# Install dependencies
pnpm install

# Generate Prisma Client
pnpm postinstall

# Run database migrations
npx prisma migrate dev --name init

# Optional: Open Prisma Studio to view DB
npx prisma studio

# Start development server
pnpm dev
```

The app will be available at: **http://localhost:3002**

---

## 🧪 Testing the Platform

### Test Flow
1. **Visit**: http://localhost:3002
2. **Click**: "Get Started" or go to `/login`
3. **Sign in**: Choose Google or GitHub
4. **Onboard**: Select CLIENT or FREELANCER role
5. **Explore**: Browse the dashboard

### Test Accounts
You can use:
- Your personal Google account
- Your personal GitHub account

---

## 📊 Database Schema

View the database schema:

```bash
# Open Prisma Studio (visual database browser)
npx prisma studio
```

This opens a web interface at http://localhost:5555

---

## 🔧 Common Issues & Solutions

### Issue: "DATABASE_URL not found"
**Solution**: Make sure `.env.local` is in the project root directory

### Issue: "OAuth redirect URI mismatch"
**Solution**: Ensure OAuth callback URLs match:
- Google: `http://localhost:3002/api/auth/callback/google`
- GitHub: `http://localhost:3002/api/auth/callback/github`

### Issue: "Cannot connect to database"
**Solution**: 
- Check DATABASE_URL is correct
- Verify PostgreSQL is running
- Try creating database manually: `createdb ALTFaze`

### Issue: "Prisma migration failed"
**Solution**: 
```bash
# Reset database (careful - deletes all data)
npx prisma migrate reset

# Or manually fix: recreate database
dropdb ALTFaze
createdb ALTFaze
npx prisma migrate deploy
```

---

## 📱 Features to Test

### Authentication ✅
- [ ] Google login
- [ ] GitHub login
- [ ] Logout
- [ ] Protected routes

### Dashboard ✅
- [ ] View dashboard overview
- [ ] Stats display (0 values are expected)
- [ ] Navigate sidebar sections

### Role-Based Features ✅
- **CLIENT role**:
  - [ ] See "Hire Freelancer" in sidebar
  - [ ] See "Payments" section
  - [ ] See "Requests" section

- **FREELANCER role**:
  - [ ] See "Find Work" in sidebar
  - [ ] See "Upload Project" in sidebar
  - [ ] See "Earnings" in wallet section

### Pages ✅
- [ ] Dashboard Overview
- [ ] Hire Freelancer
- [ ] Find Work
- [ ] Templates
- [ ] My Projects
- [ ] Upload Project
- [ ] AI Help
- [ ] Requests
- [ ] Wallet
- [ ] Discounts
- [ ] Settings

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Deploy to Other Platforms
- **Netlify**: Requires `vercel.json` configuration
- **Railway**: Connect GitHub repository
- **Render**: Connect GitHub repository

---

## 📞 Support

### Need Help?
- Check the [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
- Review [Next.js Documentation](https://nextjs.org)
- Check [NextAuth.js Documentation](https://next-auth.js.org)

### Troubleshooting
1. Check console errors (browser DevTools)
2. Check server logs (terminal)
3. Check `.env.local` configuration
4. Review database connection

---

## ✅ Next Steps

Once setup is complete:

1. **Test all features** - Sign up with both roles
2. **Connect Stripe** - For payment processing
3. **Set up email** - For notifications
4. **Add real data** - Create templates, projects, etc.
5. **Deploy** - To production environment

---

**Happy coding!** 🎉

For more details, see [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
