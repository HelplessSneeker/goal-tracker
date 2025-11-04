---
description: Archive completed dev documentation
argument-hint: Task name to archive (e.g., "implement-weekly-tasks") or "all" for all completed tasks
---

Archive completed development documentation to keep the active workspace clean and organized.

## Project Context

This is a **Next.js 15 + Prisma + NextAuth.js** goal-tracking application. When archiving:
- Preserve all implementation details and decisions
- Add completion timestamps for historical reference
- Keep archived docs accessible for future reference
- Maintain the three-file structure (plan, context, tasks)

## Instructions

1. **Parse Arguments:**
   - If specific task name provided: Archive that task
   - If "all" specified: Find and archive all completed tasks
   - If no arguments: List available tasks and ask which to archive

2. **Validate Task for Archiving:**
   - Verify task directory exists in `dev/active/[task-name]/`
   - Read `[task-name]-tasks.md` and verify all tasks marked ✅ COMPLETE
   - If any tasks are incomplete, warn user and ask for confirmation
   - Check that all three files exist (plan.md, context.md, tasks.md)

3. **Archive Process:**
   For each task to archive:

   a. **Create archive directory:**
   ```bash
   mkdir -p dev/completed/[task-name]
   ```

   b. **Add completion metadata** to each file:
   - At the top of each file, add:
     ```markdown
     **ARCHIVED:** YYYY-MM-DD
     **COMPLETION STATUS:** ✅ All tasks completed
     ```

   c. **Move files:**
   ```bash
   mv dev/active/[task-name]/* dev/completed/[task-name]/
   rmdir dev/active/[task-name]
   ```

   d. **Record in archive index** (create if doesn't exist):
   - File: `dev/completed/ARCHIVE_INDEX.md`
   - Add entry with:
     - Task name and date archived
     - Brief summary (from plan.md executive summary)
     - Link to archived directory

4. **Generate Summary Report:**
   After archiving, provide:
   - List of tasks archived with dates
   - Total number of tasks archived
   - Location of archived documentation
   - Reminder that files can be restored if needed

## Validation Checks

Before archiving, verify:
- [ ] All tasks in `[task-name]-tasks.md` are marked ✅
- [ ] No 🟡 IN PROGRESS or ⏳ NOT STARTED tasks remain
- [ ] All three files exist (plan, context, tasks)
- [ ] No uncommitted code changes related to this task

## Warning Scenarios

**Incomplete tasks:**
```
⚠️ Warning: Task has incomplete items
Found 2 incomplete tasks in [task-name]-tasks.md:
- [ ] Write integration tests
- [ ] Update documentation

Archive anyway? (not recommended)
```

**Missing files:**
```
❌ Error: Cannot archive - missing files
Expected: plan.md, context.md, tasks.md
Found: plan.md, context.md
```

## Archive Index Format

Create/update `dev/completed/ARCHIVE_INDEX.md`:

```markdown
# Archived Dev Docs

Archive of completed development tasks and their documentation.

---

## [Task Name] - Archived YYYY-MM-DD

**Summary:** Brief description from executive summary

**Location:** `dev/completed/task-name/`

**Key Achievements:**
- Major accomplishment 1
- Major accomplishment 2

---
```

## Example Usage

**Archive specific task:**
```
/dev-docs-archive implement-weekly-tasks
```

**Archive all completed:**
```
/dev-docs-archive all
```

**Interactive (no args):**
```
/dev-docs-archive
```

## Additional Context: $ARGUMENTS

**Note:** Archiving is non-destructive. Files are moved, not deleted. You can always restore archived tasks by moving them back to `dev/active/`.
