---
name: tdd
description: Test-Driven Development workflow for Next.js 15 with Jest and React Testing Library. Covers red-green-refactor cycle, test patterns for server actions, service layer, and components, mocking strategies, and best practices.
---

# Test-Driven Development (TDD)

## Purpose

Guide TDD implementation for Next.js 15 features using Jest and React Testing Library.

## When to Use

**Activate when:**
- Implementing new features
- Writing or debugging tests
- Setting up test infrastructure
- Working with server actions, services, or components

**Core Rule:** All new features use TDD (Red-Green-Refactor)

---

## TDD Workflow: Red-Green-Refactor

### The Cycle

```
🔴 RED → 🟢 GREEN → ♻️ REFACTOR → Repeat
```

### 1. 🔴 RED - Write Failing Test

**Before any code:**
1. Think about desired behavior
2. Write test describing that behavior
3. Run test - should FAIL (code doesn't exist)

```typescript
it('should create resource with valid data', async () => {
  // ARRANGE
  const mockData = { id: '1', title: 'Test' }
  ;(serviceFunction as jest.Mock).mockResolvedValue(mockData)

  // ACT
  const result = await actionFunction(formData)

  // ASSERT
  expect(result.success).toBe(true)
  expect(result.data).toEqual(mockData)
})
```

Run: `pnpm test` → ❌ FAIL

### 2. 🟢 GREEN - Make It Pass

**Write minimal code:**
- Just enough to pass the test
- Don't over-engineer
- Keep it simple

Run: `pnpm test` → ✅ PASS

### 3. ♻️ REFACTOR - Improve

**Clean up while keeping tests green:**
- Extract functions
- Improve naming
- Remove duplication

Run: `pnpm test` → ✅ STILL PASS

### 4. Repeat

Continue for each new behavior.

---

## Feature Implementation Process

### New Feature Checklist

**Phase 1: Database**
- [ ] Add Prisma models to `schema.prisma`
- [ ] Run `pnpm prisma generate && pnpm prisma db push`

**Phase 2: Service Layer (TDD)**
- [ ] 🔴 Write service tests (`lib/services/*.service.test.ts`)
- [ ] 🟢 Implement service functions
- [ ] ♻️ Refactor
- [ ] Verify: `pnpm test` passes

**Phase 3: Server Actions (TDD)**
- [ ] 🔴 Write action tests (`app/actions/*.test.ts`)
- [ ] 🟢 Implement server actions
- [ ] ♻️ Refactor
- [ ] Verify: `pnpm test` passes

**Phase 4: Components (TDD)**
- [ ] 🔴 Write component tests (`components/**/[name].test.tsx`)
- [ ] 🟢 Implement components
- [ ] ♻️ Refactor
- [ ] Verify: `pnpm test` passes

**Phase 5: Final Verification**
- [ ] Run `pnpm test` - all tests pass
- [ ] Run `pnpm test:coverage` - meet coverage goals
- [ ] Run `pnpm lint` - no errors
- [ ] Manual browser testing

---

## Test Pattern Templates

### Server Action Test

**File:** `app/actions/*.test.ts`

```typescript
import { createResource } from './resources'
import { getServerSession } from 'next-auth'
import * as resourceService from '@/lib/services/resource.service'

jest.mock('next-auth')
jest.mock('@/lib/services/resource.service')
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))

describe('Resource Actions', () => {
  const mockSession = { user: { id: 'user-123' } }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create resource with authenticated user', async () => {
    // ARRANGE
    (getServerSession as jest.Mock).mockResolvedValue(mockSession)
    const mockResource = { id: '1', title: 'Test', userId: 'user-123' }
    ;(resourceService.createResource as jest.Mock).mockResolvedValue(mockResource)

    const formData = new FormData()
    formData.append('title', 'Test')

    // ACT
    const result = await createResource(formData)

    // ASSERT
    expect(result.success).toBe(true)
    expect(resourceService.createResource).toHaveBeenCalledWith({
      title: 'Test',
      userId: 'user-123'
    })
  })

  it('should return error when not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null)
    const result = await createResource(new FormData())
    expect(result.error).toBe('Unauthorized')
  })
})
```

**Test Scenarios:**
- ✅ Authentication (with/without session)
- ✅ FormData validation
- ✅ Service layer calls
- ✅ Error handling
- ✅ Cache revalidation

### Service Layer Test

**File:** `lib/services/*.service.test.ts`

```typescript
import { createResource, getResourceById } from './resource.service'
import prisma from '@/lib/prisma'

jest.mock('@/lib/prisma')
const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('Resource Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create resource', async () => {
    // ARRANGE
    const input = { title: 'Test', userId: 'user-123' }
    const mockCreated = { id: '1', ...input, createdAt: new Date() }
    mockPrisma.resource.create.mockResolvedValue(mockCreated)

    // ACT
    const result = await createResource(input)

    // ASSERT
    expect(result).toEqual(mockCreated)
    expect(mockPrisma.resource.create).toHaveBeenCalledWith({ data: input })
  })

  it('should verify ownership before returning resource', async () => {
    mockPrisma.resource.findUnique.mockResolvedValue(null)
    const result = await getResourceById('1', 'user-123')
    expect(result).toBeNull()
  })
})
```

**Test Scenarios:**
- ✅ CRUD operations
- ✅ Ownership verification
- ✅ Null returns for unauthorized access
- ✅ Input/output types

### Component Test

**File:** `components/**/[name]/[name].test.tsx`

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResourceForm } from './resource-form'
import { mockRouterPush } from '@/jest.setup'
import * as actions from '@/app/actions/resources'

jest.mock('@/app/actions/resources')

describe('ResourceForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('submits form with valid data', async () => {
    // ARRANGE
    const user = userEvent.setup()
    ;(actions.createResource as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: { id: '1', title: 'Test' }
    })

    render(<ResourceForm mode="create" />)

    // ACT
    await user.type(screen.getByLabelText(/title/i), 'Test')
    await user.click(screen.getByRole('button', { name: /create/i }))

    // ASSERT
    await waitFor(() => {
      expect(actions.createResource).toHaveBeenCalled()
      expect(mockRouterPush).toHaveBeenCalled()
    })
  })

  it('displays error on failure', async () => {
    const user = userEvent.setup()
    ;(actions.createResource as jest.Mock).mockResolvedValueOnce({
      error: 'Failed to create'
    })

    render(<ResourceForm mode="create" />)
    await user.type(screen.getByLabelText(/title/i), 'Test')
    await user.click(screen.getByRole('button', { name: /create/i }))

    expect(await screen.findByText(/failed to create/i)).toBeInTheDocument()
  })
})
```

**Test Scenarios:**
- ✅ Form rendering (create/edit modes)
- ✅ Form submission
- ✅ Validation
- ✅ Loading states
- ✅ Error handling
- ✅ Navigation

---

## Mocking Reference

### Global Mocks (Available in All Tests)

Configured in `jest.setup.ts`:

**Router:**
```typescript
import { mockRouterPush, mockRouterRefresh, mockRouterBack } from '@/jest.setup'

expect(mockRouterPush).toHaveBeenCalledWith('/path')
```

**Prisma:**
```typescript
import prisma from '@/lib/prisma'
const mockPrisma = prisma as jest.Mocked<typeof prisma>

mockPrisma.model.findMany.mockResolvedValue([data])
```

### Per-Test Mocks

**NextAuth:**
```typescript
import { getServerSession } from 'next-auth'
jest.mock('next-auth')

(getServerSession as jest.Mock).mockResolvedValue({ user: { id: 'user-123' } })
// or null for unauthenticated
```

**Server Actions:**
```typescript
import * as actions from '@/app/actions/resources'
jest.mock('@/app/actions/resources')

;(actions.createResource as jest.Mock).mockResolvedValueOnce({ success: true })
```

**Services:**
```typescript
import * as service from '@/lib/services/resource.service'
jest.mock('@/lib/services/resource.service')

;(service.createResource as jest.Mock).mockResolvedValue(mockData)
```

**Next.js Cache:**
```typescript
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }))
```

---

## Best Practices

### AAA Pattern

**Every test:**
1. **ARRANGE** - Set up data and mocks
2. **ACT** - Perform action
3. **ASSERT** - Verify outcome

### Test Behavior, Not Implementation

❌ Bad: `expect(component.state.isLoading).toBe(true)`
✅ Good: `expect(screen.getByText(/loading/i)).toBeInTheDocument()`

### Semantic Queries (Priority Order)

1. `getByRole('button', { name: /create/i })` - Most accessible
2. `getByLabelText(/title/i)` - Form inputs
3. `getByText('Create New')` - Visible text
4. `getByTestId('widget')` - Last resort

### Test Independence

**Each test must:**
- Run in isolation
- Not depend on other tests
- Reset state in `beforeEach`

```typescript
beforeEach(() => {
  jest.clearAllMocks()
  mockData.length = 0
  mockData.push(...defaultData)
})
```

### Async Testing

**Use `waitFor` for assertions:**
```typescript
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

**Or `findBy` (built-in wait):**
```typescript
expect(await screen.findByText('Success')).toBeInTheDocument()
```

### User Events

**Always `setup()` first:**
```typescript
const user = userEvent.setup()
await user.type(screen.getByLabelText(/title/i), 'Text')
await user.click(screen.getByRole('button'))
```

### Edge Cases

Always test:
- Empty states
- Error states
- Loading states
- Boundary values
- Non-existent resources
- Unauthorized access

### Descriptive Test Names

**Pattern:** `should [behavior] when [condition]`

✅ `should display error when title field is empty`
❌ `test validation`

---

## Running Tests

```bash
# Run all tests
pnpm test

# Watch mode (development)
pnpm test:watch

# Coverage report
pnpm test:coverage

# Specific file
pnpm test path/to/file.test.ts

# Specific test name
pnpm test -- -t "should create resource"
```

### Coverage Goals

- Server Actions: 100%
- Service Layer: 100%
- Components: 90%+

---

## Quick Tips

1. **Write test first** - Always RED before GREEN
2. **Keep tests simple** - One assertion focus per test
3. **Mock external deps** - Actions, services, Prisma, NextAuth
4. **Use semantic queries** - Test accessibility
5. **Test user behavior** - Not implementation details
6. **Reset between tests** - Use `beforeEach`
7. **Async by default** - Always `await` user events
8. **Focus on edges** - Empty, error, boundary cases

---

**Skill Status**: ACTIVE ✅
**Following**: Anthropic best practices (500-line rule) ✅
