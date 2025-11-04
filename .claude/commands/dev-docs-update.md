---
description: Update dev documentation before context compaction
argument-hint: Optional - specific context or tasks to focus on (leave empty for comprehensive update)
---

We're approaching context limits. Please update the development documentation to ensure seamless continuation after context reset.

## Project Context

This is a **Next.js 15 + Prisma + NextAuth.js** goal-tracking application. When updating dev docs:

**Architecture layers to track:**
- Component layer (Server/Client components)
- Server Actions (app/actions/)
- Service layer (lib/services/)
- Database layer (Prisma models)

**Key considerations:**
- Test coverage status (especially for actions/services)
- Database schema changes (note Prisma migrations needed)
- i18n updates (both English and German translations)
- TDD workflow progress (🔴 RED / 🟢 GREEN / ♻️ REFACTOR)

**Important files:**
- Check CLAUDE.md, BEST_PRACTICES.md, TROUBLESHOOTING.md for any outdated info
- Update TODOs.md if scope changed

## Required Updates

### 1. Update Active Task Documentation
For each task in `/dev/active/`:
- Update `[task-name]-context.md` with:
  - Current implementation state
  - Key decisions made this session
  - Files modified and why
  - Any blockers or issues discovered
  - Next immediate steps
  - Last Updated timestamp

- Update `[task-name]-tasks.md` with:
  - Mark completed tasks as ✅ 
  - Add any new tasks discovered
  - Update in-progress tasks with current status
  - Reorder priorities if needed

### 2. Capture Session Context
Include any relevant information about:
- Complex problems solved
- Architectural decisions made (e.g., service layer patterns, validation approach)
- Tricky bugs found and fixed
- Integration points discovered (Server Actions ↔ Services ↔ Prisma)
- Testing approaches used (TDD workflow, mocking strategies)
- Performance optimizations made
- Database schema changes (Prisma migrations)
- i18n updates (translations added to en.json, de.json)

### 3. Update Memory (if applicable)
- Store any new patterns or solutions in project memory/documentation
- Update entity relationships discovered
- Add observations about system behavior

### 4. Document Unfinished Work
- What was being worked on when context limit approached
- Exact state of any partially completed features
- Commands that need to be run on restart
- Any temporary workarounds that need permanent fixes

### 5. Create Handoff Notes
If switching to a new conversation:
- Exact file and line being edited
- The goal of current changes
- Any uncommitted changes that need attention
- Test commands to verify work

## Additional Context: $ARGUMENTS

**Priority**: Focus on capturing information that would be hard to rediscover or reconstruct from code alone.