# Route Naming Conventions - ALTFaze Marketplace

## Overview
This document establishes consistent route naming patterns across the ALTFaze platform to ensure predictability and maintainability.

---

## Core Naming Principles

### 1. **Client vs Freelancer Routes - STANDARDIZED**

All role-based routes should use the same structure:

```
/client/{feature}      - Client-specific features
/freelancer/{feature}  - Freelancer-specific features
/admin/{feature}       - Admin-specific features
```

#### ✅ CORRECT Examples:
- `/client/dashboard` 
- `/freelancer/dashboard`
- `/client/projects`
- `/freelancer/offers`

#### ❌ INCONSISTENT (DON'T USE):
- `/client/dashboard` paired with `/freelancer/my-dashboard` ❌
- `/client/requests` paired with `/freelancer/my-requests` ❌

### 2. **Current Status - Known Inconsistencies**

The following routes currently use inconsistent naming patterns (historical reasons):

| Route | Current | Should Be |
|-------|---------|-----------|
| Client dashboard | `/client/dashboard` | ✅ Correct |
| Freelancer dashboard | `/freelancer/my-dashboard` | ⚠️ Should standardize to `/freelancer/dashboard` |
| Client requests | `/client/requests` | ✅ Correct |
| Freelancer requests | `/freelancer/my-requests` | ⚠️ Should standardize to `/freelancer/requests` |

**Future Migration:** Consider gradual migration to consistent naming with proper redirects.

### 3. **API Route Naming**

#### Dynamic Routes - CRITICAL
Always use bracket notation for dynamic segments:

```
✅ CORRECT:
app/api/freelancers/[id]/route.ts    → GET /api/freelancers/123
app/api/projects/[id]/apply/route.ts → POST /api/projects/456/apply

❌ WRONG (Fixed March 2026):
app/api/freelancers/id/route.ts      → Only matches literal /api/freelancers/id
```

#### Utility Files
Utility/helper files should have clear naming:

```
✅ CORRECT:
app/api/stripe/checkout-utils.ts     (utility functions)
app/api/stripe/checkout/route.ts     (actual API endpoint)

❌ CONFUSING:
app/api/stripe/checkout.ts           (unclear if endpoint or utility)
app/api/stripe/checkout/route.ts     (mixed with above)
```

---

## Marketing vs Authenticated Routes

### Public Routes
```
/(marketing)/
  ├── page.tsx              → Home
  ├── hire/page.tsx         → Public hire information
  ├── templates/page.tsx    → Public template browse
  ├── pricing/page.tsx      → Pricing page
  └── [other-public]/*
```

### Authenticated Role Routes
```
/client/
  ├── dashboard/
  ├── projects/
  ├── freelancers/
  └── [features]/*

/freelancer/
  ├── dashboard/
  ├── profile/
  ├── offers/
  └── [features]/*

/admin/
  ├── dashboard/
  ├── users/
  ├── projects/
  └── [features]/*
```

---

## Dynamic Route Parameters

### Naming Convention for [brackets]
- `[id]` - Numeric or UUID primary identifier
- `[slug]` - URL-friendly text identifier
- `[action]` - Specific action (approve, reject, etc.)

### Pattern Examples
```
✅ /freelancers/[id]              - Get freelancer by ID
✅ /projects/[id]/apply           - Apply to project (action)
✅ /offers/[offerId]/[action]     - Approve/reject offer
✅ /blog/[slug]                   - Blog post by slug
```

---

## API Endpoint Structure

### Conventions
```
GET    /api/resource              - List all
GET    /api/resource/[id]         - Get one
POST   /api/resource              - Create
PUT    /api/resource/[id]         - Update
DELETE /api/resource/[id]         - Delete

GET    /api/resource/[id]/action  - Perform action on resource
POST   /api/resource/action       - Batch action
```

### Examples
```
GET    /api/freelancers           - List freelancers
GET    /api/freelancers/[id]      - Get freelancer profile
POST   /api/projects              - Create project
PUT    /api/offers/[offerId]      - Update offer
POST   /api/offers/[offerId]/approve  - Approve offer
```

---

## Duplicate Features (Intentional)

Some features exist in multiple locations for different user flows:

### ✅ Intentional Duplicates

| Feature | Locations | Purpose |
|---------|-----------|---------|
| Hire | `/(marketing)/hire` + `/client/hire` | Public info vs authenticated action |
| Templates | `/(marketing)/templates` + `/client/templates` + `/freelancer/templates` | Browse vs purchase/create |
| Settings | `/client/settings` + `/freelancer/settings` + `/admin/settings` | Role-specific configurations |
| AI Help | `/client/ai-help` + `/freelancer/ai-help` | Role-specific suggestions |

These are intentional and provide different user experiences.

---

## 2026 Fixes Applied

### Critical Fixes (March 2026)

1. ✅ **Dynamic Route Naming - FIXED**
   - Renamed: `app/api/freelancers/id/` → `app/api/freelancers/[id]/`
   - Impact: Enables `/api/freelancers/{id}` endpoint to work correctly
   - Date: March 17, 2026

2. ✅ **API Utility File Naming - FIXED**
   - Renamed: `app/api/stripe/checkout.ts` → `app/api/stripe/checkout-utils.ts`
   - Impact: Clarifies distinction from actual endpoint `checkout/route.ts`
   - Date: March 17, 2026

---

## Migration Path (Future Recommendations)

**Phase 1 (Current):** Documentation and awareness
- All developers follow new conventions
- New routes use standardized naming

**Phase 2 (Next Sprint):** Gradual updates
- Update `/freelancer/my-dashboard` → `/freelancer/dashboard` 
- Update `/freelancer/my-requests` → `/freelancer/requests`
- Add URL redirects for backward compatibility

**Phase 3 (Future):** Remove deprecations
- Remove old route patterns
- Update all documentation

---

## Checklist for New Routes

When adding new routes, verify:

- [ ] Dynamic segments use brackets: `[id]`, `[slug]`, `[action]`
- [ ] Role-based routes follow: `/role/feature` pattern
- [ ] API routes have clear purpose (endpoint vs utility)
- [ ] Utility files are named with suffix: `-utils`, `-helpers`, `-service`
- [ ] Naming is consistent with existing patterns
- [ ] Documentation is updated
- [ ] No literal folder names that should be dynamic

---

## Questions or Updates?

This document should be reviewed quarterly and updated as patterns evolve.
Last Updated: March 17, 2026
