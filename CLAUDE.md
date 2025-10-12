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
- ✅ Goals (CRUD complete - filtering/search pending)
- ⏳ Regions (in progress - missing: edit, delete, filtering)
- ⏳ Tasks (TODO)
- ⏳ Weekly Tasks (TODO)
- ⏳ Progress Entries (TODO)
- ⏳ Weekly review workflow (TODO)
- ⏳ Archive system (TODO)

See [TODOs.md](./TODOs.md) for detailed implementation roadmap.

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
```

The development server runs at http://localhost:3000.

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
  - `app/goals/[id]/[regionId]/page.tsx` - Region detail
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
- Custom components organized by feature:
  - `components/app-sidebar.tsx` - Main navigation sidebar
  - `components/goals/` - Goal-related components
    - `goal-card.tsx` - Goal list item display
    - `goal-detail-header.tsx` - Goal detail page header with edit/delete actions
    - `goal-form.tsx` - Reusable form for create/edit (handles both modes)
    - `delete-goal-dialog.tsx` - Confirmation dialog for goal deletion

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

### Entity Relationships

```
Goal (1) ──> Region (n) ──> Task (n) ──> Weekly Task (n, 3 per week) ──> Progress Entry (n, daily)
```

- A **Goal** can have many **Regions**
- A **Region** can have many **Tasks** (Tasks belong to Regions)
- A **Task** can have many **Weekly Tasks** (3 per week, with priority 1-3)
- A **Weekly Task** can have many **Progress Entries** (daily journal entries)

### API Routes

**Goals:** ✅ Complete
- `GET /api/goals` - List all goals ✅
- `POST /api/goals` - Create a goal ✅
- `GET /api/goals/[id]` - Get specific goal ✅
- `PUT /api/goals/[id]` - Update goal ✅
- `DELETE /api/goals/[id]` - Delete goal ✅

**Regions:** ⏳ In Progress
- `GET /api/regions?goalId={id}` - List regions (optional filter by goalId) ✅
- `POST /api/regions` - Create a region ✅
- `GET /api/regions/[id]` - Get specific region ✅
- `PUT /api/regions/[id]` - Update region ⏳ (endpoint exists, UI missing)
- `DELETE /api/regions/[id]` - Delete region ⏳ (endpoint exists, UI missing)

**Tasks:** ⏳ TODO
- `GET /api/tasks?regionId={id}` - List tasks for a region
- `POST /api/tasks` - Create a task
- `GET /api/tasks/[id]` - Get specific task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

**Weekly Tasks:** ⏳ TODO
- `GET /api/weekly-tasks?taskId={id}&weekStartDate={date}` - List weekly tasks with filters
- `GET /api/weekly-tasks/current-week` - Get all weekly tasks for the current week
- `POST /api/weekly-tasks` - Create a weekly task
- `GET /api/weekly-tasks/[id]` - Get specific weekly task
- `PUT /api/weekly-tasks/[id]` - Update weekly task
- `DELETE /api/weekly-tasks/[id]` - Delete weekly task

**Progress Entries:** ⏳ TODO
- `GET /api/progress-entries?weeklyTaskId={id}` - List progress entries for a weekly task
- `POST /api/progress-entries` - Create a progress entry
- `GET /api/progress-entries/[id]` - Get specific progress entry
- `PUT /api/progress-entries/[id]` - Update progress entry
- `DELETE /api/progress-entries/[id]` - Delete progress entry

### Data Types

TypeScript interfaces in `lib/types.ts`:

**Implemented:**
- `Goal`: id, title, description
- `Region`: id, goalId (reference), title, description

**TODO:**
- `Task`: id, regionId (required), title, description, deadline (Date, required)
- `WeeklyTask`: id, taskId, title, description, priority (1-3), weekStartDate (Date), status (pending/completed)
- `ProgressEntry`: id, weeklyTaskId, date (Date), notes (string), completionPercentage (0-100), createdAt (timestamp)

### Mock Data
In-memory mock data stored in `lib/mock-data.ts` for development. This will be replaced with a real backend later.

## Component Patterns

### Server vs Client Components
- **Server Components** (default): Used for data fetching and static UI (e.g., `app/page.tsx`, `app/progress/page.tsx`, `app/goals/page.tsx`, `app/goals/[id]/page.tsx`, `app/goals/[id]/[regionId]/page.tsx`, `components/goal-card.tsx`)
- **Client Components** (`"use client"`): Required for interactivity, state, event handlers (e.g., `components/app-sidebar.tsx`)
- Server Components fetch from API routes using native `fetch()` with `cache: "no-store"`
- Use `loading.tsx` files for Suspense boundaries and loading states
- Nested dynamic routes follow the pattern: `/goals/[id]/[regionId]` for hierarchical navigation

### Interactive Cards
Pattern for clickable cards with navigation:
- Wrap shadcn/ui `Card` in Next.js `Link` component
- Add visual indicators (hover effects, chevron icon) to show interactivity
- Use `cursor-pointer` and `hover:shadow-lg` for affordance
- Chevron animates on hover with `group-hover:translate-x-1`

## Code Style

- ESLint configured with Next.js TypeScript presets (`next/core-web-vitals`, `next/typescript`)
- TypeScript strict mode enabled
- Component props use `React.ComponentProps<>` type helper
- UI components use data slots pattern (e.g., `data-slot="card"`)
