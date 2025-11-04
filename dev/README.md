# Dev Docs Pattern

A methodology for maintaining project context across Claude Code sessions and context resets.

**Project:** Goal Tracker (Next.js 15 + Prisma + NextAuth.js)

---

## About This Project

This dev docs pattern is configured for a **Next.js 15** goal-tracking application:

**Tech Stack:**
- Next.js 15 with App Router & React 19
- Prisma ORM + PostgreSQL (UUID primary keys)
- NextAuth.js (email/magic link authentication)
- TypeScript, Tailwind CSS v4, next-intl (English, German)
- Jest + React Testing Library

**Architecture:**
- **Data Flow:** Component → Server Action → Service → Prisma
- **Testing:** TDD required (🔴 RED → 🟢 GREEN → ♻️ REFACTOR)
- **Package Manager:** pnpm
- **Dev Server:** http://localhost:3000

**Key Documentation:**
- `CLAUDE.md` - Project overview and architecture
- `BEST_PRACTICES.md` - Coding standards and patterns
- `TROUBLESHOOTING.md` - Common issues and solutions
- `TODOs.md` - Project roadmap

When creating dev docs for this project, always consider:
- TDD workflow and test coverage requirements
- Server actions + service layer architecture
- Database schema changes (Prisma models)
- i18n support (English and German)
- Component organization and import patterns

---

## The Problem

**Context resets lose everything:**
- Implementation decisions
- Key files and their purposes
- Task progress
- Technical constraints
- Why certain approaches were chosen

**After a reset, Claude has to rediscover everything.**

---

## The Solution: Persistent Dev Docs

A three-file structure that captures everything needed to resume work:

```
dev/active/[task-name]/
├── [task-name]-plan.md      # Strategic plan
├── [task-name]-context.md   # Key decisions & files
└── [task-name]-tasks.md     # Checklist format
```

**These files survive context resets** - Claude reads them to get back up to speed instantly.

---

## Three-File Structure

### 1. [task-name]-plan.md

**Purpose:** Strategic plan for the implementation

**Contains:**
- Executive summary
- Current state analysis
- Proposed future state
- Implementation phases
- Detailed tasks with acceptance criteria
- Risk assessment
- Success metrics
- Timeline estimates

**When to create:** At the start of a complex task

**When to update:** When scope changes or new phases discovered

**Example:**
```markdown
# Feature Name - Implementation Plan

## Executive Summary
What we're building and why

## Current State
Where we are now

## Implementation Phases

### Phase 1: Infrastructure (2 hours)
- Task 1.1: Set up database schema
  - Acceptance: Schema compiles, relationships correct
- Task 1.2: Create service structure
  - Acceptance: All directories created

### Phase 2: Core Functionality (3 hours)
...
```

---

### 2. [task-name]-context.md

**Purpose:** Key information for resuming work

**Contains:**
- SESSION PROGRESS section (updated frequently!)
- What's completed vs in-progress
- Key files and their purposes
- Important decisions made
- Technical constraints discovered
- Links to related files
- Quick resume instructions

**When to create:** Start of task

**When to update:** **FREQUENTLY** - after major decisions, completions, or discoveries

**Example:**
```markdown
# Feature Name - Context

## SESSION PROGRESS (2025-10-29)

### ✅ COMPLETED
- Database schema created (User, Post, Comment models)
- PostController implemented with BaseController pattern
- Sentry integration working

### 🟡 IN PROGRESS
- Creating PostService with business logic
- File: src/services/postService.ts

### ⚠️ BLOCKERS
- Need to decide on caching strategy

## Key Files

**src/controllers/PostController.ts**
- Extends BaseController
- Handles HTTP requests for posts
- Delegates to PostService

**src/services/postService.ts** (IN PROGRESS)
- Business logic for post operations
- Next: Add caching

## Quick Resume
To continue:
1. Read this file
2. Continue implementing PostService.createPost()
3. See tasks file for remaining work
```

**CRITICAL:** Update the SESSION PROGRESS section every time significant work is done!

---

### 3. [task-name]-tasks.md

**Purpose:** Checklist for tracking progress

**Contains:**
- Phases broken down by logical sections
- Tasks in checkbox format
- Status indicators (✅/🟡/⏳)
- Acceptance criteria
- Quick resume section

**When to create:** Start of task

**When to update:** After completing each task or discovering new tasks

**Example:**
```markdown
# Feature Name - Task Checklist

## Phase 1: Setup ✅ COMPLETE
- [x] Create database schema
- [x] Set up controllers
- [x] Configure Sentry

## Phase 2: Implementation 🟡 IN PROGRESS
- [x] Create PostController
- [ ] Create PostService (IN PROGRESS)
- [ ] Create PostRepository
- [ ] Add validation with Zod

## Phase 3: Testing ⏳ NOT STARTED
- [ ] Unit tests for service
- [ ] Integration tests
- [ ] Manual API testing
```

---

## When to Use Dev Docs

**Use for:**
- ✅ Complex multi-day tasks
- ✅ Features with many moving parts
- ✅ Tasks likely to span multiple sessions
- ✅ Work that needs careful planning
- ✅ Refactoring large systems

**Skip for:**
- ❌ Simple bug fixes
- ❌ Single-file changes
- ❌ Quick updates
- ❌ Trivial modifications

**Rule of thumb:** If it takes more than 2 hours or spans multiple sessions, use dev docs.

---

## Workflow with Dev Docs

### Starting a New Task

1. **Use /dev-docs slash command:**
   ```
   /dev-docs refactor authentication system
   ```

2. **Claude creates the three files:**
   - Analyzes requirements
   - Examines codebase
   - Creates comprehensive plan
   - Generates context and tasks files

3. **Review and adjust:**
   - Check if plan makes sense
   - Add any missing considerations
   - Adjust timeline estimates

### During Implementation

1. **Refer to plan** for overall strategy
2. **Update context.md** frequently:
   - Mark completed work
   - Note decisions made
   - Add blockers
3. **Check off tasks** in tasks.md as you complete them

### After Context Reset

1. **Claude reads all three files**
2. **Understands complete state** in seconds
3. **Resumes exactly where you left off**

No need to explain what you were doing - it's all documented!

### After Task Completion

1. **Verify all tasks complete** - Check tasks.md for any remaining items
2. **Final context update** - Document final decisions and outcomes
3. **Archive the docs:**
   ```
   /dev-docs-archive task-name
   ```
4. **Keep active workspace clean** - Archived docs move to `dev/completed/`

---

## Integration with Slash Commands

### /dev-docs
**Creates:** New dev docs for a task

**Usage:**
```
/dev-docs implement real-time notifications
```

**Generates:**
- `dev/active/implement-real-time-notifications/`
  - implement-real-time-notifications-plan.md
  - implement-real-time-notifications-context.md
  - implement-real-time-notifications-tasks.md

### /dev-docs-update
**Updates:** Existing dev docs before context reset

**Usage:**
```
/dev-docs-update
```

**Updates:**
- Marks completed tasks
- Adds new tasks discovered
- Updates context with session progress
- Captures current state

**Use when:** Approaching context limits or ending session

### /dev-docs-archive
**Archives:** Completed dev docs to keep active workspace clean

**Usage:**
```
/dev-docs-archive implement-weekly-tasks
/dev-docs-archive all  # Archive all completed tasks
```

**Actions:**
- Verifies all tasks are marked ✅ complete
- Moves task from `dev/active/` to `dev/completed/`
- Adds completion timestamp to files
- Updates archive index
- Creates summary report

**Use when:** Task is 100% complete and you want to clean up active workspace

---

## File Organization

```
dev/
├── README.md                   # This file
├── active/                     # Current work
│   ├── task-1/
│   │   ├── task-1-plan.md
│   │   ├── task-1-context.md
│   │   └── task-1-tasks.md
│   └── task-2/
│       └── ...
└── completed/                  # Archived completed work
    ├── ARCHIVE_INDEX.md       # Index of all archived tasks
    └── old-task/
        └── ...
```

**active/**: Work in progress (current tasks being developed)
**completed/**: Archived tasks (historical reference, cleaned from active workspace)
**ARCHIVE_INDEX.md**: Catalog of all completed tasks with summaries

---

## Best Practices

### Update Context Frequently

**Bad:** Update only at end of session
**Good:** Update after each major milestone

**SESSION PROGRESS section should always reflect reality:**
```markdown
## SESSION PROGRESS (YYYY-MM-DD)

### ✅ COMPLETED (list everything done)
### 🟡 IN PROGRESS (what you're working on RIGHT NOW)
### ⚠️ BLOCKERS (what's preventing progress)
```

### Make Tasks Actionable

**Bad:** "Fix the authentication"
**Good:** "Implement JWT token validation in AuthMiddleware.ts (Acceptance: Tokens validated, errors to Sentry)"

**Include:**
- Specific file names
- Clear acceptance criteria
- Dependencies on other tasks

### Keep Plan Current

If scope changes:
- Update the plan
- Add new phases
- Adjust timeline estimates
- Note why scope changed

---

## For Claude Code

**When user asks to create dev docs:**

1. **Use the /dev-docs slash command** if available
2. **Or create manually:**
   - Ask about the task scope
   - Analyze relevant codebase files (check CLAUDE.md, BEST_PRACTICES.md, TODOs.md)
   - Create comprehensive plan
   - Generate context and tasks

3. **Structure the plan with:**
   - Clear phases following TDD workflow (🔴 RED → 🟢 GREEN → ♻️ REFACTOR)
   - Actionable tasks with file paths (e.g., app/actions/goals.ts:42)
   - Acceptance criteria including test coverage
   - Risk assessment
   - Database schema changes if needed (Prisma models)
   - i18n considerations (English + German)

4. **Make context file resumable:**
   - SESSION PROGRESS at top
   - Quick resume instructions
   - Key files list with explanations
   - Note which layer each file belongs to (Component/Action/Service/Prisma)

**When resuming from dev docs:**

1. **Read all three files** (plan, context, tasks)
2. **Start with context.md** - has current state
3. **Check tasks.md** - see what's done and what's next
4. **Refer to plan.md** - understand overall strategy

**Update frequently:**
- Mark tasks complete immediately
- Update SESSION PROGRESS after significant work
- Add new tasks as discovered

---

## Creating Dev Docs Manually

If you don't have the /dev-docs command:

**1. Create directory:**
```bash
mkdir -p dev/active/your-task-name
```

**2. Create plan.md:**
- Executive summary
- Current state (what exists in the codebase)
- Implementation phases (TDD workflow)
- Detailed tasks with file paths and layer (Action/Service/Component)
- Timeline estimates (consider test writing time)
- Database changes (Prisma schema updates if needed)

**3. Create context.md:**
- SESSION PROGRESS section (✅ COMPLETED, 🟡 IN PROGRESS, ⚠️ BLOCKERS)
- Key files and their layer (Component/Action/Service/Prisma)
- Important decisions (e.g., "Used Zod for validation", "Chose JWT sessions")
- Quick resume instructions

**4. Create tasks.md:**
- Phases with checkboxes (e.g., "Phase 1: Database ✅", "Phase 2: Tests 🟡")
- [ ] Task format with acceptance criteria
- Test tasks (unit, integration)
- i18n tasks (English + German)

---

## Benefits

**Before dev docs:**
- Context reset = start over
- Forget why decisions were made
- Lose track of progress
- Repeat work

**After dev docs:**
- Context reset = read 3 files, resume instantly
- Decisions documented
- Progress tracked
- No repeated work

**Time saved:** Hours per context reset

---

## Next Steps

1. **Try the pattern** on your next complex task
2. **Use /dev-docs** slash command to create persistent task structure
3. **Update frequently** - especially context.md
4. **Test with TDD workflow** - Plans should include test-first approach

**Questions?** See the project documentation:
- [CLAUDE.md](../CLAUDE.md) - Project architecture and setup
- [BEST_PRACTICES.md](../BEST_PRACTICES.md) - Coding standards
- [TROUBLESHOOTING.md](../TROUBLESHOOTING.md) - Common issues
