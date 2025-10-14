# Testing Guide for Goal Tracker

Comprehensive guide for testing this Next.js 15 goal-tracking application using Test-Driven Development (TDD).

**Last Updated:** 2025-10-14  
**Status:** ✅ All tests passing - 94 tests in ~3.5s

---

## Table of Contents

- [Test Status Overview](#test-status-overview)
- [Implemented Tests](#implemented-tests)
- [Open Tests (Not Yet Implemented)](#open-tests-not-yet-implemented)
- [Testing Tools & Stack](#testing-tools--stack)
- [Testing Techniques](#testing-techniques)
- [Test Infrastructure & Configuration](#test-infrastructure--configuration)
- [TDD Workflow (Red-Green-Refactor)](#tdd-workflow-red-green-refactor)
- [Test Patterns & Examples](#test-patterns--examples)
- [Best Practices](#best-practices)
- [Running Tests](#running-tests)
- [Resources](#resources)

---

## Test Status Overview

### Current Results

```
Test Suites: 12 passed, 12 total
Tests:       94 passed, 94 total
Time:        ~3.5 seconds
```

### Coverage at a Glance

| Category | Tests | Coverage | Status |
|----------|-------|----------|--------|
| **API Routes** | 37 tests | 100% | ✅ Complete |
| **Components** | 51 tests | 93-100% | ✅ Complete |
| **Utilities** | 6 tests | 100% | ✅ Complete |
| **E2E Tests** | 0 tests | N/A | ⏳ Pending |

---

## Implemented Tests

### ✅ API Route Tests (37 tests - 100% coverage)

#### Goals API (18 tests)

**File:** `app/api/goals/route.test.ts` (8 tests)
- ✅ GET /api/goals - returns all goals
- ✅ GET /api/goals - returns correct structure (id, title, description)
- ✅ POST /api/goals - creates goal with valid data
- ✅ POST /api/goals - adds to mockGoals array
- ✅ POST /api/goals - handles special characters in title/description
- ✅ POST /api/goals - generates unique ID
- ✅ POST /api/goals - creates multiple goals independently
- ✅ POST /api/goals - returns correct structure

**File:** `app/api/goals/[id]/route.test.ts` (10 tests)
- ✅ GET /api/goals/[id] - returns existing goal
- ✅ GET /api/goals/[id] - returns 404 for non-existent goal
- ✅ PUT /api/goals/[id] - updates existing goal
- ✅ PUT /api/goals/[id] - persists updates across calls
- ✅ PUT /api/goals/[id] - returns 404 for non-existent goal
- ✅ PUT /api/goals/[id] - allows partial updates (title only)
- ✅ DELETE /api/goals/[id] - deletes existing goal
- ✅ DELETE /api/goals/[id] - returns 404 for non-existent goal
- ✅ DELETE /api/goals/[id] - doesn't affect other goals (isolation)
- ✅ DELETE /api/goals/[id] - handles deleting last goal

**Coverage:** 100% (Statements, Branches, Functions, Lines)

#### Regions API (19 tests)

**File:** `app/api/regions/route.test.ts` (9 tests)
- ✅ GET /api/regions - returns all regions
- ✅ GET /api/regions?goalId={id} - filters by goalId
- ✅ GET /api/regions?goalId={id} - returns empty array for non-existent goalId
- ✅ GET /api/regions - returns correct structure (id, goalId, title, description)
- ✅ POST /api/regions - creates region with valid data
- ✅ POST /api/regions - adds to mockRegions array
- ✅ POST /api/regions - handles special characters
- ✅ POST /api/regions - creates regions for different goals
- ✅ POST /api/regions - generates unique ID

**File:** `app/api/regions/[id]/route.test.ts` (10 tests)
- ✅ GET /api/regions/[id] - returns existing region
- ✅ GET /api/regions/[id] - returns 404 for non-existent region
- ✅ PUT /api/regions/[id] - updates existing region
- ✅ PUT /api/regions/[id] - persists updates across calls
- ✅ PUT /api/regions/[id] - returns 404 for non-existent region
- ✅ PUT /api/regions/[id] - allows updating goalId
- ✅ PUT /api/regions/[id] - allows partial updates
- ✅ DELETE /api/regions/[id] - deletes existing region
- ✅ DELETE /api/regions/[id] - returns 404 for non-existent region
- ✅ DELETE /api/regions/[id] - doesn't affect other regions (isolation)
- ✅ DELETE /api/regions/[id] - handles goal isolation (regions in different goals)
- ✅ DELETE /api/regions/[id] - handles deleting last region

**Coverage:** 100% (Statements, Branches, Functions, Lines)

**Key Edge Cases Tested:**
- 404 handling for non-existent IDs
- Special characters in title/description
- Empty arrays / last item deletion
- Data persistence verification
- Query parameter filtering
- Cross-entity isolation (deleting one doesn't affect others)

---

### ✅ Component Tests (51 tests - 93-100% coverage)

#### Goal Components (33 tests)

**File:** `components/goals/goal-form/goal-form.test.tsx` (14 tests)
- ✅ Renders create mode correctly
- ✅ Renders edit mode with initial data
- ✅ Displays proper title for each mode
- ✅ Shows correct button text (Create Goal vs Save Changes)
- ✅ Shows cancel button
- ✅ Submits form with valid data (create mode)
- ✅ Submits form with valid data (edit mode)
- ✅ Calls correct API endpoint for each mode
- ✅ Navigates to /goals after successful create
- ✅ Navigates back after successful edit
- ✅ Displays error when API fails
- ✅ Shows loading state during submission
- ✅ Handles cancel button correctly
- ✅ Validates required fields

**File:** `components/goals/delete-goal-dialog/delete-goal-dialog.test.tsx` (10 tests)
- ✅ Renders dialog when open
- ✅ Doesn't render when closed
- ✅ Shows goal title in warning message
- ✅ Shows cascade warning (regions and tasks)
- ✅ Requires exact goal name to enable delete button
- ✅ Delete button disabled with wrong name
- ✅ Delete button enabled with correct name
- ✅ Calls API on successful delete
- ✅ Redirects to /goals after delete
- ✅ Displays error on API failure

**File:** `components/goals/goal-detail-header/goal-detail-header.test.tsx` (4 tests)
- ✅ Renders goal title and description
- ✅ Shows edit button with correct link
- ✅ Shows delete button
- ✅ Opens delete dialog on button click

**File:** `components/goals/goal-card/goal-card.test.tsx` (5 tests)
- ✅ Renders goal title and description
- ✅ Wraps card in link to goal detail page
- ✅ Shows chevron icon for navigation affordance
- ✅ Applies hover styles
- ✅ Handles goals with empty description

#### Region Components (18 tests)

**File:** `components/regions/region-form/region-form.test.tsx` (8 tests)
- ✅ Renders create mode correctly
- ✅ Renders edit mode with initial data
- ✅ Displays proper title for each mode
- ✅ Shows correct button text
- ✅ Submits form with valid data (create mode)
- ✅ Submits form with valid data (edit mode)
- ✅ Calls correct API endpoint for each mode
- ✅ Handles navigation after submission

**File:** `components/regions/delete-region-dialog/delete-region-dialog.test.tsx` (6 tests)
- ✅ Renders dialog when open
- ✅ Shows region title in warning message
- ✅ Shows cascade warning for tasks
- ✅ Requires exact region name to enable delete button
- ✅ Calls API and navigates on successful delete
- ✅ Displays error on API failure

**File:** `components/regions/region-card/region-card.test.tsx` (5 tests)
- ✅ Renders region title and description
- ✅ Shows view button with tooltip
- ✅ Shows edit button with tooltip
- ✅ Shows delete button with tooltip
- ✅ Opens delete dialog on delete button click

**Coverage:** 93-100% for all component files

**Key Features Tested:**
- Form rendering (create/edit modes)
- Form submission with API integration
- Form validation and error display
- Loading states during submission
- Router navigation after actions
- Dialog open/close behavior
- Confirmation dialogs with name verification
- Card rendering with action buttons
- Tooltips for icon buttons

---

### ✅ Utility Tests (6 tests - 100% coverage)

**File:** `lib/utils.test.ts` (6 tests)
- ✅ Merges class names correctly
- ✅ Handles conditional classes (true/false)
- ✅ Resolves Tailwind conflicts (keeps last class)
- ✅ Handles undefined and null values
- ✅ Handles arrays of classes
- ✅ Works with complex nested conditions

**Coverage:** 100% for `cn()` utility function

---

## Open Tests (Not Yet Implemented)

These tests should be implemented when the corresponding features are built. **Follow TDD approach: write tests first!**

### ⏳ Tasks API Tests (Pending)

**Files to create:**
- `app/api/tasks/route.test.ts`
- `app/api/tasks/[id]/route.test.ts`

**Tests needed:**
- [ ] GET /api/tasks?regionId={id} - list tasks for region
- [ ] GET /api/tasks?regionId={id} - filter by regionId
- [ ] POST /api/tasks - create task with deadline
- [ ] POST /api/tasks - validates required deadline
- [ ] GET /api/tasks/[id] - returns existing task
- [ ] GET /api/tasks/[id] - returns 404 for non-existent
- [ ] PUT /api/tasks/[id] - updates task
- [ ] PUT /api/tasks/[id] - validates deadline
- [ ] DELETE /api/tasks/[id] - deletes task
- [ ] DELETE /api/tasks/[id] - cascades to weekly tasks

### ⏳ Weekly Tasks API Tests (Pending)

**Files to create:**
- `app/api/weekly-tasks/route.test.ts`
- `app/api/weekly-tasks/[id]/route.test.ts`
- `app/api/weekly-tasks/current-week/route.test.ts`

**Tests needed:**
- [ ] GET /api/weekly-tasks?taskId={id} - list weekly tasks
- [ ] GET /api/weekly-tasks?weekStartDate={date} - filter by week
- [ ] GET /api/weekly-tasks/current-week - get current week's tasks
- [ ] POST /api/weekly-tasks - create with priority 1-3
- [ ] POST /api/weekly-tasks - validates priority range
- [ ] POST /api/weekly-tasks - enforces 3 tasks per week limit
- [ ] PUT /api/weekly-tasks/[id] - update weekly task
- [ ] PUT /api/weekly-tasks/[id] - update status (pending/completed)
- [ ] DELETE /api/weekly-tasks/[id] - deletes weekly task

### ⏳ Progress Entries API Tests (Pending)

**Files to create:**
- `app/api/progress-entries/route.test.ts`
- `app/api/progress-entries/[id]/route.test.ts`

**Tests needed:**
- [ ] GET /api/progress-entries?weeklyTaskId={id} - list entries
- [ ] POST /api/progress-entries - create with completion %
- [ ] POST /api/progress-entries - validates completion % (0-100)
- [ ] POST /api/progress-entries - auto-sets date to today
- [ ] PUT /api/progress-entries/[id] - update entry
- [ ] DELETE /api/progress-entries/[id] - delete entry

### ⏳ Component Tests (Pending)

**Files to create:**
- `components/tasks/task-form/task-form.test.tsx`
- `components/tasks/task-card/task-card.test.tsx`
- `components/tasks/delete-task-dialog/delete-task-dialog.test.tsx`
- `components/weekly-tasks/weekly-task-form/weekly-task-form.test.tsx`
- `components/weekly-tasks/weekly-task-card/weekly-task-card.test.tsx`
- `components/progress/progress-entry-form/progress-entry-form.test.tsx`
- `components/progress/progress-entry-card/progress-entry-card.test.tsx`

**Tests needed:** (follow same patterns as Goals/Regions)
- [ ] Form rendering (create/edit modes)
- [ ] Form validation (deadlines, priorities, completion %)
- [ ] API integration
- [ ] Navigation after actions
- [ ] Delete dialogs with confirmation
- [ ] Weekly review workflow

### ⏳ E2E Tests (Pending)

**Files to create:**
- `tests/e2e/goals.spec.ts`
- `tests/e2e/regions.spec.ts`
- `tests/e2e/tasks.spec.ts`
- `tests/e2e/weekly-workflow.spec.ts`

**Tests needed:**
- [ ] Complete goal creation flow
- [ ] Complete region creation flow
- [ ] Complete task creation flow
- [ ] Weekly task creation and prioritization
- [ ] Daily progress entry workflow
- [ ] Weekly review and archive workflow
- [ ] Navigation between all pages

### ⏳ Integration Tests (Pending)

**Tests needed:**
- [ ] Full user flow: Goal → Region → Task → Weekly Task → Progress
- [ ] Cascade deletion verification across all levels
- [ ] Weekly review and recreation workflow
- [ ] Archive and historical data access

### ⏳ Feature-Specific Tests (Pending)

**Tests needed when implemented:**
- [ ] Filtering/search functionality for goals
- [ ] Filtering/search functionality for regions
- [ ] Date-based filtering for tasks
- [ ] Weekly task priority sorting
- [ ] Progress completion percentage calculations
- [ ] Archive access and filtering

---

## Testing Tools & Stack

### Core Testing Framework

**Jest** - Test runner and assertion library
- Version: Latest compatible with Next.js 15
- Built-in with Next.js 15 via `next/jest`
- No separate `@next/jest` package needed
- Configuration: `jest.config.ts`

**React Testing Library** - Component testing
- `@testing-library/react` - Rendering and querying
- `@testing-library/jest-dom` - Custom matchers (toBeInTheDocument, etc.)
- `@testing-library/user-event` - User interaction simulation

### Test Environments

**jsdom** - Browser-like DOM environment
- Used for: Component tests
- Default environment in `jest.config.ts`
- Provides browser APIs (document, window, etc.)

**node** - Node.js environment
- Used for: API route tests
- Specified per-file with `@jest-environment node` docblock
- Provides Web APIs (Request, Response) needed by Next.js routes

### Coverage Tools

**v8** - Coverage provider
- Configured in `jest.config.ts`
- Faster than babel for modern projects
- Provides detailed coverage reports
- Tracks: Statements, Branches, Functions, Lines

### E2E Testing (Configured but not yet used)

**Playwright** - End-to-end testing
- Installed: `@playwright/test`
- Supports: Chromium, Firefox, WebKit
- Not yet implemented (pending feature completion)

### Mocking & Test Utilities

**Global Mocks** (`jest.setup.ts`)
- Next.js router (`useRouter`, `usePathname`, etc.)
- Next.js Link component (renders as `<a>`)
- Fetch API (`global.fetch`)

**Mock Data** (`lib/mock-data.ts`)
- In-memory mock database
- Used by API routes and tests
- Reset before each test

### Type Safety

**TypeScript**
- Full type checking in tests
- Type-safe mocks and assertions
- Type inference for test data

---

## Testing Techniques

### 1. Test-Driven Development (TDD)

**Red-Green-Refactor Cycle:**
1. **🔴 RED**: Write a failing test first
2. **🟢 GREEN**: Write minimal code to make it pass
3. **♻️ REFACTOR**: Improve code while keeping tests green

**Benefits:**
- Tests written before code
- Better design through testability
- Prevents regressions
- Living documentation

**Used for:** All new features (Goals, Regions, and future Tasks/Weekly Tasks)

---

### 2. Unit Testing

**What:** Test individual functions/components in isolation

**Techniques used:**
- Pure function testing (utilities)
- Component rendering tests
- Props testing
- State management testing

**Examples:**
- `lib/utils.test.ts` - Testing `cn()` utility
- API route handlers (GET, POST, PUT, DELETE)
- Individual components in isolation

---

### 3. Integration Testing

**What:** Test how multiple units work together

**Techniques used:**
- Component + API integration (fetch calls)
- Form submission → API → navigation flow
- Dialog open → confirmation → API → redirect
- Router navigation integration

**Examples:**
- GoalForm submits → calls API → navigates to /goals
- DeleteGoalDialog confirms → calls API → redirects → refreshes
- RegionCard actions → opens dialogs → triggers API calls

---

### 4. Behavior-Driven Testing

**What:** Test user-facing behavior, not implementation details

**Principles:**
- Test what users see and do
- Avoid testing internal state
- Use semantic queries (getByRole, getByLabelText)
- Focus on outcomes, not steps

**Examples:**
```typescript
// ❌ Bad: Testing implementation
expect(component.state.isLoading).toBe(true)

// ✅ Good: Testing behavior
expect(screen.getByText(/loading/i)).toBeInTheDocument()
```

---

### 5. Arrange-Act-Assert (AAA) Pattern

**Structure every test:**
1. **Arrange**: Set up test data and mocks
2. **Act**: Perform the action being tested
3. **Assert**: Verify the expected outcome

**Example:**
```typescript
it('should create a new goal', async () => {
  // ARRANGE
  const user = userEvent.setup()
  const newGoal = { title: 'Test', description: 'Test' }
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ ...newGoal, id: '123' })
  })
  
  // ACT
  render(<GoalForm mode="create" />)
  await user.type(screen.getByLabelText(/title/i), newGoal.title)
  await user.click(screen.getByRole('button', { name: /create/i }))
  
  // ASSERT
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith('/api/goals', expect.any(Object))
    expect(mockRouterPush).toHaveBeenCalledWith('/goals')
  })
})
```

---

### 6. Mocking Strategies

#### API Mocking
```typescript
(global.fetch as jest.Mock).mockResolvedValueOnce({
  ok: true,
  json: async () => ({ id: '1', title: 'Test' })
})
```

#### Router Mocking
```typescript
import { mockRouterPush, mockRouterRefresh, mockRouterBack } from '@/jest.setup'

await waitFor(() => {
  expect(mockRouterPush).toHaveBeenCalledWith('/goals')
})
```

#### Component Mocking
```typescript
jest.mock('./child-component', () => ({
  ChildComponent: () => <div>Mocked Child</div>
}))
```

---

### 7. User Event Simulation

**Using @testing-library/user-event:**

```typescript
const user = userEvent.setup()

// Typing
await user.type(screen.getByLabelText(/title/i), 'New Goal')

// Clicking
await user.click(screen.getByRole('button', { name: /create/i }))

// Clearing
await user.clear(screen.getByLabelText(/title/i))

// Selecting
await user.selectOptions(screen.getByRole('combobox'), 'option1')
```

**Why user-event over fireEvent:**
- More realistic user interactions
- Handles focus, keyboard events, pointer events
- Async by default (matches real browser behavior)

---

### 8. Async Testing

**Using waitFor:**
```typescript
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

**Using findBy queries (built-in wait):**
```typescript
expect(await screen.findByText('Success')).toBeInTheDocument()
```

**Testing loading states:**
```typescript
expect(screen.getByText(/loading/i)).toBeInTheDocument()

await waitFor(() => {
  expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
})
```

---

### 9. Edge Case Testing

**Tested edge cases:**
- Non-existent IDs (404 responses)
- Empty arrays / last item deletion
- Special characters in input
- Partial updates (optional fields)
- Data persistence across calls
- Cross-entity isolation
- Cascade deletion warnings

**Example:**
```typescript
it('handles deleting last goal', async () => {
  mockGoals.length = 0
  mockGoals.push({ id: '1', title: 'Only Goal', description: '' })
  
  const request = new Request('http://localhost:3000/api/goals/1', {
    method: 'DELETE'
  })
  
  const response = await DELETE(request, { params: { id: '1' } })
  
  expect(response.status).toBe(200)
  expect(mockGoals).toHaveLength(0)
})
```

---

### 10. Test Independence

**Each test must:**
- Run in isolation
- Not depend on other tests
- Not share state with other tests
- Be runnable in any order

**Using beforeEach:**
```typescript
beforeEach(() => {
  jest.clearAllMocks()
  mockGoals.length = 0
  mockGoals.push(...defaultMockData)
})
```

---

### 11. Semantic Queries (Accessibility-First)

**Query priority (most to least preferred):**

1. **getByRole** - Accessible to screen readers
```typescript
screen.getByRole('button', { name: /create goal/i })
screen.getByRole('textbox', { name: /title/i })
```

2. **getByLabelText** - Form inputs with labels
```typescript
screen.getByLabelText(/title/i)
screen.getByLabelText(/description/i)
```

3. **getByText** - User-visible text
```typescript
screen.getByText('Create New Goal')
```

4. **getByPlaceholderText** - When no label exists
```typescript
screen.getByPlaceholderText('Enter goal title')
```

**Avoid:** getByTestId (last resort only)

---

### 12. Coverage-Driven Testing

**Coverage tracked:**
- Statements: Individual lines of code
- Branches: if/else, switch cases
- Functions: Function declarations
- Lines: Physical lines in file

**Running coverage:**
```bash
pnpm test:coverage
```

**Coverage goals:**
- API routes: 100% (required)
- Components: 80%+ (target)
- Utilities: 90%+ (target)

---

## Test Infrastructure & Configuration

### File Structure

```
goal-tracker/
├── app/
│   └── api/
│       ├── goals/
│       │   ├── route.test.ts              # API tests
│       │   ├── route.ts
│       │   └── [id]/
│       │       ├── route.test.ts          # API tests
│       │       └── route.ts
│       └── regions/
│           ├── route.test.ts              # API tests
│           ├── route.ts
│           └── [id]/
│               ├── route.test.ts          # API tests
│               └── route.ts
├── components/
│   ├── goals/
│   │   ├── delete-goal-dialog/
│   │   │   ├── delete-goal-dialog.tsx
│   │   │   └── delete-goal-dialog.test.tsx
│   │   ├── goal-card/
│   │   │   ├── goal-card.tsx
│   │   │   └── goal-card.test.tsx
│   │   ├── goal-detail-header/
│   │   │   ├── goal-detail-header.tsx
│   │   │   └── goal-detail-header.test.tsx
│   │   └── goal-form/
│   │       ├── goal-form.tsx
│   │       └── goal-form.test.tsx
│   └── regions/
│       ├── delete-region-dialog/
│       │   ├── delete-region-dialog.tsx
│       │   └── delete-region-dialog.test.tsx
│       ├── region-card/
│       │   ├── region-card.tsx
│       │   └── region-card.test.tsx
│       └── region-form/
│           ├── region-form.tsx
│           └── region-form.test.tsx
├── lib/
│   ├── utils.test.ts                      # Utility tests
│   ├── utils.ts
│   └── mock-data.ts
├── jest.config.ts                         # Jest configuration
├── jest.setup.ts                          # Global mocks and setup
└── package.json                           # Test scripts
```

---

### jest.config.ts

```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom', // Default for components
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!app/layout.tsx',
    '!app/**/loading.tsx',
  ],
}

export default createJestConfig(config)
```

**Key features:**
- `coverageProvider: 'v8'` - Fast coverage tracking
- `testEnvironment: 'jsdom'` - Browser-like DOM for components
- `setupFilesAfterEnv` - Loads global mocks
- `moduleNameMapper` - Resolves `@/` path alias
- `collectCoverageFrom` - Specifies coverage targets

---

### jest.setup.ts

```typescript
import "@testing-library/jest-dom";
import React from "react";

// Export mock functions for component tests to use
export const mockRouterPush = jest.fn();
export const mockRouterRefresh = jest.fn();
export const mockRouterBack = jest.fn();

// Global Next.js navigation mock
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: jest.fn(),
    refresh: mockRouterRefresh,
    back: mockRouterBack,
    forward: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/",
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock Next.js Link as anchor tag (matches production DOM structure)
jest.mock("next/link", () => {
  return function Link({ children, href }: { children: React.ReactNode; href: string }) {
    return React.createElement("a", { href }, children);
  };
});

// Clear mocks and reset fetch before each test
beforeEach(() => {
  mockRouterPush.mockClear();
  mockRouterRefresh.mockClear();
  mockRouterBack.mockClear();
  global.fetch = jest.fn();
});
```

**Key features:**
- Exports mock functions for component tests to import
- Global Next.js router and Link mocks
- Auto-clears mocks before each test
- Resets fetch mock before each test

---

### package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0"
  }
}
```

---

### Environment Separation

**Component tests** (default):
- Use `jsdom` environment
- Provides browser-like DOM APIs
- No docblock needed

**API route tests**:
- Use `node` environment
- Provides Web APIs (Request, Response)
- Requires docblock:

```typescript
/**
 * @jest-environment node
 */
import { GET, POST } from './route'
```

---

## TDD Workflow (Red-Green-Refactor)

### The TDD Cycle

```
🔴 RED → 🟢 GREEN → ♻️ REFACTOR → Repeat
```

**Step-by-step process:**

1. **🔴 RED - Write a failing test**
   - Think about what behavior you want
   - Write a test that describes that behavior
   - Run test → should fail (because code doesn't exist yet)

2. **🟢 GREEN - Make it pass**
   - Write minimal code to make the test pass
   - Don't worry about perfection yet
   - Run test → should pass

3. **♻️ REFACTOR - Improve the code**
   - Clean up implementation
   - Extract functions
   - Improve naming
   - Run test → should still pass

4. **Repeat for next feature**

---

### TDD Example: Adding Title Length Validation

#### Step 1: 🔴 RED - Write Failing Test

**File:** `components/goals/goal-form.test.tsx`

```typescript
it('should show error when title exceeds 100 characters', async () => {
  // ARRANGE
  const user = userEvent.setup()
  render(<GoalForm mode="create" />)
  
  // ACT
  const longTitle = 'a'.repeat(101)
  await user.type(screen.getByLabelText(/title/i), longTitle)
  await user.click(screen.getByRole('button', { name: /create goal/i }))
  
  // ASSERT
  expect(screen.getByText(/title must be 100 characters or less/i)).toBeInTheDocument()
})
```

**Run test:**
```bash
pnpm test goal-form.test.tsx
```

**Result:** ❌ FAIL - Error message doesn't appear

---

#### Step 2: 🟢 GREEN - Make It Pass

**File:** `components/goals/goal-form.tsx`

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError(null)

  // Add validation
  if (title.length > 100) {
    setError('Title must be 100 characters or less')
    return
  }

  // ... rest of submit logic
}
```

**Run test:**
```bash
pnpm test goal-form.test.tsx
```

**Result:** ✅ PASS - Test now passes!

---

#### Step 3: ♻️ REFACTOR - Improve Code

**File:** `components/goals/goal-form.tsx`

```typescript
// Extract constant
const MAX_TITLE_LENGTH = 100

// Extract validation function
const validateTitle = (value: string): string | null => {
  if (!value.trim()) {
    return 'Title is required'
  }
  if (value.length > MAX_TITLE_LENGTH) {
    return `Title must be ${MAX_TITLE_LENGTH} characters or less`
  }
  return null
}

// Use in handler
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  const titleError = validateTitle(title)
  if (titleError) {
    setError(titleError)
    return
  }
  
  // ... rest of submit logic
}
```

**Run test:**
```bash
pnpm test goal-form.test.tsx
```

**Result:** ✅ PASS - Still passes after refactoring!

---

### TDD Benefits

✅ **Better design**
- Code is testable by design
- Functions are smaller and focused
- Dependencies are explicit

✅ **Confidence**
- Tests verify behavior
- Refactoring is safe
- Regressions are caught

✅ **Documentation**
- Tests describe expected behavior
- Examples of usage
- Living documentation that stays updated

✅ **Faster development**
- Less debugging
- Catch issues early
- Quick feedback loop

---

## Test Patterns & Examples

### Pattern 1: API Route Tests

**Key characteristics:**
- Use `@jest-environment node` docblock
- Import route handlers directly
- Create Request objects for testing
- Test all HTTP methods (GET, POST, PUT, DELETE)
- Test edge cases (404, validation)

**Example:**

```typescript
/**
 * @jest-environment node
 */
import { GET, POST } from './route'
import { mockGoals } from '@/lib/mock-data'

describe('Goals API - /api/goals', () => {
  beforeEach(() => {
    // Reset mock data before each test
    mockGoals.length = 0
    mockGoals.push(
      { id: '1', title: 'Test Goal 1', description: 'Description 1' },
      { id: '2', title: 'Test Goal 2', description: 'Description 2' }
    )
  })

  describe('GET /api/goals', () => {
    it('should return all goals', async () => {
      // ACT
      const response = await GET()
      const data = await response.json()
      
      // ASSERT
      expect(response.status).toBe(200)
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBe(2)
      expect(data[0]).toMatchObject({
        id: '1',
        title: 'Test Goal 1',
        description: 'Description 1'
      })
    })
  })

  describe('POST /api/goals', () => {
    it('should create a new goal', async () => {
      // ARRANGE
      const newGoal = { title: 'New Goal', description: 'New Description' }
      
      const request = new Request('http://localhost:3000/api/goals', {
        method: 'POST',
        body: JSON.stringify(newGoal),
        headers: { 'Content-Type': 'application/json' },
      })
      
      // ACT
      const response = await POST(request)
      const data = await response.json()
      
      // ASSERT
      expect(response.status).toBe(200)
      expect(data).toMatchObject(newGoal)
      expect(data.id).toBeDefined()
      expect(mockGoals).toHaveLength(3) // Verify it was added
    })
    
    it('should handle special characters', async () => {
      // ARRANGE
      const newGoal = { 
        title: 'Goal with "quotes" & ampersands', 
        description: 'Description with <html> tags'
      }
      
      const request = new Request('http://localhost:3000/api/goals', {
        method: 'POST',
        body: JSON.stringify(newGoal),
        headers: { 'Content-Type': 'application/json' },
      })
      
      // ACT
      const response = await POST(request)
      const data = await response.json()
      
      // ASSERT
      expect(data.title).toBe(newGoal.title)
      expect(data.description).toBe(newGoal.description)
    })
  })
})
```

---

### Pattern 2: Component Tests (Forms)

**Key characteristics:**
- Test create and edit modes
- Test form validation
- Mock API calls with `global.fetch`
- Test navigation with router mocks
- Test loading and error states

**Example:**

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GoalForm } from './goal-form'
import { mockRouterPush, mockRouterRefresh, mockRouterBack } from '@/jest.setup'

describe('GoalForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Create mode', () => {
    it('renders create form correctly', () => {
      // ACT
      render(<GoalForm mode="create" />)
      
      // ASSERT
      expect(screen.getByText('Create New Goal')).toBeInTheDocument()
      expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create goal/i })).toBeInTheDocument()
    })

    it('submits form with valid data', async () => {
      // ARRANGE
      const user = userEvent.setup()
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '123', title: 'New Goal', description: 'Test Description' }),
      })
      
      render(<GoalForm mode="create" />)
      
      // ACT
      await user.type(screen.getByLabelText(/title/i), 'New Goal')
      await user.type(screen.getByLabelText(/description/i), 'Test Description')
      await user.click(screen.getByRole('button', { name: /create goal/i }))
      
      // ASSERT
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/goals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'New Goal', description: 'Test Description' })
        })
        expect(mockRouterPush).toHaveBeenCalledWith('/goals')
      })
    })

    it('displays error on API failure', async () => {
      // ARRANGE
      const user = userEvent.setup()
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500
      })
      
      render(<GoalForm mode="create" />)
      
      // ACT
      await user.type(screen.getByLabelText(/title/i), 'New Goal')
      await user.click(screen.getByRole('button', { name: /create goal/i }))
      
      // ASSERT
      await waitFor(() => {
        expect(screen.getByText(/failed to create goal/i)).toBeInTheDocument()
      })
    })

    it('shows loading state during submission', async () => {
      // ARRANGE
      const user = userEvent.setup()
      
      (global.fetch as jest.Mock).mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100))
      )
      
      render(<GoalForm mode="create" />)
      
      // ACT
      await user.type(screen.getByLabelText(/title/i), 'New Goal')
      await user.click(screen.getByRole('button', { name: /create goal/i }))
      
      // ASSERT
      expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled()
    })
  })

  describe('Edit mode', () => {
    const initialData = {
      id: '123',
      title: 'Existing Goal',
      description: 'Existing Description'
    }

    it('renders edit form with initial data', () => {
      // ACT
      render(<GoalForm mode="edit" initialData={initialData} />)
      
      // ASSERT
      expect(screen.getByText('Edit Goal')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Existing Goal')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Existing Description')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument()
    })

    it('submits edit form correctly', async () => {
      // ARRANGE
      const user = userEvent.setup()
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...initialData, title: 'Updated Goal' }),
      })
      
      render(<GoalForm mode="edit" initialData={initialData} />)
      
      // ACT
      await user.clear(screen.getByLabelText(/title/i))
      await user.type(screen.getByLabelText(/title/i), 'Updated Goal')
      await user.click(screen.getByRole('button', { name: /save changes/i }))
      
      // ASSERT
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/goals/123', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Updated Goal', description: 'Existing Description' })
        })
        expect(mockRouterBack).toHaveBeenCalled()
        expect(mockRouterRefresh).toHaveBeenCalled()
      })
    })
  })
})
```

---

### Pattern 3: Component Tests (Dialogs)

**Key characteristics:**
- Test open/close behavior
- Test confirmation requirements
- Test name verification
- Mock API calls
- Test navigation after action

**Example:**

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteGoalDialog } from './delete-goal-dialog'
import { mockRouterPush, mockRouterRefresh } from '@/jest.setup'

describe('DeleteGoalDialog', () => {
  const mockOnOpenChange = jest.fn()
  
  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    goalId: '123',
    goalTitle: 'Test Goal'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders when open', () => {
    // ACT
    render(<DeleteGoalDialog {...defaultProps} />)
    
    // ASSERT
    expect(screen.getByText(/delete goal/i)).toBeInTheDocument()
    expect(screen.getByText(/test goal/i)).toBeInTheDocument()
    expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    // ACT
    render(<DeleteGoalDialog {...defaultProps} open={false} />)
    
    // ASSERT
    expect(screen.queryByText(/delete goal/i)).not.toBeInTheDocument()
  })

  it('shows cascade warning about regions and tasks', () => {
    // ACT
    render(<DeleteGoalDialog {...defaultProps} />)
    
    // ASSERT
    expect(screen.getByText(/all associated regions and tasks will also be deleted/i)).toBeInTheDocument()
  })

  it('requires exact goal name to enable delete button', async () => {
    // ARRANGE
    const user = userEvent.setup()
    render(<DeleteGoalDialog {...defaultProps} />)
    
    const deleteButton = screen.getByRole('button', { name: /delete goal/i })
    const input = screen.getByPlaceholderText('Test Goal')
    
    // ASSERT - Initially disabled
    expect(deleteButton).toBeDisabled()
    
    // ACT - Type wrong name
    await user.type(input, 'Wrong Name')
    
    // ASSERT - Still disabled
    expect(deleteButton).toBeDisabled()
    
    // ACT - Type correct name
    await user.clear(input)
    await user.type(input, 'Test Goal')
    
    // ASSERT - Now enabled
    expect(deleteButton).not.toBeDisabled()
  })

  it('calls API and redirects on successful delete', async () => {
    // ARRANGE
    const user = userEvent.setup()
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })
    
    render(<DeleteGoalDialog {...defaultProps} />)
    
    // ACT
    await user.type(screen.getByPlaceholderText('Test Goal'), 'Test Goal')
    await user.click(screen.getByRole('button', { name: /delete goal/i }))
    
    // ASSERT
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/goals/123', {
        method: 'DELETE',
      })
      expect(mockRouterPush).toHaveBeenCalledWith('/goals')
      expect(mockRouterRefresh).toHaveBeenCalled()
    })
  })

  it('displays error on API failure', async () => {
    // ARRANGE
    const user = userEvent.setup()
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500
    })
    
    render(<DeleteGoalDialog {...defaultProps} />)
    
    // ACT
    await user.type(screen.getByPlaceholderText('Test Goal'), 'Test Goal')
    await user.click(screen.getByRole('button', { name: /delete goal/i }))
    
    // ASSERT
    await waitFor(() => {
      expect(screen.getByText(/failed to delete goal/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during deletion', async () => {
    // ARRANGE
    const user = userEvent.setup()
    
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 100))
    )
    
    render(<DeleteGoalDialog {...defaultProps} />)
    
    // ACT
    await user.type(screen.getByPlaceholderText('Test Goal'), 'Test Goal')
    await user.click(screen.getByRole('button', { name: /delete goal/i }))
    
    // ASSERT
    expect(screen.getByRole('button', { name: /deleting/i })).toBeDisabled()
  })
})
```

---

### Pattern 4: Component Tests (Cards)

**Key characteristics:**
- Test rendering of data
- Test action buttons
- Test tooltips
- Test navigation links
- Test dialog triggers

**Example:**

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegionCard } from './region-card'

describe('RegionCard', () => {
  const mockRegion = {
    id: '123',
    goalId: '456',
    title: 'Test Region',
    description: 'Test Description'
  }

  it('renders region title and description', () => {
    // ACT
    render(<RegionCard region={mockRegion} />)
    
    // ASSERT
    expect(screen.getByText('Test Region')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('shows view button with correct link', () => {
    // ACT
    render(<RegionCard region={mockRegion} />)
    
    // ASSERT
    const viewButton = screen.getByRole('link', { name: /view region/i })
    expect(viewButton).toHaveAttribute('href', '/goals/456/123')
  })

  it('shows edit button with correct link', () => {
    // ACT
    render(<RegionCard region={mockRegion} />)
    
    // ASSERT
    const editButton = screen.getByRole('link', { name: /edit region/i })
    expect(editButton).toHaveAttribute('href', '/goals/456/123/edit')
  })

  it('shows delete button', () => {
    // ACT
    render(<RegionCard region={mockRegion} />)
    
    // ASSERT
    expect(screen.getByRole('button', { name: /delete region/i })).toBeInTheDocument()
  })

  it('shows tooltips on action buttons', async () => {
    // ARRANGE
    const user = userEvent.setup()
    render(<RegionCard region={mockRegion} />)
    
    // ACT - Hover over view button
    await user.hover(screen.getByRole('link', { name: /view region/i }))
    
    // ASSERT
    expect(await screen.findByText(/view region details/i)).toBeInTheDocument()
  })

  it('opens delete dialog when delete button clicked', async () => {
    // ARRANGE
    const user = userEvent.setup()
    render(<RegionCard region={mockRegion} />)
    
    // ACT
    await user.click(screen.getByRole('button', { name: /delete region/i }))
    
    // ASSERT
    expect(screen.getByText(/delete region/i)).toBeInTheDocument()
  })

  it('handles regions with empty description', () => {
    // ARRANGE
    const regionWithoutDescription = { ...mockRegion, description: '' }
    
    // ACT
    render(<RegionCard region={regionWithoutDescription} />)
    
    // ASSERT
    expect(screen.getByText('Test Region')).toBeInTheDocument()
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument()
  })
})
```

---

### Pattern 5: Utility Tests

**Key characteristics:**
- Test pure functions
- Test all branches
- Test edge cases
- Test type coercion

**Example:**

```typescript
import { cn } from './utils'

describe('cn utility', () => {
  it('merges class names correctly', () => {
    // ACT
    const result = cn('text-red', 'bg-blue')
    
    // ASSERT
    expect(result).toContain('text-red')
    expect(result).toContain('bg-blue')
  })

  it('handles conditional classes', () => {
    // ACT & ASSERT
    expect(cn('base', true && 'active')).toContain('active')
    expect(cn('base', false && 'inactive')).not.toContain('inactive')
  })

  it('resolves Tailwind conflicts (keeps last class)', () => {
    // ACT
    const result = cn('p-4', 'p-8')
    
    // ASSERT
    expect(result).toContain('p-8')
    expect(result).not.toContain('p-4')
  })

  it('handles undefined and null values', () => {
    // ACT
    const result = cn('base', undefined, null, 'active')
    
    // ASSERT
    expect(result).toContain('base')
    expect(result).toContain('active')
  })

  it('handles arrays of classes', () => {
    // ACT
    const result = cn(['text-red', 'bg-blue'], 'p-4')
    
    // ASSERT
    expect(result).toContain('text-red')
    expect(result).toContain('bg-blue')
    expect(result).toContain('p-4')
  })

  it('handles complex nested conditions', () => {
    // ARRANGE
    const isActive = true
    const isPending = false
    
    // ACT
    const result = cn(
      'base',
      isActive && 'active',
      isPending && 'pending',
      !isPending && 'not-pending'
    )
    
    // ASSERT
    expect(result).toContain('base')
    expect(result).toContain('active')
    expect(result).toContain('not-pending')
    expect(result).not.toContain('pending')
  })
})
```

---

## Best Practices

### 1. Test Behavior, Not Implementation

❌ **Bad:** Testing internal state
```typescript
expect(component.state.isLoading).toBe(true)
expect(component.props.onSubmit).toHaveBeenCalled()
```

✅ **Good:** Testing what users see/experience
```typescript
expect(screen.getByText(/loading/i)).toBeInTheDocument()
expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
```

---

### 2. Use Descriptive Test Names

❌ **Bad:**
```typescript
it('works', () => { ... })
it('validates form', () => { ... })
it('test 1', () => { ... })
```

✅ **Good:**
```typescript
it('should display error when title field is empty', () => { ... })
it('should disable submit button during API call', () => { ... })
it('should redirect to /goals after successful creation', () => { ... })
```

**Pattern:** `should [expected behavior] when [condition]`

---

### 3. Follow Arrange-Act-Assert (AAA) Pattern

```typescript
it('should create a new goal', async () => {
  // ARRANGE: Set up test data, mocks, and render
  const user = userEvent.setup()
  const newGoal = { title: 'Test Goal', description: 'Test Description' }
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ ...newGoal, id: '123' })
  })
  render(<GoalForm mode="create" />)
  
  // ACT: Perform the action being tested
  await user.type(screen.getByLabelText(/title/i), newGoal.title)
  await user.type(screen.getByLabelText(/description/i), newGoal.description)
  await user.click(screen.getByRole('button', { name: /create goal/i }))
  
  // ASSERT: Verify the expected outcome
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith('/api/goals', expect.any(Object))
    expect(mockRouterPush).toHaveBeenCalledWith('/goals')
  })
})
```

---

### 4. Keep Tests Independent

**Each test must:**
- Run in isolation
- Not depend on other tests
- Not share state
- Be runnable in any order

**Use beforeEach to reset:**
```typescript
beforeEach(() => {
  jest.clearAllMocks()
  mockGoals.length = 0
  mockGoals.push(...defaultMockData)
})
```

**Avoid:**
```typescript
// ❌ Bad: Tests depend on execution order
it('creates a goal', () => { /* creates id: 1 */ })
it('updates the goal', () => { /* assumes id: 1 exists */ })
```

**Instead:**
```typescript
// ✅ Good: Each test sets up its own data
it('creates a goal', () => {
  mockGoals.length = 0 // Start fresh
  // ... test
})

it('updates a goal', () => {
  mockGoals.push({ id: '1', title: 'Test' }) // Set up needed data
  // ... test
})
```

---

### 5. Mock External Dependencies

**Always mock:**
- API calls (use `global.fetch`)
- Router navigation (use exported mocks)
- Browser APIs (localStorage, window, etc.)
- External libraries
- Date/time (for consistent tests)

**Example:**
```typescript
// Mock API
(global.fetch as jest.Mock).mockResolvedValueOnce({
  ok: true,
  json: async () => ({ id: '1' })
})

// Mock router
import { mockRouterPush } from '@/jest.setup'
expect(mockRouterPush).toHaveBeenCalledWith('/goals')

// Mock Date
jest.useFakeTimers()
jest.setSystemTime(new Date('2025-01-01'))
```

---

### 6. Use Semantic Queries

**Query priority (best to worst):**

1. **getByRole** - Most accessible
```typescript
screen.getByRole('button', { name: /create goal/i })
screen.getByRole('textbox', { name: /title/i })
screen.getByRole('link', { name: /view region/i })
```

2. **getByLabelText** - For form inputs
```typescript
screen.getByLabelText(/title/i)
screen.getByLabelText(/description/i)
```

3. **getByText** - For visible text
```typescript
screen.getByText('Create New Goal')
screen.getByText(/loading/i)
```

4. **getByPlaceholderText** - When no label
```typescript
screen.getByPlaceholderText('Enter goal title')
```

5. **getByTestId** - Last resort only
```typescript
// Avoid unless absolutely necessary
screen.getByTestId('custom-widget')
```

---

### 7. Test Async Code Properly

**Use waitFor for assertions:**
```typescript
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

**Use findBy queries (built-in wait):**
```typescript
expect(await screen.findByText('Success')).toBeInTheDocument()
```

**Don't use arbitrary timeouts:**
```typescript
// ❌ Bad
await new Promise(resolve => setTimeout(resolve, 1000))

// ✅ Good
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument()
})
```

---

### 8. Test Edge Cases

**Always test:**
- Empty states (no data)
- Error states (API failures)
- Loading states
- Boundary values (min/max)
- Special characters
- Non-existent resources (404)
- Last item deletion
- Concurrent operations

---

### 9. One Assertion Focus Per Test

**Prefer:**
```typescript
it('should display error when title is empty', () => { ... })
it('should display error when title exceeds 100 characters', () => { ... })
it('should display error on API failure', () => { ... })
```

**Over:**
```typescript
it('should validate form', () => {
  // Tests empty title
  // Tests long title
  // Tests API failure
  // Tests network error
  // Too much in one test!
})
```

**Exception:** Related assertions can be grouped:
```typescript
it('should create goal and navigate', async () => {
  // These are related parts of same behavior
  expect(global.fetch).toHaveBeenCalled()
  expect(mockRouterPush).toHaveBeenCalledWith('/goals')
})
```

---

### 10. Clear Test Output

**Use clear error messages:**
```typescript
expect(screen.getByRole('button', { name: /create goal/i })).toBeDisabled()
// Clear: "Expected button with name /create goal/i to be disabled"

expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
// Clear: "Expected error message not to be in document"
```

**Add comments for complex tests:**
```typescript
it('should handle concurrent delete operations', async () => {
  // ARRANGE: Set up two goals
  mockGoals.push({ id: '1', title: 'Goal 1' })
  mockGoals.push({ id: '2', title: 'Goal 2' })
  
  // ACT: Delete both simultaneously
  const delete1 = DELETE(new Request('http://localhost/api/goals/1', { method: 'DELETE' }), { params: { id: '1' } })
  const delete2 = DELETE(new Request('http://localhost/api/goals/2', { method: 'DELETE' }), { params: { id: '2' } })
  
  await Promise.all([delete1, delete2])
  
  // ASSERT: Both should be deleted independently
  expect(mockGoals).toHaveLength(0)
})
```

---

## Running Tests

### Basic Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode (auto-rerun on changes)
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage
```

---

### Running Specific Tests

```bash
# Run specific file
pnpm test goal-form.test.tsx

# Run specific test suite (describe block)
pnpm test -- -t "GoalForm"

# Run specific test (it block)
pnpm test -- -t "should create a new goal"

# Run only API tests
pnpm jest -- app/api

# Run only component tests
pnpm jest -- components

# Run only utility tests
pnpm jest -- lib
```

---

### Watch Mode Options

```bash
# Watch mode (press keys for options)
pnpm test:watch

# In watch mode:
# Press a - run all tests
# Press f - run only failed tests
# Press p - filter by filename pattern
# Press t - filter by test name pattern
# Press q - quit watch mode
```

---

### Coverage Reports

```bash
# Generate coverage report
pnpm test:coverage

# Coverage report shows:
# - % Statements covered
# - % Branches covered
# - % Functions covered
# - % Lines covered

# View detailed HTML report
# Open: coverage/lcov-report/index.html
```

**Example output:**
```
--------------------|---------|----------|---------|---------|-------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------------|---------|----------|---------|---------|-------------------
All files           |     100 |      100 |     100 |     100 |                   
 app/api/goals      |     100 |      100 |     100 |     100 |                   
  route.ts          |     100 |      100 |     100 |     100 |                   
 components/goals   |   98.21 |    94.73 |     100 |   98.14 |                   
  goal-form.tsx     |   98.07 |    93.75 |     100 |   98.07 | 45                
--------------------|---------|----------|---------|---------|-------------------
```

---

### CI/CD Integration (Future)

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:coverage
      - uses: codecov/codecov-action@v3
```

---

## Resources

### Official Documentation
- [Jest Documentation](https://jestjs.io/) - Test runner and assertion library
- [React Testing Library](https://testing-library.com/react) - Component testing
- [Testing Library Queries](https://testing-library.com/docs/queries/about) - Query methods
- [user-event](https://testing-library.com/docs/user-event/intro) - User interaction simulation
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing) - Testing Next.js apps
- [Playwright](https://playwright.dev/) - E2E testing (future)

### Best Practices & Philosophy
- [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles)
- [Common Mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Test-Driven Development (Martin Fowler)](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [Write Tests. Not Too Many. Mostly Integration.](https://kentcdodds.com/blog/write-tests)

### Testing Patterns
- [AAA Pattern (Arrange-Act-Assert)](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/)
- [Test Behavior, Not Implementation](https://kentcdodds.com/blog/testing-implementation-details)
- [Mocking Best Practices](https://kentcdodds.com/blog/common-testing-mistakes)

### Project-Specific
- [CLAUDE.md](./CLAUDE.md) - Project overview and architecture
- [TODOs.md](./TODOs.md) - Implementation roadmap
- [jest.config.ts](./jest.config.ts) - Jest configuration
- [jest.setup.ts](./jest.setup.ts) - Global mocks and setup

---

**Happy Testing! 🧪✅**

Run `pnpm test` to verify all tests are passing.
