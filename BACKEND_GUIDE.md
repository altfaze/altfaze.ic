# ALTFaze Production Backend System

A complete production-grade backend implementation for ALTFaze platform with real payment processing, commission logic, and wallet management.

## 🏗️ Architecture Overview

### Components

```
Backend System
├── Authentication (NextAuth.js)
├── Database (PostgreSQL + Prisma ORM)
├── Payment Processing (Stripe)
├── API Routes (Next.js API Routes)
├── Commission System (5% platform fee)
├── Wallet Management
├── Activity Tracking
└── Webhook Handlers
```

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ALTFaze

# NextAuth
NEXTAUTH_SECRET=your-secret-key-min-32-chars
NEXTAUTH_URL=http://localhost:3002

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

## 🗄️ Database Schema

### Transaction Model
```prisma
model Transaction {
  id                  String
  userId              String
  type                String      // "PAYMENT", "EARNING", "REFUND", "WITHDRAWAL"
  amount              Decimal     // Total amount
  netAmount           Decimal?    // Amount after commission
  commission          Decimal?    // Platform fee (5%)
  status              String      // "PENDING", "COMPLETED", "FAILED"
  stripeSessionId     String?     // Unique Stripe checkout session
  stripeTransactionId String?     // Unique Stripe transaction ID
  senderId            String?     // Who paid
  receiverId          String?     // Who received
  metadata            Json?       // Additional data
  createdAt           DateTime
  updatedAt           DateTime
}
```

### Commission Calculation

**Formula**: 5% platform fee
- Total Amount: ₹1000
- Commission (5%): ₹50
- Freelancer Receives: ₹950

**Implementation**: 
```typescript
const COMMISSION_RATE = 0.05
const commission = amount * COMMISSION_RATE        // ₹50
const netAmount = amount - commission              // ₹950
```

## 📡 API Endpoints

### Authentication
All protected endpoints require valid NextAuth session. Use `requireAuth()` or `requireAuthWithRole()` middleware.

### Payments

#### `POST /api/payments/checkout`
Create Stripe checkout session for payment.

**Request**:
```json
{
  "freelancerId": "user-id",
  "amount": 1000,
  "projectId": "project-id",
  "templateId": "template-id",
  "description": "Payment for project"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/pay/cs_test_...",
    "amount": 1000,
    "description": "Payment for project"
  }
}
```

**Process**:
1. Creates Stripe checkout session
2. Stores pending transaction in database
3. Returns checkout URL for client
4. Webhook processes payment completion

#### `GET /api/payments/checkout?sessionId=...`
Get transaction details by Stripe session ID.

### Wallets

#### `GET /api/wallet`
Get user wallet balance and transaction history.

**Query Parameters**:
- `limit`: Number of transactions (default: 20)
- `page`: Page number (default: 1)

**Response**:
```json
{
  "success": true,
  "data": {
    "wallet": {
      "userId": "user-id",
      "balance": 15000,
      "totalSpent": 5000,
      "totalEarned": 20000
    },
    "transactions": [
      {
        "id": "txn-id",
        "type": "EARNING",
        "amount": 1000,
        "netAmount": 950,
        "commission": 50,
        "status": "COMPLETED",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "hasMore": true
    }
  }
}
```

#### `POST /api/wallet`
Add funds to wallet (admin/internal operation).

**Request**:
```json
{
  "amount": 5000,
  "description": "Promotional credit"
}
```

### Projects

#### `GET /api/projects`
List projects with filtering.

**Query Parameters**:
- `status`: Filter by status (OPEN, IN_PROGRESS, COMPLETED, CANCELLED)
- `my`: Set to "true" to get only your projects
- `limit`: Items per page (default: 20)
- `page`: Page number (default: 1)

**Response**:
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "proj-id",
        "title": "Build E-commerce Website",
        "description": "Need a full-stack e-commerce solution",
        "budget": 50000,
        "status": "OPEN",
        "category": "web-development",
        "deadline": "2024-02-15T23:59:59Z",
        "creator": { "id": "user-id", "name": "John", "email": "john@example.com" },
        "submitter": null,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 5, "hasMore": false }
  }
}
```

#### `POST /api/projects`
Create new project (CLIENT only).

**Request**:
```json
{
  "title": "Build E-commerce Website",
  "description": "Need a full-stack e-commerce solution",
  "budget": 50000,
  "category": "web-development",
  "deadline": "2024-02-15T23:59:59Z"
}
```

**Response**: Created project object with ID.

#### `PATCH /api/projects`
Update project status (FREELANCER only).

**Request**:
```json
{
  "projectId": "proj-id",
  "status": "IN_PROGRESS"
}
```

### Templates

#### `GET /api/templates`
Browse templates.

**Query Parameters**:
- `category`: Filter by category
- `search`: Search in title and description
- `limit`: Items per page (default: 20)
- `page`: Page number (default: 1)

#### `POST /api/templates`
Upload new template (FREELANCER only).

**Request**:
```json
{
  "title": "E-commerce UI Kit",
  "description": "Complete UI components for e-commerce",
  "category": "ui-kit",
  "price": 2999,
  "image": "https://cdn.example.com/template.jpg",
  "features": ["Responsive", "Dark mode", "100+ components"]
}
```

#### `PUT /api/templates`
Purchase template (CLIENT only).

**Request**:
```json
{
  "templateId": "template-id"
}
```

**Process**:
1. Verifies sufficient wallet balance
2. Creates transaction record
3. Deducts amount from client wallet
4. Updates wallet balances

### Requests

#### `GET /api/requests`
Get work requests.

**Query Parameters**:
- `type`: "sent" or "received" (default: both)
- `status`: Filter by status
- `limit`: Items per page (default: 20)
- `page`: Page number (default: 1)

#### `POST /api/requests`
Send work request to freelancer.

**Request**:
```json
{
  "title": "Design Landing Page",
  "description": "Need a modern landing page design",
  "freelancerId": "freelancer-user-id",
  "amount": 5000,
  "dueDate": "2024-02-01T23:59:59Z",
  "projectId": "proj-id"
}
```

#### `PATCH /api/requests`
Accept or reject request.

**Request**:
```json
{
  "requestId": "req-id",
  "status": "ACCEPTED"
}
```

### Webhooks

#### `POST /api/webhooks/stripe`
Handle Stripe webhook events.

**Supported Events**:
- `checkout.session.completed`: Payment successful
- `payment_intent.succeeded`: Payment confirmed
- `charge.refunded`: Payment refunded
- `charge.dispute.created`: Chargeback dispute

**Process on Payment Completion**:
1. Verifies webhook signature using `STRIPE_WEBHOOK_SECRET`
2. Updates transaction status to "COMPLETED"
3. Calculates commission (5%)
4. Updates client wallet: decreases by total amount
5. Updates freelancer wallet: increases by net amount
6. Creates earning transaction for freelancer
7. Logs activity for both users
8. Uses Prisma atomic transactions to prevent race conditions

## 🔐 Security Best Practices

### Webhook Signature Verification
```typescript
event = stripe.webhooks.constructEvent(body, signature, secret)
```
- Always use raw body for signature verification
- Verify signature before processing
- Reject requests with invalid signatures

### Auth Middleware
```typescript
const { userId } = await requireAuth(req)
const { userId, role } = await requireAuthWithRole(req, 'CLIENT')
```
- All API routes must verify authentication
- Optional: Verify user role for role-specific operations
- Returns 401 Unauthorized for unauthenticated requests

### Data Validation
- Validate all input fields
- Check numeric bounds
- Verify user permissions

### Rate Limiting (Recommended)
Implement rate limiting on:
- Payment checkout endpoint
- Webhook endpoint (Stripe provides retry logic)
- API requests (general)

## 💰 Commission System

### 5% Platform Commission

**On Payment**:
```
Client pays: ₹1000
Commission: ₹50 (5%)
Freelancer receives: ₹950
Platform keeps: ₹50
```

**Tracking**:
- Stored in `Transaction.commission` field
- Available in transaction history
- Calculated using `calculateCommission()` utility

**Wallet Updates**:
```typescript
// Client wallet
client.walletBalance -= 1000        // Total payment
client.totalSpent += 1000           // Track spending

// Freelancer wallet
freelancer.walletBalance += 950     // Net after commission
freelancer.totalEarned += 950       // Track earnings
```

## 📊 Activity Tracking

Logged activities:
- `TEMPLATE_VIEWED`: User views template
- `TEMPLATE_PURCHASED`: User purchases template
- `PROJECT_CREATED`: Client creates project
- `PROJECT_ACCEPTED`: Freelancer accepts project
- `REQUEST_SENT`: User sends request
- `REQUEST_ACCEPTED`: Freelancer accepts request
- `PAYMENT_COMPLETED`: Payment processed successfully
- `PAYMENT_REFUNDED`: Payment refunded

**Usage**:
```typescript
import { logPaymentCompletion, logProjectCreation } from '@/lib/activity'

await logProjectCreation(userId, projectId, projectTitle)
await logPaymentCompletion(userId, amount, description, transactionId)
```

## 🚀 Deployment Checklist

- [ ] Set up PostgreSQL database
- [ ] Configure all environment variables
- [ ] Set up Stripe account and get API keys
- [ ] Configure Stripe webhook endpoint (`/api/webhooks/stripe`)
- [ ] Run Prisma migrations: `pnpm prisma migrate deploy`
- [ ] Test payment flow in Stripe test mode
- [ ] Implement rate limiting
- [ ] Set up error logging (Sentry, DataDog, etc.)
- [ ] Set up database monitoring
- [ ] Configure backups
- [ ] Test webhook retries
- [ ] Set up monitoring alerts

## 🧪 Testing

### Test Payment Flow

1. **Create Checkout Session**:
   ```bash
   curl -X POST http://localhost:3002/api/payments/checkout \
     -H "Content-Type: application/json" \
     -d '{
       "freelancerId": "freelancer-user-id",
       "amount": 1000,
       "description": "Test payment"
     }'
   ```

2. **Use Stripe Test Card**: `4242 4242 4242 4242`
3. **Verify Webhook**: Check transaction status changes to "COMPLETED"
4. **Check Wallets**: Verify wallet balances updated correctly

### Debug Webhook Events

Use Stripe Dashboard → Webhooks → View Events to:
- See webhook delivery attempts
- View event payload
- Re-trigger webhook manually

## 📚 Utility Functions

### Commission Utilities (`lib/commission.ts`)
```typescript
calculateCommission(amount)         // Get 5% commission
calculateNetAmount(amount)          // Get amount after commission
getTransactionBreakdown(amount)     // Get detailed breakdown
validateAmount(amount)              // Validate amount input
validateSufficientBalance(balance, required) // Check wallet
```

### Activity Utilities (`lib/activity.ts`)
```typescript
logActivity(userId, action, description, metadata)
logTemplateView(userId, templateId, title)
logTemplatePurchase(userId, templateId, amount, title)
logProjectCreation(userId, projectId, title)
logPaymentCompletion(userId, amount, description, transactionId)
getUserActivityLogs(userId, limit, offset)
```

### Auth Utilities (`lib/auth-middleware.ts`)
```typescript
requireAuth(req)                    // Require authentication
requireAuthWithRole(req, role)      // Require auth + role
getAuthenticatedUserId(req)         // Get user ID
handleApiError(error)               // Standard error response
```

### Stripe Utilities (`lib/stripe.ts`)
```typescript
createCheckoutSession(params)       // Create Stripe checkout
getSession(sessionId)               // Retrieve session
verifyWebhookSignature(body, sig, secret)
constructWebhookEvent(body, sig, secret)
```

### API Utilities (`lib/api.ts`)
```typescript
successResponse(data, status, message)
errorResponse(status, message, code)
ValidationError / NotFoundError / UnauthorizedError
formatCurrency(value, currency)
```

## 🔄 Payment Flow Diagram

```
Client → Create Checkout → Stripe Session → Checkout URL
              ↓
         Store pending transaction
              ↓
         Return checkout link
              ↓
Client fills payment on Stripe checkout
              ↓
Stripe processes payment
              ↓
Stripe sends webhook event
              ↓
API verifies signature
              ↓
Update transaction to "COMPLETED"
              ↓
Calculate commission (5%)
              ↓
Update client wallet (deduct total)
              ↓
Update freelancer wallet (add net)
              ↓
Create earning transaction
              ↓
Log activities
              ↓
Payment complete ✓
```

## 🆘 Troubleshooting

### Webhook Not Triggering
- Check webhook endpoint URL configured in Stripe Dashboard
- Verify `STRIPE_WEBHOOK_SECRET` environment variable
- Check server logs for webhook errors
- Use Stripe Dashboard to manually retry webhook

### Payment Failed
- Verify Stripe API keys are correct
- Check card details in test
- Review Stripe Dashboard for specific error codes
- Check database connectivity

### Commission Not Calculated
- Verify `COMMISSION_RATE` is 0.05 in commission utility
- Check transaction record has commission field populated
- Verify webhook handler executed successfully

### Wallet Balance Incorrect
- Check transaction atomicity (using `db.$transaction`)
- Verify both client and freelancer user updates
- Check for concurrent payment processing
- Review activity logs for issues

## 📝 Notes

- All amounts are stored as Decimal(12,2) for precision
- Commission is always 5% and deducted from freelancer earnings
- All transactions are atomic using Prisma transactions
- Webhook processing is idempotent (safe to retry)
- Activity logging is non-blocking (fails silently)

