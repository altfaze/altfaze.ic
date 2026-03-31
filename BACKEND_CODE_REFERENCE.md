# Backend Production System - Code Reference

Complete reference for all backend files, utilities, and API endpoints in ATXEP.

## 📦 New Files Created

### Utility Files (`lib/`)

#### `lib/api.ts` - API Response Utilities
Standardized API response format and error handling.

**Key Exports**:
- `successResponse(data, status, message)` - Standard success response
- `errorResponse(status, message, code)` - Standard error response
- `ValidationError / NotFoundError / UnauthorizedError` - Custom errors
- `validateRequiredFields(body, fields)` - Input validation
- `formatCurrency(value, currency)` - Format monetary values

**Usage**:
```typescript
import { successResponse, ValidationError } from '@/lib/api'

throw new ValidationError('Email already exists')
return successResponse({ id: user.id }, 201, 'User created')
```

#### `lib/commission.ts` - Commission Calculation
Calculate 5% platform commission on all transactions.

**Key Exports**:
- `COMMISSION_RATE` - 0.05 (5%)
- `calculateCommission(amount)` - Get 5% fee
- `calculateNetAmount(amount)` - Get amount after commission
- `getTransactionBreakdown(amount)` - Detailed breakdown
- `validateAmount(amount)` - Validate numeric input
- `validateSufficientBalance(balance, required)` - Check balance

**Example**:
```typescript
import { calculateCommission, getTransactionBreakdown } from '@/lib/commission'

const breakdown = getTransactionBreakdown(1000)
// { totalAmount: 1000, commission: 50, netAmount: 950, commissionPercentage: '5' }
```

#### `lib/auth-middleware.ts` - Authentication Middleware
Verify user authentication and roles in API routes.

**Key Exports**:
- `requireAuth(req)` - Verify logged in user
- `requireAuthWithRole(req, role)` - Verify role (CLIENT | FREELANCER)
- `getAuthenticatedUserId(req)` - Get user ID from session
- `handleApiError(error)` - Transform errors to API responses

**Usage**:
```typescript
import { requireAuth, handleApiError } from '@/lib/auth-middleware'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await requireAuth(req)
    // Now you have verified userId
  } catch (error) {
    return handleApiError(error)
  }
}
```

#### `lib/activity.ts` - Activity Tracking
Log all user actions for audit trail and analytics.

**Key Exports**:
- `logActivity(userId, action, description, metadata)` - Generic logging
- `logTemplateView(userId, templateId, title)` - Log view
- `logTemplatePurchase(userId, templateId, amount, title)` - Log purchase
- `logProjectCreation(userId, projectId, title)` - Log project
- `logProjectAcceptance(userId, projectId, title)` - Log acceptance
- `logPaymentCompletion(userId, amount, description, transactionId)` - Log payment
- `getUserActivityLogs(userId, limit, offset)` - Retrieve logs

**Activity Types**:
- TEMPLATE_VIEWED, TEMPLATE_PURCHASED, PROJECT_CREATED, PROJECT_ACCEPTED
- REQUEST_SENT, REQUEST_ACCEPTED, PAYMENT_COMPLETED, PAYMENT_REFUNDED
- WITHDRAWAL_REQUESTED, PROFILE_UPDATED, RATING_GIVEN, PROPOSAL_SUBMITTED

#### `lib/stripe.ts` - Stripe Integration
Stripe payment processing and webhook utilities.

**Key Exports**:
- `stripe` - Initialized Stripe client
- `STRIPE_CONFIG` - Configuration object
- `createCheckoutSession(params)` - Create payment session
- `getSession(sessionId)` - Retrieve session details
- `getPaymentIntent(intentId)` - Get payment intent
- `refundPayment(chargeId, amount)` - Process refund
- `verifyWebhookSignature(body, sig, secret)` - Verify webhook
- `constructWebhookEvent(body, sig, secret)` - Parse webhook event

**Usage**:
```typescript
import { createCheckoutSession, verifyWebhookSignature } from '@/lib/stripe'

const session = await createCheckoutSession({
  clientId: 'client-123',
  freelancerId: 'freelancer-456',
  amount: 1000,
  successUrl: 'http://localhost:3000/success',
  cancelUrl: 'http://localhost:3000/cancel',
})

event = constructWebhookEvent(body, sig, secret) // Verify & parse
```

### API Routes

#### `app/api/payments/checkout/route.ts`
Create Stripe checkout session for payments.

**Methods**:
- `POST` - Create checkout session and store pending transaction
- `GET` - Get transaction by session ID

**Request** (POST):
```json
{
  "freelancerId": "user-123",
  "amount": 1000,
  "projectId": "proj-456",
  "templateId": "tmpl-789",
  "description": "Payment for project"
}
```

**Response** (POST):
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/pay/cs_test_...",
    "amount": 1000
  }
}
```

#### `app/api/webhooks/stripe/route.ts`
Handle Stripe webhook events (critical for payment completion).

**Handled Events**:
- `checkout.session.completed` - Payment successful (main handler)
- `payment_intent.succeeded` - Fallback confirmation
- `charge.refunded` - Refund processed
- `charge.dispute.created` - Chargeback initiated

**Process on Payment Completion**:
1. Verify webhook signature
2. Mark transaction as COMPLETED
3. Calculate 5% commission
4. Update client wallet (deduct total)
5. Update freelancer wallet (add net)
6. Create earning transaction
7. Log activity
8. Use atomic transactions for consistency

**Security**: Always verifies webhook signature using `STRIPE_WEBHOOK_SECRET`

#### `app/api/wallet/route.ts`
User wallet management and transaction history.

**Methods**:
- `GET` - Get wallet balance and transaction history (paginated)
- `POST` - Add funds to wallet (admin operation)

**GET Response**:
```json
{
  "wallet": {
    "userId": "user-123",
    "balance": 15000,
    "totalSpent": 5000,
    "totalEarned": 20000
  },
  "transactions": [
    {
      "id": "txn-123",
      "type": "EARNING",
      "amount": 1000,
      "netAmount": 950,
      "commission": 50,
      "status": "COMPLETED"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 45, "hasMore": true }
}
```

#### `app/api/projects/route.ts`
Project creation and management.

**Methods**:
- `GET` - List projects (filterable by status, creator)
- `POST` - Create project (CLIENT only)
- `PATCH` - Update project status (FREELANCER only)

**Create Project** (POST):
```json
{
  "title": "Build E-commerce",
  "description": "Full-stack e-commerce solution",
  "budget": 50000,
  "category": "web-development",
  "deadline": "2024-02-15T23:59:59Z"
}
```

**Update Project** (PATCH):
```json
{
  "projectId": "proj-123",
  "status": "IN_PROGRESS"
}
```

Valid statuses: `OPEN`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`

#### `app/api/templates/route.ts`
Template browsing and purchasing.

**Methods**:
- `GET` - Browse templates (searchable, filterable by category)
- `POST` - Upload template (FREELANCER only)
- `PUT` - Purchase template (CLIENT only)

**Upload Template** (POST):
```json
{
  "title": "E-commerce UI Kit",
  "description": "Complete UI components",
  "category": "ui-kit",
  "price": 2999,
  "image": "https://cdn.example.com/template.jpg",
  "features": ["Responsive", "Dark mode", "100+ components"]
}
```

**Purchase Template** (PUT):
```json
{
  "templateId": "template-123"
}
```

**Business Logic**:
- Checks sufficient wallet balance
- Deducts full amount from client wallet
- Creates transaction record
- Logs purchase activity
- All in atomic transaction

#### `app/api/requests/route.ts`
Work request management between users.

**Methods**:
- `GET` - Get requests (sent/received/all, filterable by status)
- `POST` - Send request to freelancer
- `PATCH` - Accept/reject request

**Send Request** (POST):
```json
{
  "title": "Design Landing Page",
  "description": "Modern landing page design",
  "freelancerId": "freelancer-456",
  "amount": 5000,
  "dueDate": "2024-02-01T23:59:59Z",
  "projectId": "proj-123"
}
```

**Update Request** (PATCH):
```json
{
  "requestId": "req-123",
  "status": "ACCEPTED"
}
```

Valid statuses: `PENDING`, `ACCEPTED`, `REJECTED`, `COMPLETED`

## 🔄 Data Flow Examples

### Payment Flow
```
Client → POST /api/payments/checkout
  ↓
Create Stripe Session & pending Transaction
  ↓
Return checkout URL
  ↓
Client redirects to Stripe checkout
  ↓
Client fills payment
  ↓
Stripe processes & sends webhook
  ↓
POST /api/webhooks/stripe
  ↓
Verify signature
  ↓
Mark Transaction COMPLETED
  ↓
Calculate commission (5%)
  ↓
Update wallets (atomic)
  ↓
Log activities
  ✓ Payment complete
```

### Template Purchase Flow
```
Client → PUT /api/templates
  ↓
Validate sufficient balance
  ↓
Deduct amount atomically:
  ├─ Update client.walletBalance -= amount
  ├─ Update client.totalSpent += amount
  ├─ Create Transaction record
  └─ Log activity
  ↓
✓ Template purchased
```

### Request Flow
```
User A → POST /api/requests
  ↓
Create Request (PENDING)
  ↓
Log activity
  ↓
User B receives notification (external)
  ↓
User B → PATCH /api/requests
  ↓
Update status (ACCEPTED/REJECTED)
  ↓
Log activity
  ✓ Request processed
```

## 📊 Database Models Used

### Transaction Model
```
id: String (unique ID)
userId: String (who owns this transaction)
type: String (PAYMENT, EARNING, REFUND, WITHDRAWAL)
amount: Decimal (total amount)
netAmount: Decimal (amount after commission)
commission: Decimal (5% fee)
status: String (PENDING, COMPLETED, FAILED)
stripeSessionId: String (Stripe checkout session ID)
stripeTransactionId: String (Stripe transaction ID)
senderId: String (who paid)
receiverId: String (who received)
projectId: String (related project)
templateId: String (related template)
metadata: Json (additional data)
createdAt: DateTime
updatedAt: DateTime
```

### User Model (Extended)
```
id: String
email: String
name: String
role: String (CLIENT, FREELANCER)
walletBalance: Decimal (current balance)
totalSpent: Decimal (lifetime spending)
totalEarned: Decimal (lifetime earnings)
image: String
createdAt: DateTime
updatedAt: DateTime

Relations:
- Projects created (as creator)
- Requests sent/received
- Transactions
- ActivityLogs
- Freelancer/Client profile
```

### Project Model
```
id: String
title: String
description: String
budget: Decimal
status: String (OPEN, IN_PROGRESS, COMPLETED, CANCELLED)
category: String
deadline: DateTime
creatorId: String (Client)
submiterId: String (Freelancer, optional)
createdAt: DateTime
updatedAt: DateTime
```

### Request Model
```
id: String
title: String
description: String
status: String (PENDING, ACCEPTED, REJECTED, COMPLETED)
senderId: String
receiverId: String
amount: Decimal (optional)
dueDate: DateTime (optional)
projectId: String (optional)
createdAt: DateTime
updatedAt: DateTime
```

## 🔐 Authentication Flow

All API routes use NextAuth session-based authentication:

```
User logs in with Google/GitHub
  ↓
NextAuth creates JWT + session
  ↓
API route receives request
  ↓
requireAuth() reads session
  ↓
Extracts userId from JWT
  ↓
Returns userId or throws UnauthorizedError
  ↓
Route continues with verified userId
```

## 💰 Commission Math

```
Amount: ₹1000
Commission Rate: 5% (0.05)

Commission = 1000 * 0.05 = ₹50
Net Amount = 1000 - 50 = ₹950

Stored in Transaction:
  amount: 1000        (total)
  commission: 50      (ATXEP fee)
  netAmount: 950      (freelancer gets)

Wallet Updates:
  Client:     walletBalance -= 1000
  Freelancer: walletBalance += 950
```

## 🧪 Testing All Endpoints

### Setup
1. Create two test users (CLIENT and FREELANCER)
2. Add balance to CLIENT wallet
3. Get session cookies

### Test Payment
```bash
# 1. Create checkout
curl -X POST http://localhost:3000/api/payments/checkout \
  -H "Cookie: <client-session>" \
  -d '{"freelancerId":"...", "amount": 1000}'

# 2. Complete payment in Stripe
url: https://checkout.stripe.com/pay/cs_test_...

# 3. Verify webhook processed
GET /api/wallet → check balances
```

### Test Projects
```bash
# 1. Client creates project
curl -X POST http://localhost:3000/api/projects \
  -H "Cookie: <client-session>" \
  -d '{"title":"...", "budget": 50000}'

# 2. Freelancer accepts
curl -X PATCH http://localhost:3000/api/projects \
  -H "Cookie: <freelancer-session>" \
  -d '{"projectId":"...", "status": "IN_PROGRESS"}'

# 3. View project
GET /api/projects
```

## 🚨 Error Codes

All errors return standard format:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

**Common Codes**:
- `UNAUTHORIZED` - Not logged in (401)
- `VALIDATION_ERROR` - Invalid input data (400)
- `NOT_FOUND` - Resource doesn't exist (404)
- `INSUFFICIENT_BALANCE` - Not enough wallet funds
- `INVALID_STATUS` - Invalid status transition
- `PERMISSION_DENIED` - User lacks permission

## 📁 File Organization

```
app/api/
├── payments/
│   └── checkout/
│       └── route.ts               ← Stripe integration
├── webhooks/
│   └── stripe/
│       └── route.ts               ← Webhook handler
├── wallet/
│   └── route.ts                   ← Wallet operations
├── projects/
│   └── route.ts                   ← Project management
├── templates/
│   └── route.ts                   ← Template operations
└── requests/
    └── route.ts                   ← Request management

lib/
├── api.ts                         ← Response helpers
├── auth.ts                        ← NextAuth config
├── auth-middleware.ts             ← Auth utilities
├── commission.ts                  ← 5% commission logic
├── stripe.ts                      ← Stripe utilities
├── activity.ts                    ← Activity logging
├── db.ts                          ← Prisma client
└── fonts.ts                       ← Font management

prisma/
├── schema.prisma                  ← DB schema
└── migrations/                    ← Migration files
```

## ✅ Production Checklist

- [x] All API endpoints implemented
- [x] Authentication & auth middleware
- [x] Commission calculation (5%)
- [x] Wallet system with balance tracking
- [x] Stripe integration (checkout + webhook)
- [x] Activity logging for all actions
- [x] Input validation on all endpoints
- [x] Error handling standardized
- [x] Atomic transactions for consistency
- [x] Webhook signature verification
- [x] Beautiful documentation
- [ ] Rate limiting (add if needed)
- [ ] Email notifications (add for production)
- [ ] Monitoring/logging setup (add for production)

