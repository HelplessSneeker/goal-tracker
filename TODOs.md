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

**Current Test Status:** 147 tests passing in ~3.8s (updated 2025-10-15)

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

## Phase 9: Data Persistence (Replace Mock Data) 💾

Currently using in-memory mock data. Need real persistence.

### Options to Consider:
1. **Local Storage / IndexedDB** (client-side only)
2. **SQLite + File System** (for local-first app)
3. **Backend API + Database** (PostgreSQL, MongoDB, etc.)
4. **Supabase / Firebase** (managed backend)

### Implementation Tasks:
- [ ] Choose persistence strategy
- [ ] Set up database/storage
- [ ] Create data migration from mock data
- [ ] Update all API routes to use real storage
- [ ] Add data import/export functionality
- [ ] Implement data backup strategy

---

## Phase 10: Advanced Features (Nice to Have) 🚀

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

- [ ] Fix ESLint warnings in `app/progress/page.tsx` (unescaped entities)
- [ ] Remove unused imports in `components/app-sidebar.tsx`
- [ ] Add proper TypeScript types for all API responses
- [ ] Add error boundaries
- [ ] Improve error handling in API routes
- [ ] Add API rate limiting (if needed)
- [ ] Add request validation/sanitization
- [ ] Security audit (XSS, CSRF, etc.)

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
   - 147 tests passing (21 API + 32 component tests for Tasks)

3. **Implement Weekly Tasks** (Phase 3) 🎯 **NEXT**
   - Build weekly task system
   - Connect to tasks
   - Week management utilities
   - Use TDD approach (following Tasks implementation pattern)

4. **Progress Entries** (Phase 4)
   - Daily journaling interface
   - Completion percentage tracking

5. **Redesign Progress Page** (Phase 5)
   - Focus on current week's weekly tasks
   - Add progress entry functionality

6. **Weekly Review & Archive** (Phase 6)
   - Weekly review workflow
   - Archive system

---

**Last Updated:** 2025-10-15
