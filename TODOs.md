# TODOs - Goal Tracker Implementation Roadmap

This document tracks the implementation progress and remaining work for the goal tracking system.

**Last Updated:** 2025-11-13

---

## Current Status

**Branch:** `main'

**Architecture:** Server Actions + Service Layer (migrated from API routes)

**Test Status:** ✅ 321/321 tests passing (~7.9s, 100% service coverage)

**Completed:**
- Goals, Regions, Tasks (CRUD with Server Actions + Service Layer)
- PostgreSQL + Prisma ORM with UUID primary keys
- NextAuth.js authentication (email/magic link, JWT sessions)
- User avatar sidebar with dropdown menu
- User Settings Page (complete - profile editing, language switching, theme selection saved)
- Dynamic language switching with cookie-based locale detection
- Name editing with JWT callback fix for persistence
- TypeScript error fixes and type safety improvements
- Comprehensive test coverage (actions, services, components)
- Database seeding with 4 test users and comprehensive data

**Next:** Weekly Tasks → Progress Entries

---

## Overview

The system follows a 4-level hierarchy:
- **Goal** → **Region** → **Task** → **Weekly Task** → **Progress Entry**

---

## Completed Work ✅

**Phases 1-4.6 Complete** (Goals, Regions, Tasks, Database, Authentication, UI, User Settings, Seeding)

- ✅ **CRUD Operations:** Goals, Regions, Tasks with full UI
- ✅ **Architecture:** Server Actions + Service Layer (migrated from API routes)
  - Actions: `app/actions/goals.ts`, `regions.ts`, `tasks.ts`, `user-preferences.ts`, `user.ts`
  - Services: `lib/services/goals.service.ts`, `regions.service.ts`, `tasks.service.ts`, `user-preferences.service.ts`, `user.service.ts`
- ✅ **Database:** PostgreSQL + Prisma ORM with UUID primary keys
  - Models: User, Goal, Region, Task, UserPreferences (with NextAuth adapter models)
- ✅ **Authentication:** NextAuth.js with email provider, JWT sessions, middleware protection
- ✅ **User Interface:** UserMenu component with avatar, dropdown menu, sign-out (2025-11-06)
  - Component: `components/user-menu/user-menu.tsx`
  - Integrated in sidebar footer with responsive behavior
  - i18n support (English + German)
  - 15 comprehensive tests with 100% coverage
- ✅ **User Settings Page:** Complete with all 4 phases (2025-11-11 to 2025-11-12)
  - Phase 1: UI structure with profile and preferences sections
  - Phase 2: Backend integration with database persistence
  - Phase 3: Name editing with auto-refresh and JWT callback fix
  - Phase 4: Dynamic language switching with cookie-based locale detection
  - Components: `UserProfileSection`, `UserPreferencesSection`
  - 31 comprehensive tests with full coverage
  - **Key Features:** Profile editing, language switching, theme preferences (saved)
- ✅ **Language Switching:** Dynamic i18n implementation (2025-11-12)
  - `lib/navigation.ts` with `useChangeLocale()` hook
  - Middleware integration for `NEXT_LOCALE` cookie detection
  - Header-based locale passing to next-intl
  - Seamless language switching with page reload
  - Locale persists across sessions via cookie
- ✅ **Database Seeding:** Comprehensive test data (2025-11-13)
  - 4 test users: Alice (power user), Bob (German), Charlie (new), Diana (empty)
  - Realistic sample data with varied scenarios
  - Task statuses: active, completed, overdue
  - German content for i18n testing
  - Edge cases and empty states
- ✅ **Theme Implementation:** Light/Dark/System mode with next-themes (2025-11-13)
  - ThemeProvider integration with database-backed preferences
  - Instant theme switching with `useThemeSync` hook
  - All components theme-ready with semantic Tailwind classes
  - Seamless persistence across sessions
- ✅ **Testing:** 321/321 tests passing (actions, services, components, auth)
- ✅ **Components:** Forms, cards, dialogs for all entities
- ✅ **User Ownership:** Service layer verifies user ownership on all operations
- ✅ **Type Safety:** ActionResponse types with proper error handling (2025-11-06)

**Auth & User Features:**
- [x] Sign-out functionality (in UserMenu dropdown)
- [x] User profile menu in UI (UserMenu component in sidebar)
- [x] User settings page with profile editing
- [x] Dynamic language switching (English/German)
- [x] Theme implementation (Light/Dark/System mode, instant switching)

---

## Open Phases

---

### Phase 4.6: Database Seeding Improvements 🌱 ✅ COMPLETED (2025-11-13)

Complete rewrite of `prisma/seed.ts` with comprehensive test data:

- [x] 4 test users created (Alice, Bob, Charlie, Diana)
- [x] Realistic goal/region/task data with helper functions
- [x] Various task statuses (active, completed, overdue/incomplete)
- [x] Different deadline ranges (past, present, future)
- [x] Empty states (Diana has no goals, some goals have no regions)
- [x] Edge cases (long titles, null descriptions, varied dates)
- [x] German content for i18n testing
- [x] Comprehensive statistics output after seeding

**Test Users:**
- Alice: Power user (7 goals, 14 regions, 33 tasks) - English, Light theme
- Bob: German user (3 goals, 5 regions, 8 tasks) - German, Dark theme
- Charlie: New user (1 goal, 1 region, 1 task, no name) - English, System theme
- Diana: Empty state (0 goals) - English, System theme

---

### Phase 4.7: Theme Implementation 🎨 ✅ COMPLETED (2025-11-13)

Implemented full Light/Dark/System theme switching with `next-themes`.

#### Requirements
- [x] Install next-themes package (v0.4.6)
- [x] Create ThemeProvider wrapper component (`components/theme-provider.tsx`)
- [x] Update Providers component to include ThemeProvider
- [x] Add suppressHydrationWarning to root layout
- [x] Fetch user preference from DB on initial load (server-side)
- [x] Pass theme as defaultTheme to ThemeProvider
- [x] Create useThemeSync hook for instant theme changes + DB sync
- [x] Update UserPreferencesSection to use useThemeSync
- [x] Add next-themes mock to jest.setup.ts
- [x] Test theme switching (all 321 tests passing)
- [x] Verify theme persists across sessions
- [x] Tailwind dark mode support (CSS variables already defined)

#### Files Created
- `components/theme-provider.tsx` - ThemeProvider wrapper
- `hooks/use-theme-sync.ts` - Hook for syncing theme to DB

#### Files Modified
- `app/providers.tsx`, `app/layout.tsx`, `jest.setup.ts`, `package.json`
- `components/user-settings/user-preferences-section/user-preferences-section.tsx`

#### Key Features
- Instant theme switching (no page reload required)
- Database-backed persistence across sessions
- System preference detection with `enableSystem={true}`
- All components theme-ready (semantic Tailwind classes)
- No hydration mismatch with `suppressHydrationWarning`

**Time Invested:** ~2.5 hours

---

### Phase 5: Weekly Tasks Implementation 📅
**Status:** Start after settings page and seeding

#### Data Layer
- [ ] Add `WeeklyTask` model to Prisma schema
  - Fields: id, taskId, title, description, priority (1-3), weekStartDate, status, userId
- [ ] Create service layer: `lib/services/weekly-tasks.service.ts`
  - getWeeklyTasksForTask, getCurrentWeekTasks, createWeeklyTask, updateWeeklyTask, deleteWeeklyTask
- [ ] Create server actions: `app/actions/weekly-tasks.ts`
  - Handle FormData, auth checks, call service layer, revalidate paths

#### UI/Components
- [ ] WeeklyTaskForm component (max 3 tasks per week)
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

### High Priority ✅ COMPLETED
- [x] **Add proper TypeScript types for all action responses** (2025-10-29)
  - Created `lib/action-types.ts` with `ActionResponse<T>`, `ActionError`, `ActionSuccess<T>`
  - Added error codes enum (`ActionErrorCode`) for structured error handling
  - All server actions now have explicit return types with proper type safety
  - Updated components to use new response structure: `{ success: true, data: T }` or `{ error, code }`
- [x] **Improve error handling in server actions** (2025-10-29)
  - Implemented structured error responses with error codes and field-specific validation errors
  - Added detailed error logging with action name prefixes for debugging
  - Differentiated error types: UNAUTHORIZED, VALIDATION_ERROR, NOT_FOUND, DATABASE_ERROR
- [x] **Add input validation/sanitization for FormData** (2025-10-29)
  - Integrated Zod 4.1.12 for schema-based validation with detailed error messages
  - Implemented custom sanitization (regex-based) for XSS protection without external deps
  - Created validation schemas for Goals, Regions, and Tasks in `lib/validation.ts`
  - Automatic sanitization of all text inputs to strip HTML tags and dangerous patterns
  - Updated `lib/types.ts` to accept both Date objects (server) and strings (after serialization)

### Fixed TypeScript & Linting Issues ✅
- [x] Fixed NextAuth session.user.id type errors (created `types/next-auth.d.ts`)
- [x] Fixed Jest mock types in test setup
- [x] Fixed optional parameter type issue in regions service
- [x] Updated ESLint config to ignore generated files and coverage reports
- [x] Removed unused imports and variables across codebase
- [x] Added ESLint exceptions for test files with documented reasons
- [x] **Standardized ActionResponse mock formats across all test files** (2025-11-06)
- [x] **Fixed Prisma mock typing with explicit type assertions** (2025-11-06)
- [x] **Reduced TypeScript errors from 77 to 9** (only auth-related remain) (2025-11-06)

### Medium Priority
- [ ] Add error boundaries
- [ ] Optimize service layer queries (select only needed fields)

### Low Priority (Future)
- [x] Security audit (XSS, CSRF, etc.) - XSS protection implemented via DOMPurify
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

**Current Status:** ✅ All tests passing, excellent coverage (2025-11-12)
- ✅ **TypeScript compilation:** Successful - No blocking errors
- ✅ **ESLint:** Passing - Minor warnings only (unused imports in test files)
- ✅ **Production build:** Successful - App compiles and runs (~3.8s)
- ✅ **Action tests:** 102 tests (100% coverage) - All passing
  - Includes 11 user preferences + 9 user action tests
- ✅ **Service tests:** 60 tests (100% coverage) - All passing
  - Includes 7 user preferences + 8 user service tests
- ✅ **Component tests:** 147 tests (93-100% coverage) - All passing
  - Includes 15 UserMenu + 31 UserSettings tests (profile + preferences)
- ✅ **Authentication tests:** 12 tests (100% coverage) - All passing

**Total:** 321/321 tests passing (~7.9s)

**Summary:** Application is production-ready with comprehensive test coverage, type-safe action responses, dynamic language switching, user settings complete, and proper error handling throughout.

See [TESTING.md](./TESTING.md) for comprehensive testing guide.

---

## Immediate Next Steps (Priority Order)

1. **Phase 4.7: Theme Implementation** 🎨 **← START HERE**
   - Install next-themes package
   - Create theme provider and wrap app
   - Apply light/dark mode styles to all components
   - Connect to saved user preference from DB
   - Test theme switching across all pages with seeded data
   - **Why next:** User requested, preference already saved, high visibility feature
   - **Estimated time:** 2-3 hours

3. **Phase 5: Weekly Tasks Implementation** 🚀
   - Add Prisma schema model
   - Create service layer (TDD)
   - Create server actions (TDD)
   - Create UI components (TDD)
   - Max 3 tasks per week per task
   - **Estimated time:** 4-6 hours

4. **Phase 6: Progress Entries**
   - Add Prisma schema model
   - Create service layer + actions (TDD)
   - Daily journaling with completion percentage
   - **Estimated time:** 3-4 hours

5. **Phase 7: Redesign Progress Page**
   - Focus on current week
   - Quick progress entry interface
   - **Estimated time:** 2-3 hours

6. **Phase 8: Weekly Review & Archive**
   - Weekly review workflow
   - Historical data access
   - **Estimated time:** 3-4 hours
