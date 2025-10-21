# TODOs - Goal Tracker Implementation Roadmap

This document tracks the remaining work needed to complete the goal tracking system.

## Overview

The system follows a 4-level hierarchy:
- **Goal** → **Region** → **Task** → **Weekly Task** → **Progress Entry**

## Phase 1: Complete Goals & Regions (Foundation) ⏳

### Goals - CRUD Operations ✅
- [x] Create goal (API + UI)
  - [x] API: `POST /api/goals`
  - [x] UI: `/goals/create` page with GoalForm component
- [x] Read/List goals (API + UI)
  - [x] API: `GET /api/goals`
  - [x] UI: `/goals` page with GoalCard components
- [x] Get single goal (API + UI)
  - [x] API: `GET /api/goals/[id]`
  - [x] UI: `/goals/[id]` page with GoalDetailHeader
- [x] Update goal (API + UI)
  - [x] API: `PUT /api/goals/[id]`
  - [x] UI: `/goals/[id]/edit` page with GoalForm component
  - [x] Edit button on goal detail page
- [x] Delete goal (API + UI)
  - [x] API: `DELETE /api/goals/[id]`
  - [x] UI: Delete button with DeleteGoalDialog confirmation
  - [x] Redirects to `/goals` after deletion
  - Note: Currently deletes goal only, cascade behavior to be implemented with Tasks phase

### Regions - CRUD Operations ✅
- [x] Create region (API + UI)
  - [x] API: `POST /api/regions`
  - [x] UI: `/goals/[id]/addRegion` page with RegionForm component
- [x] Read/List regions (API + UI)
  - [x] API: `GET /api/regions?goalId={id}`
  - [x] UI: Goal detail page with RegionCard components
- [x] Get single region (API + UI)
  - [x] API: `GET /api/regions/[id]`
  - [x] UI: `/goals/[id]/[regionId]` page
- [x] Update region (API + UI)
  - [x] API: `PUT /api/regions/[id]`
  - [x] UI: `/goals/[id]/[regionId]/edit` page with RegionForm component
  - [x] Edit button (pencil icon) on region cards
- [x] Delete region (API + UI)
  - [x] API: `DELETE /api/regions/[id]`
  - [x] UI: Delete button (trash icon) with DeleteRegionDialog confirmation
  - [x] Requires typing region name for confirmation
  - [x] Warns about cascade deletion of tasks, weekly tasks, and progress entries
  - [x] Redirects to goal detail page after deletion

### Additional Features for Goals/Regions
- [x] Add "Create" buttons/forms on relevant pages
  - [x] "Add Goal" button on `/goals` page → links to `/goals/create`
  - [x] "Add Region" button on `/goals/[id]` page → links to `/goals/[id]/addRegion`
- [ ] Add filtering/search functionality
- [ ] Add sorting options
- [ ] Improve empty states with clear CTAs

### Component Organization
- [x] Goal components organized in `components/goals/` directory (each component in its own folder with test)
  - [x] `goal-card/` - Displays goal summary on list page
  - [x] `goal-detail-header/` - Header with edit/delete actions
  - [x] `goal-form/` - Reusable form for create/edit operations
  - [x] `delete-goal-dialog/` - Confirmation dialog for deletion
- [x] Region components organized in `components/regions/` directory (each component in its own folder with test)
  - [x] `region-card/` - Displays region with Eye, Edit, Delete action buttons
  - [x] `region-form/` - Reusable form for create/edit operations
  - [x] `delete-region-dialog/` - Confirmation dialog with name verification

### Testing Implementation ✅
- [x] Testing infrastructure setup
  - [x] Jest configured with Next.js 15 integration
  - [x] React Testing Library for component testing
  - [x] Global mocks for Next.js router and Link
  - [x] Test coverage tracking with v8 provider
- [x] Goals API tests (18 tests - 100% coverage)
  - [x] `app/api/goals/route.test.ts` - 8 tests for GET and POST
  - [x] `app/api/goals/[id]/route.test.ts` - 10 tests for GET, PUT, DELETE
- [x] Regions API tests (19 tests - 100% coverage)
  - [x] `app/api/regions/route.test.ts` - 9 tests for GET and POST
  - [x] `app/api/regions/[id]/route.test.ts` - 10 tests for GET, PUT, DELETE
- [x] Goal component tests (33 tests - 93-100% coverage)
  - [x] `components/goals/goal-form/goal-form.test.tsx` - 14 tests
  - [x] `components/goals/delete-goal-dialog/delete-goal-dialog.test.tsx` - 10 tests
  - [x] `components/goals/goal-detail-header/goal-detail-header.test.tsx` - 4 tests
  - [x] `components/goals/goal-card/goal-card.test.tsx` - 5 tests
- [x] Region component tests (18 tests - 93-100% coverage)
  - [x] `components/regions/region-form/region-form.test.tsx` - 8 tests
  - [x] `components/regions/delete-region-dialog/delete-region-dialog.test.tsx` - 6 tests
  - [x] `components/regions/region-card/region-card.test.tsx` - 5 tests
- [x] Utility tests (6 tests - 100% coverage)
  - [x] `lib/utils.test.ts` - 6 tests for cn() utility
- [x] Testing documentation
  - [x] Comprehensive TESTING.md guide created
  - [x] TDD workflow documented with examples
  - [x] Test patterns and best practices documented

**Current Test Status:** 156 tests passing in ~7.9s (updated 2025-10-21)

---

## Phase 2: Tasks Implementation ✅ COMPLETE

### Data Layer ✅
- [x] Define `Task` interface in `lib/types.ts`
  ```ts
  interface Task {
    id: string;
    regionId: string; // required - tasks belong to regions
    title: string;
    description: string;
    deadline: string; // ISO date string - creates urgency
    status: 'active' | 'completed';
    createdAt: string; // ISO date string
  }
  ```
- [x] Add mock tasks to `lib/mock-data.ts` (5 sample tasks)
- [x] Create API routes in `app/api/tasks/`
  - [x] `GET /api/tasks?regionId={id}` - List with filters (21 tests - 100% coverage)
  - [x] `POST /api/tasks` - Create
  - [x] `GET /api/tasks/[id]` - Get single
  - [x] `PUT /api/tasks/[id]` - Update
  - [x] `DELETE /api/tasks/[id]` - Delete

### UI/Pages ✅
- [x] Create `app/goals/[id]/[regionId]/tasks/[taskId]/page.tsx` - Task detail page with deadline countdown
- [x] Create `app/goals/[id]/[regionId]/addTask/page.tsx` - Create task page
- [x] Create `app/goals/[id]/[regionId]/tasks/[taskId]/edit/page.tsx` - Edit task page
- [x] Add tasks section to region detail page with "New Task" button
- [x] Create TaskCard component with deadline, status badge, action buttons (8 tests - 100% coverage)
- [x] Create TaskForm component for create/edit operations (16 tests - 99% coverage)
- [x] Create DeleteTaskDialog with cascade warning (8 tests - 98% coverage)
- [x] Add deadline picker (date input with ISO string conversion)
- [x] Show task status (active/completed with color-coded badges)
- [x] Add visual indicators for approaching/overdue deadlines (days remaining/overdue display)

### Components ✅
- [x] `components/tasks/task-card/` - Display task with action buttons
- [x] `components/tasks/task-form/` - Reusable form for create/edit
- [x] `components/tasks/delete-task-dialog/` - Confirmation dialog

### Routing/Navigation ✅
- [x] Tasks accessible from region detail pages
- [x] Task detail, create, and edit pages implemented
- [ ] Update sidebar to show tasks (future enhancement)

---

## Phase 3: Weekly Tasks Implementation 📅

### Data Layer
- [ ] Define `WeeklyTask` interface in `lib/types.ts`
  ```ts
  interface WeeklyTask {
    id: string;
    taskId: string; // parent task
    title: string;
    description: string;
    priority: 1 | 2 | 3; // 1 = highest
    weekStartDate: Date; // Monday of the week
    status: 'pending' | 'completed';
    createdAt: Date;
  }
  ```
- [ ] Add mock weekly tasks to `lib/mock-data.ts`
- [ ] Create API routes in `app/api/weekly-tasks/`
  - [ ] `GET /api/weekly-tasks?taskId={id}&weekStartDate={date}`
  - [ ] `GET /api/weekly-tasks/current-week` - Special endpoint for current week
  - [ ] `POST /api/weekly-tasks` - Create
  - [ ] `GET /api/weekly-tasks/[id]` - Get single
  - [ ] `PUT /api/weekly-tasks/[id]` - Update
  - [ ] `DELETE /api/weekly-tasks/[id]` - Delete

### UI/Pages
- [ ] Create weekly task creation form
  - [ ] Enforce: exactly 3 weekly tasks per task per week
  - [ ] Priority selector (1-3)
  - [ ] Auto-populate weekStartDate based on current week
- [ ] Add weekly tasks section to task detail page
- [ ] Show weekly tasks grouped by week
- [ ] Add week selector/navigation (current week vs. past weeks)
- [ ] Visual distinction for different priorities

### Week Management
- [ ] Implement week calculation utilities
  - [ ] Get current week start date (Monday)
  - [ ] Week navigation (previous/next)
  - [ ] Date formatting for week display
- [ ] Add "Create Weekly Tasks for This Week" workflow
- [ ] Validate: only 3 weekly tasks per task per week

---

## Phase 4: Progress Entries (Daily Journaling) 📝

### Data Layer
- [ ] Define `ProgressEntry` interface in `lib/types.ts`
  ```ts
  interface ProgressEntry {
    id: string;
    weeklyTaskId: string;
    date: Date; // which day the entry is for
    notes: string; // journal entry
    completionPercentage: number; // 0-100
    createdAt: Date;
  }
  ```
- [ ] Add mock progress entries to `lib/mock-data.ts`
- [ ] Create API routes in `app/api/progress-entries/`
  - [ ] `GET /api/progress-entries?weeklyTaskId={id}`
  - [ ] `POST /api/progress-entries` - Create
  - [ ] `GET /api/progress-entries/[id]` - Get single
  - [ ] `PUT /api/progress-entries/[id]` - Update
  - [ ] `DELETE /api/progress-entries/[id]` - Delete

### UI/Components
- [ ] Create progress entry form/modal
  - [ ] Text area for notes (journal entry)
  - [ ] Completion percentage input (slider or number input 0-100)
  - [ ] Date selector (default to today)
- [ ] Show progress entries timeline for a weekly task
- [ ] Visual progress indicator (percentage complete)
- [ ] Daily entry reminders/indicators

---

## Phase 5: Progress Page (Main Dashboard) 🎯

The progress page is the core daily interface for tracking work.

### Current Week View
- [ ] Redesign `app/progress/page.tsx` to show current week's weekly tasks
- [ ] Group weekly tasks by parent task
- [ ] Display priority (1-3) clearly
- [ ] Show completion status/percentage for each weekly task
- [ ] Add quick action: "Add Progress Entry" button for each weekly task
- [ ] Show latest progress entry for each weekly task
- [ ] Visual progress bars/indicators

### Daily Progress Update Flow
- [ ] Add prominent "Log Progress" interface
- [ ] Quick access to add progress entry for today
- [ ] Show which weekly tasks have been updated today
- [ ] Completion percentage updates

### Week-at-a-Glance
- [ ] Calendar view showing current week (Mon-Sun)
- [ ] Highlight days with progress entries
- [ ] Show overall weekly progress

---

## Phase 6: Weekly Review & Archive System 🗂️

### Weekly Review Workflow
- [ ] Create weekly review page/modal
- [ ] Show all weekly tasks from previous week
- [ ] Mark weekly tasks as complete/incomplete
- [ ] Archive completed week
- [ ] Create new weekly tasks for upcoming week (3 per task, priority 1-3)
- [ ] Weekly review reminder/notification

### Archive System
- [ ] Create archive page for historical weeks
- [ ] Week selector to browse past weeks
- [ ] Show archived weekly tasks and progress entries
- [ ] Read-only view of past weeks
- [ ] Search/filter archived weeks
- [ ] Statistics/analytics from archived data

### Archive Location in UI
- [ ] Keep archived weeks "deeper" in the app (not on main navigation)
- [ ] Access via: Settings, History page, or dedicated Archive section
- [ ] Ensure current week stays in focus on Progress page

---

## Phase 7: Roll-Over Feature (Future Enhancement) 🔄

This is a future enhancement for handling incomplete weekly tasks.

- [ ] Design roll-over logic
  - [ ] Detect incomplete weekly tasks from previous week
  - [ ] Offer to roll incomplete tasks to current week
  - [ ] Copy vs. move options
- [ ] UI for roll-over management during weekly review
- [ ] Handle priority conflicts when rolling over
- [ ] Track roll-over history

---

## Phase 8: Polish & UX Improvements ✨

### Navigation & Flow
- [ ] Breadcrumb navigation for deep pages
- [ ] Consistent back buttons
- [ ] Keyboard shortcuts for common actions
- [ ] Loading states for all async operations
- [ ] Optimistic updates for better perceived performance

### Visual Design
- [ ] Consistent spacing and typography
- [ ] Color coding for priorities
- [ ] Deadline urgency indicators (colors for overdue, approaching, etc.)
- [ ] Progress visualization (charts/graphs)
- [ ] Empty states with helpful illustrations/text

### Forms & Validation
- [ ] Form validation for all inputs
- [ ] Better error messages
- [ ] Success notifications
- [ ] Confirmation dialogs for destructive actions
- [ ] Auto-save drafts

### Mobile Responsiveness
- [ ] Test all pages on mobile
- [ ] Optimize sidebar for mobile
- [ ] Touch-friendly buttons/interactions
- [ ] Mobile-specific layouts where needed

---

## Phase 9: Data Persistence ✅ COMPLETE

~~Currently using in-memory mock data. Need real persistence.~~

### Implementation ✅
- [x] Choose persistence strategy → **PostgreSQL + Prisma**
- [x] Set up database/storage → Docker Compose with PostgreSQL
- [x] Create database schema → Prisma schema with UUID primary keys
- [x] Update all API routes to use Prisma → Goals, Regions, Tasks complete
- [x] Create seed file for development data
- [x] Update all API tests to use Prisma mocks
- [x] Document database setup in README.md

**Completed:** 2025-10-21
- Prisma ORM integrated with PostgreSQL
- All entities use UUID primary keys
- Database seeding implemented
- All 58 API tests updated to mock Prisma client
- 100% API test coverage maintained

---

## Phase 10: Authentication & User Management 🔐

**Priority: HIGH** - Must be implemented before Weekly Tasks to avoid technical debt.

### Why Now?
- All current database models have `userId` fields (currently using placeholder `0`)
- Implementing auth now prevents massive refactoring later
- Weekly Tasks and Progress Entries will depend on user context
- Multi-tenancy considerations must be established early

### Authentication Strategy
- [ ] Choose auth provider
  - Options: NextAuth.js, Clerk, Auth0, Supabase Auth
  - Recommendation: **NextAuth.js** (integrates well with Next.js 15)
- [ ] Set up authentication
  - [ ] Configure auth provider
  - [ ] Add login/signup pages
  - [ ] Implement session management
  - [ ] Add protected route middleware
- [ ] Update database schema
  - [ ] Add User model to Prisma schema
  - [ ] Add user relations to Goal, Region, Task models
  - [ ] Create migration for existing data
- [ ] Update API routes
  - [ ] Add user authentication checks
  - [ ] Filter queries by userId
  - [ ] Prevent cross-user data access
  - [ ] Update API tests to handle user context
- [ ] Update UI
  - [ ] Add user profile menu
  - [ ] Add login/logout functionality
  - [ ] Show user-specific data only
  - [ ] Add user settings page

### User Model Design
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  goals     Goal[]
  regions   Region[]
  tasks     Task[]
  // weeklyTasks WeeklyTask[] (when implemented)
  // progressEntries ProgressEntry[] (when implemented)
}
```

### Security Considerations
- [ ] Implement row-level security (user can only access their data)
- [ ] Add CSRF protection
- [ ] Secure session storage
- [ ] Rate limiting for auth endpoints
- [ ] Email verification (optional)

---

## Phase 11: Advanced Features (Nice to Have) 🚀

### Analytics & Insights
- [ ] Completion rate tracking
- [ ] Time to completion statistics
- [ ] Goal progress visualization
- [ ] Weekly/monthly reports
- [ ] Streaks and achievements

### Collaboration (if multi-user)
- [ ] User authentication
- [ ] Shared goals
- [ ] Comments on tasks
- [ ] Activity feed

### Customization
- [ ] Theme selection (light/dark mode)
- [ ] Custom color schemes
- [ ] Configurable week start day
- [ ] Notification preferences

### Export & Sharing
- [ ] Export goals/progress as Markdown
- [ ] PDF reports
- [ ] Share goals publicly
- [ ] Calendar integration (iCal export)

---

## Bug Fixes & Tech Debt 🐛

### High Priority
- [ ] **Fix TypeScript errors in API tests** - Tests pass but have type errors with Prisma mocks
- [ ] **Implement user authentication** - userId fields exist but not enforced (see Phase 11 below)
- [ ] Add proper TypeScript types for all API responses
- [ ] Improve error handling in API routes
- [ ] Add request validation/sanitization

### Medium Priority
- [ ] Fix ESLint warnings in `app/progress/page.tsx` (unescaped entities)
- [ ] Remove unused imports in `components/app-sidebar.tsx`
- [ ] Add error boundaries
- [ ] Add API rate limiting (if needed)

### Low Priority (Future)
- [ ] Security audit (XSS, CSRF, etc.)
- [ ] Performance optimization
- [ ] Bundle size optimization

---

## Testing 🧪

- [x] Set up testing framework (Jest + React Testing Library) ✅
- [x] Unit tests for utilities ✅
- [x] Component tests for Goals and Regions ✅
- [x] API route tests for Goals and Regions ✅
- [x] Component tests for Tasks ✅
- [x] API route tests for Tasks ✅
- [ ] Tooltip tests for components with tooltips (TaskCard, RegionCard, GoalDetailHeader, etc.)
- [ ] Component tests for Weekly Tasks (when implemented)
- [ ] API route tests for Weekly Tasks (when implemented)
- [ ] Component tests for Progress Entries (when implemented)
- [ ] API route tests for Progress Entries (when implemented)
- [ ] E2E tests for critical user flows (Playwright)
- [ ] Accessibility testing
- [ ] Performance testing

---

## Documentation 📚

- [x] Testing documentation (TESTING.md) ✅
- [ ] API documentation
- [ ] Component documentation
- [ ] User guide / help section
- [ ] Contributing guide (if open source)
- [ ] Deployment guide
- [ ] Development setup guide

---

## Immediate Next Steps (Recommended Priority)

1. ~~**Complete Goals & Regions CRUD** (Phase 1)~~ ✅ **COMPLETE**
   - ~~Add edit/delete UI for goals~~ ✅
   - ~~Add edit/delete UI for regions~~ ✅
   - ~~Add create buttons/forms~~ ✅

2. ~~**Implement Tasks** (Phase 2)~~ ✅ **COMPLETE**
   - ~~Build out the Task data model and API~~ ✅
   - ~~Create task pages and UI~~ ✅
   - ~~Add deadline functionality~~ ✅
   - 156 tests passing (58 API + 92 component + 6 utility tests)

3. ~~**Data Persistence with Prisma** (Phase 9)~~ ✅ **COMPLETE**
   - ~~Set up PostgreSQL with Docker~~ ✅
   - ~~Integrate Prisma ORM~~ ✅
   - ~~Migrate all API routes to use Prisma~~ ✅
   - ~~Update all tests with Prisma mocks~~ ✅
   - ~~Create database seed file~~ ✅

4. **Authentication & User Management** (Phase 10) 🎯 **NEXT - HIGH PRIORITY**
   - Implement user authentication (NextAuth.js recommended)
   - Add User model to Prisma schema
   - Update API routes to enforce user context
   - Add login/signup pages
   - **Critical:** Must be done before Weekly Tasks to avoid technical debt

5. **Fix TypeScript Errors in Tests** (Tech Debt)
   - Resolve type errors with Prisma mocks in API tests
   - Tests pass but have TypeScript warnings

6. **Implement Weekly Tasks** (Phase 3)
   - Build weekly task system (after auth is complete)
   - Connect to tasks
   - Week management utilities
   - Use TDD approach (following Tasks implementation pattern)

7. **Progress Entries** (Phase 4)
   - Daily journaling interface
   - Completion percentage tracking

8. **Redesign Progress Page** (Phase 5)
   - Focus on current week's weekly tasks
   - Add progress entry functionality

9. **Weekly Review & Archive** (Phase 6)
   - Weekly review workflow
   - Archive system

---

**Last Updated:** 2025-10-21

**Recent Accomplishments:**
- ✅ Migrated from mock data to PostgreSQL + Prisma
- ✅ All 156 tests updated and passing with Prisma mocks
- ✅ Database seeding implemented
- ✅ UUID primary keys for all entities
- ✅ 100% API test coverage maintained
