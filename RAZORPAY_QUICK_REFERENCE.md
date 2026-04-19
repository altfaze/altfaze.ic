# Razorpay Payment Integration - Quick Reference

## 🚀 Quick Start (5 minutes)

### 1. Setup Environment Variables
```bash
# Add to .env.local
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXX
RAZORPAY_KEY_SECRET=key_secret_XXXXXX
RAZORPAY_WEBHOOK_SECRET=webhook_secret_XXXXXX
```

### 2. Use Payment Component
```tsx
import { RazorpayPayment } from '@/components/razorpay-payment'

<RazorpayPayment
  freelancerId="user-123"
  amount={1000}
  description="Payment for design"
  onSuccess={(transactionId, paymentId, orderId) => {
    window.location.href = '/payment-success'
  }}
>
  Pay ₹1000
</RazorpayPayment>
```

### 3. Done! ✅

---

## 🛠️ Developer API Reference

### Backend: Create Order
```tsx
// POST /api/razorpay/order
const response = await fetch('/api/razorpay/order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 1000,              // Amount in INR
    freelancerId: 'user-123',
    projectId: 'project-123',
    description: 'Project payment',
  }),
})

const { data } = await response.json()
// Returns: { orderId, amount, currency, keyId, ... }
```

### Backend: Verify Payment (CRITICAL)
```tsx
// POST /api/razorpay/verify
const response = await fetch('/api/razorpay/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    razorpay_order_id: 'order_xxx',
    razorpay_payment_id: 'pay_xxx',
    razorpay_signature: 'signature_hex',
  }),
})

// Returns: { success: true, transactionId, amount, ... }
```

### Backend: Check Order Status
```tsx
// GET /api/razorpay/order?orderId=order_xxx
const response = await fetch('/api/razorpay/order?orderId=order_xxx')
const { data } = await response.json()
// Returns: { transactionId, status, amount, ... }
```

---

## 💡 Common Use Cases

### Use Case 1: Simple Payment Button
```tsx
function PaymentButton() {
  return (
    <RazorpayPayment
      freelancerId="freelancer-id"
      amount={500}
      onSuccess={() => alert('Payment successful!')}
    >
      Pay ₹500
    </RazorpayPayment>
  )
}
```

### Use Case 2: Project Payment with Custom Callback
```tsx
function ProjectCheckout() {
  const handleSuccess = async (transactionId, paymentId, orderId) => {
    // Update project status
    await fetch('/api/projects/mark-paid', {
      method: 'POST',
      body: JSON.stringify({ transactionId, projectId: 'proj-123' }),
    })
    
    // Redirect to success
    window.location.href = '/projects/success'
  }

  return (
    <RazorpayPayment
      freelancerId="freelancer-id"
      amount={10000}
      projectId="proj-123"
      description="Payment for website design"
      onSuccess={handleSuccess}
    >
      Complete Payment
    </RazorpayPayment>
  )
}
```

### Use Case 3: Template Purchase Payment
```tsx
function TemplatePurchase() {
  return (
    <RazorpayPayment
      freelancerId="template-creator-id"
      amount={2999}
      templateId="template-123"
      description="UI Template Purchase"
      onSuccess={(transactionId) => {
        // Grant template access
        grantTemplateAccess(transactionId)
      }}
    >
      Buy Template - ₹2999
    </RazorpayPayment>
  )
}
```

---

## 🧬 Technical Deep Dive

### Payment Flow Diagram

```
┌─────────────────────────────────────┐
│ User clicks "Pay Now" button        │
└──────────────┬──────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Frontend: Create Order               │
│ POST /api/razorpay/order             │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Backend: Creates Razorpay Order      │
│ - Generates order_id                 │
│ - Stores pending transaction         │
│ - Returns order_id + key_id          │
└──────────────┬───────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│ Frontend: Opens Razorpay Checkout    │
│ - Shows payment form                 │
│ - Collects card details              │
└──────────────┬───────────────────────┘
               │
               ▼
         ┌─────┴─────┐
         │           │
    SUCCESS      FAILURE
         │           │
         ▼           ▼
    ┌────────┐  ┌─────────┐
    │ Verify │  │  Error  │
    │Payment │  │  Show   │
    └────────┘  └─────────┘
         │
         ▼
    ┌──────────────────┐
    │ POST /verify     │
    │ - Check signature│
    │ - Verify amount  │
    │ - Update DB      │
    └──────────────────┘
         │
         ▼
    ┌──────────────┐
    │ Success Page │
    │ or Callback  │
    └──────────────┘
```

### Security Flow

```
1. Frontend sends: order_id, payment_id, signature
   ↓
2. Backend receives request
   ↓
3. Backend computes expected signature:
   message = "order_id|payment_id"
   signature = HMAC-SHA256(message, KEY_SECRET)
   ↓
4. Backend compares signatures:
   received_signature === computed_signature ?
   ↓
5. If matches:
   - Fetch payment details from Razorpay
   - Verify amount & status
   - Mark transaction as SUCCESS
   - Transfer funds
   ↓
6. Return success/failure to frontend
```

---

## 🐛 Debugging Tips

### Enable Logging
```ts
// In development, enable logs
if (process.env.NODE_ENV === 'development') {
  console.log('[RAZORPAY_DEBUG]', {
    orderId,
    paymentId,
    signature,
    computedSignature,
  })
}
```

### Check Razorpay Dashboard
1. Go to https://dashboard.razorpay.com
2. Transactions → See all payments
3. Check payment status, error codes, retry logs

### Test Webhook Locally
```bash
# Install ngrok
npm install -g ngrok

# Start ngrok
ngrok http 3000

# Update webhook URL in Razorpay dashboard
# https://YOUR_NGROK_URL/api/razorpay/webhook
```

### Verify Signature Manually
```ts
import crypto from 'crypto'

const orderId = 'order_xxx'
const paymentId = 'pay_xxx'
const signature = 'sig_xxx'

const message = `${orderId}|${paymentId}`
const computed = crypto
  .createHmac('sha256', 'YOUR_SECRET_KEY')
  .update(message)
  .digest('hex')

console.log('Signatures match:', computed === signature)
```

---

## 📊 Testing Scenarios

| Scenario | Card | OTP | Result |
|----------|------|-----|--------|
| Successful payment | 4111111111111111 | Any | ✅ Success |
| Failed payment | 4222222222222222 | Any | ❌ Failed |
| International | 378282246310005 | 123 | ⚠️ Declined |
| Verify OTP | Any | 99 | ✅ Success |

---

## 🔗 Useful Links

- **Dashboard**: https://dashboard.razorpay.com
- **Docs**: https://razorpay.com/docs/
- **Test Cards**: https://razorpay.com/docs/payments/test-pay/
- **API Reference**: https://razorpay.com/docs/api/
- **Support**: support@razorpay.com

---

## ⚡ Performance Tips

✅ **Cache Razorpay script**
- Razorpay checkout script is auto-cached by browser
- No need for additional optimization

✅ **Lazy load component**
```tsx
const RazorpayPayment = dynamic(
  () => import('@/components/razorpay-payment'),
  { loading: () => <Button disabled>Loading...</Button> }
)
```

✅ **Debounce rapid clicks**
```tsx
const handleClick = useCallback(
  debounce(() => handlePayment(), 500),
  []
)
```

---

## 🎯 Production Checklist

Before deploying:
- [ ] Switch to live keys in Razorpay dashboard
- [ ] Update environment variables on Vercel
- [ ] Test payment flow with small amount (₹1)
- [ ] Verify webhook receives events
- [ ] Check error logs for issues
- [ ] Test refund process
- [ ] Enable 2FA on Razorpay account
- [ ] Monitor for first 24 hours

---

**Last Updated**: April 19, 2026  
**Maintained By**: ALTFaze Development Team
