# 🔌 API Documentation

Complete reference for all Altfaze API endpoints.

## Table of Contents
- [Authentication](#authentication)
- [Freelancers](#freelancers)
- [Projects](#projects)
- [Proposals](#proposals)
- [Payments](#payments)
- [Templates](#templates)
- [Transactions](#transactions)
- [Error Handling](#error-handling)

---

## Authentication

All protected endpoints require JWT token in cookie or Authorization header.

### Login
```http
POST /api/auth/signin
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CLIENT"
  }
}
```

### Register
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "CLIENT"  // or "FREELANCER"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "CLIENT"
  }
}
```

### Verify Role
```http
GET /api/auth/verify-role
Authorization: Bearer {token}
```

**Response:**
```json
{
  "role": "CLIENT",
  "verified": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com"
  }
}
```

### Logout
```http
POST /api/auth/signout
```

---

## Freelancers

### Get All Freelancers
```http
GET /api/freelancers?page=1&limit=20&search=react&skills=node.js
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `search` - Search by name/bio
- `skills` - Filter by skills (comma-separated)
- `sort` - Sort by: `rating`, `experience`, `newest`

**Response:**
```json
{
  "data": {
    "freelancers": [
      {
        "id": "freelancer_123",
        "name": "Jane Developer",
        "email": "jane@example.com",
        "bio": "Full-stack developer",
        "skills": ["React", "Node.js", "PostgreSQL"],
        "hourlyRate": 50,
        "rating": 4.8,
        "projects": 127,
        "avatar": "https://..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 245,
      "pages": 13
    }
  }
}
```

### Get Freelancer Profile
```http
GET /api/freelancers/{id}
```

**Response:**
```json
{
  "data": {
    "id": "freelancer_123",
    "name": "Jane Developer",
    "email": "jane@example.com",
    "bio": "Full-stack developer with 5 years experience",
    "skills": ["React", "Node.js", "PostgreSQL"],
    "hourlyRate": 50,
    "rating": 4.8,
    "projects": 127,
    "reviews": [
      {
        "author": "Client Name",
        "rating": 5,
        "comment": "Great work!",
        "date": "2024-01-15"
      }
    ],
    "portfolio": [
      {
        "title": "E-commerce Platform",
        "description": "Built full stack",
        "image": "https://...",
        "link": "https://..."
      }
    ],
    "verified": true,
    "joinDate": "2023-06-01"
  }
}
```

### Update Freelancer Profile
```http
PUT /api/freelancers/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "bio": "Updated bio",
  "hourlyRate": 60,
  "skills": ["React", "Vue", "Node.js"],
  "avatar": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "freelancer": {
    "id": "freelancer_123",
    ...updated fields
  }
}
```

---

## Projects

### Create Project
```http
POST /api/projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Build E-commerce Website",
  "description": "Need a full-stack e-commerce platform",
  "category": "web-development",
  "skills": ["React", "Node.js", "MongoDB"],
  "budget": 5000,
  "deadline": "2024-06-01",
  "attachment": "url_to_file"
}
```

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "project_123",
    "title": "Build E-commerce Website",
    "status": "OPEN",
    "createdAt": "2024-01-20"
  }
}
```

### Get All Projects
```http
GET /api/projects?page=1&limit=20&status=OPEN&category=web-dev&search=react
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `status` - Filter: `OPEN`, `IN_PROGRESS`, `COMPLETED`
- `category` - Project category
- `search` - Search by title
- `sort` - Sort by: `newest`, `budget-high`, `deadline`

**Response:**
```json
{
  "data": {
    "projects": [
      {
        "id": "project_123",
        "title": "Build E-commerce Website",
        "description": "...",
        "budget": 5000,
        "status": "OPEN",
        "skills": ["React", "Node.js"],
        "proposals": 12,
        "deadline": "2024-06-01",
        "client": {
          "id": "client_123",
          "name": "Client Name",
          "rating": 4.9
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 450,
      "pages": 23
    }
  }
}
```

### Get Project Details
```http
GET /api/projects/{id}
```

**Response:**
```json
{
  "data": {
    "id": "project_123",
    "title": "Build E-commerce Website",
    "description": "...",
    "budget": 5000,
    "status": "OPEN",
    "skills": ["React", "Node.js"],
    "deadline": "2024-06-01",
    "client": {
      "id": "client_123",
      "name": "Client Name",
      "rating": 4.9,
      "email": "client@example.com"
    },
    "proposals": [
      {
        "id": "proposal_123",
        "bid": 4500,
        "freelancer": {
          "id": "freelancer_123",
          "name": "Freelancer Name"
        },
        "status": "PENDING"
      }
    ]
  }
}
```

### Update Project
```http
PUT /api/projects/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "budget": 5500,
  "description": "Updated description"
}
```

---

## Proposals

### Submit Proposal
```http
POST /api/projects/{projectId}/proposals
Authorization: Bearer {token}
Content-Type: application/json

{
  "bid": 4500,
  "message": "I can complete this project in 3 weeks",
  "timeline": "21 days"
}
```

**Response:**
```json
{
  "success": true,
  "proposal": {
    "id": "proposal_123",
    "projectId": "project_123",
    "bid": 4500,
    "status": "PENDING"
  }
}
```

### Get Proposals for Project
```http
GET /api/projects/{projectId}/proposals?status=PENDING
```

**Response:**
```json
{
  "data": {
    "proposals": [
      {
        "id": "proposal_123",
        "bid": 4500,
        "message": "I can complete this...",
        "status": "PENDING",
        "freelancer": {
          "id": "freelancer_123",
          "name": "Jane Developer",
          "rating": 4.8,
          "projects": 127
        },
        "submittedAt": "2024-01-20"
      }
    ]
  }
}
```

### Accept Proposal
```http
POST /api/proposals/{proposalId}/accept
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Proposal accepted",
  "project": {
    "id": "project_123",
    "status": "IN_PROGRESS",
    "assignedTo": "freelancer_123"
  }
}
```

### Reject Proposal
```http
POST /api/proposals/{proposalId}/reject
Authorization: Bearer {token}

{
  "reason": "Found better fit"
}
```

---

## Payments

### Create Payment Intent
```http
POST /api/checkout
Authorization: Bearer {token}
Content-Type: application/json

{
  "projectId": "project_123",
  "amount": 5000
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

### Payment Webhook
```http
POST /api/stripe/webhook
Content-Type: application/json
Stripe-Signature: t=...,v1=...

{
  "type": "charge.succeeded",
  "data": {
    "object": {
      "id": "ch_...",
      "amount": 500000,
      "status": "succeeded"
    }
  }
}
```

---

## Templates

### Get All Templates
```http
GET /api/templates?page=1&limit=20&category=saas&sort=trending
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `category` - Filter by category
- `sort` - trending, newest, rating, price-low, price-high

**Response:**
```json
{
  "data": {
    "templates": [
      {
        "id": "template_123",
        "name": "SaaS Landing Page",
        "category": "SaaS",
        "price": 49,
        "rating": 4.9,
        "downloads": 1240,
        "demo": "https://...",
        "uploader": {
          "id": "user_123",
          "name": "Template Creator"
        },
        "image": "https://..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 350,
      "pages": 18
    }
  }
}
```

### Get Template Details
```http
GET /api/templates/{id}
```

**Response:**
```json
{
  "data": {
    "id": "template_123",
    "name": "SaaS Landing Page",
    "description": "Modern SaaS landing page...",
    "category": "SaaS",
    "price": 49,
    "rating": 4.9,
    "downloads": 1240,
    "images": ["https://...", "https://..."],
    "demo": "https://demo.example.com",
    "sourceCode": "https://...",
    "features": [
      "Responsive design",
      "Dark mode",
      "Stripe integration"
    ],
    "uploader": {
      "id": "user_123",
      "name": "Template Creator",
      "avatar": "https://..."
    },
    "reviews": [
      {
        "author": "User Name",
        "rating": 5,
        "comment": "Great template!",
        "date": "2024-01-15"
      }
    ]
  }
}
```

### Upload Template
```http
POST /api/templates
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: (zip file)
name: "SaaS Landing Page"
description: "Modern SaaS landing page"
category: "SaaS"
price: 49
features: ["Responsive", "Dark mode"]
```

**Response:**
```json
{
  "success": true,
  "template": {
    "id": "template_123",
    "name": "SaaS Landing Page",
    "status": "PENDING_REVIEW"
  }
}
```

---

## Transactions

### Get User Transactions
```http
GET /api/transactions?page=1&limit=20&type=PROJECT_PAYMENT&status=COMPLETED
```

**Response:**
```json
{
  "data": {
    "transactions": [
      {
        "id": "trans_123",
        "type": "PROJECT_PAYMENT",
        "amount": 5000,
        "status": "COMPLETED",
        "description": "Payment for Project Name",
        "date": "2024-01-20",
        "project": {
          "id": "project_123",
          "title": "Build E-commerce"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45
    }
  }
}
```

### Get Wallet
```http
GET /api/wallet
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": {
    "balance": 2500.00,
    "escrow": 500.00,
    "totalEarnings": 15000.00,
    "transactions": [...]
  }
}
```

### Withdraw Funds
```http
POST /api/wallet/withdraw
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 1000,
  "method": "bank_transfer"  // or "stripe"
}
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {
      "email": "Must be a valid email",
      "password": "Must be at least 8 characters"
    }
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Not authenticated
- `FORBIDDEN` - Not authorized for this action
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `RATE_LIMITED` - Too many requests
- `INTERNAL_ERROR` - Server error

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `409` - Conflict
- `429` - Rate limited
- `500` - Server error

---

## Rate Limiting

- **Free tier**: 100 requests/hour
- **Authenticated**: 1000 requests/hour
- **Pro**: Unlimited

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640000000
```

---

## Authentication Methods

### Cookie-based (Default)
```javascript
// Automatically sent with requests
fetch('/api/projects', {
  credentials: 'include'
})
```

### Bearer Token
```javascript
fetch('/api/projects', {
  headers: {
    'Authorization': 'Bearer your_token_here'
  }
})
```

---

## Support

For API issues:
- Check error codes above
- Verify authentication token
- Check rate limits
- Contact support@altfaze.com
