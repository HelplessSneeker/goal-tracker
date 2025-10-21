# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 goal-tracking application using the App Router, React 19, TypeScript, and Tailwind CSS v4. The project uses pnpm as the package manager and Turbopack for faster builds.

### Goal Management System

This application implements a hierarchical goal management system designed to help users break down and track progress toward their goals:

**Hierarchy:**
1. **Goal** (no deadline) - High-level objectives (e.g., "Learn Next.js")
2. **Region** (no deadline) - Specific areas within a goal to work on (e.g., "Master Server Components")
3. **Task** (has deadline) - Concrete tasks with urgency created by deadlines (e.g., "Build 3 projects using Server Components" - due end of month)
4. **Weekly Task** (belongs to a Task, 3 per task per week, priority 1-3) - Weekly action items reviewed and recreated each week (e.g., "Read Server Components documentation")
5. **Progress Entry** (daily journal for Weekly Tasks) - Daily progress notes with completion percentage

**Key Workflows:**
- Goals and Regions have no deadlines (long-term focus areas)
- Tasks always have deadlines to create urgency
- Each Task gets 3 Weekly Tasks per week with priorities 1-3
- Weekly Tasks are reviewed and recreated each week
- Progress is tracked daily on Weekly Tasks via journal entries with completion percentages
- Old weeks are archived but accessible for historical review
- The Progress page focuses on the current week's tasks

**Implementation Status:**
- ✅ Goals (CRUD complete with full test coverage - filtering/search pending)
- ✅ Regions (CRUD complete with full test coverage - filtering/search pending)
- ✅ Tasks (CRUD complete with full test coverage, deadline tracking, status badges)
- ✅ Database (Prisma + PostgreSQL with UUID primary keys)
- ✅ Testing infrastructure (Jest + React Testing Library - 156 tests passing in ~7.9s)
  - ✅ 100% API coverage for Goals, Regions, and Tasks
  - ✅ 93-100% component coverage for Goals, Regions, and Tasks
  - ✅ Comprehensive TESTING.md documentation
- ⏳ Weekly Tasks (TODO - next priority, **use TDD approach**)
- ⏳ Progress Entries (TODO - use TDD approach)
- ⏳ Weekly review workflow (TODO)
- ⏳ Archive system (TODO)

See [TODOs.md](./TODOs.md) for detailed implementation roadmap and [TESTING.md](./TESTING.md) for comprehensive testing guide.

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server with Turbopack
pnpm dev

# Build for production with Turbopack
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Database commands (Prisma)
pnpm prisma generate         # Generate Prisma client
pnpm prisma db push          # Push schema changes to database
pnpm prisma db seed          # Seed database with initial data
pnpm prisma studio           # Open Prisma Studio (database GUI)
```

The development server runs at http://localhost:3000.

## Testing Strategy

**⚠️ IMPORTANT: We follow Test-Driven Development (TDD) for all new features.**

### Current Test Coverage
- ✅ **156 tests passing** (58 API + 92 component + 6 utility)
- ✅ **100% API coverage** for Goals, Regions, and Tasks CRUD
- ✅ **High component coverage** (93-100%) for all implemented features

### Testing Stack
- **Jest** with Next.js 15 built-in support (`next/jest`)
- **React Testing Library** for component testing
- **Prisma mocks** configured in `jest.setup.ts` for API tests
- **Coverage provider**: v8 (faster than babel)
- **Test environment**: jsdom for components, node for API routes

### Current Test Results
```
Test Suites: 19 passed, 19 total
Tests:       156 passed, 156 total
Time:        ~7.9 seconds
```

### TDD Workflow (Red-Green-Refactor)
For all new features, follow this cycle:
1. **🔴 RED**: Write a failing test first
2. **🟢 GREEN**: Write minimal code to make it pass
3. **♻️ REFACTOR**: Improve code while keeping tests green

### Test File Locations & Organization
- API tests: `app/api/**/*.test.ts` (co-located with routes)
- Component tests: `components/**/[component-name]/[component-name].test.tsx` (co-located with component)
- Utility tests: `lib/**/*.test.ts` (co-located with utilities)

**Component Structure:** Each component lives in its own folder with its test, and each feature folder has an `index.ts` for centralized exports:
```
components/
├── goals/
│   ├── index.ts                  # Exports all goal components
│   ├── goal-form/
│   │   ├── goal-form.tsx
│   │   └── goal-form.test.tsx
│   ├── goal-card/
│   │   ├── goal-card.tsx
│   │   └── goal-card.test.tsx
│   └── ...
├── regions/
│   ├── index.ts                  # Exports all region components
│   ├── region-form/
│   │   ├── region-form.tsx
│   │   └── region-form.test.tsx
│   └── ...
└── tasks/
    ├── index.ts                  # Exports all task components
    ├── task-form/
    │   ├── task-form.tsx
    │   └── task-form.test.tsx
    ├── task-card/
    │   ├── task-card.tsx
    │   └── task-card.test.tsx
    └── ...
```

**Import Pattern:** Always import components from the feature folder's index, not directly from component folders:
```typescript
// ✅ Good - import from index
import { TaskForm, TaskCard, DeleteTaskDialog } from "@/components/tasks";
import { RegionForm, RegionCard } from "@/components/regions";

// ❌ Bad - direct import from component folder
import { TaskForm } from "@/components/tasks/task-form/task-form";
```

**Adding New Components:** When creating a new component in a feature folder:
1. Create the component in its own folder (e.g., `components/tasks/new-component/`)
2. Add the component and its test file
3. Export it in the feature's `index.ts` file
4. Always import from the feature folder index in other files

### Key Testing Patterns
- API tests use `/** @jest-environment node */` docblock and mocked Prisma client
- Prisma mock configured globally in `jest.setup.ts` with all CRUD methods
- Component tests import global mocks from `jest.setup.ts`
- All tests use Arrange-Act-Assert pattern
- Mock `fetch` for API calls, mock router for navigation
- API tests verify Prisma method calls with correct parameters

### Test Coverage Goals
- **API routes**: 100% coverage (required) ✅
- **Components**: 80%+ coverage ✅
- **Utilities**: 90%+ coverage ✅

See [TESTING.md](./TESTING.md) for comprehensive testing guide, examples, and best practices.

## Architecture

### Framework & Routing
- **Next.js 15** with App Router (`app/` directory)
- Server Components by default (RSC enabled)
- Pages:
  - `app/page.tsx` - Home
  - `app/progress/page.tsx` - Progress tracking
  - `app/goals/page.tsx` - Goals list (Server Component)
  - `app/goals/create/page.tsx` - Create goal (Client Component)
  - `app/goals/[id]/page.tsx` - Goal detail (Server Component)
  - `app/goals/[id]/edit/page.tsx` - Edit goal (Client Component)
  - `app/goals/[id]/addRegion/page.tsx` - Create region (Client Component)
  - `app/goals/[id]/[regionId]/page.tsx` - Region detail (Server Component)
  - `app/goals/[id]/[regionId]/edit/page.tsx` - Edit region (Client Component)
  - `app/goals/[id]/[regionId]/addTask/page.tsx` - Create task (Client Component)
  - `app/goals/[id]/[regionId]/tasks/[taskId]/page.tsx` - Task detail (Server Component)
  - `app/goals/[id]/[regionId]/tasks/[taskId]/edit/page.tsx` - Edit task (Client Component)
- Layout in `app/layout.tsx`
- Loading states: `loading.tsx` files for Suspense boundaries

### Styling
- **Tailwind CSS v4** with PostCSS
- CSS variables enabled for theming
- Global styles in `app/globals.css`
- Uses `tw-animate-css` for animations

### UI Components
- **shadcn/ui** components (New York style variant)
- Components stored in `components/ui/`
- Configuration in `components.json`
- Uses Lucide icons (`lucide-react`)
- Utility function `cn()` in `lib/utils.ts` combines `clsx` and `tailwind-merge`
- Custom components organized by feature (each in its own folder with test):
  - `components/app-sidebar.tsx` - Main navigation sidebar
  - `components/goals/` - Goal-related components
    - `goal-card/` - Clickable card for navigation to goal detail
    - `goal-detail-header/` - Goal detail page header with edit/delete actions
    - `goal-form/` - Reusable form for create/edit (handles both modes)
    - `delete-goal-dialog/` - Confirmation dialog for goal deletion
  - `components/regions/` - Region-related components
    - `region-card/` - Clickable card for navigation to region detail
    - `region-detail-header/` - Region detail page header with edit/delete actions
    - `region-form/` - Reusable form for create/edit (handles both modes)
    - `delete-region-dialog/` - Confirmation dialog requiring region name to be typed
  - `components/tasks/` - Task-related components
    - `task-card/` - Clickable card for navigation to task detail (shows deadline, status badge)
    - `task-detail-header/` - Task detail page header with edit/delete actions
    - `task-form/` - Reusable form for create/edit with date picker (handles both modes)
    - `delete-task-dialog/` - Confirmation dialog with cascade warning

### Path Aliases
Configured in `tsconfig.json`:
- `@/*` - Root directory (e.g., `@/components`, `@/lib`)
- Shadcn aliases: `@/components/ui`, `@/lib/utils`, `@/hooks`

### Hooks
Custom React hooks in `hooks/`:
- `use-mobile.ts` - Responsive design hook for mobile detection

### Fonts
Uses Next.js font optimization with Geist and Geist Mono fonts from Google Fonts.

## Data Architecture

### Database
- **Prisma ORM** with PostgreSQL
- **Schema**: `prisma/schema.prisma`
- **Client**: Generated to `generated/prisma/`
- **UUID primary keys** for all entities (Goals, Regions, Tasks)
- **Seed file**: `prisma/seed.ts` for development data

### Entity Relationships

```
Goal (1) ──> Region (n) ──> Task (n) ──> Weekly Task (n, 3 per week) ──> Progress Entry (n, daily)
```

- A **Goal** can have many **Regions**
- A **Region** can have many **Tasks** (Tasks belong to Regions)
- A **Task** can have many **Weekly Tasks** (3 per week, with priority 1-3)
- A **Weekly Task** can have many **Progress Entries** (daily journal entries)

### API Routes

All API routes use Prisma client imported from `@/lib/prisma` for database operations.

**Goals:** ✅ Complete (100% test coverage)
- `GET /api/goals` - List all goals ✅
- `POST /api/goals` - Create a goal ✅
- `GET /api/goals/[id]` - Get specific goal ✅
- `PUT /api/goals/[id]` - Update goal ✅
- `DELETE /api/goals/[id]` - Delete goal ✅

**Regions:** ✅ Complete (100% test coverage)
- `GET /api/regions?goalId={id}` - List regions (optional filter by goalId) ✅
- `POST /api/regions` - Create a region ✅
- `GET /api/regions/[id]` - Get specific region ✅
- `PUT /api/regions/[id]` - Update region ✅
- `DELETE /api/regions/[id]` - Delete region ✅

**Tasks:** ✅ Complete (100% test coverage)
- `GET /api/tasks?regionId={id}` - List tasks (optional filter by regionId) ✅
- `POST /api/tasks` - Create a task ✅
- `GET /api/tasks/[id]` - Get specific task ✅
- `PUT /api/tasks/[id]` - Update task ✅
- `DELETE /api/tasks/[id]` - Delete task ✅

**Weekly Tasks:** ⏳ TODO (implement with TDD using Prisma)
- First add `WeeklyTask` model to `prisma/schema.prisma` and run migration
- `GET /api/weekly-tasks?taskId={id}&weekStartDate={date}` - List weekly tasks with filters
- `GET /api/weekly-tasks/current-week` - Get all weekly tasks for the current week
- `POST /api/weekly-tasks` - Create a weekly task
- `GET /api/weekly-tasks/[id]` - Get specific weekly task
- `PUT /api/weekly-tasks/[id]` - Update weekly task
- `DELETE /api/weekly-tasks/[id]` - Delete weekly task

**Progress Entries:** ⏳ TODO (implement with TDD using Prisma)
- First add `ProgressEntry` model to `prisma/schema.prisma` and run migration
- `GET /api/progress-entries?weeklyTaskId={id}` - List progress entries for a weekly task
- `POST /api/progress-entries` - Create a progress entry
- `GET /api/progress-entries/[id]` - Get specific progress entry
- `PUT /api/progress-entries/[id]` - Update progress entry
- `DELETE /api/progress-entries/[id]` - Delete progress entry

### Data Types

**Prisma Models** (`prisma/schema.prisma`):
- `Goal`: id (UUID), title, description, userId, createdAt, updatedAt, regions[]
- `Region`: id (UUID), goalId, title, description, userId, createdAt, updatedAt, goal, tasks[]
- `Task`: id (UUID), regionId, title, description, deadline (DateTime), status (active/completed/incomplete), userId, createdAt, updatedAt, region

**TypeScript Interfaces** (`lib/types.ts` - for frontend use):
- Simplified versions of Prisma models (id, title, description, etc.)
- Used by components and pages for type checking

**TODO - Prisma Models:**
- `WeeklyTask`: id, taskId, title, description, priority (1-3), weekStartDate, status
- `ProgressEntry`: id, weeklyTaskId, date, notes, completionPercentage (0-100), createdAt

## Component Patterns

### Server vs Client Components
- **Server Components** (default): Used for data fetching and static UI (pages, detail views, cards)
- **Client Components** (`"use client"`): Required for interactivity, state, event handlers (forms, dialogs, sidebar)
- Server Components fetch from API routes using native `fetch()` with `cache: "no-store"`
- API routes use Prisma to query PostgreSQL database
- Use `loading.tsx` files for Suspense boundaries and loading states
- Nested dynamic routes: `/goals/[id]/[regionId]/tasks/[taskId]` for hierarchical navigation

### Interactive Cards & Detail Headers
All cards follow a consistent clickable navigation pattern:

**Card Pattern** (Goals, Regions, Tasks):
- Entire card is clickable for navigation using `onClick` with `useRouter`
- Use `cursor-pointer` and `hover:shadow-lg` for visual affordance
- Display relevant metadata (title, description, deadline, status) without action buttons
- Clean, uncluttered design focused on content

**Detail Header Pattern** (GoalDetailHeader, RegionDetailHeader, TaskDetailHeader):
- Displays entity title, description, and metadata (deadline/status for tasks)
- Contains Edit and Delete action buttons
- Edit button links to edit page
- Delete button opens confirmation dialog
- Consistent placement across all detail pages

## Code Style

- ESLint configured with Next.js TypeScript presets (`next/core-web-vitals`, `next/typescript`)
- TypeScript strict mode enabled
- Component props use `React.ComponentProps<>` type helper
- UI components use data slots pattern (e.g., `data-slot="card"`)

## Development Workflow

### When Implementing New Features (TDD Approach)
1. **🔴 Write tests first** - Create failing tests that define the expected behavior
2. **🟢 Implement minimal code** - Write just enough code to pass the tests (use Prisma for database operations)
3. **♻️ Refactor** - Improve code quality while keeping tests green
4. **Run full test suite** - Ensure no regressions: `pnpm test`
5. **Check coverage** - Verify coverage targets met: `pnpm test:coverage`
6. **Lint before commit** - Ensure code style: `pnpm lint`

See [TESTING.md](./TESTING.md) for detailed TDD examples and patterns.
