# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Next.js 15 goal-tracking application using App Router, React 19, TypeScript, Tailwind CSS v4, Prisma, and PostgreSQL.

**Package manager:** pnpm
**Dev server:** http://localhost:3000

### Goal Management Hierarchy

1. **Goal** (no deadline) → High-level objectives
2. **Region** (no deadline) → Specific areas within a goal
3. **Task** (has deadline) → Concrete tasks with urgency
4. **Weekly Task** (3 per task/week, priority 1-3) → Weekly action items
5. **Progress Entry** (daily) → Daily progress notes with completion %

**Implementation Status:**
- ✅ Goals, Regions, Tasks (CRUD + Server Actions + Service Layer + full test coverage)
- ✅ Database (Prisma + PostgreSQL with UUID primary keys)
- ✅ Authentication (NextAuth.js with email/magic link, JWT sessions)
- ✅ User Interface (User avatar sidebar with dropdown menu)
- ✅ Internationalization (next-intl with English & German, dynamic language switching via cookies)
- ✅ Testing (Jest + React Testing Library - 424/424 tests passing, 100% service coverage)
- ✅ User Settings Page (Complete - profile editing, language switching, theme selection saved to DB)
- ✅ Database Seeding (4 test users with comprehensive data: Alice, Bob, Charlie, Diana)
- ✅ Theme Implementation (Light/Dark/System mode with next-themes, instant switching, persisted to DB)
- ✅ Weekly Tasks (Complete - CRUD + Server Actions + Service Layer + UI + Pages + full test coverage)
- ⏳ Progress Entries (TODO - use TDD)

**Architecture:** Migrated from API routes to **Server Actions + Service Layer** for improved type safety and performance.

See [TODOs.md](./TODOs.md) for roadmap, [BEST_PRACTICES.md](./BEST_PRACTICES.md) for coding standards, and [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues. Use `/tdd` skill for TDD workflow and testing patterns.

## Development Commands

```bash
pnpm install         # Install dependencies
pnpm dev             # Development server (Turbopack)
pnpm build           # Production build
pnpm test            # Run tests
pnpm test:watch      # Watch mode
pnpm test:coverage   # Coverage report
pnpm lint            # ESLint

# Database (Prisma)
pnpm prisma generate    # Generate client
pnpm prisma db push     # Push schema changes
pnpm prisma db seed     # Seed database
pnpm prisma studio      # Database GUI
```

## Testing Strategy (TDD)

**⚠️ IMPORTANT: Follow Test-Driven Development for all new features.**

**Current Status:** 424/424 tests passing (~6s)
- ✅ 129 action tests (85%+ coverage, includes 11 user preferences + 9 user + 27 weekly tasks action tests)
- ✅ 75 service tests (100% coverage, includes 7 user preferences + 8 user + 15 weekly tasks service tests)
- ✅ 208 component tests (93-100% coverage, includes 15 UserMenu + 31 UserSettings + 61 weekly tasks UI tests)
- ✅ 12 authentication tests (100% coverage)

**TDD Workflow:**
1. 🔴 **RED**: Write failing test first
2. 🟢 **GREEN**: Write minimal code to pass
3. ♻️ **REFACTOR**: Improve code while tests stay green

**Test Organization:**
- Action tests: `app/actions/*.test.ts` (test FormData → Service flow)
- Service tests: `lib/services/*.service.test.ts` (test business logic + Prisma)
- Component tests: `components/**/[component-name]/[component-name].test.tsx`
- Use Prisma + NextAuth mocks (configured in `jest.setup.ts`)
- Components use global Next.js and server action mocks

**Component Structure:**
```
components/
├── goals/
│   ├── index.ts                  # Export all goal components
│   ├── goal-form/
│   │   ├── goal-form.tsx
│   │   └── goal-form.test.tsx
│   └── ...
```

**Import Patterns:**
```typescript
// Components: Always import from feature index
// ✅ Good
import { TaskForm, TaskCard } from "@/components/tasks";

// ❌ Bad
import { TaskForm } from "@/components/tasks/task-form/task-form";

// Server Actions: Import directly from actions
import { createGoal, updateGoal } from "@/app/actions/goals";
```

See [TESTING.md](./TESTING.md) for detailed patterns and examples.

## Architecture

### Tech Stack
- **Framework:** Next.js 15 with App Router
- **Database:** PostgreSQL + Prisma ORM (UUID primary keys)
- **Authentication:** NextAuth.js with email provider (JWT sessions)
- **i18n:** next-intl v4.4.0 (English, German)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Testing:** Jest + React Testing Library
- **Icons:** Lucide React

### Key Patterns
- **Server Components** (default): Data fetching via services, static UI
- **Client Components** (`"use client"`): Forms, dialogs, interactivity
- Server Components call service layer directly for data
- Client Components call Server Actions for mutations
- Server Actions → Service Layer → Prisma for all data operations
- Path alias: `@/*` for root directory

### Authentication
- **NextAuth.js** with email provider (magic links)
- **Config:** `lib/auth.ts` (centralized)
- **Session:** JWT strategy
- **Middleware:** `middleware.ts` protects routes
- **Pages:** `/auth/signin`, `/auth/verify-request`
- **Adapter:** Prisma adapter for NextAuth

### Server Actions & Service Layer

**Data Flow:** `Client Component → Server Action → Service Layer → Prisma → Database`

**Server Actions** (`app/actions/`):
- `goals.ts` - Create, read, update, delete goals
- `regions.ts` - Create, read, update, delete regions
- `tasks.ts` - Create, read, update, delete tasks
- `weekly-tasks.ts` - Create, read, update, delete weekly tasks (with optional weekStartDate filter)
- `user-preferences.ts` - Get and update user preferences
- `user.ts` - Get user data and update user name

Actions handle:
- FormData validation from client components
- Authentication (NextAuth session)
- Calling service layer with typed inputs
- Cache revalidation (`revalidatePath`)
- Error handling and response formatting

**Service Layer** (`lib/services/`):
- `goals.service.ts` - Business logic + Prisma queries for goals
- `regions.service.ts` - Business logic + Prisma queries for regions
- `tasks.service.ts` - Business logic + Prisma queries for tasks
- `weekly-tasks.service.ts` - Business logic + Prisma queries for weekly tasks (with ownership verification through task chain)
- `user-preferences.service.ts` - User preferences with auto-creation defaults
- `user.service.ts` - User data retrieval and name updates

Services handle:
- Direct Prisma database operations
- User ownership verification (including through relationship chains for nested entities)
- Input/output type safety
- Null returns for unauthorized access

### Action Response Types

**Type-safe response structure** defined in `lib/action-types.ts`:

```typescript
// Success response
export interface ActionSuccess<T> {
  success: true;
  data: T;
}

// Error response
export interface ActionError {
  error: string;
  code: ActionErrorCode;
  validationErrors?: ValidationError[];
}

export enum ActionErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  DATABASE_ERROR = "DATABASE_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export type ActionResponse<T> = ActionSuccess<T> | ActionError;
```

**Usage in Actions:**
```typescript
// Success
return { success: true, data: goal };

// Error
return { error: "Failed to create goal", code: ActionErrorCode.DATABASE_ERROR };
```

**Testing Pattern:**
```typescript
// Mock success response
mockAction.mockResolvedValue({
  success: true,
  data: { id: "123", title: "Test" }
});

// Mock error response
import { ActionErrorCode } from "@/lib/action-types";
mockAction.mockResolvedValue({
  error: "Failed",
  code: ActionErrorCode.DATABASE_ERROR
});
```

### Database Seeding

**Status:** ✅ Comprehensive test data (2025-11-13)

The database seeder (`prisma/seed.ts`) creates realistic test data for development and testing.

**Test Users (4):**
- **Alice** (alice@example.com) - Power user: 7 goals, English, Light theme
- **Bob** (bob@example.com) - German user: 3 goals, German, Dark theme  
- **Charlie** (charlie@example.com) - New user: 1 goal, no name, English, System theme
- **Diana** (diana@example.com) - Empty state: 0 goals, English, System theme

**Run Seeding:**
```bash
pnpm prisma db seed
```

**Features:** Varied task statuses (active/completed/overdue), realistic deadlines, German content for i18n testing, edge cases (long titles, null descriptions), empty states.

### Database Models (Prisma)

**Current:**
- `User`: id, email, name, image (NextAuth adapter models)
- `Goal`: id, title, description, userId, createdAt, updatedAt
- `Region`: id, goalId, title, description, createdAt, updatedAt (userId via Goal)
- `Task`: id, regionId, title, description, deadline, status, createdAt, updatedAt (userId via Region→Goal)
- `WeeklyTask`: id, taskId, title, description, priority (1-3), weekStartDate, status, createdAt, updatedAt (userId via Task→Region→Goal)
- `UserPreferences`: id, userId, language, theme, createdAt, updatedAt (auto-created on first access)

**TODO:**
- `ProgressEntry`: id, weeklyTaskId, date, notes, completionPercentage (0-100)

### User Settings Features

**Status:** ✅ Phase 1-4 Complete (Profile, Preferences, Name Editing, Language Switching)

#### User Preferences (Phase 1 & 2) ✅
**Service Layer:**
- `getUserPreferences(userId)` - Auto-creates defaults if not exist
- `updateUserPreferences(userId, data)` - Updates with ownership verification

**Server Actions:**
- `getUserPreferencesAction()` - Authenticated read
- `updateUserPreferencesAction(formData)` - Validated update

**UI Features:**
- Language selector (English/German) - saves to DB, switches UI on reload
- Theme selector (Light/Dark/System) - saves to DB (not yet applied to UI)
- Optimistic UI updates
- Loading states
- Error handling

**Test Coverage:** 100% service, 100% actions

#### Name Editing (Phase 3) ✅
**Service Layer:**
- `getUserById(userId)` - Get user data
- `updateUserName(userId, name)` - Update with null support

**Server Actions:**
- `updateUserNameAction(formData)` - Auth + validation

**UI Features:**
- Edit/Save/Cancel buttons
- Input field with validation (max 100 chars)
- Success message with auto-refresh
- Error handling
- XSS sanitization
- Can clear name (sets to null)

**Test Coverage:** 100% service, 100% actions, 100% component

**Key Feature:** Automatically reloads page after save to refresh NextAuth session

#### Language Switching (Phase 4) ✅
**Implementation:** Cookie-based locale detection with middleware integration
- `useChangeLocale()` hook sets `NEXT_LOCALE` cookie and triggers page reload
- Middleware reads cookie and passes locale to i18n via headers
- Full integration with next-intl framework
- Language switches persist across sessions

## Internationalization (i18n)

**Status:** ✅ next-intl v4.4.0 with dynamic language switching | **Languages:** English (en), German (de) | **Date Format:** dd.MM.yyyy

**Files:**
- Config: `lib/i18n.ts`, `middleware.ts`, `next.config.ts`
- Translations: `messages/en.json`, `messages/de.json`
- Date utility: `formatDate()` in `lib/utils.ts`
- Navigation: `lib/navigation.ts` (useChangeLocale hook)

**Usage:**
```typescript
// Client components
import { useTranslations } from "next-intl";
const t = useTranslations("goals");

// Server components
import { getTranslations } from "next-intl/server";
const t = await getTranslations("goals");

// Date formatting
import { formatDate } from "@/lib/utils";
formatDate(task.deadline); // "01.12.2025"

// Language switching
import { useChangeLocale } from "@/lib/navigation";
const changeLocale = useChangeLocale();
changeLocale("de"); // Switches to German and reloads page
```

**How it works:**
1. User selects language in settings
2. Preference saved to database
3. `NEXT_LOCALE` cookie set via `useChangeLocale()` hook
4. Page reloads
5. Middleware reads cookie and passes locale to i18n via header
6. All translations switch to selected language

**Adding translations:** Add keys to both `messages/en.json` and `messages/de.json`, then update `jest.setup.ts` mocks.

## Development Workflow

### Implementing New Features
1. 🔴 **Write tests first** (action + service + component tests)
2. 🟢 **Implement feature**:
   - Add Prisma schema if needed
   - Create service layer functions
   - Create server actions
   - Update components to use actions
3. ♻️ **Refactor** while keeping tests green
4. Run `pnpm test` to verify no regressions
5. Run `pnpm lint` before committing

### Adding New Components
1. Create folder: `components/[feature]/[component-name]/`
2. Add `[component-name].tsx` and `[component-name].test.tsx`
3. Export from feature's `index.ts`
4. Import from feature index in other files

## Path Aliases

Configured in `tsconfig.json`:
- `@/*` - Root directory
- `@/components`, `@/lib`, `@/app`, `@/hooks`

## Code Style

- ESLint: Next.js TypeScript presets
- TypeScript strict mode enabled
- Use `cn()` utility from `@/lib/utils` for className merging

---

## Recent Completions

### Weekly Tasks Implementation - Complete ✅ (2025-11-17)

Fully implemented weekly tasks feature using TDD methodology across all layers.

**What Was Implemented:**

**Database Layer:**
- Added `WeeklyTask` model to Prisma schema with:
  - UUID primary key
  - Foreign key to Task (with cascade delete)
  - Fields: title, description, priority (1-3), weekStartDate, status
  - Enum: WeeklyTaskStatus (pending, in_progress, completed)
  - Indexes on taskId and weekStartDate for query performance
- Ran `pnpm prisma generate && pnpm prisma db push`

**Service Layer (100% coverage):**
- `lib/services/weekly-tasks.service.ts` - 5 functions implemented with TDD:
  - `getWeeklyTasksForTask(taskId, userId, weekStartDate?)` - List with optional week filter
  - `getWeeklyTaskById(id, userId)` - Single task retrieval with ownership check
  - `createWeeklyTask(data)` - Create with task ownership verification
  - `updateWeeklyTask(id, userId, data)` - Update with ownership check
  - `deleteWeeklyTask(id, userId)` - Delete with ownership verification
- Ownership verification through relationship chain: WeeklyTask → Task → Region → Goal → User
- All 15 service tests passing

**Server Actions (85%+ coverage):**
- `app/actions/weekly-tasks.ts` - 5 actions implemented with TDD:
  - `createWeeklyTaskAction(formData)` - Validates priority (1-3), status, weekStartDate
  - `updateWeeklyTaskAction(formData)` - Updates with validation
  - `deleteWeeklyTaskAction(formData)` - Simple ID-based deletion
  - `getWeeklyTasksAction(taskId, weekStartDate?)` - Fetch with optional week filter
  - `getWeeklyTaskAction(id)` - Single task retrieval
- All actions use NextAuth session verification
- FormData validation with Zod schemas
- Cache revalidation on mutations (`revalidatePath`)
- All 27 action tests passing

**Validation Schemas:**
- `lib/validation.ts` - Added weeklyTaskSchemas:
  - `createWeeklyTaskSchema` - Validates title, description, priority, weekStartDate, status, taskId
  - `updateWeeklyTaskSchema` - Validates id + update fields
  - `deleteWeeklyTaskSchema` - Simple id validation
  - Priority validation enforces 1-3 range
  - Date coercion for weekStartDate

**Type Definitions:**
- `lib/types.ts` - Added WeeklyTask type:
  - Supports both Prisma Date objects and ISO string dates
  - Compatible with JSON serialization for server components

**Components (98-100% coverage):**
- `WeeklyTaskCard` component:
  - Displays weekly task with priority badge (color-coded 1-3: red/yellow/blue)
  - Shows status with i18n translation (pending/in_progress/completed)
  - Edit/Delete action buttons
  - Full i18n support
  - 9 component tests passing

- `DeleteWeeklyTaskDialog` component:
  - Confirmation dialog requiring exact title match
  - Loading states during deletion
  - Error handling with error messages
  - Router refresh after successful deletion
  - 10 component tests passing

- `WeekSelector` component:
  - Week navigation (Previous/This Week/Next)
  - Displays week range with proper date formatting
  - Normalizes any date to Sunday (week start)
  - Utility function: `getWeekStart(date)` - Returns Sunday at midnight UTC
  - 11 component tests passing (after fixing date calculations)

**Internationalization:**
- Added 24 new i18n keys to `messages/en.json` and `messages/de.json`:
  - `weeklyTasks.*` - Form labels, buttons, status labels
  - `weeklyTasks.status.*` - Status translations (pending, in_progress, completed)
  - `weeklyTasks.priorityLevel.*` - Priority labels (High/Medium/Low)
  - `delete.weeklyTask.*` - Delete dialog translations

**Bug Fix - Test Date Calculations:**
- Fixed 6 failing tests in `week-selector.test.tsx`
- Issue: Tests assumed Nov 10, 2025 was Sunday (actually Monday)
- Solution: Changed mock dates to Nov 9, 2025 (actual Sunday)
- Updated all date expectations in tests to match correct week boundaries

**Test Results:**
- Started with: 387/393 tests passing (6 failures in WeekSelector)
- After fixes: **393/393 tests passing** ✅
- Test execution time: ~10s
- Coverage: 85%+ actions, 100% services, 98%+ components

**Files Created:**
- `lib/services/weekly-tasks.service.ts` + `.test.ts`
- `app/actions/weekly-tasks.ts` + `.test.ts`
- `components/weekly-tasks/weekly-task-card/` (component + tests)
- `components/weekly-tasks/delete-weekly-task-dialog/` (component + tests)
- `components/weekly-tasks/week-selector/` (component + tests)
- `components/weekly-tasks/index.ts` (exports)

**Files Modified:**
- `prisma/schema.prisma` - Added WeeklyTask model
- `lib/validation.ts` - Added weeklyTaskSchemas
- `lib/types.ts` - Added WeeklyTask type
- `messages/en.json` - Added 24 weekly task keys
- `messages/de.json` - Added 24 weekly task keys (German translations)

**Key Features:**
- Week-based organization (tasks grouped by Sunday week start)
- Priority system (1-3: High/Medium/Low with visual indicators)
- Status tracking (pending/in_progress/completed)
- Ownership verification through 3-level relationship chain
- Full CRUD operations with proper error handling
- Optimistic UI updates in components
- Comprehensive i18n support

**Architecture Pattern:**
Following established pattern: Client Component → Server Action → Service Layer → Prisma → Database

**Next Steps:**
- UI integration for weekly tasks in task detail pages (display + forms)
- Progress Entries implementation (next feature in hierarchy)

### Theme Implementation - Complete ✅ (2025-11-13)

Implemented full Light/Dark/System theme switching with `next-themes` package.

**What Was Implemented:**
- Installed `next-themes@0.4.6` package
- Created `ThemeProvider` wrapper component (`components/theme-provider.tsx`)
- Updated `Providers` component to include ThemeProvider with user's saved preference
- Added `suppressHydrationWarning` to root layout's `<html>` tag (prevents hydration mismatch)
- Fetches user's theme preference from database in root layout (server-side)
- Passes theme as `defaultTheme` prop to ThemeProvider
- Created `useThemeSync` hook (`hooks/use-theme-sync.ts`) to sync theme changes to both next-themes AND database
- Updated `UserPreferencesSection` to trigger immediate theme changes via `useThemeSync`
- Added next-themes mock to `jest.setup.ts` for testing
- All 321 tests still passing

**How It Works:**
1. User's saved theme preference is fetched from database on page load (root layout)
2. Theme is passed to ThemeProvider as initial value
3. ThemeProvider applies the correct CSS class to the `<html>` element
4. When user changes theme in settings:
   - `useThemeSync` updates next-themes immediately (instant UI change)
   - Theme preference is saved to database (persists across sessions)
   - Router refreshes to ensure server components see updated preference

**Files Created:**
- `components/theme-provider.tsx` - ThemeProvider wrapper
- `hooks/use-theme-sync.ts` - Hook for syncing theme to DB

**Files Modified:**
- `app/providers.tsx` - Added ThemeProvider integration
- `app/layout.tsx` - Added theme fetching and suppressHydrationWarning
- `components/user-settings/user-preferences-section/user-preferences-section.tsx` - Integrated useThemeSync
- `jest.setup.ts` - Added next-themes mock
- `package.json` - Added next-themes dependency

**Testing:**
- All existing semantic Tailwind classes (bg-background, text-foreground, etc.) automatically work with themes
- CSS variables for light and dark modes already defined in `globals.css`
- Test with seeded users: Alice (light), Bob (dark), Charlie/Diana (system)
- Dev server: `pnpm dev` → http://localhost:3000

**Key Technical Details:**
- Uses `attribute="class"` mode (adds `.dark` class to html element)
- `enableSystem={true}` for system preference detection
- `disableTransitionOnChange` prevents flash during theme switch
- No hardcoded colors in components - all use semantic Tailwind classes

### Database Seeding Improvements ✅ (2025-11-13)

Complete rewrite of `prisma/seed.ts` with 4 test users and comprehensive sample data:

**Test Users:**
- Alice (power user): 7 goals, 14 regions, 33 tasks
- Bob (German): 3 goals, 5 regions, 8 tasks  
- Charlie (new user): 1 goal, 1 region, 1 task
- Diana (empty state): 0 goals

**Features:** Realistic dates, varied task statuses, German i18n content, edge cases, empty states for thorough UI testing.

### User Settings Page - Complete ✅ (2025-11-11 to 2025-11-12)

**Phase 1:** UI Structure
- Implemented UserProfileSection component (avatar, name, email display)
- Implemented UserPreferencesSection component (read-only selectors)
- Added Select component from shadcn/ui
- Complete i18n support (17 new keys in EN + DE)
- Full test coverage (20 new tests: 11 profile + 9 preferences)
- 280/280 tests passing

**Phase 2:** Backend & Interactivity
- Added UserPreferences model to Prisma schema
- Implemented service layer with TDD (7 tests, 100% coverage)
- Implemented server actions with TDD (11 tests, 93.75% coverage)
- Made UI fully interactive with optimistic updates
- Updated settings page to fetch real preferences
- 297/297 tests passing

**Key Features Delivered:**
- User preferences persist across sessions
- Language & theme selection fully functional
- Optimistic UI updates with error recovery
- Auto-creates default preferences on first visit
- 100% test coverage for business logic

**Phase 3:** Name editing with JWT callback fix
**Phase 4:** Language switching with cookie-based locale detection

### TypeScript Error Fixes ✅ (2025-11-06)
- Standardized ActionResponse formats across all test files
- Fixed Prisma mock typing with explicit type assertions
- Reduced TypeScript errors from 77 to 9 (only auth-related remain)
- All 260 tests passing with improved type safety

### User Avatar Sidebar ✅ (2025-11-06)
- Implemented UserMenu component with avatar and dropdown
- Integrated with NextAuth for authentication
- Added i18n support (English + German)
- Full test coverage (15 new tests)
- Responsive behavior in sidebar footer

**Archive:** See `dev/completed/ARCHIVE_INDEX.md` for detailed phase documentation

---

## Immediate Next Steps

1. **Weekly Tasks UI Integration** ← **START HERE**
   - Create WeeklyTaskForm component (create/edit modes)
   - Integrate WeekSelector, WeeklyTaskCard, DeleteWeeklyTaskDialog into task detail pages
   - Add "Add Weekly Task" button and form dialog
   - Display weekly tasks list filtered by selected week
   - Add empty states for weeks with no tasks
   - Optional: Add warning when 3+ tasks exist for a week
   - **Estimated time:** 2-3 hours

2. **Progress Entries Implementation**
   - Add ProgressEntry Prisma model for daily journaling
   - Implement service layer + actions (TDD)
   - Create components for daily progress tracking
   - Daily progress UI with completion percentage (0-100)
   - **Estimated time:** 4-5 hours
