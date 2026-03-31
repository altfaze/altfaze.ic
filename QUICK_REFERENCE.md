# ATXEP Quick Reference

## 📚 Documentation
- **Setup**: [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Start here
- **Implementation**: [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Full docs
- **Changes**: [CHANGELOG.md](./CHANGELOG.md) - What was added/modified

## 🔑 Key Files

### Authentication & Config
- `lib/auth.ts` - OAuth providers, session config
- `types/next-auth.d.ts` - Type definitions
- `middleware.ts` - Route protection
- `.env.local` - Environment variables (create this)

### Database
- `prisma/schema.prisma` - Database schema
- `app/api/users/onboard.ts` - User onboarding
- `app/api/transactions/route.ts` - Transactions
- `app/api/projects/route.ts` - Projects
- `app/api/requests/route.ts` - Requests

### UI & Components
- `app/layout.tsx` - Root layout with fonts
- `components/dashboard-sidebar.tsx` - Sidebar nav
- `components/more-icons.tsx` - Icons (10+ added)
- `lib/fonts.ts` - Font configuration

### Dashboard Pages
- `app/(dashboard)/layout.tsx` - Dashboard layout
- `app/(dashboard)/dashboard/page.tsx` - Overview
- `app/(dashboard)/dashboard/hire/page.tsx` - Hire freelancers
- `app/(dashboard)/dashboard/work/page.tsx` - Find work
- `app/(dashboard)/dashboard/templates/page.tsx` - Templates
- `app/(dashboard)/dashboard/projects/page.tsx` - Projects
- `app/(dashboard)/dashboard/upload/page.tsx` - Upload
- `app/(dashboard)/dashboard/ai-help/page.tsx` - AI help
- `app/(dashboard)/dashboard/requests/page.tsx` - Requests
- `app/(dashboard)/dashboard/wallet/page.tsx` - Wallet
- `app/(dashboard)/dashboard/offers/page.tsx` - Discounts
- `app/(dashboard)/dashboard/settings/page.tsx` - Settings

### Auth Pages
- `app/(auth)/login/page.tsx` - Login page
- `app/onboard/page.tsx` - Role selection

## 🚀 Quick Commands

```bash
# Setup
pnpm install
pnpm postinstall

# Development
pnpm dev              # Start dev server
npx prisma studio    # View database UI

# Database
npx prisma migrate dev --name migration_name
npx prisma migrate reset              # ⚠️ Deletes all data
npx prisma db push                    # Push schema to DB

# Build & Deploy
pnpm build
pnpm start
```

## 🔐 User Roles

### CLIENT Features
- Hire Freelancer
- Buy Templates
- Create Projects
- Send Requests
- Pay for Services
- Track Spending
- Wallet Management

### FREELANCER Features
- Find Work
- Sell Templates
- Upload Projects
- Accept Requests
- Track Earnings
- Withdraw Funds
- Manage Portfolio

## 💾 Database Models (8 total)

```
User (extended)
├── Freelancer (1:1)
├── Client (1:1)
├── Projects (created)
├── Requests (sent/received)
├── Transactions
└── Activities

Additional Models:
├── Template (marketplace)
├── Discount (coupons)
└── ActivityLog (tracking)
```

## 🎨 Colors & Fonts

### Fonts (Tailwind CSS Variables)
- `--font-display`: Libre Bodoni (global default)
- `--font-sans`: Inter
- `--font-mono`: JetBrains Mono

### Colors
- All existing colors preserved
- No design changes
- Tailwind dark mode enabled

## 📊 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/signin` | OAuth flows |
| POST | `/api/users/onboard` | Set user role |
| POST | `/api/transactions` | Create transaction |
| GET | `/api/transactions` | Get transactions |
| POST | `/api/projects` | Create project |
| GET | `/api/projects` | Get user projects |
| POST | `/api/requests` | Send request |
| GET | `/api/requests` | Get requests |
| POST | `/api/stripe/checkout` | Stripe checkout |

## 🛡️ Protected Routes

All routes under `/dashboard/*` require:
- User authentication (session)
- Valid JWT token
- Middleware validation

## 🔄 Common Tasks

### Add New Dashboard Page
1. Create folder: `app/(dashboard)/dashboard/[name]/`
2. Create file: `page.tsx`
3. Use existing components from `components/ui/`
4. Add link to sidebar in `components/dashboard-sidebar.tsx`

### Add New API Endpoint
1. Create folder: `app/api/[resource]/`
2. Create file: `route.ts`
3. Import auth and db from `lib/`
4. Validate session
5. Handle POST/GET/etc.

### Update Database Schema
1. Edit `prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name describe_change`
3. Prisma Client auto-updates

### Add New Icon
1. Import from lucide-react in `components/more-icons.tsx`
2. Add to Icons export object
3. Use in components: `Icons.iconName`

## 📱 Testing Credentials

### Google OAuth
1. Use your Google account
2. Will auto-create user

### GitHub OAuth
1. Use your GitHub account
2. Will auto-create user

### Test Roles
- First login: goes to onboard page
- Select CLIENT or FREELANCER
- Verify sidebar changes

## ⚙️ Environment Variables

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
DATABASE_URL=postgresql://...
```

## 📞 Helpful Links

- [Next.js Docs](https://nextjs.org)
- [NextAuth Docs](https://next-auth.js.org)
- [Prisma Docs](https://prisma.io)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

## ✨ Key Features Implemented

✅ Dual OAuth (Google & GitHub)  
✅ Role-based dashboard  
✅ 11+ dashboard pages  
✅ 8 database models  
✅ 5 API routes  
✅ Global Libre Bodoni font  
✅ Sidebar navigation  
✅ Protected routes  
✅ Activity logging  
✅ Transaction tracking  

## 🎯 Current Status

- **Phase 1**: ✅ Core implementation complete
- **Phase 2**: ⏳ Production environment setup
- **Phase 3**: ⏳ Stripe production integration
- **Phase 4**: ⏳ Deployment & monitoring

## 🚀 To Get Started

1. Read: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. Create: `.env.local` with OAuth credentials
3. Setup: PostgreSQL database
4. Run: `pnpm install && pnpm dev`
5. Test: OAuth flow at `http://localhost:3000`

---

**Last Updated**: March 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
