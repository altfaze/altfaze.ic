# 🛠️ Development Guide

Complete guide for local development setup and workflow.

## Table of Contents
- [Development Setup](#development-setup)
- [Project Commands](#project-commands)
- [Development Workflow](#development-workflow)
- [Common Tasks](#common-tasks)
- [Debugging](#debugging)
- [Performance Tips](#performance-tips)

---

## Development Setup

### Initial Installation

#### 1. Clone Repository
```bash
git clone https://github.com/altfaze/altfaze.git
cd altfaze
```

#### 2. Install Dependencies
```bash
# Using npm (included with Node.js)
npm install

# OR using pnpm (faster, recommended)
pnpm install

# OR using yarn
yarn install
```

#### 3. Setup Environment Variables
```bash
# Copy example file
cp .env.example .env.local

# Edit with your configuration
nano .env.local
# or
code .env.local
```

#### 4. Setup Database

**Option A: Local PostgreSQL with Docker**
```bash
# Create and start database
docker run --name altfaze-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=altfaze_db \
  -p 5432:5432 \
  -d postgres:15

# Update DATABASE_URL in .env.local:
# DATABASE_URL=postgresql://postgres:password@localhost:5432/altfaze_db
```

**Option B: Cloud Database**
```bash
# Use Supabase, AWS RDS, or Railway
# Copy connection string to DATABASE_URL
```

#### 5. Initialize Database
```bash
# Create tables and seed data
npx prisma db push

# Generate Prisma client
npx prisma generate

# (Optional) View data
npx prisma studio
# Opens on http://localhost:5555
```

#### 6. Start Development Server
```bash
npm run dev

# Server runs on http://localhost:3000
```

### Verify Installation

```bash
# Check Node version
node --version  # Should be v18+

# Check npm
npm --version

# Check TypeScript
npx tsc --version

# Build check
npm run build

# Type check
npm run type-check
```

---

## Project Commands

### Development
```bash
# Start dev server with hot reload
npm run dev

# Watch mode for specific file
npm run dev -- --open

# With debugging
DEBUG=* npm run dev
```

### Building
```bash
# Build for production
npm run build

# Analyze bundle size (if configured)
npm run build -- --analyze
```

### Running Production Build
```bash
# Build first
npm run build

# Start production server
npm start
```

### Code Quality
```bash
# Check TypeScript
npm run type-check

# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix

# Format code
npm run format
```

### Database
```bash
# Push schema changes
npm run db:push

# Create migration
npm run db:migrate

# Open Prisma Studio (GUI)
npm run db:studio

# Reset database (DANGER!)
npm run db:reset

# Generate Prisma client
npx prisma generate
```

### Testing
```bash
# Run tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage
```

---

## Development Workflow

### Feature Development

#### 1. Create Feature Branch
```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Naming convention: feature/*, bugfix/*, hotfix/*
```

#### 2. Make Changes
```bash
# Edit files in your editor
code .

# Watch for errors
npm run type-check
npm run lint
```

#### 3. Test Locally
```bash
# Run development server
npm run dev

# Open http://localhost:3000
# Test all user flows
```

#### 4. Commit Changes
```bash
# See what changed
git status

# Stage changes
git add .
# or stage specific files
git add src/components/Button.tsx

# Commit with message
git commit -m "feat: add button component"

# Commit message format:
# feat: new feature
# fix: bug fix
# docs: documentation
# style: formatting
# refactor: code restructuring
# test: adding tests
# chore: maintenance
```

#### 5. Push & Create PR
```bash
# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
# - Go to https://github.com/altfaze/altfaze
# - Click "New Pull Request"
# - Select your branch
# - Add title and description
```

#### 6. Code Review & Merge
```bash
# After approval, merge to main
# Then pull locally
git checkout main
git pull origin main

# Delete local branch
git branch -d feature/your-feature-name
```

---

## Common Tasks

### Add New Page

1. Create directory: `app/(marketing)/new-page/`
2. Create `page.tsx`:
```typescript
export default function NewPage() {
  return (
    <div>
      <h1>New Page Title</h1>
      <p>Your content here</p>
    </div>
  )
}
```

3. Add to navigation: `components/main-nav.tsx`

### Add New API Endpoint

1. Create file: `app/api/resource/route.ts`
2. Add handler:
```typescript
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Your logic
    return NextResponse.json({ data: [] })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  // Your logic
  return NextResponse.json({ success: true })
}
```

### Add Database Model

1. Update `prisma/schema.prisma`:
```prisma
model NewModel {
  id    String  @id @default(cuid())
  name  String
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

2. Create migration:
```bash
npx prisma migrate dev --name add_new_model
```

3. Use in API:
```typescript
import { db } from "@/lib/db"

const items = await db.newModel.findMany()
```

### Add Component

1. Create: `components/new-component.tsx`
2. Build component:
```typescript
import { Button } from "@/components/ui/button"

export function NewComponent() {
  return (
    <div>
      <h1>Component</h1>
      <Button>Click me</Button>
    </div>
  )
}
```

3. Use in pages:
```typescript
import { NewComponent } from "@/components/new-component"

export default function Page() {
  return <NewComponent />
}
```

### Add Environment Variable

1. Add to `.env.local`:
```env
NEW_VARIABLE=value
```

2. Access in code:
```typescript
const value = process.env.NEW_VARIABLE

// For public variables (client-side):
// NEW_PUBLIC_VARIABLE=value
const publicValue = process.env.NEXT_PUBLIC_NEW_VARIABLE
```

---

## Debugging

### Enable Debug Logs

```bash
# Enable all debug logs
DEBUG=* npm run dev

# Enable specific module logs
DEBUG=app npm run dev
DEBUG=prisma* npm run dev
DEBUG=next* npm run dev
```

### Browser DevTools

```bash
# Open DevTools in browser
F12 or Cmd+Option+I

# Tabs:
# - Elements: Inspect HTML
# - Console: View logs, run JS
# - Network: See API calls
# - Storage: Check cookies/localStorage
# - Application: View cache
```

### Debug Next.js

```javascript
// Add to your code
console.log('Debug info:', data)
debugger  // Pauses execution (DevTools must be open)

// View in terminal
npm run dev
```

### Debug Prisma Queries

```typescript
// Enable query logging
// In lib/db.ts or where Prisma is instantiated:
const db = new PrismaClient({
  log: ['query', 'error', 'warn']
})
```

### Debug API Routes

```typescript
// In api/route.ts
export async function POST(request: NextRequest) {
  console.log('Request:', request)
  console.log('Body:', await request.json())
  
  // Your logic
}
```

### Test API Endpoints

```bash
# Using curl
curl -X GET http://localhost:3000/api/freelancers

# Using curl with auth
curl -X GET http://localhost:3000/api/projects \
  -H "Authorization: Bearer your_token"

# Using Postman
# Import collection or create requests manually
```

### View Database

```bash
# Open Prisma Studio
npm run db:studio

# View tables and data at http://localhost:5555
```

---

## Performance Tips

### Development Experience

1. **Fast Refreshes**
   - Use `npm run dev` for hot reload
   - Most changes reflect instantly
   - Full page refresh for major changes

2. **TypeScript**
   - Enable editor integration
   - Check types: `npm run type-check`
   - Don't ignore type errors

3. **Code Organization**
   - Keep components < 500 lines
   - Extract custom hooks
   - Separate concerns

### Build Optimization

```bash
# Analyze bundle
npm run build
# Check .next/static/chunks

# Optimize imports
npm run lint -- --fix

# Remove unused dependencies
npm prune
```

### Database Performance

```typescript
// GOOD: Only select needed fields
const user = await db.user.findUnique({
  where: { id: userId },
  select: { id: true, email: true }
})

// BAD: Fetches all fields
const user = await db.user.findUnique({
  where: { id: userId }
})

// GOOD: Use include for relations
const project = await db.project.findUnique({
  where: { id: projectId },
  include: { proposals: true }
})

// BAD: N+1 query problem
const projects = await db.project.findMany()
for (const project of projects) {
  const proposals = await db.proposal.findMany({
    where: { projectId: project.id }
  })
}
```

### Component Performance

```typescript
// Use React.memo for expensive components
import { memo } from 'react'

export const ExpensiveComponent = memo(function Component(props) {
  return <div>{props.data}</div>
})

// Use useCallback for stable references
import { useCallback } from 'react'

export function Parent() {
  const handleClick = useCallback(() => {
    // Handle click
  }, [])
  
  return <Child onClick={handleClick} />
}

// Lazy load components
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('../components/heavy'))
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### Node Version Issues
```bash
# Check current version
node --version

# Install correct version
# Using nvm (Node Version Manager)
nvm install 18
nvm use 18

# Or upgrade Node directly
# Download from https://nodejs.org/
```

### Prisma Issues
```bash
# Regenerate Prisma client
rm -rf node_modules/.prisma
npx prisma generate

# Re-install dependencies
rm -rf node_modules
npm install
npx prisma generate
```

### Database Connection Error
```bash
# Verify DATABASE_URL
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check if database is running
docker ps  # For Docker

# Restart database
docker restart altfaze-db
```

### TypeScript Errors
```bash
# Check all types
npm run type-check

# Rebuild TypeScript
rm -rf .next
npm run build

# Check tsconfig.json
cat tsconfig.json
```

### Module Not Found
```bash
# Check file exists
ls src/components/MyComponent.tsx

# Verify import path
# Change:
// import { MyComponent } from '../components'
// To:
import { MyComponent } from '@/components'

# Update paths alias in tsconfig.json
```

---

## Best Practices

1. **Commit Often**
   ```bash
   git commit -m "Descriptive message"
   ```

2. **Test Locally**
   ```bash
   npm run type-check
   npm run lint
   npm run build
   ```

3. **Keep Dependencies Updated**
   ```bash
   npm outdated  # Check for updates
   npm update    # Update all
   ```

4. **Use Environment Variables**
   ```
   NEVER hardcode secrets
   ALWAYS use .env.local
   NEVER commit .env.local
   ```

5. **Write Comments**
   ```typescript
   // Complex logic needs explanation
   /* Multi-line comments for
      longer explanations */
   ```

6. **Use TypeScript**
   ```typescript
   // Specify types
   function greet(name: string): void {
     console.log(`Hello, ${name}`)
   }
   ```

---

## Support

For development issues:
1. Check this guide
2. Check browser console for errors
3. Check terminal output for logs
4. Check Prisma Studio for data
5. Ask in discussions or email dev@altfaze.in

Happy coding! 🚀
