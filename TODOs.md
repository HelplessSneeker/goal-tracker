# TODOs - Goal Tracker Implementation Roadmap

This document tracks the implementation progress and remaining work for the goal tracking system.

**Last Updated:** 2025-10-23

---

## Current Branch Status

**Branch:** `authentication`

**Recent Changes (not yet merged):**
- ✅ NextAuth.js authentication implemented (email/magic link)
- ✅ Centralized auth configuration (`lib/auth.ts`)
- ✅ Sign-in and verify-request pages
- ✅ Middleware for route protection
- ✅ Authentication tests (28 tests, 100% coverage)
- ✅ Documentation updated (TESTING.md, TODOs.md, CLAUDE.md, README.md)
- ⚠️ Prisma seed script needs fixing for user relations
- ⚠️ 1 pre-existing test failure (task-form.test.tsx:275)

---

## Overview

The system follows a 4-level hierarchy:
- **Goal** → **Region** → **Task** → **Weekly Task** → **Progress Entry**

---

## Completed Phases ✅

### Phase 1: Goals & Regions (Foundation) ✅ COMPLETE
**Completed:** 2025-10-20

#### Goals CRUD ✅
- [x] API routes (`POST/GET/PUT/DELETE /api/goals`)
- [x] UI pages (list, create, detail, edit)
- [x] Components (GoalCard, GoalForm, GoalDetailHeader, DeleteGoalDialog)
- [x] 18 API tests (100% coverage)
- [x] 33 component tests (93-100% coverage)

#### Regions CRUD ✅
- [x] API routes (`POST/GET/PUT/DELETE /api/regions`)
- [x] UI pages (list, create, detail, edit)
- [x] Components (RegionCard, RegionForm, DeleteRegionDialog)
- [x] 19 API tests (100% coverage)
- [x] 18 component tests (93-100% coverage)

#### Testing Infrastructure ✅
- [x] Jest + React Testing Library setup
- [x] Prisma mocks configured globally
- [x] Test coverage tracking with v8
- [x] TESTING.md documentation created

---

### Phase 2: Tasks Implementation ✅ COMPLETE
**Completed:** 2025-10-21

#### Tasks CRUD ✅
- [x] API routes (`POST/GET/PUT/DELETE /api/tasks`)
- [x] UI pages (list, create, detail, edit)
- [x] Components (TaskCard, TaskForm, TaskDetailHeader, DeleteTaskDialog)
- [x] Deadline tracking with date picker
- [x] Status badges (active/completed/incomplete)
- [x] Visual indicators for approaching/overdue deadlines
- [x] 21 API tests (100% coverage)
- [x] 41 component tests (93-100% coverage)

---

### Phase 3: Database Integration (Prisma + PostgreSQL) ✅ COMPLETE
**Completed:** 2025-10-21

#### Implementation ✅
- [x] PostgreSQL database with Docker Compose
- [x] Prisma ORM integration
- [x] Database schema with UUID primary keys
- [x] Migrated all API routes from mock data to Prisma
- [x] Database seeding script (`prisma/seed.ts`)
- [x] Updated all 58 API tests to use Prisma mocks
- [x] 100% API test coverage maintained

---

### Phase 4: Authentication & User Management ⏳ IN PROGRESS
**Started:** 2025-10-23

#### Completed ✅
- [x] NextAuth.js setup with email provider
- [x] Centralized auth configuration (`lib/auth.ts`)
- [x] JWT session strategy
- [x] Prisma adapter for NextAuth
- [x] Sign-in page with magic link flow
- [x] Verify request page
- [x] Middleware for route protection
- [x] Authentication tests (28 tests - 100% coverage)
  - [x] Auth configuration tests (10 tests)
  - [x] Sign-in page tests (11 tests)
  - [x] Verify request page tests (7 tests)

#### Remaining 🔲
- [ ] Sign-out functionality
- [ ] User model in Prisma schema with relations
- [ ] Update API routes to filter by userId
- [ ] Add user authentication checks to API routes
- [ ] User profile menu in UI
- [ ] User settings page
- [ ] Update tests to handle user context
- [ ] Verify Goals/Regions/Tasks properly scoped to users

**Current Status:** Basic authentication working with magic link email flow. Need to add user scoping to database models and API routes.

---

## Currently Implementing

**Phase 4: Authentication** - Sign-in works, magic links work. Need to add user scoping to data models and logout functionality.

---

## Open Phases

### Phase 5: Weekly Tasks Implementation 📅
**Status:** Not started (blocked by Phase 4 completion)

#### Data Layer
- [ ] Add `WeeklyTask` model to Prisma schema
- [ ] Create API routes
  - [ ] `GET /api/weekly-tasks?taskId={id}&weekStartDate={date}`
  - [ ] `GET /api/weekly-tasks/current-week`
  - [ ] `POST /api/weekly-tasks` - Create with priority 1-3
  - [ ] `PUT /api/weekly-tasks/[id]` - Update
  - [ ] `DELETE /api/weekly-tasks/[id]` - Delete

#### UI/Components
- [ ] WeeklyTaskForm component (enforce 3 tasks per week)
- [ ] WeeklyTaskCard component with priority indicator
- [ ] Add weekly tasks section to task detail page
- [ ] Week selector/navigation
- [ ] Visual distinction for different priorities

#### Testing (TDD Approach)
- [ ] Write API tests first (following Tasks pattern)
- [ ] Write component tests first
- [ ] Implement features to pass tests

---

### Phase 6: Progress Entries (Daily Journaling) 📝

#### Data Layer
- [ ] Add `ProgressEntry` model to Prisma schema
- [ ] Create API routes
  - [ ] `GET /api/progress-entries?weeklyTaskId={id}`
  - [ ] `POST /api/progress-entries`
  - [ ] `PUT /api/progress-entries/[id]`
  - [ ] `DELETE /api/progress-entries/[id]`

#### UI/Components
- [ ] Progress entry form with notes and completion percentage
- [ ] Progress entries timeline for weekly tasks
- [ ] Visual progress indicator
- [ ] Daily entry reminders

#### Testing (TDD Approach)
- [ ] Write API tests first
- [ ] Write component tests first
- [ ] Implement features to pass tests

---

### Phase 7: Progress Page (Main Dashboard) 🎯

#### Current Week View
- [ ] Redesign `/progress` page to show current week's weekly tasks
- [ ] Group weekly tasks by parent task
- [ ] Display priority clearly
- [ ] Show completion status/percentage
- [ ] Quick "Add Progress Entry" button
- [ ] Visual progress bars

#### Daily Progress Flow
- [ ] Prominent "Log Progress" interface
- [ ] Show which tasks updated today
- [ ] Completion percentage updates

---

### Phase 8: Weekly Review & Archive System 🗂️

#### Weekly Review Workflow
- [ ] Weekly review page/modal
- [ ] Show previous week's tasks
- [ ] Mark tasks complete/incomplete
- [ ] Archive completed week
- [ ] Create new weekly tasks for upcoming week

#### Archive System
- [ ] Archive page for historical weeks
- [ ] Week selector for browsing past weeks
- [ ] Read-only view of past weeks
- [ ] Search/filter archived weeks
- [ ] Statistics from archived data

---

### Phase 9: Polish & UX Improvements ✨

#### Navigation & Flow
- [ ] Breadcrumb navigation
- [ ] Consistent back buttons
- [ ] Keyboard shortcuts
- [ ] Loading states for all async operations
- [ ] Optimistic updates

#### Visual Design
- [ ] Consistent spacing and typography
- [ ] Color coding for priorities
- [ ] Deadline urgency indicators
- [ ] Progress visualization charts
- [ ] Empty states with helpful text

#### Forms & Validation
- [ ] Form validation for all inputs
- [ ] Better error messages
- [ ] Success notifications
- [ ] Confirmation dialogs for destructive actions

#### Mobile Responsiveness
- [ ] Test all pages on mobile
- [ ] Optimize sidebar for mobile
- [ ] Touch-friendly interactions
- [ ] Mobile-specific layouts

---

### Phase 10: Advanced Features (Nice to Have) 🚀

#### Analytics & Insights
- [ ] Completion rate tracking
- [ ] Time to completion statistics
- [ ] Goal progress visualization
- [ ] Weekly/monthly reports
- [ ] Streaks and achievements

#### Customization
- [ ] Theme selection (light/dark mode)
- [ ] Custom color schemes
- [ ] Configurable week start day
- [ ] Notification preferences

#### Export & Sharing
- [ ] Export as Markdown
- [ ] PDF reports
- [ ] Share goals publicly
- [ ] Calendar integration (iCal export)

---

## Bug Fixes & Tech Debt 🐛

### High Priority
- [ ] Fix failing test in `task-form.test.tsx:275` (pre-existing issue)
- [ ] Fix Prisma seed script (needs updating for authentication/user relations)
- [ ] Add proper TypeScript types for all API responses
- [ ] Improve error handling in API routes
- [ ] Add request validation/sanitization

### Medium Priority
- [ ] Add error boundaries
- [ ] Add API rate limiting (if needed)

### Low Priority (Future)
- [ ] Security audit (XSS, CSRF, etc.)
- [ ] Performance optimization
- [ ] Bundle size optimization

---

## Documentation 📚

- [x] Testing documentation (TESTING.md) ✅
- [x] Project instructions (CLAUDE.md) ✅
- [x] README with setup instructions ✅
- [ ] API documentation
- [ ] Component documentation
- [ ] User guide / help section
- [ ] Deployment guide

---

## Test Status 🧪

**Current:** 183 of 184 tests passing (~8 seconds)
- ✅ 58 API tests (100% coverage)
- ✅ 92 component tests (93-100% coverage)
- ✅ 6 utility tests (100% coverage)
- ✅ 28 authentication tests (100% coverage)
- ⚠️ 1 failing test (pre-existing, unrelated to recent work)

See [TESTING.md](./TESTING.md) for comprehensive testing guide.

---

## Immediate Next Steps (Priority Order)

1. **Complete Phase 4: Authentication** 🎯
   - Add sign-out functionality
   - Add User model to Prisma with relations
   - Update API routes to enforce user scoping
   - Fix failing test in task-form.test.tsx

2. **Phase 5: Weekly Tasks**
   - Use TDD approach (write tests first)
   - Follow Tasks implementation pattern
   - Enforce 3 tasks per week per task

3. **Phase 6: Progress Entries**
   - Daily journaling with completion percentage
   - Use TDD approach

4. **Phase 7: Redesign Progress Page**
   - Focus on current week
   - Quick progress entry interface

5. **Phase 8: Weekly Review & Archive**
   - Weekly review workflow
   - Historical data access
