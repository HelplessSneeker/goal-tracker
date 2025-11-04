# Best Practices

Coding standards and patterns for Goal Tracker (Next.js 15 + Prisma + NextAuth).

**Last Updated:** 2025-11-04

---

## Architecture

### Data Flow Pattern

**Always follow:** `Component → Server Action → Service → Prisma`

```typescript
// ✅ Correct flow
// 1. Component
const result = await createGoal(formData)

// 2. Server Action (app/actions/goals.ts)
export async function createGoal(formData: FormData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { error: 'Unauthorized' }

  const goal = await goalsService.createGoal({
    title: formData.get('title') as string,
    userId: session.user.id
  })

  revalidatePath('/goals')
  return { success: true, data: goal }
}

// 3. Service (lib/services/goals.service.ts)
export async function createGoal(data: CreateGoalInput) {
  return await prisma.goal.create({ data })
}
```

**❌ Never skip layers:** Don't call Prisma from actions or fetch from components.

### Feature Organization

```
components/goals/     # Feature-based, not type-based
  goal-form/
  goal-card/
  index.ts           # Export all
```

---

## Code Style

### Naming

- **Files:** `kebab-case.tsx`
- **Components:** `PascalCase`
- **Variables/Functions:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`

### Imports

```typescript
// 1. External
import { useState } from 'react'
import { useTranslations } from 'next-intl'

// 2. Internal (@/ alias only)
import { Button } from '@/components/ui/button'
import { GoalCard } from '@/components/goals'

// 3. Actions/Services
import { createGoal } from '@/app/actions/goals'

// 4. Types
import type { Goal } from '@/lib/types'

// 5. Utils
import { cn } from '@/lib/utils'
```

**Import from feature index:**
```typescript
// ✅ Good
import { GoalForm, GoalCard } from '@/components/goals'

// ❌ Bad
import { GoalForm } from '@/components/goals/goal-form/goal-form'
```

---

## TypeScript

### Type Safety

```typescript
// ✅ Always explicit for public APIs
export async function createGoal(
  data: CreateGoalInput
): Promise<Goal> {
  return await prisma.goal.create({ data })
}

// ❌ No implicit any
function process(data) { } // ❌
```

### Avoid `any`

```typescript
// ✅ Use specific types
function process(data: Goal) { }

// ✅ Use unknown if truly unknown
function process(data: unknown) {
  if (typeof data === 'string') { /* ... */ }
}
```

---

## Components

### Server vs Client

**Default to Server Components:**
```typescript
// Server (no directive needed)
export default async function GoalsPage() {
  const goals = await getGoalsForUser()
  return <div>{/* ... */}</div>
}
```

**Use Client only when needed:**
```typescript
'use client' // Required for hooks/events

export function GoalForm() {
  const [state, setState] = useState()
  return <div>{/* ... */}</div>
}
```

**Use "use client" for:**
- Hooks (useState, useEffect, etc.)
- Event handlers (onClick, onChange)
- Browser APIs (localStorage, window)

### Component Structure

```typescript
'use client' // If needed

// Imports
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Goal } from '@/lib/types'

// Props type
type Props = { goal: Goal }

export function Component({ goal }: Props) {
  // 1. Hooks
  const [state, setState] = useState()

  // 2. Handlers
  const handleClick = () => { }

  // 3. Render
  return <div>{/* ... */}</div>
}
```

---

## Server Actions

### Standard Pattern

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import * as service from '@/lib/services/goals.service'
import { authOptions } from '@/lib/auth'

type Result<T> = { success: true; data: T } | { error: string }

export async function createGoal(formData: FormData): Promise<Result<Goal>> {
  // 1. Auth
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return { error: 'Unauthorized' }

  // 2. Validate
  const title = formData.get('title') as string
  if (!title?.trim()) return { error: 'Title required' }

  // 3. Service call
  try {
    const goal = await service.createGoal({
      title,
      userId: session.user.id
    })

    // 4. Revalidate
    revalidatePath('/goals')

    return { success: true, data: goal }
  } catch (error) {
    console.error('Create goal failed:', error)
    return { error: 'Failed to create goal' }
  }
}
```

**Checklist:**
- [ ] Authenticate first
- [ ] Validate inputs
- [ ] Try-catch wrapper
- [ ] Revalidate cache
- [ ] Return typed result
- [ ] Never expose internal errors

---

## Service Layer

### Service Pattern

```typescript
import prisma from '@/lib/prisma'

// Always verify ownership
export async function updateGoal(
  id: string,
  userId: string,
  data: Partial<Goal>
): Promise<Goal | null> {
  const existing = await prisma.goal.findUnique({ where: { id } })

  // Return null for unauthorized (don't throw)
  if (!existing || existing.userId !== userId) return null

  return await prisma.goal.update({ where: { id }, data })
}
```

**Rules:**
- Verify ownership before mutations
- Return `null` for unauthorized (don't throw)
- Keep business logic here, not in actions
- Use JSDoc for complex functions

---

## Database

### Prisma Patterns

```typescript
// ✅ Type-safe queries
await prisma.goal.findMany({ where: { userId } })

// ❌ Never raw SQL
await prisma.$queryRaw`SELECT * FROM goals`

// ✅ Ownership verification
const goal = await prisma.goal.findUnique({ where: { id } })
if (!goal || goal.userId !== userId) return null

// ✅ Transactions for related ops
await prisma.$transaction([
  prisma.goal.delete({ where: { id } }),
  prisma.region.deleteMany({ where: { goalId: id } })
])
```

---

## Authentication

### Server Side

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const session = await getServerSession(authOptions)
if (!session?.user?.id) { /* unauthorized */ }
```

### Client Side

```typescript
import { useSession } from 'next-auth/react'

const { data: session, status } = useSession()
if (status === 'loading') { /* loading */ }
if (!session) { /* unauthorized */ }
```

### Route Protection

```typescript
// middleware.ts
export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/goals/:path*', '/progress/:path*']
}
```

---

## Error Handling

### Client Components

```typescript
try {
  const result = await createGoal(formData)
  if ('error' in result) {
    setError(result.error)
    return
  }
  router.push('/goals')
} catch (error) {
  setError('An unexpected error occurred')
  console.error(error)
}
```

### Server Actions

```typescript
try {
  const goal = await service.createGoal(data)
  return { success: true, data: goal }
} catch (error) {
  console.error('Create failed:', error)
  // ✅ Generic message (don't expose internals)
  return { error: 'Failed to create goal' }
}
```

---

## Internationalization

```typescript
// Client
import { useTranslations } from 'next-intl'
const t = useTranslations('goals')
<h1>{t('title')}</h1>

// Server
import { getTranslations } from 'next-intl/server'
const t = await getTranslations('goals')
<h1>{t('title')}</h1>

// Dates (European format)
import { formatDate } from '@/lib/utils'
formatDate(task.deadline) // "01.12.2025"
```

**Always update both:** `messages/en.json` and `messages/de.json`

---

## Security

### Input Validation

```typescript
const title = formData.get('title') as string
if (!title?.trim()) return { error: 'Required' }
if (title.length > 200) return { error: 'Too long' }
```

### SQL Injection

```typescript
// ✅ Prisma escapes automatically
await prisma.goal.findMany({ where: { userId } })

// ❌ Never use raw SQL with user input
await prisma.$queryRaw`SELECT * WHERE id = ${userId}` // ❌
```

### XSS Prevention

```typescript
// ✅ React escapes by default
<div>{user.name}</div>

// ⚠️ Only for trusted content
<div dangerouslySetInnerHTML={{ __html: trustedHTML }} />
```

### Ownership Verification

```typescript
// Never trust client IDs without verification
export async function deleteGoal(id: string, userId: string) {
  const goal = await prisma.goal.findUnique({ where: { id } })
  if (!goal || goal.userId !== userId) return null
  return await prisma.goal.delete({ where: { id } })
}
```

---

## Testing

### TDD Required

**Process:**
1. 🔴 RED: Write failing test
2. 🟢 GREEN: Make it pass
3. ♻️ REFACTOR: Improve code

**Coverage goals:**
- Server Actions: 100%
- Service Layer: 100%
- Components: 90%+

**Use `/tdd` skill for detailed patterns.**

---

## Quick Checklist

### New Feature
- [ ] Follow architecture (Component → Action → Service → Prisma)
- [ ] Write tests first (TDD)
- [ ] Add TypeScript types
- [ ] Validate inputs
- [ ] Authenticate
- [ ] Verify ownership
- [ ] Handle errors
- [ ] Revalidate cache
- [ ] Add i18n (en + de)
- [ ] `pnpm test` passes
- [ ] `pnpm lint` passes

### Common Operations

**Create:**
1. Authenticate
2. Validate
3. service.create()
4. revalidatePath()
5. Return result

**Update:**
1. Authenticate
2. Validate
3. service.update() (includes ownership check)
4. revalidatePath()
5. Return result

**Delete:**
1. Authenticate
2. service.delete() (includes ownership check)
3. revalidatePath()
4. Return result

---

**See also:**
- `CLAUDE.md` - Architecture overview
- `TROUBLESHOOTING.md` - Common issues
- `/tdd` skill - Testing patterns
