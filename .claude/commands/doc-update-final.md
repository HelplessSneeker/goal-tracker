---
description: Update all dev documentation after completing major features (CLAUDE.md, TODOs.md, BEST_PRACTICES.md, TROUBLESHOOTING.md, README.md)
argument-hint: Optional - specific context or tasks to focus on (leave empty for comprehensive update)
---

# Final Documentation Update

Update all core documentation files based on recent code changes. Run this after completing significant features or milestones.

## Phase 1: Context Gathering

### Step 1: Check Current Branch & Changes

**Determine branch:**
```bash
git branch --show-current
```

**Gather changes based on branch:**

- **On `main` branch** → Analyze uncommitted changes:
  ```bash
  git status
  git diff HEAD
  git diff --cached
  ```

- **On feature branch** → Analyze diff between main and current:
  ```bash
  git diff main...HEAD --stat
  git diff main...HEAD
  git log main...HEAD --oneline --no-decorate
  ```

### Step 2: Get Test Status

```bash
pnpm test 2>&1 | tail -30
```

Note the total test count and any failures.

### Step 3: Check for Completion Docs

```bash
find dev/active -name "*COMPLETION*" -o -name "*SUMMARY*" 2>/dev/null | head -10
```

## Phase 2: Change Analysis

### Categorize Change Significance

**HIGH PRIORITY** (always document):
- ✅ New features (CRUD operations, new pages, major functionality)
- ✅ Architecture changes (new patterns, major refactoring)
- ✅ Database schema changes (new/modified Prisma models)
- ✅ Authentication/authorization changes
- ✅ New dependencies or tools
- ✅ Breaking changes
- ✅ Significant test coverage changes (±10 tests or more)
- ✅ Critical bug fixes

**MEDIUM PRIORITY** (document if substantial):
- Component additions/major modifications
- New utility functions/patterns
- Performance improvements
- Significant refactoring
- Error handling improvements

**LOW PRIORITY** (usually skip):
- Minor bug fixes, typos, formatting
- Comment updates
- Small test adjustments (unless coverage changed)

### Map Changes to Documentation Files

**CLAUDE.md** updates needed for:
- Implementation status changes
- New architecture patterns
- Database model changes
- Test count updates
- Recent completions
- Next steps reordering

**TODOs.md** updates needed for:
- Completed phases/tasks
- New tasks discovered
- Priority changes
- Roadmap adjustments

**BEST_PRACTICES.md** updates needed for:
- New patterns established
- Architecture conventions
- Testing patterns
- Security practices

**TROUBLESHOOTING.md** updates needed for:
- New common errors encountered
- Solutions to complex problems
- Environment/setup issues

**README.md** updates needed for:
- Feature status changes
- Tech stack additions
- Getting started changes
- Test status updates

## Phase 3: Documentation Updates

### File-Specific Guidelines

#### CLAUDE.md
**Target:** ~450 lines | **Hard Max:** 550 lines

**Key sections to update:**
1. **Implementation Status** (lines 20-30): Update ✅/⏳ markers
2. **Testing Strategy** (lines 54-74): Update test counts
3. **Database Models** (lines 214-225): Add new models/fields
4. **Recent Completions** (lines 331-408): Add latest, compress old
5. **Immediate Next Steps** (lines 411-434): Reorder priorities

**Line management:**
- Keep last 2-3 major features in "Recent Completions"
- Reference `dev/completed/` for older details
- Compress verbose sections
- Keep "Immediate Next Steps" to 3-4 items max

#### TODOs.md
**Target:** ~350 lines | **Hard Max:** 450 lines

**Key sections:**
1. **Current Status** (lines 9-26): Branch, tests, completed features
2. **Completed Work** (lines 36-60): Add new ✅ items
3. **Open Phases** (lines 63-368): Update statuses, new tasks
4. **Immediate Next Steps** (lines 327-368): Reorder priorities

**Line management:**
- Compress completed phases (keep ✅, remove details)
- Move detailed notes to `dev/completed/`
- Keep future phases concise

#### BEST_PRACTICES.md
**Target:** ~450 lines | **Hard Max:** 550 lines

**Update as needed:**
- Architecture patterns (lines 9-49)
- New conventions discovered
- Testing patterns (lines 417-431)
- Quick checklist (lines 435-471)

**Line management:**
- Keep code examples concise (2-3 lines max)
- Remove outdated patterns
- Focus on actively used patterns

#### TROUBLESHOOTING.md
**Target:** ~450 lines | **Hard Max:** 550 lines

**Update as needed:**
- New error messages (lines 443-455)
- New problem categories
- Updated solutions

**Line management:**
- Only add recurring or complex issues
- Keep solutions concise
- Remove obsolete issues

#### README.md
**No line limit** - be comprehensive

**Update:**
- Current Status (lines 12-24)
- Features → Implemented (lines 28-40)
- Test Status (lines 189-194)
- Tech Stack (lines 196-218)
- Database Schema (lines 256-273)

## Phase 4: Execute Updates

### Process

1. **Read all documentation files** to understand current state

2. **For each file needing updates:**
   - Read the file
   - Identify specific sections to change
   - Draft updates based on analysis
   - Apply changes with Edit tool
   - Verify line count

3. **Check line counts:**
   ```bash
   wc -l CLAUDE.md TODOs.md BEST_PRACTICES.md TROUBLESHOOTING.md README.md
   ```

4. **Archive if needed:**
   - Move detailed completions to `dev/completed/`
   - Update `dev/completed/ARCHIVE_INDEX.md`
   - Keep high-level summaries in main docs

### Quality Checklist

Before finishing, verify:
- [ ] Dates updated to today (format: 2025-11-11)
- [ ] Test counts match actual output
- [ ] Completed items marked ✅
- [ ] In-progress items marked ⏳
- [ ] Branch status current
- [ ] Line counts acceptable:
  - CLAUDE.md < 550
  - TODOs.md < 450
  - BEST_PRACTICES.md < 550
  - TROUBLESHOOTING.md < 550
- [ ] No broken references
- [ ] Consistent style/formatting

## Output Summary

Provide this format:

```markdown
## Documentation Update Summary

**Branch:** [name]
**Changes:** [brief description]
**Significance:** [HIGH/MEDIUM/LOW]

### Files Updated:

**CLAUDE.md** (XXX lines)
- [changes made]

**TODOs.md** (XXX lines)
- [changes made]

**BEST_PRACTICES.md** (XXX lines)
- [changes made or "No updates needed"]

**TROUBLESHOOTING.md** (XXX lines)
- [changes made or "No updates needed"]

**README.md** (XXX lines)
- [changes made]

### Archived Content:
- [any content moved to dev/completed/]

### Recommendations:
- [next steps or improvements]
```

## Additional Context: $ARGUMENTS

## Important Principles

- **Conservative:** Only update what genuinely changed
- **Preserve:** Don't remove still-relevant information
- **Concise:** Bullet points, short paragraphs
- **Consistent:** Match existing tone and style
- **Cross-reference:** Link to `dev/` folders for details
- **Date everything:** Use YYYY-MM-DD format
- **Future-proof:** Structure for maintainability

## Error Handling

- **Can't determine changes?** → Ask user what was completed
- **Line limit conflicts?** → Archive older content, prioritize recent
- **Unclear significance?** → Default to documenting (better safe)
- **Conflicting info?** → Use git history + tests as truth
