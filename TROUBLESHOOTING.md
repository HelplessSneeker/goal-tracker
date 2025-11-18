# Troubleshooting Guide

Common issues and solutions for Goal Tracker.

**Last Updated:** 2025-11-04

---

## Development Server

### Port in Use
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
pnpm dev -- -p 3001
```

### Hot Reload Not Working
```bash
# Clear cache
rm -rf .next
pnpm dev

# Linux: Increase file watchers
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Module Not Found
```bash
# Clear and reinstall
rm -rf .next node_modules
pnpm install

# Check tsconfig.json has:
# "paths": { "@/*": ["./*"] }

# Restart TypeScript server in IDE
```

---

## Database

### Connection Refused

**Check PostgreSQL running:**
```bash
# Docker
docker ps
docker-compose up -d

# System PostgreSQL
sudo systemctl status postgresql
sudo systemctl start postgresql
```

**Verify DATABASE_URL in .env:**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/goal-tracker-db"
```

**Test connection:**
```bash
pnpm prisma studio
```

### Schema Out of Sync
```bash
# Push changes
pnpm prisma db push

# Regenerate client
pnpm prisma generate
```

### Reset Database (⚠️ Deletes Data)
```bash
pnpm prisma migrate reset
pnpm prisma db seed
```

### UUID Format Errors
- Let Prisma auto-generate IDs (use `@default(uuid())` in schema)
- Don't manually create UUIDs
- Valid format: `550e8400-e29b-41d4-a716-446655440000`

---

## Authentication

### Magic Link Not Working

**Check Mailpit running (dev):**
```bash
mailpit
# Access at http://localhost:8025
```

**Verify environment:**
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..." # openssl rand -base64 32
EMAIL_SERVER_HOST="localhost"
EMAIL_SERVER_PORT="1025"
EMAIL_FROM="noreply@goal-tracker.local"
```

### Session Not Persisting

**Check lib/auth.ts:**
```typescript
session: {
  strategy: 'jwt', // Must be 'jwt'
}
```

**Verify middleware.ts:**
```typescript
export { default } from 'next-auth/middleware'
export const config = {
  matcher: ['/goals/:path*', '/progress/:path*']
}
```

**Clear browser cookies and retry**

### Unauthorized Errors

**Debug session in action:**
```typescript
const session = await getServerSession(authOptions)
console.log('Session:', session)
```

**Verify import:**
```typescript
import { authOptions } from '@/lib/auth'
// NOT from 'next-auth'
```

---

## Build & Deployment

### Type Errors
```bash
# Check types
pnpm tsc --noEmit

# Verify strict mode in tsconfig.json
```

### Module Not Found (Build)
```bash
# Clear cache
rm -rf .next
pnpm build

# Avoid dynamic imports
# ❌ const C = require('./component')
# ✅ import { C } from './component'
```

### Out of Memory
```bash
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

---

## Testing

### Tests Failing Randomly

**Reset between tests:**
```typescript
beforeEach(() => {
  jest.clearAllMocks()
  mockData.length = 0
  mockData.push(...defaultData)
})
```

**Run serially:**
```bash
pnpm test --runInBand
```

### Mock Not Working

**Mock at top level:**
```typescript
jest.mock('@/app/actions/goals')
// NOT inside describe/it

;(createGoal as jest.Mock).mockResolvedValueOnce({ success: true })
```

### Async Timeouts

**Use waitFor:**
```typescript
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

**Don't forget awaits:**
```typescript
// ❌ user.click(button)
// ✅ await user.click(button)
```

### Environment Variables in Tests
```typescript
// In jest.setup.ts or test file
process.env.NEXTAUTH_URL = 'http://localhost:3000'
process.env.NEXTAUTH_SECRET = 'test-secret'
```

### ActionResponse Mock Format
```typescript
import { ActionErrorCode } from '@/lib/action-types'

// ✅ Success: { success: true, data: {...} }
mockAction.mockResolvedValue({
  success: true,
  data: { id: "123", title: "Test" }
})

// ✅ Error: { error: string, code: ActionErrorCode }
mockAction.mockResolvedValue({
  error: "Failed",
  code: ActionErrorCode.DATABASE_ERROR
})
```

### Prisma Mock Typing
```typescript
const mockPrisma = prisma as jest.Mocked<typeof prisma>

// ✅ Explicit type assertions required
const mockFindMany = mockPrisma.goal.findMany as unknown as jest.Mock
mockFindMany.mockResolvedValue([])
```

### TextEncoder Not Defined
```typescript
// Add before importing components that use server actions
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}))
```

**Why:** Components import server actions → actions import `next/cache` → Node.js test environment lacks TextEncoder

---

## TypeScript

### Type 'null' Not Assignable

**Use optional chaining:**
```typescript
const title = goal?.title ?? 'Untitled'
```

**Type guards:**
```typescript
if (!goal) return { error: 'Not found' }
// TypeScript knows goal is not null here
```

### Property Does Not Exist

**Extend NextAuth types:**
```typescript
// next-auth.d.ts
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
    }
  }
}
```

### Cannot Find Module
1. Check file exists
2. Check tsconfig.json paths
3. Restart TypeScript server
4. Check for circular imports

---

## Prisma

### Client Not Generated
```bash
pnpm prisma generate
```

### Type Mismatch
```bash
# After schema changes
pnpm prisma generate

# Restart TypeScript server
```

### Database Locked (SQLite)
- This project uses PostgreSQL, not SQLite
- If you see this, check DATABASE_URL

---

## Next.js

### "use client" Issues

**Only use when needed:**
- Hooks (useState, useEffect)
- Event handlers (onClick)
- Browser APIs (localStorage)

**Split components if needed:**
```typescript
// Server.tsx (no "use client")
export default async function Server() {
  const data = await fetchData()
  return <Client data={data} />
}

// Client.tsx
'use client'
export function Client({ data }) {
  const [state] = useState()
  return <div>{/* ... */}</div>
}
```

### Server Actions Not Working

**Add "use server":**
```typescript
'use server'

export async function createGoal() { }
```

**Return serializable data:**
```typescript
return { success: true, data: goal } // ✅
return new Date() // ❌ Not serializable
```

### Hydration Errors

**Consistent formatting:**
```typescript
// Use formatDate from utils
import { formatDate } from '@/lib/utils'
formatDate(date) // Always same format
```

**Browser APIs in useEffect:**
```typescript
// ❌ const value = localStorage.getItem('key')

// ✅
const [value, setValue] = useState()
useEffect(() => {
  setValue(localStorage.getItem('key'))
}, [])
```

**Date objects in client components:**
```typescript
// ❌ const [date, setDate] = useState(new Date())

// ✅ Initialize as null, set in useEffect
const [date, setDate] = useState<Date | null>(null)
useEffect(() => {
  setDate(new Date())
}, [])
```

**Why:** `new Date()` returns different values on server vs client → hydration mismatch

### Cache Not Updating

**Revalidate after mutations:**
```typescript
import { revalidatePath } from 'next/cache'

export async function createGoal(formData: FormData) {
  // ... create goal
  revalidatePath('/goals')
  return { success: true, data: goal }
}
```

**Force refresh:**
```typescript
const router = useRouter()
router.refresh()
```

---

## Environment Variables

### Not Loading

1. Check `.env` exists in project root
2. Restart dev server after changes
3. Client vars need `NEXT_PUBLIC_` prefix
4. Precedence: `.env.local` > `.env.development` > `.env`

### Not in Build

**Set in deployment platform:**
- Vercel: Project Settings → Environment Variables
- Docker: Pass via `docker-compose.yml` or `--env-file`

**Don't commit:**
```bash
# .gitignore
.env*.local
.env
```

---

## Quick Fixes

### Clean Slate
```bash
rm -rf .next node_modules
pnpm install
pnpm prisma generate
pnpm dev
```

### Database Reset (⚠️ Deletes All Data)
```bash
pnpm prisma migrate reset
pnpm prisma db seed
```

### Diagnostic Commands
```bash
pnpm prisma studio    # Database GUI
pnpm test             # Run tests
pnpm lint             # Code quality
pnpm tsc --noEmit     # Type check
```

---

## Common Error Messages

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| `EADDRINUSE` | Port in use | Kill process or use `-p 3001` |
| `Can't reach database` | PostgreSQL not running | `docker-compose up -d` |
| `Prisma schema not in sync` | Schema changed | `pnpm prisma db push` |
| `Unauthorized` | Session/auth issue | Check `getServerSession(authOptions)` |
| `Module not found` | Path/cache issue | Clear `.next`, restart server |
| `Hydration failed` | Client/server mismatch | Check Date formatting, browser APIs |
| `Type 'null' not assignable` | Missing null check | Use `?.` or type guard |
| `@prisma/client not initialized` | Client not generated | `pnpm prisma generate` |
| `TextEncoder is not defined` | next/cache in tests | Add `jest.mock("next/cache")` |
| `Cannot read 'getTime' of undefined` | SSR date initialization | Use nullable state + useEffect |
| `Foreign key constraint` | User doesn't exist | Check user exists before creating related records |

---

## Getting Help

1. **Check logs:**
   - Browser console (F12)
   - Terminal output
   - Prisma Studio

2. **Search docs:**
   - [Next.js](https://nextjs.org/docs)
   - [Prisma](https://prisma.io/docs)
   - [NextAuth](https://next-auth.js.org)

3. **Debug checklist:**
   - [ ] Clear cache (`.next`, browser)
   - [ ] Restart dev server
   - [ ] Check `.env` variables
   - [ ] Verify database connection
   - [ ] Run `pnpm prisma generate`
   - [ ] Check imports use `@/` alias
   - [ ] Verify `authOptions` import path

---

**See also:**
- `BEST_PRACTICES.md` - Coding patterns
- `CLAUDE.md` - Architecture
- `/tdd` skill - Testing help
