# 🚀 Altfaze Production Upgrade Guide

Complete implementation guide for the production-grade freelance marketplace platform.

## ✅ What's Been Implemented

### 1. **Core Services & Utilities**
- ✅ `lib/upload.ts` - Cloudinary file upload with validation
- ✅ `lib/realtime.ts` - Event emitter for real-time updates
- ✅ `lib/ai.ts` - OpenAI integration for proposal/description generation
- ✅ `lib/commission.ts` - Commission calculation (5% platform fee)
- ✅ Comprehensive validation schemas for Projects, Requests, Templates

### 2. **API Endpoints - Projects**
```
GET    /api/projects              - List all projects
POST   /api/projects              - Create project (CLIENT only)
POST   /api/projects/[id]/apply   - Apply to project (FREELANCER only)
POST   /api/projects/[id]/close   - Accept bid (CLIENT only)
POST   /api/projects/[id]/submit  - Submit work (FREELANCER only)
PATCH  /api/projects/[id]/submit  - Approve work (CLIENT only)
```

### 3. **API Endpoints - Requests/Bids**
```
GET    /api/requests              - Get requests (sent/received)
POST   /api/requests              - Send work request
PATCH  /api/requests/[id]         - Update request status (accept/reject)
```

### 4. **API Endpoints - Wallet**
```
GET    /api/wallet                - Get wallet balance & transactions
POST   /api/wallet/add-funds      - Add funds to wallet
POST   /api/wallet/withdraw       - Request withdrawal
POST   /api/wallet/pay-freelancer - Pay freelancer for completed work
```

### 5. **API Endpoints - Templates**
```
GET    /api/templates             - List templates (searchable, filterable)
POST   /api/templates/create      - Upload template (FREELANCER only)
POST   /api/templates/[id]/buy    - Buy template (CLIENT only)
GET    /api/templates/[id]/download - Download purchased template
```

### 6. **API Endpoints - Users**
```
GET    /api/users/profile         - Get user profile
PATCH  /api/users/profile         - Update profile
GET    /api/users/stats           - Get user statistics
GET    /api/users/activity        - Get activity log
```

### 7. **API Endpoints - Dashboard**
```
GET    /api/dashboard/client      - Complete client dashboard data
GET    /api/dashboard/freelancer  - Complete freelancer dashboard data
```

### 8. **API Endpoints - AI**
```
POST   /api/ai/generate-description - Generate project description
POST   /api/ai/generate-proposal     - Generate proposal (FREELANCER only)
```

### 9. **API Endpoints - Real-Time**
```
GET    /api/notifications         - Get user notifications
```

### 10. **Security & Middleware**
- ✅ Enhanced role-based access control (CLIENT vs FREELANCER)
- ✅ Comprehensive middleware with role validation
- ✅ JWT authentication with session management
- ✅ Input validation across all APIs
- ✅ Rate limiting on all endpoints
- ✅ Suspended user detection

---

## 🔧 Environment Setup

### Required Environment Variables

```env
# Authentication
NEXTAUTH_SECRET=your-secure-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/altfaze

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# File Upload (Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AI (OpenAI)
OPENAI_API_KEY=your-openai-api-key

# Payment (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# WebSocket (Optional - for real-time)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=production
```

---

## 📦 Installation & Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### 3. Build & Start

```bash
# Development
npm run dev

# Production Build
npm run build
npm start
```

---

## 🎯 Key Features Implementation

### Client Features

#### 1. Hire Freelancer (Post Project)
```typescript
// Request
POST /api/projects
{
  "title": "Build website",
  "description": "Need a React website",
  "budget": 500,
  "category": "Web Development",
  "deadline": "2024-12-31"
}

// Response
{
  "success": true,
  "data": {
    "id": "proj_123",
    "title": "Build website",
    "status": "OPEN",
    "budget": 500,
    ...
  }
}
```

#### 2. View & Accept Bids
```typescript
// Get pending bids
GET /api/requests?type=received&status=PENDING

// Accept bid
POST /api/projects/[projectId]/close
{
  "requestId": "req_123"
}
```

#### 3. Wallet Management
```typescript
// Add funds
POST /api/wallet/add-funds
{
  "amount": 100,
  "stripeSessionId": "stripe_session_123"
}

// Pay freelancer
POST /api/wallet/pay-freelancer
{
  "freelancerId": "user_456",
  "projectId": "proj_123",
  "amount": 450
}
```

#### 4. Browse Templates
```typescript
// Get templates
GET /api/templates?search=react&category=Website&limit=20

// Buy template
POST /api/templates/[templateId]/buy

// Download
GET /api/templates/[templateId]/download?token=download_token_123
```

### Freelancer Features

#### 1. Browse Projects
```typescript
// Get open projects
GET /api/projects?status=OPEN&limit=20

// Filter by category
GET /api/projects?status=OPEN&category=Web%20Development
```

#### 2. Apply to Project
```typescript
// Submit bid/proposal
POST /api/projects/[projectId]/apply
{
  "proposal": "I can build this website in 2 weeks...",
  "bidAmount": 450
}
```

#### 3. Submit Work
```typescript
// Upload completed work
POST /api/projects/[projectId]/submit
{
  "submission": "Project completed! Check the link below.",
  "submissionUrl": "https://example.com/project"
}
```

#### 4. Upload Templates
```typescript
// Create FormData
const formData = new FormData()
formData.append('title', 'React Dashboard')
formData.append('description', 'Complete dashboard template')
formData.append('category', 'Dashboard')
formData.append('price', 29)
formData.append('features', JSON.stringify(['Dark mode', 'Charts', 'Users table']))
formData.append('templateFile', fileObject)
formData.append('previewImage', imageFileObject)

// Upload
POST /api/templates/create (multipart/form-data)
```

#### 5. Earnings & Withdrawals
```typescript
// Get earnings
GET /api/users/stats

// Request withdrawal
POST /api/wallet/withdraw
{
  "amount": 500
}
```

---

## 💼 Dashboard Endpoints

### Client Dashboard
```typescript
GET /api/dashboard/client

// Returns
{
  "user": {
    "name": "John",
    "walletBalance": 1000,
    "totalSpent": 5000
  },
  "projects": {
    "open": 3,
    "inProgress": 2,
    "completed": 10,
    "recent": [...]
  },
  "requests": {
    "pending": 5,
    "list": [...]
  },
  "transactions": [...]
}
```

### Freelancer Dashboard
```typescript
GET /api/dashboard/freelancer

// Returns
{
  "user": {
    "name": "Jane",
    "walletBalance": 500,
    "totalEarned": 15000,
    "rating": 4.8,
    "reviewCount": 42
  },
  "projects": {
    "completed": 25,
    "ongoing": 3,
    "active": [...]
  },
  "applications": {
    "pending": 8,
    "accepted": 3
  },
  "templates": 5,
  "transactions": [...]
}
```

---

## 🔐 Security Best Practices

### 1. Authentication
- Uses NextAuth with JWT strategy
- Supports OAuth (Google, GitHub) and credentials
- Auto-expires inactive sessions (24 hours)
- Validates role from JWT

### 2. Authorization
- Middleware enforces role-based access
- Clients can't access freelancer routes
- Freelancers can't access client routes
- Suspended users blocked immediately

### 3. Input Validation
- All API inputs validated before processing
- SQL injection protection via Prisma ORM
- CORS enabled only for trusted origins
- Rate limiting on all endpoints (100 req/min per IP)

### 4. Data Security
- Passwords hashed with bcryptjs
- Sensitive data in DB encrypted
- File uploads scanned for malware
- Download tokens expire after 7 days

---

## 📊 Database Schema Highlights

### User
- `role`: CLIENT | FREELANCER
- `walletBalance`: decimal(12,2)
- `totalEarned`, `totalSpent`: tracking
- `stripeCustomerId`: for payments
- `isSuspended`: account status

### Project
- `status`: OPEN | IN_PROGRESS | COMPLETED | CANCELLED
- `creatorId`: client who posted
- `submiterId`: freelancer assigned
- Tracks budget, deadline, category

### Request (Bids)
- `senderId`: freelancer
- `receiverId`: client
- `projectId`: linked project
- `status`: PENDING | ACCEPTED | REJECTED

### Template
- `uploaderId`: freelancer
- `price`: decimal(10,2)
- `features`: array of strings
- Tracks purchases & downloads

### Transaction
- `type`: PAYMENT | EARNING | WITHDRAWAL | REFUND
- `status`: PENDING | COMPLETED | FAILED
- Calculates 5% platform commission
- Links to Stripe for payments

---

## 🚀 Deployment Checklist

- [ ] Set all environment variables
- [ ] Run database migrations in production
- [ ] Set `NEXTAUTH_SECRET` to secure random value
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for your domain
- [ ] Set up Stripe webhooks
- [ ] Set up Cloudinary account
- [ ] Set up OpenAI API
- [ ] Configure email service for notifications
- [ ] Enable monitoring/logging
- [ ] Set up backups for database
- [ ] Test all APIs in production environment
- [ ] Enable rate limiting on production
- [ ] Set up CDN for static assets

---

## 📈 Scalability Considerations

### Current Implementation
- Uses PostgreSQL for reliability
- Prisma ORM for query optimization
- Cloudinary for scalable file storage
- Next.js API routes with serverless support

### Future Enhancements
- Implement caching layer (Redis)
- Add search indexing (Elasticsearch)
- Use message queue (RabbitMQ/Bull)
- Implement websocket for true real-time
- Add admin analytics dashboard
- Set up automated testing
- Implement feature flags
- Add CDN for API responses

---

## 🔄 Real-Time Updates

Currently implements polling (5s intervals). To upgrade to true WebSocket:

```typescript
// Use Socket.io
import { io } from 'socket.io-client'

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL)

// Subscribe to projects
socket.on('new-project', (data) => {
  // Update state
})

// Or use Pusher
import Pusher from 'pusher-js'

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: 'your-cluster',
})

const channel = pusher.subscribe('projects')
channel.bind('new-project', (data) => {
  // Update state
})
```

---

## 📞 Support & Troubleshooting

### Common Issues

1. **Role not set on login**
   - Ensure user completes onboarding
   - Check /onboard page flow

2. **File upload fails**
   - Verify Cloudinary credentials
   - Check upload preset exists
   - Verify file size limits

3. **Payments not processing**
   - Verify Stripe keys correct
   - Check webhook setup
   - Review Stripe logs

4. **Real-time updates slow**
   - Reduce polling interval or implement WebSocket
   - Check database query performance
   - Enable caching

---

## 📚 Additional Resources

- [NextAuth Documentation](https://next-auth.js.org/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Cloudinary Upload API](https://cloudinary.com/documentation/upload_widget)
- [OpenAI API Docs](https://platform.openai.com/docs/api-reference)

---

**Version**: 1.0.0  
**Last Updated**: April 14, 2026  
**Status**: Production Ready ✅
