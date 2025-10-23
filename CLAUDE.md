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
- ✅ Goals, Regions, Tasks (CRUD + full test coverage)
- ✅ Database (Prisma + PostgreSQL with UUID primary keys)
- ✅ Authentication (NextAuth.js with email/magic link, JWT sessions)
- ✅ Testing (Jest + React Testing Library - 183/184 tests passing)
- ⏳ Weekly Tasks, Progress Entries (TODO - use TDD)

See [TODOs.md](./TODOs.md) for roadmap and [TESTING.md](./TESTING.md) for testing guide.

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

**Current Status:** 183/184 tests passing (~8s)
- ✅ 58 API tests (100% coverage)
- ✅ 92 component tests (93-100% coverage)
- ✅ 6 utility tests (100% coverage)
- ✅ 28 authentication tests (100% coverage)
- ⚠️ 1 failing test (pre-existing, task-form.test.tsx:275)

**TDD Workflow:**
1. 🔴 **RED**: Write failing test first
2. 🟢 **GREEN**: Write minimal code to pass
3. ♻️ **REFACTOR**: Improve code while tests stay green

**Test Organization:**
- API tests: `app/api/**/*.test.ts` (co-located with routes)
- Component tests: `components/**/[component-name]/[component-name].test.tsx`
- Use Prisma mocks for API tests (configured in `jest.setup.ts`)
- Components use global Next.js mocks (router, Link)

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

**Import Pattern:** Always import from feature index
```typescript
// ✅ Good
import { TaskForm, TaskCard } from "@/components/tasks";

// ❌ Bad
import { TaskForm } from "@/components/tasks/task-form/task-form";
```

See [TESTING.md](./TESTING.md) for detailed patterns and examples.

## Architecture

### Tech Stack
- **Framework:** Next.js 15 with App Router
- **Database:** PostgreSQL + Prisma ORM (UUID primary keys)
- **Authentication:** NextAuth.js with email provider (JWT sessions)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Testing:** Jest + React Testing Library
- **Icons:** Lucide React

### Key Patterns
- **Server Components** (default): Data fetching, static UI
- **Client Components** (`"use client"`): Forms, dialogs, interactivity
- Server Components fetch from API routes (`fetch` with `cache: "no-store"`)
- API routes use Prisma for database operations
- Path alias: `@/*` for root directory

### Authentication
- **NextAuth.js** with email provider (magic links)
- **Config:** `lib/auth.ts` (centralized)
- **Session:** JWT strategy
- **Middleware:** `middleware.ts` protects routes
- **Pages:** `/auth/signin`, `/auth/verify-request`
- **Adapter:** Prisma adapter for NextAuth

### API Routes (All use Prisma)

**Goals:** ✅ Complete
- `GET/POST /api/goals`
- `GET/PUT/DELETE /api/goals/[id]`

**Regions:** ✅ Complete
- `GET/POST /api/regions` (filter by `?goalId={id}`)
- `GET/PUT/DELETE /api/regions/[id]`

**Tasks:** ✅ Complete
- `GET/POST /api/tasks` (filter by `?regionId={id}`)
- `GET/PUT/DELETE /api/tasks/[id]`

**Weekly Tasks:** ⏳ TODO
- Add `WeeklyTask` model to `prisma/schema.prisma` first
- Implement CRUD API with TDD approach

**Progress Entries:** ⏳ TODO
- Add `ProgressEntry` model to `prisma/schema.prisma` first
- Implement CRUD API with TDD approach

### Database Models (Prisma)

**Current:**
- `User`: id, email, name, image (NextAuth adapter models)
- `Goal`: id, title, description, userId, createdAt, updatedAt
- `Region`: id, goalId, title, description, userId, createdAt, updatedAt
- `Task`: id, regionId, title, description, deadline, status, userId, createdAt, updatedAt

**TODO:**
- `WeeklyTask`: id, taskId, title, description, priority (1-3), weekStartDate, status
- `ProgressEntry`: id, weeklyTaskId, date, notes, completionPercentage (0-100)

## Development Workflow

### Implementing New Features
1. 🔴 **Write tests first** (API + component tests)
2. 🟢 **Implement feature** using Prisma for data operations
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
