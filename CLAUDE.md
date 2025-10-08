# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 goal-tracking application using the App Router, React 19, TypeScript, and Tailwind CSS v4. The project uses pnpm as the package manager and Turbopack for faster builds.

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
- Pages are defined in `app/page.tsx`, layout in `app/layout.tsx`

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

### Path Aliases
Configured in `tsconfig.json`:
- `@/*` - Root directory (e.g., `@/components`, `@/lib`)
- Shadcn aliases: `@/components/ui`, `@/lib/utils`, `@/hooks`

### Fonts
Uses Next.js font optimization with Geist and Geist Mono fonts from Google Fonts.

## Data Architecture

### API Routes
Mock API endpoints in `app/api/` for goals and subgoals:

**Goals:**
- `GET /api/goals` - List all goals
- `POST /api/goals` - Create a goal
- `GET /api/goals/[id]` - Get specific goal
- `PUT /api/goals/[id]` - Update goal
- `DELETE /api/goals/[id]` - Delete goal

**Subgoals:**
- `GET /api/subgoals?goalId={id}` - List subgoals (optional filter by goalId)
- `POST /api/subgoals` - Create a subgoal
- `GET /api/subgoals/[id]` - Get specific subgoal
- `PUT /api/subgoals/[id]` - Update subgoal
- `DELETE /api/subgoals/[id]` - Delete subgoal

### Data Types
TypeScript interfaces in `lib/types.ts`:
- `Goal`: id, title, description
- `Subgoal`: id, goalId (reference), title, description

### Mock Data
In-memory mock data stored in `lib/mock-data.ts` for development. This will be replaced with a real backend later.

## Component Patterns

### Server vs Client Components
- **Server Components** (default): Used for data fetching and static UI (e.g., `app/page.tsx`)
- **Client Components** (`"use client"`): Required for interactivity, dialogs, event handlers (e.g., `components/goal-card.tsx`)
- Server Components fetch from API routes using native `fetch()` with `cache: "no-store"`

### Interactive Cards
Pattern for clickable cards with dialogs:
- Wrap shadcn/ui `Card` in `Dialog` + `DialogTrigger`
- Add visual indicators (hover effects, chevron icon) to show interactivity
- Use `cursor-pointer` and `hover:shadow-lg` for affordance

## Code Style

- ESLint configured with Next.js TypeScript presets (`next/core-web-vitals`, `next/typescript`)
- TypeScript strict mode enabled
- Component props use `React.ComponentProps<>` type helper
- UI components use data slots pattern (e.g., `data-slot="card"`)
