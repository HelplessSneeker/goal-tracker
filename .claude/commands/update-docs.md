# Update Documentation

Validate and update project documentation files to match the actual codebase state. Keep documentation concise and remove bloat.

## Validation & Update Process

### 1. ANALYZE CODEBASE STATE (gather facts first)

Run these checks to establish ground truth:

```bash
# Test status
pnpm test 2>&1 | grep -E "(Test Suites:|Tests:|Time:)" || echo "Tests not run"

# File structure
find app/actions -name "*.ts" -not -name "*.test.ts" 2>/dev/null | wc -l
find lib/services -name "*.ts" -not -name "*.test.ts" 2>/dev/null | wc -l
find components -type d -name "*-form" -o -name "*-card" -o -name "*-dialog" 2>/dev/null | wc -l

# Dependencies
grep -E "next-intl|prisma|next-auth" package.json || echo "Key deps check"
```

Use Glob and Read tools to check:
- Actual test files and their counts
- Implemented features (Goals, Regions, Tasks, WeeklyTasks, ProgressEntries)
- Prisma schema models
- Component structure
- Configuration files

### 2. IDENTIFY DISCREPANCIES

Compare documentation claims against actual codebase:

**CLAUDE.md:**
- ✅ Test counts (claims "228/228 tests passing")
- ✅ Implementation status checkboxes (Goals ✅, WeeklyTasks ⏳)
- ✅ File paths and structure
- ✅ Tech stack versions
- ✅ Commands accuracy

**TESTING.md:**
- ✅ Test counts by category (91 action, 53 service, 72 component, 12 auth)
- ✅ Coverage percentages
- ✅ Test file locations
- ✅ Test status table

**TODOs.md:**
- ✅ Feature completion status (what's actually done vs marked done)
- ✅ Test status section
- ✅ Current branch info
- ✅ Immediate next steps relevance

**README.md:**
- ✅ Feature checklist accuracy
- ✅ Prerequisites
- ✅ Commands that actually work
- ✅ Project structure matches reality

### 3. UPDATE STRATEGY

**ONLY update these types of content:**

✅ **Factual data:**
- Test counts: "228/228" → actual count
- Coverage percentages
- File counts and paths
- Dependency versions
- Feature status: ✅ vs ⏳ vs ❌

✅ **Remove bloat:**
- Outdated sections (e.g., instructions for removed features)
- Duplicate information across files
- Verbose explanations that can be shortened
- Obsolete commands or file references

✅ **Structural fixes:**
- Broken file path references
- Outdated command examples
- Inconsistent status between files

❌ **DO NOT change:**
- Explanatory content and rationale
- Architectural decision documentation
- Code examples and patterns
- Section organization (unless removing bloat)
- The "why" behind decisions

### 4. EXECUTE UPDATES

For each file with discrepancies:

1. **Report findings** - List what's incorrect/outdated
2. **Propose changes** - Show specific updates
3. **Apply updates** - Use Edit tool to fix issues
4. **Verify consistency** - Ensure all 4 docs are in sync

### 5. PRINCIPLES

**Conciseness:**
- Remove redundant information
- Prefer tables over long lists
- Use checkboxes instead of paragraphs for status
- Link between docs instead of duplicating content

**Accuracy:**
- All counts must match actual codebase
- All file paths must exist
- All commands must work
- Status indicators must be current

**Minimalism:**
- If it's in git history, it doesn't need to be in docs
- If it's obvious from code, don't document it
- If it's in one doc, don't repeat in another

## Example Output Format

```
DOCUMENTATION AUDIT RESULTS
===========================

DISCREPANCIES FOUND:

1. CLAUDE.md:
   - Test count: Claims "228/228" but actual is "235/235" ✏️
   - Weekly Tasks: Marked as ⏳ TODO but implementation exists ✏️

2. TESTING.md:
   - Service tests: Claims "53 tests" but actual is "58 tests" ✏️
   - Missing WeeklyTask test section ✏️

3. TODOs.md:
   - Phase 5 marked as open but actually complete ✏️
   - Outdated "Current Branch" information ✏️

4. README.md:
   - Feature list outdated ✏️

BLOAT IDENTIFIED:

- TESTING.md: Lines 450-500 duplicate information from CLAUDE.md
- TODOs.md: Completed items from 3 months ago still listed
- README.md: Verbose setup section can be condensed

APPLYING UPDATES...
[Updates applied]

SUMMARY:
- 8 factual corrections
- 3 bloat removals
- All docs now in sync with codebase
```

## Usage

Run this command after:
- Completing a major feature
- Significant test additions
- Dependency updates
- Structural changes

The command will validate and update all documentation to match reality.
