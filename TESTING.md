# Testing Guide for Goal Tracker

Comprehensive guide for testing this Next.js 15 goal-tracking application using Test-Driven Development (TDD).

**Last Updated:** 2025-10-27
**Status:** ✅ 228 of 228 tests passing (~7.4s runtime)

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
Test Suites: 22 passed, 22 total
Tests:       228 passed, 228 total
Time:        ~7.4 seconds
```

### Coverage at a Glance

| Category | Tests | Coverage | Status |
|----------|-------|----------|--------|
| **Server Actions** | 91 tests | 100% | ✅ Complete |
| **Service Layer** | 53 tests | 100% | ✅ Complete |
| **Components** | 72 tests | 93-100% | ✅ Complete |
| **Authentication** | 12 tests | 100% | ✅ Complete |
| **E2E Tests** | 0 tests | N/A | ⏳ Pending |

---

## Implemented Tests

### ✅ Server Action Tests (91 tests - 100% coverage)

**Architecture:** Server Actions receive FormData from client components, validate inputs, check authentication, call service layer, and return typed responses.

#### Goals Actions (30 tests)

**File:** `app/actions/goals.test.ts`

**Test Coverage:**
- ✅ createGoal - Creates goal with authenticated user
- ✅ createGoal - Returns error without authentication
- ✅ createGoal - Validates required fields (title)
- ✅ createGoal - Calls service layer with correct parameters
- ✅ createGoal - Revalidates cache paths on success
- ✅ updateGoal - Updates existing goal
- ✅ updateGoal - Returns error for non-existent goal
- ✅ updateGoal - Validates ownership before update
- ✅ deleteGoal - Deletes existing goal
- ✅ deleteGoal - Returns error for non-existent goal
- ✅ getGoalsForUser - Returns user's goals
- ✅ getGoalsForUser - Returns empty array if no goals
- ✅ Error handling for database failures
- ✅ FormData parsing and validation

**Key Features Tested:**
- NextAuth session authentication checks
- FormData extraction and validation
- Service layer integration
- Error responses for unauthenticated requests
- Cache revalidation after mutations
- User ownership verification

**Coverage:** 100% (Statements, Branches, Functions, Lines)

#### Tasks Actions (31 tests)

**File:** `app/actions/tasks.test.ts`

**Test Coverage:**
- ✅ createTask - Creates task with deadline and region
- ✅ createTask - Validates required fields (title, deadline, regionId)
- ✅ createTask - Sets default status to 'active'
- ✅ createTask - Converts deadline string to Date
- ✅ updateTask - Updates task including status
- ✅ updateTask - Validates deadline format
- ✅ deleteTask - Deletes existing task
- ✅ getTasksForRegion - Filters by regionId
- ✅ getTasksForRegion - Verifies region ownership
- ✅ Authentication checks for all mutations
- ✅ Error handling for invalid input

**Coverage:** 100% (Statements, Branches, Functions, Lines)

#### Regions Actions (30 tests)

**File:** `app/actions/regions.test.ts`

**Test Coverage:**
- ✅ createRegion - Creates region linked to goal
- ✅ createRegion - Validates goalId exists
- ✅ createRegion - Verifies goal ownership before creating region
- ✅ updateRegion - Updates existing region
- ✅ deleteRegion - Deletes existing region
- ✅ getRegionsForGoal - Filters by goalId
- ✅ getRegionsForGoal - Verifies goal ownership
- ✅ Authentication checks for all mutations
- ✅ Error handling for invalid relationships

**Coverage:** 100% (Statements, Branches, Functions, Lines)

**Key Edge Cases Tested:**
- Authentication failures (no session)
- Non-existent UUIDs (goals, regions, tasks)
- Ownership verification across relationships
- FormData validation (required fields, types)
- Date/DateTime handling for task deadlines
- Status enum validation (active/completed/incomplete)
- Special characters in text fields
- Empty result sets

---

### ✅ Service Layer Tests (53 tests - 100% coverage)

**Architecture:** Service layer handles business logic and direct Prisma database operations. All services verify user ownership before operations.

#### Goals Service (18 tests)

**File:** `lib/services/goals.service.test.ts`

**Test Coverage:**
- ✅ getGoalsForUser - Returns user's goals via Prisma
- ✅ getGoalsForUser - Returns empty array if no goals
- ✅ getGoalById - Returns goal if user owns it
- ✅ getGoalById - Returns null if goal doesn't exist
- ✅ getGoalById - Returns null if user doesn't own goal (ownership check)
- ✅ createGoal - Creates goal with Prisma
- ✅ updateGoal - Updates goal if user owns it
- ✅ updateGoal - Returns null if user doesn't own goal
- ✅ deleteGoal - Deletes goal if user owns it
- ✅ deleteGoal - Returns null if user doesn't own goal

**Coverage:** 100% (Statements, Branches, Functions, Lines)

#### Regions Service (18 tests)

**File:** `lib/services/regions.service.test.ts`

**Test Coverage:**
- ✅ getRegionsForGoal - Returns regions with ownership verification
- ✅ getRegionById - Verifies ownership through goal relationship
- ✅ createRegion - Creates region after verifying goal ownership
- ✅ updateRegion - Updates with ownership check
- ✅ deleteRegion - Deletes with ownership check
- ✅ Ownership verification across goal-region relationship

**Coverage:** 100% (Statements, Branches, Functions, Lines)

#### Tasks Service (17 tests)

**File:** `lib/services/tasks.service.test.ts`

**Test Coverage:**
- ✅ getTasksForRegion - Returns tasks with ownership verification
- ✅ getTaskById - Verifies ownership through region→goal chain
- ✅ createTask - Creates task with deadline handling
- ✅ updateTask - Updates status and deadline
- ✅ deleteTask - Deletes with ownership check
- ✅ Date/DateTime conversion for deadlines
- ✅ Status enum handling (active/completed/incomplete)

**Coverage:** 100% (Statements, Branches, Functions, Lines)

**Key Features Tested:**
- Prisma query mocking (findMany, findUnique, create, update, delete)
- User ownership verification at service layer
- Null returns for unauthorized access
- Input/output type safety
- Relationship traversal for ownership checks
- Date handling and conversions

---

### ✅ Component Tests (72 tests - 93-100% coverage)

**Architecture:** Client components call server actions (mocked in tests) instead of using fetch to API routes.

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

#### Task Components (41 tests)

**File:** `components/tasks/task-form/task-form.test.tsx` (14 tests)
- ✅ Renders create mode correctly
- ✅ Renders edit mode with initial data
- ✅ Displays proper title for each mode
- ✅ Shows correct button text
- ✅ Shows cancel button
- ✅ Submits form with valid data (create mode)
- ✅ Submits form with valid data (edit mode)
- ✅ Calls correct API endpoint for each mode
- ✅ Navigates after successful submission
- ✅ Displays error when API fails
- ✅ Shows loading state during submission
- ✅ Handles cancel button correctly
- ✅ Includes deadline field with date picker
- ✅ Validates required deadline field

**File:** `components/tasks/delete-task-dialog/delete-task-dialog.test.tsx` (11 tests)
- ✅ Renders dialog when open
- ✅ Shows task title in warning message
- ✅ Shows cascade warning for weekly tasks
- ✅ Requires exact task name to enable delete button
- ✅ Delete button disabled with wrong name
- ✅ Delete button enabled with correct name
- ✅ Calls API on successful delete
- ✅ Redirects after delete
- ✅ Displays error on API failure
- ✅ Shows loading state during deletion
- ✅ Handles different task statuses in display

**File:** `components/tasks/task-detail-header/task-detail-header.test.tsx` (6 tests)
- ✅ Renders task title and description
- ✅ Shows deadline information
- ✅ Shows status badge (active/completed)
- ✅ Shows edit button with correct link
- ✅ Shows delete button
- ✅ Opens delete dialog on button click

**File:** `components/tasks/task-card/task-card.test.tsx` (10 tests)
- ✅ Renders task title and description
- ✅ Displays deadline date
- ✅ Shows status badge
- ✅ Applies different styles for active vs completed status
- ✅ Shows warning for overdue tasks
- ✅ Navigates to task detail on click
- ✅ Shows chevron icon for navigation affordance
- ✅ Applies hover styles
- ✅ Handles tasks with empty description
- ✅ Formats deadline correctly

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

### ✅ Authentication Tests (12 tests - 100% coverage)

**All authentication tests verify NextAuth.js configuration, callbacks, and UI behavior.**

#### Auth Configuration Tests

**File:** `lib/auth.test.ts`
- ✅ Session strategy (JWT)
- ✅ Email provider configuration
- ✅ Prisma adapter
- ✅ Redirect callbacks

#### Sign-In Page Tests

**File:** `app/auth/signin/page.test.tsx`
- ✅ Form rendering and validation
- ✅ Email input handling
- ✅ Submit and redirect flow
- ✅ Error handling
- ✅ Loading states

#### Verify Request Page Tests

**File:** `app/auth/verify-request/page.test.tsx`
- ✅ Message display
- ✅ Icon rendering
- ✅ Layout and styling

**Coverage:** 100% (Statements, Branches, Functions, Lines)

**Key Features Tested:**
- NextAuth configuration (providers, session strategy, callbacks)
- Redirect logic (security - prevents open redirects)
- Session management (user ID in JWT and session)
- Sign-in form (email input, submission, error handling)
- Loading states and disabled inputs during auth operations
- Verify request page rendering and styling
- Email provider integration with magic link flow

---

## Open Tests (Not Yet Implemented)

These tests should be implemented when the corresponding features are built. **Follow TDD approach: write tests first!**

### ⏳ Weekly Tasks Tests (Pending)

**Files to create:**
- `lib/services/weekly-tasks.service.test.ts` (Service layer)
- `app/actions/weekly-tasks.test.ts` (Server actions)

**Service Tests Needed:**
- [ ] getWeeklyTasksForTask - list weekly tasks with ownership check
- [ ] getCurrentWeekTasks - get current week's tasks for user
- [ ] createWeeklyTask - create with priority 1-3, validates limit
- [ ] updateWeeklyTask - update with ownership verification
- [ ] deleteWeeklyTask - delete with ownership check
- [ ] Enforces 3 tasks per week limit
- [ ] Priority range validation (1-3)
- [ ] Status handling (pending/completed)

**Action Tests Needed:**
- [ ] createWeeklyTask - FormData validation, auth check, calls service
- [ ] updateWeeklyTask - ownership verification via service
- [ ] deleteWeeklyTask - auth check and service call
- [ ] getWeeklyTasksForTask - filters by taskId
- [ ] Error handling for unauthenticated requests

### ⏳ Progress Entries Tests (Pending)

**Files to create:**
- `lib/services/progress-entries.service.test.ts`
- `app/actions/progress-entries.test.ts`

**Service Tests Needed:**
- [ ] getProgressEntriesForWeeklyTask - list with ownership
- [ ] createProgressEntry - completion % validation (0-100)
- [ ] updateProgressEntry - update with ownership check
- [ ] deleteProgressEntry - delete with ownership check
- [ ] Auto-sets date to today

**Action Tests Needed:**
- [ ] createProgressEntry - FormData validation and service call
- [ ] updateProgressEntry - ownership verification
- [ ] deleteProgressEntry - auth and service integration

### ⏳ Component Tests (Pending)

**Files to create:**
- `components/weekly-tasks/weekly-task-form/weekly-task-form.test.tsx`
- `components/weekly-tasks/weekly-task-card/weekly-task-card.test.tsx`
- `components/progress/progress-entry-form/progress-entry-form.test.tsx`
- `components/progress/progress-entry-card/progress-entry-card.test.tsx`

**Tests needed:** (follow same patterns as Goals/Regions/Tasks)
- [ ] Form rendering (create/edit modes)
- [ ] Form validation (priorities 1-3, completion % 0-100)
- [ ] Server action integration (mocked actions)
- [ ] Navigation after successful submission
- [ ] Delete dialogs with confirmation
- [ ] Loading and error states
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
- Fetch API (`global.fetch`) - for component tests
- **Prisma Client** - for API route tests
  - All CRUD methods mocked (findMany, findUnique, create, update, delete)
  - Returns mock data matching Prisma schema types
  - Cleared before each test via `jest.clearAllMocks()`

**Mock Data** (`lib/mock-data.ts`)
- Legacy in-memory data (deprecated for new features)
- Use Prisma mocks for new tests instead

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

#### Server Action Mocking
```typescript
import * as goalsActions from '@/app/actions/goals'

jest.mock('@/app/actions/goals')

// Mock successful action
;(goalsActions.createGoal as jest.Mock).mockResolvedValueOnce({
  success: true,
  data: { id: '1', title: 'Test' }
})

// Mock error response
;(goalsActions.createGoal as jest.Mock).mockResolvedValueOnce({
  error: 'Something went wrong'
})
```

#### Service Layer Mocking
```typescript
import * as goalsService from '@/lib/services/goals.service'

jest.mock('@/lib/services/goals.service')

;(goalsService.createGoal as jest.Mock).mockResolvedValueOnce({
  id: '1',
  title: 'Test',
  userId: 'user-123',
  createdAt: new Date(),
  updatedAt: new Date(),
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

// Mock Prisma client globally for API tests
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    goal: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    region: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    task: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

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
- **Prisma client mock** with all CRUD operations
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

### Pattern 1: Server Action Tests

**Key characteristics:**
- Import server action functions directly
- Mock NextAuth session (getServerSession)
- Mock service layer functions
- Test FormData input handling
- Test authentication checks
- Verify service layer called with correct parameters
- Test success/error response format

**Example:**

```typescript
import { createGoal, updateGoal, deleteGoal } from './goals'
import { getServerSession } from 'next-auth'
import * as goalsService from '@/lib/services/goals.service'

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

// Mock service layer
jest.mock('@/lib/services/goals.service')

// Mock Next.js cache revalidation
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}))

describe('Goals Actions', () => {
  const mockSession = {
    user: { id: 'user-123', email: 'test@example.com' },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createGoal', () => {
    it('should create goal with authenticated user', async () => {
      // ARRANGE
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)
      const mockCreatedGoal = {
        id: 'goal-123',
        title: 'New Goal',
        description: 'Test',
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      ;(goalsService.createGoal as jest.Mock).mockResolvedValue(mockCreatedGoal)

      const formData = new FormData()
      formData.append('title', 'New Goal')
      formData.append('description', 'Test')

      // ACT
      const result = await createGoal(formData)

      // ASSERT
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockCreatedGoal)
      expect(goalsService.createGoal).toHaveBeenCalledWith({
        title: 'New Goal',
        description: 'Test',
        userId: 'user-123',
      })
    })

    it('should return error when not authenticated', async () => {
      // ARRANGE
      ;(getServerSession as jest.Mock).mockResolvedValue(null)

      const formData = new FormData()
      formData.append('title', 'New Goal')

      // ACT
      const result = await createGoal(formData)

      // ASSERT
      expect(result.error).toBe('Unauthorized')
      expect(goalsService.createGoal).not.toHaveBeenCalled()
    })

    it('should validate required fields', async () => {
      // ARRANGE
      ;(getServerSession as jest.Mock).mockResolvedValue(mockSession)

      const formData = new FormData()
      // Missing title

      // ACT
      const result = await createGoal(formData)

      // ASSERT
      expect(result.error).toContain('required')
      expect(goalsService.createGoal).not.toHaveBeenCalled()
    })
  })
})
```

---

### Pattern 2: Service Layer Tests

**Key characteristics:**
- Import and type-cast mocked Prisma client
- Mock Prisma method return values (findMany, findUnique, create, update, delete)
- Test ownership verification logic
- Test input/output transformations
- Return null for unauthorized access
- Test relationship traversal

**Example:**

```typescript
import { createGoal, getGoalsForUser, deleteGoal } from './goals.service'
import prisma from '@/lib/prisma'

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  default: {
    goal: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('Goals Service', () => {
  const userId = 'user-123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getGoalsForUser', () => {
    it('should return user goals', async () => {
      // ARRANGE
      const mockGoals = [
        { id: 'goal-1', title: 'Goal 1', description: 'Test', userId, createdAt: new Date(), updatedAt: new Date() },
        { id: 'goal-2', title: 'Goal 2', description: 'Test', userId, createdAt: new Date(), updatedAt: new Date() },
      ]
      mockPrisma.goal.findMany.mockResolvedValue(mockGoals)

      // ACT
      const result = await getGoalsForUser(userId)

      // ASSERT
      expect(result).toEqual(mockGoals)
      expect(mockPrisma.goal.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('createGoal', () => {
    it('should create goal with userId', async () => {
      // ARRANGE
      const input = { title: 'New Goal', description: 'Test', userId }
      const mockCreated = { id: 'goal-123', ...input, createdAt: new Date(), updatedAt: new Date() }
      mockPrisma.goal.create.mockResolvedValue(mockCreated)

      // ACT
      const result = await createGoal(input)

      // ASSERT
      expect(result).toEqual(mockCreated)
      expect(mockPrisma.goal.create).toHaveBeenCalledWith({
        data: input,
      })
    })
  })

  describe('deleteGoal', () => {
    it('should delete goal if user owns it', async () => {
      // ARRANGE
      const goalId = 'goal-123'
      const mockGoal = { id: goalId, title: 'Goal', description: 'Test', userId, createdAt: new Date(), updatedAt: new Date() }
      mockPrisma.goal.findUnique.mockResolvedValue(mockGoal)
      mockPrisma.goal.delete.mockResolvedValue(mockGoal)

      // ACT
      const result = await deleteGoal(goalId, userId)

      // ASSERT
      expect(result).toEqual(mockGoal)
      expect(mockPrisma.goal.delete).toHaveBeenCalledWith({
        where: { id: goalId },
      })
    })

    it('should return null if user does not own goal', async () => {
      // ARRANGE
      const goalId = 'goal-123'
      const mockGoal = { id: goalId, title: 'Goal', description: 'Test', userId: 'other-user', createdAt: new Date(), updatedAt: new Date() }
      mockPrisma.goal.findUnique.mockResolvedValue(mockGoal)

      // ACT
      const result = await deleteGoal(goalId, userId)

      // ASSERT
      expect(result).toBeNull()
      expect(mockPrisma.goal.delete).not.toHaveBeenCalled()
    })
  })
})
```

---

### Pattern 3: Component Tests (Forms)

**Key characteristics:**
- Test create and edit modes
- Test form validation
- Mock server actions (imported from `@/app/actions/*`)
- Test navigation with router mocks
- Test loading and error states

**Example:**

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GoalForm } from './goal-form'
import { mockRouterPush, mockRouterRefresh } from '@/jest.setup'
import * as goalsActions from '@/app/actions/goals'

// Mock server actions
jest.mock('@/app/actions/goals', () => ({
  createGoal: jest.fn(),
  updateGoal: jest.fn(),
}))

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
      const mockGoal = {
        id: 'goal-123',
        title: 'New Goal',
        description: 'Test Description',
        userId: 'user-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      ;(goalsActions.createGoal as jest.Mock).mockResolvedValueOnce({
        success: true,
        data: mockGoal,
      })

      render(<GoalForm mode="create" />)

      // ACT
      await user.type(screen.getByLabelText(/title/i), 'New Goal')
      await user.type(screen.getByLabelText(/description/i), 'Test Description')
      await user.click(screen.getByRole('button', { name: /create goal/i }))

      // ASSERT
      await waitFor(() => {
        expect(goalsActions.createGoal).toHaveBeenCalled()
        expect(mockRouterPush).toHaveBeenCalledWith('/goals')
      })
    })

    it('displays error on action failure', async () => {
      // ARRANGE
      const user = userEvent.setup()

      ;(goalsActions.createGoal as jest.Mock).mockResolvedValueOnce({
        error: 'Failed to create goal',
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

      ;(goalsActions.createGoal as jest.Mock).mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ success: true, data: {} }), 100))
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

      ;(goalsActions.updateGoal as jest.Mock).mockResolvedValueOnce({
        success: true,
        data: { ...initialData, title: 'Updated Goal' },
      })

      render(<GoalForm mode="edit" initialData={initialData} />)

      // ACT
      await user.clear(screen.getByLabelText(/title/i))
      await user.type(screen.getByLabelText(/title/i), 'Updated Goal')
      await user.click(screen.getByRole('button', { name: /save changes/i }))

      // ASSERT
      await waitFor(() => {
        expect(goalsActions.updateGoal).toHaveBeenCalled()
        expect(mockRouterRefresh).toHaveBeenCalled()
      })
    })
  })
})
```

---

### Pattern 4: Component Tests (Dialogs)

**Key characteristics:**
- Test open/close behavior
- Test confirmation requirements
- Test name verification
- Mock server actions
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

### Pattern 5: Component Tests (Cards)

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
