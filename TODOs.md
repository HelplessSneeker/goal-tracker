# TODOs - Goal Tracker Implementation Roadmap

This document tracks the implementation progress and remaining work for the goal tracking system.

**Last Updated:** 2025-10-27

---

## Current Status

**Branch:** `authentication`

**Architecture:** Server Actions + Service Layer (migrated from API routes)

**Test Status:** ✅ 228/228 tests passing (~7.4s, 100% service coverage)

**Completed:**
- Goals, Regions, Tasks (CRUD with Server Actions + Service Layer)
- PostgreSQL + Prisma ORM with UUID primary keys
- NextAuth.js authentication (email/magic link, JWT sessions)
- Comprehensive test coverage (actions, services, components)

**Next:** Weekly Tasks and Progress Entries implementation

---

## Overview

The system follows a 4-level hierarchy:
- **Goal** → **Region** → **Task** → **Weekly Task** → **Progress Entry**

---

## Completed Work ✅

**Phases 1-4 Complete** (Goals, Regions, Tasks, Database, Authentication)

- ✅ **CRUD Operations:** Goals, Regions, Tasks with full UI
- ✅ **Architecture:** Server Actions + Service Layer (migrated from API routes)
  - Actions: `app/actions/goals.ts`, `regions.ts`, `tasks.ts`
  - Services: `lib/services/goals.service.ts`, `regions.service.ts`, `tasks.service.ts`
- ✅ **Database:** PostgreSQL + Prisma ORM with UUID primary keys
- ✅ **Authentication:** NextAuth.js with email provider, JWT sessions, middleware protection
- ✅ **Testing:** 228/228 tests passing (actions, services, components, auth)
- ✅ **Components:** Forms, cards, dialogs for all entities
- ✅ **User Ownership:** Service layer verifies user ownership on all operations

**Remaining Auth Tasks:**
- [ ] Sign-out functionality
- [ ] User profile menu in UI
- [ ] User settings page

---

## Open Phases

### Phase 5: Weekly Tasks Implementation 📅
**Status:** Ready to start

#### Data Layer
- [ ] Add `WeeklyTask` model to Prisma schema
  - Fields: id, taskId, title, description, priority (1-3), weekStartDate, status, userId
- [ ] Create service layer: `lib/services/weekly-tasks.service.ts`
  - getWeeklyTasksForTask, getCurrentWeekTasks, createWeeklyTask, updateWeeklyTask, deleteWeeklyTask
- [ ] Create server actions: `app/actions/weekly-tasks.ts`
  - Handle FormData, auth checks, call service layer, revalidate paths

#### UI/Components
- [ ] WeeklyTaskForm component (enforce 3 tasks per week)
- [ ] WeeklyTaskCard component with priority indicator
- [ ] Add weekly tasks section to task detail page
- [ ] Week selector/navigation
- [ ] Visual distinction for different priorities

#### Testing (TDD Approach)
- [ ] Write service tests first (Prisma mocks)
- [ ] Write action tests first (FormData → Service)
- [ ] Write component tests first
- [ ] Implement features to pass tests

---

### Phase 6: Progress Entries (Daily Journaling) 📝

#### Data Layer
- [ ] Add `ProgressEntry` model to Prisma schema
  - Fields: id, weeklyTaskId, date, notes, completionPercentage (0-100), userId
- [ ] Create service layer: `lib/services/progress-entries.service.ts`
- [ ] Create server actions: `app/actions/progress-entries.ts`

#### UI/Components
- [ ] Progress entry form with notes and completion percentage
- [ ] Progress entries timeline for weekly tasks
- [ ] Visual progress indicator
- [ ] Daily entry reminders

#### Testing (TDD Approach)
- [ ] Write service tests first
- [ ] Write action tests first
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
- [ ] Add proper TypeScript types for all action responses
- [ ] Improve error handling in server actions
- [ ] Add input validation/sanitization for FormData

### Medium Priority
- [ ] Add error boundaries
- [ ] Optimize service layer queries (select only needed fields)

### Low Priority (Future)
- [ ] Security audit (XSS, CSRF, etc.)
- [ ] Performance optimization
- [ ] Bundle size optimization

---

## Documentation 📚

- [x] Testing documentation (TESTING.md) ✅
- [x] Project instructions (CLAUDE.md) ✅
- [x] README with setup instructions ✅
- [x] Architecture migration documented ✅
- [ ] Server Actions documentation
- [ ] Service Layer documentation
- [ ] Component documentation
- [ ] User guide / help section
- [ ] Deployment guide

---

## Test Status 🧪

**Current:** 228 of 228 tests passing (~7.4 seconds)
- ✅ 91 action tests (100% coverage)
- ✅ 53 service tests (100% coverage)
- ✅ 72 component tests (93-100% coverage)
- ✅ 12 authentication tests (100% coverage)

See [TESTING.md](./TESTING.md) for comprehensive testing guide.

---

## Immediate Next Steps (Priority Order)

1. **Complete Remaining Auth Features** 🎯
   - Add sign-out functionality
   - User profile menu in UI
   - User settings page

2. **Phase 5: Weekly Tasks** 🚀
   - Add Prisma schema model
   - Create service layer (TDD)
   - Create server actions (TDD)
   - Create UI components (TDD)
   - Enforce 3 tasks per week per task

3. **Phase 6: Progress Entries**
   - Add Prisma schema model
   - Create service layer + actions (TDD)
   - Daily journaling with completion percentage

4. **Phase 7: Redesign Progress Page**
   - Focus on current week
   - Quick progress entry interface

5. **Phase 8: Weekly Review & Archive**
   - Weekly review workflow
   - Historical data access
