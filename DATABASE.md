# 📊 Database Documentation

Complete guide to Altfaze database schema, models, and management.

## Table of Contents
- [Database Overview](#database-overview)
- [Schema Design](#schema-design)
- [Data Models](#data-models)
- [Relationships](#relationships)
- [Migrations](#migrations)
- [Backup & Recovery](#backup--recovery)

---

## Database Overview

- **Type**: PostgreSQL 12+
- **ORM**: Prisma
- **Schema Location**: `prisma/schema.prisma`
- **Migrations**: `prisma/migrations/`

---

## Schema Design

### Core Entities

```
User
├── Client (role=CLIENT)
├── Freelancer (role=FREELANCER)
└── Admin (role=ADMIN)

Project
├── belongs to User (client)
├── Proposal (freelancer applications)
└── Transaction (payments)

Template
├── belongs to User (vendor)
├── Category
└── Purchase

Transaction
├── belongs to Project
└── Wallet (user balance)

Review & Rating
├── belongs to User (reviewer)
└── belongs to User (reviewee)
```

---

## Data Models

### 1. User Model
**Stores**: User accounts, authentication, profile info

```prisma
model User {
  id                    String      @id @default(cuid())
  email                 String      @unique
  name                  String?
  password              String      (hashed with bcryptjs)
  role                  UserRole    @default(CLIENT)
  avatar                String?
  bio                   String?
  verified              Boolean     @default(false)
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  
  // Relations
  projects              Project[]
  proposals             Proposal[]
  wallet                Wallet?
  reviews               Review[]
  ratings               Rating[]
  templates             Template[]
}

enum UserRole {
  CLIENT
  FREELANCER
  ADMIN
}
```

### 2. Project Model
**Stores**: Client projects, job postings, specifications

```prisma
model Project {
  id                  String      @id @default(cuid())
  title               String
  description         String
  skills              String[]    // ["React", "Node.js"]
  budget              Float
  status              ProjectStatus @default(OPEN)
  deadline            DateTime
  
  // Relations
  clientId            String
  client              User        @relation(fields: [clientId])
  proposals           Proposal[]
  transactions        Transaction[]
  
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
}

enum ProjectStatus {
  OPEN
  IN_PROGRESS
  COMPLETED
  CANCELLED
  DISPUTED
}
```

### 3. Proposal Model
**Stores**: Freelancer applications to projects

```prisma
model Proposal {
  id                  String      @id @default(cuid())
  bid                 Float       // Amount freelancer is asking
  message             String
  status              ProposalStatus @default(PENDING)
  
  // Relations
  projectId           String
  project             Project     @relation(fields: [projectId])
  freelancerId        String
  freelancer          User        @relation(fields: [freelancerId])
  
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
}

enum ProposalStatus {
  PENDING
  ACCEPTED
  REJECTED
  WITHDRAWN
}
```

### 4. Transaction Model
**Stores**: All financial transactions, payments, commissions

```prisma
model Transaction {
  id                  String      @id @default(cuid())
  type                TransactionType
  amount              Float
  status              TransactionStatus @default(PENDING)
  stripeId            String?     // Stripe charge/payment ID
  
  // Relations
  projectId           String?
  project             Project?    @relation(fields: [projectId])
  userId              String
  user                User        @relation(fields: [userId])
  
  description         String?
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
}

enum TransactionType {
  PROJECT_PAYMENT
  COMMISSION
  WITHDRAWAL
  TEMPLATE_PURCHASE
  REFUND
}

enum TransactionStatus {
  PENDING
  COMPLETED
  FAILED
  DISPUTED
}
```

### 5. Wallet Model
**Stores**: User balance, escrow funds, earnings

```prisma
model Wallet {
  id                  String      @id @default(cuid())
  balance             Float       @default(0)
  escrow              Float       @default(0)  // Locked for projects
  totalEarnings       Float       @default(0)
  
  userId              String      @unique
  user                User        @relation(fields: [userId])
  
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
}
```

### 6. Template Model
**Stores**: Website templates for sale

```prisma
model Template {
  id                  String      @id @default(cuid())
  name                String
  description         String
  price               Float
  category            String      // "SaaS", "E-commerce"
  image               String?     // Cover image URL
  sourceCode          String?     // S3 URL to code
  demo                String?     // Demo URL
  rating              Float       @default(4.5)
  downloads           Int         @default(0)
  
  // Relations
  uploaderId          String
  uploader            User        @relation(fields: [uploaderId])
  purchases           TemplatePurchase[]
  
  featured            Boolean     @default(false)
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt
}
```

### 7. Review & Rating Models
**Stores**: User feedback and ratings

```prisma
model Review {
  id                  String      @id @default(cuid())
  comment             String?
  rating              Int         // 1-5 stars
  
  reviewerId          String
  reviewer            User        @relation(fields: [reviewerId])
  
  revieweeId          String      @unique
  reviewee            User        @relation(fields: [revieweeId])
  
  createdAt           DateTime    @default(now())
}
```

---

## Relationships

### User Relationships
```
User (1) ──→ (N) Project          (as client)
User (1) ──→ (N) Proposal         (as freelancer)
User (1) ──→ (1) Wallet           (balance)
User (1) ──→ (N) Template         (vendor)
User (1) ──→ (N) Review           (reviewer)
```

### Project Relationships
```
Project (1) ──→ (N) Proposal      (applications)
Project (1) ──→ (N) Transaction   (payments)
Project (N) ──→ (1) User          (client)
```

### Cascade Rules
```
User deleted         → Delete all relationships
Project deleted      → Delete proposals & transactions
Wallet auto-created  → When user created
```

---

## Migrations

### Create Migration
```bash
# After changing schema.prisma
npx prisma migrate dev --name add_new_field

# Generates:
# - SQL migration file
# - Runs migration
# - Regenerates Prisma client
```

### Apply Migration
```bash
# Apply existing migrations
npx prisma migrate deploy

# Used in:
# - CI/CD pipelines
# - Production deployments
```

### Rollback Migration
```bash
# Last migration (dev only)
npx prisma migrate resolve --rolled-back <migration_name>

# Then revert in schema.prisma
```

### Migration History
```bash
# View all migrations
ls prisma/migrations/

# Check migration status
npx prisma migrate status
```

---

## Backup & Recovery

### Automatic Backups

**Cloud Providers** (recommended):
- **Supabase**: Automatic daily backups
- **AWS RDS**: Automated snapshots
- **Railway**: Daily backups included

### Manual Backup

```bash
# Export database
pg_dump altfaze_db > backup.sql

# Backup with Prisma
npx prisma db seed > backup.json
```

### Restore from Backup

```bash
# Restore from SQL dump
psql altfaze_db < backup.sql

# Option 2: Reset and reseed
npx prisma migrate reset --force
npm run seed
```

### Production Best Practices

1. **Enable automated backups** on your database provider
2. **Weekly manual exports** to secure storage
3. **Test recovery process** monthly
4. **Keep 30-day backup retention**
5. **Monitor disk space** usage

---

## Access & Credentials

### Local Development
```
Host: localhost
Port: 5432
User: postgres
Password: password
Database: altfaze_db
```

### Production (Vercel)
```
Environment: Uses DATABASE_URL from .env
Connection: Handled by Prisma
Pool: Automatic connection pooling
```

### Security
- ✅ Never commit `.env` with real credentials
- ✅ Use different credentials per environment
- ✅ Rotate credentials quarterly
- ✅ Use read-only users for backups
- ✅ Enable SSL for remote connections

---

## Performance Optimization

### Indexing Strategy
```prisma
// Frequently queried fields are indexed
email              @unique   (indexed)
userId            @relation (indexed)
projectId         @relation (indexed)
createdAt                   (add manual index)
```

### Query Optimization
```typescript
// Use select to avoid fetching all fields
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, email: true, name: true }
})

// Use include for relations
const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: { proposals: true, transactions: true }
})
```

### Connection Pooling
- Vercel: Automatic
- Local: PgBouncer recommended for production

---

## Maintenance

### Regular Tasks
- Weekly: Check disk usage
- Monthly: Review slow queries
- Quarterly: Optimize indexes
- Yearly: Full audit & cleanup

### Monitoring
```bash
# Check table sizes
SELECT schemaname, tablename, 
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Support

For database issues:
1. Check migrations: `npx prisma migrate status`
2. Verify connection: `npx prisma db execute --stdin`
3. View logs: `npm run dev` (check console)
4. Contact support with error message
