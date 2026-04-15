# Complete Altfaze API Reference

All endpoints, schemas, and usage examples for the production freelance marketplace.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Projects](#projects)
3. [Requests/Bids](#requestsbids)
4. [Wallet](#wallet)
5. [Templates](#templates)
6. [Users](#users)
7. [Dashboard](#dashboard)
8. [AI](#ai)
9. [Real-Time](#real-time)
10. [Error Handling](#error-handling)

---

## Authentication

### Login
**POST** `/api/auth/signin`

```json
{
  "email": "user@example.com",
  "password": "password123",
  "callbackUrl": "/dashboard"
}
```

**Response** (201)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "CLIENT",
      "image": null
    },
    "session": "session_token_123"
  }
}
```

### Register
**POST** `/api/auth/signup`

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User"
}
```

---

## Projects

### List Projects

**GET** `/api/projects`

**Query Parameters:**
- `status` - OPEN | IN_PROGRESS | COMPLETED | CANCELLED
- `category` - Filter by category
- `my` - true | false (show only user's projects)
- `limit` - 1-100 (default: 20)
- `page` - >= 1 (default: 1)

**Example:**
```
GET /api/projects?status=OPEN&category=Web%20Development&limit=20&page=1
```

**Response** (200)
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "proj_123",
        "title": "Build website",
        "description": "Need a React website...",
        "budget": 500,
        "status": "OPEN",
        "category": "Web Development",
        "deadline": "2024-12-31T00:00:00Z",
        "creator": {
          "id": "client_123",
          "name": "John",
          "email": "john@example.com",
          "image": "https://..."
        },
        "createdAt": "2024-04-14T10:00:00Z",
        "updatedAt": "2024-04-14T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5,
      "hasMore": true
    }
  },
  "message": "Projects retrieved successfully"
}
```

### Create Project (CLIENT only)

**POST** `/api/projects`

**Required Headers:**
```
Authorization: Bearer <session_token>
```

**Request Body:**
```json
{
  "title": "Build website",
  "description": "I need a React-based website with authentication",
  "budget": 500,
  "category": "Web Development",
  "deadline": "2024-12-31"
}
```

**Validation Rules:**
- `title`: 5-200 characters
- `description`: 20-5000 characters
- `budget`: 0.01-999,999,999
- `category`: Must be valid category

**Response** (201)
```json
{
  "success": true,
  "data": {
    "id": "proj_123",
    "title": "Build website",
    "description": "I need a React-based website...",
    "budget": 500,
    "status": "OPEN",
    "category": "Web Development",
    "deadline": "2024-12-31",
    "creator": {
      "id": "client_123",
      "name": "John",
      "email": "john@example.com"
    },
    "createdAt": "2024-04-14T10:00:00Z"
  },
  "message": "Project created successfully"
}
```

### Apply to Project (FREELANCER only)

**POST** `/api/projects/[projectId]/apply`

**Request Body:**
```json
{
  "proposal": "I have 5 years of React experience. I can complete this in 2 weeks.",
  "bidAmount": 450
}
```

**Validation Rules:**
- `proposal`: 20-5000 characters
- `bidAmount`: 0.5-999,999,999

**Response** (201)
```json
{
  "success": true,
  "data": {
    "id": "req_123",
    "title": "Proposal for: Build website",
    "description": "I have 5 years...",
    "amount": 450,
    "status": "PENDING",
    "sender": {
      "id": "freelancer_123",
      "name": "Jane",
      "email": "jane@example.com",
      "image": "https://...",
      "freelancer": {
        "hourlyRate": 50,
        "rating": 4.8
      }
    },
    "receiver": {
      "id": "client_123",
      "email": "john@example.com",
      "name": "John"
    },
    "createdAt": "2024-04-14T10:00:00Z"
  },
  "message": "Application submitted successfully"
}
```

### Accept Bid (CLIENT only)

**POST** `/api/projects/[projectId]/close`

**Request Body:**
```json
{
  "requestId": "req_123"
}
```

**Response** (200)
```json
{
  "success": true,
  "data": {
    "request": {
      "id": "req_123",
      "status": "ACCEPTED",
      "amount": 450,
      "sender": { ... }
    },
    "project": {
      "id": "proj_123",
      "title": "Build website",
      "status": "IN_PROGRESS",
      "budget": 500,
      "submitter": {
        "id": "freelancer_123",
        "name": "Jane",
        "email": "jane@example.com"
      }
    }
  },
  "message": "Request accepted and project started"
}
```

### Submit Work (FREELANCER only)

**POST** `/api/projects/[projectId]/submit`

**Request Body:**
```json
{
  "submission": "Completed the website! It includes authentication, dashboard, and responsive design.",
  "submissionUrl": "https://github.com/example/project-link"
}
```

**Response** (200)
```json
{
  "success": true,
  "data": {
    "id": "proj_123",
    "title": "Build website",
    "status": "COMPLETED",
    "submitter": {
      "id": "freelancer_123",
      "name": "Jane",
      "email": "jane@example.com"
    },
    "updatedAt": "2024-04-14T10:00:00Z"
  },
  "message": "Work submitted successfully. Client will review and approve."
}
```

### Approve Work (CLIENT only)

**PATCH** `/api/projects/[projectId]/submit`

**Request Body:**
```json
{
  "approved": true,
  "feedback": "Great work! Exactly what we needed."
}
```

**Response** (200)
```json
{
  "success": true,
  "data": {
    "id": "proj_123",
    "status": "COMPLETED",
    "submitter": {
      "id": "freelancer_123",
      "name": "Jane"
    }
  },
  "message": "Project completed and payment released"
}
```

---

## Requests/Bids

### Get Requests

**GET** `/api/requests`

**Query Parameters:**
- `type` - sent | received | (all)
- `status` - PENDING | ACCEPTED | REJECTED | COMPLETED
- `limit` - 1-100 (default: 20)
- `page` - >= 1 (default: 1)

**Response** (200)
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "req_123",
        "title": "Proposal for: Build website",
        "description": "I can build this...",
        "status": "PENDING",
        "amount": 450,
        "dueDate": "2024-12-31T00:00:00Z",
        "sender": {
          "id": "user_123",
          "name": "Jane",
          "email": "jane@example.com",
          "image": "https://...",
          "role": "FREELANCER"
        },
        "receiver": {
          "id": "user_456",
          "name": "John",
          "email": "john@example.com",
          "image": "https://...",
          "role": "CLIENT"
        },
        "createdAt": "2024-04-14T10:00:00Z",
        "updatedAt": "2024-04-14T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

## Wallet

### Get Wallet

**GET** `/api/wallet`

**Query Parameters:**
- `limit` - 1-100 (default: 20)
- `page` - >= 1 (default: 1)

**Response** (200)
```json
{
  "success": true,
  "data": {
    "wallet": {
      "userId": "user_123",
      "email": "user@example.com",
      "name": "John",
      "walletBalance": 1500,
      "totalSpent": 5000,
      "totalEarned": 8000
    },
    "transactions": [
      {
        "id": "trans_123",
        "type": "EARNING",
        "amount": 450,
        "netAmount": 427.5,
        "commission": 22.5,
        "status": "COMPLETED",
        "description": "Earnings from project: Build website",
        "createdAt": "2024-04-14T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

### Add Funds

**POST** `/api/wallet/add-funds`

**Request Body:**
```json
{
  "amount": 100,
  "stripeSessionId": "stripe_session_123"
}
```

**Response** (201)
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "trans_123",
      "type": "PAYMENT",
      "amount": 100,
      "status": "COMPLETED",
      "createdAt": "2024-04-14T10:00:00Z"
    },
    "wallet": {
      "balance": 1500,
      "totalSpent": 5100,
      "totalEarned": 8000
    }
  },
  "message": "Funds added successfully"
}
```

### Request Withdrawal (FREELANCER only)

**POST** `/api/wallet/withdraw`

**Request Body:**
```json
{
  "amount": 500
}
```

**Validation Rules:**
- Minimum: $10
- Maximum: $999,999,999
- Must have sufficient balance

**Response** (201)
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "trans_123",
      "type": "WITHDRAWAL",
      "amount": 500,
      "status": "PENDING",
      "createdAt": "2024-04-14T10:00:00Z"
    },
    "message": "Withdrawal request submitted. Admin approval pending."
  }
}
```

### Pay Freelancer

**POST** `/api/wallet/pay-freelancer`

**Request Body:**
```json
{
  "freelancerId": "freelancer_123",
  "projectId": "proj_123",
  "amount": 450
}
```

**Response** (201)
```json
{
  "success": true,
  "data": {
    "transaction": {
      "id": "trans_123",
      "from": "client_123",
      "to": "freelancer_123",
      "amount": 450,
      "status": "COMPLETED"
    }
  },
  "message": "Payment sent successfully"
}
```

---

## Templates

### List Templates

**GET** `/api/templates`

**Query Parameters:**
- `search` - Search by title/description
- `category` - Filter by category
- `sort` - newest | popular | price-low | price-high
- `limit` - 1-100 (default: 20)
- `page` - >= 1 (default: 1)

**Response** (200)
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "template_123",
        "title": "React Dashboard",
        "description": "Complete dashboard template with charts...",
        "category": "Dashboard",
        "price": 29,
        "image": "https://...",
        "features": ["Dark mode", "Charts", "Users table"],
        "createdAt": "2024-04-14T10:00:00Z",
        "updatedAt": "2024-04-14T10:00:00Z"
      }
    ],
    "pagination": { ... }
  }
}
```

### Upload Template (FREELANCER only)

**POST** `/api/templates/create`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `title` - (string, required)
- `description` - (string, required)
- `category` - (string, required)
- `price` - (number, required)
- `features` - (JSON array, required)
- `templateFile` - (File, required)
- `previewImage` - (File, optional)

**Example with curl:**
```bash
curl -X POST http://localhost:3000/api/templates/create \
  -H "Authorization: Bearer token" \
  -F "title=React Dashboard" \
  -F "description=Complete dashboard template" \
  -F "category=Dashboard" \
  -F "price=29" \
  -F 'features=["Dark mode", "Charts", "Users table"]' \
  -F "templateFile=@dashboard.zip" \
  -F "previewImage=@preview.jpg"
```

**Response** (201)
```json
{
  "success": true,
  "data": {
    "id": "template_123",
    "title": "React Dashboard",
    "description": "Complete dashboard template",
    "category": "Dashboard",
    "price": 29,
    "image": "https://...",
    "features": ["Dark mode", "Charts", "Users table"],
    "createdAt": "2024-04-14T10:00:00Z"
  },
  "message": "Template uploaded successfully"
}
```

### Buy Template

**POST** `/api/templates/[templateId]/buy`

**Response** (201)
```json
{
  "success": true,
  "data": {
    "purchase": {
      "id": "purchase_123",
      "templateId": "template_123",
      "downloadToken": "token_123",
      "status": "COMPLETED"
    },
    "template": {
      "id": "template_123",
      "title": "React Dashboard",
      "price": 29
    }
  },
  "message": "Template purchased successfully"
}
```

### Download Template

**GET** `/api/templates/[templateId]/download?token=download_token`

**Response** (200)
```json
{
  "success": true,
  "data": {
    "templateId": "template_123",
    "title": "React Dashboard",
    "downloadUrl": "https://...",
    "expiresAt": "2024-04-21T10:00:00Z"
  },
  "message": "Download link generated"
}
```

---

## Users

### Get Profile

**GET** `/api/users/profile`

**Response** (200)
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "image": "https://...",
    "role": "CLIENT",
    "walletBalance": 1500,
    "totalSpent": 5000,
    "totalEarned": 0,
    "isVerified": true,
    "createdAt": "2024-04-01T10:00:00Z",
    "client": {
      "company": "Tech Company",
      "description": "We build software solutions"
    }
  }
}
```

### Update Profile

**PATCH** `/api/users/profile`

**Request Body:**
```json
{
  "name": "John Doe",
  "image": "https://...",
  "bio": "5+ years of React experience",
  "skills": ["React", "Node.js", "PostgreSQL"],
  "hourlyRate": 50
}
```

**Response** (200)
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "name": "John Doe",
    "email": "user@example.com",
    "image": "https://...",
    "message": "Profile updated successfully"
  }
}
```

### Get Statistics

**GET** `/api/users/stats`

**Response (CLIENT)** (200)
```json
{
  "success": true,
  "data": {
    "role": "CLIENT",
    "stats": {
      "projectsCreated": 10,
      "projectsCompleted": 8,
      "totalSpent": 5000,
      "requests": {
        "pending": 3,
        "accepted": 2,
        "rejected": 1
      }
    }
  }
}
```

**Response (FREELANCER)** (200)
```json
{
  "success": true,
  "data": {
    "role": "FREELANCER",
    "stats": {
      "projectsCompleted": 25,
      "ongoingProjects": 3,
      "totalEarned": 15000,
      "avgRating": 4.8,
      "applications": {
        "pending": 8,
        "accepted": 3,
        "rejected": 2
      }
    }
  }
}
```

### Get Activity Log

**GET** `/api/users/activity`

**Query Parameters:**
- `limit` - 1-100 (default: 20)
- `page` - >= 1 (default: 1)

**Response** (200)
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "activity_123",
        "action": "PROJECT_CREATED",
        "description": "Created project: Build website",
        "resourceType": "PROJECT",
        "resourceId": "proj_123",
        "createdAt": "2024-04-14T10:00:00Z",
        "metadata": { "projectId": "proj_123" }
      }
    ],
    "pagination": { ... }
  }
}
```

---

## Dashboard

### Client Dashboard

**GET** `/api/dashboard/client`

**Response** (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "name": "John",
      "email": "john@example.com",
      "image": "https://...",
      "walletBalance": 1500,
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
}
```

### Freelancer Dashboard

**GET** `/api/dashboard/freelancer`

**Response** (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "name": "Jane",
      "email": "jane@example.com",
      "image": "https://...",
      "walletBalance": 500,
      "totalEarned": 15000,
      "rating": 4.8,
      "reviewCount": 42,
      "hourlyRate": 50
    },
    "projects": {
      "completed": 25,
      "ongoing": 3,
      "active": [...]
    },
    "applications": {
      "pending": 8,
      "accepted": 3,
      "pendingList": [...]
    },
    "templates": 5,
    "transactions": [...]
  }
}
```

---

## AI

### Generate Project Description

**POST** `/api/ai/generate-description`

**Request Body:**
```json
{
  "projectTitle": "Build website",
  "requirements": "React, Node.js, PostgreSQL, responsive design"
}
```

**Response** (200)
```json
{
  "success": true,
  "data": {
    "description": "We're looking for an experienced full-stack developer to build a modern, responsive website using React for the frontend..."
  }
}
```

### Generate Proposal

**POST** `/api/ai/generate-proposal`

**Request Body (FREELANCER only):**
```json
{
  "projectTitle": "Build website",
  "projectDescription": "We need a React-based website with authentication...",
  "freelancerProfile": "5+ years React, 3+ years Node.js, expert in PostgreSQL"
}
```

**Response** (200)
```json
{
  "success": true,
  "data": {
    "proposal": "I'm very interested in this project! With 5+ years of React experience and 3+ years of Node.js development, I have strong expertise in building scalable web applications..."
  }
}
```

---

## Real-Time

### Get Notifications

**GET** `/api/notifications`

**Response** (200)
```json
{
  "success": true,
  "data": {
    "unread": [
      {
        "id": "notif_123",
        "message": "New bid from Jane: Proposal for: Build website",
        "type": "info",
        "createdAt": "2024-04-14T10:00:00Z"
      }
    ],
    "recent": [...]
  }
}
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2024-04-14T10:00:00Z"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Not logged in
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `429 Too Many Requests` - Rate limited
- `500 Internal Server Error` - Server error

### Common Errors

| Status | Message | Resolution |
|--------|---------|-----------|
| 400 | Valid title is required | Provide title 5-200 characters |
| 400 | Insufficient balance | Add funds to wallet |
| 401 | You must be logged in | Login required |
| 403 | You are not assigned to this project | Check project assignment |
| 404 | Project not found | Verify project ID |
| 409 | You have already applied to this project | Can't duplicate applications |
| 429 | Too many requests | Wait before retrying |

---

**API Version**: 1.0.0  
**Last Updated**: April 14, 2026  
**Environment**: Production
