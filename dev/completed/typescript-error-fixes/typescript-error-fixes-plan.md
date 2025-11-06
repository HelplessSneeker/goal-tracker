# TypeScript Error Fixes - Implementation Plan

**ARCHIVED:** 2025-11-06
**COMPLETION STATUS:** ✅ All tasks completed

---

## Overview

**Objective:** Fix all TypeScript errors in test files by standardizing action response formats and properly typing Prisma mocks.

**Scope:**
- Component test files (9 files)
- Service test files (3 files)
- TypeScript configuration adjustments

**Out of Scope:**
- NextAuth type definition errors (separate issue)
- Runtime behavior changes
- Test logic modifications

---

## Problem Analysis

### TypeScript Errors Breakdown

**Component Tests (~50 errors):**
- Action response format mismatches
- Missing ActionErrorCode imports
- Incorrect error response structure

**Service Tests (~24 errors):**
- Prisma mock methods don't have Jest mock methods
- TypeScript can't infer mockResolvedValue on Prisma client methods

**Auth Tests (~9 errors):**
- Out of scope for this task

---

## Solution Architecture

### ActionResponse Type Structure

```typescript
// lib/action-types.ts

export enum ActionErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NOT_FOUND = "NOT_FOUND",
  DATABASE_ERROR = "DATABASE_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface ActionError {
  error: string;
  code: ActionErrorCode;
  validationErrors?: ValidationError[];
}

export interface ActionSuccess<T> {
  success: true;
  data: T;
}

export type ActionResponse<T> = ActionSuccess<T> | ActionError;
```

**Key Points:**
- `ActionError` does NOT have `success: false` property
- Error codes MUST be enum values, not strings
- Success responses MUST have `data` property
- Discriminated union based on presence of `success` or `error` fields

---

## Implementation Strategy

### Phase 1: Component Test Fixes

**Approach:** Fix each component test file to use correct response format

**Files to Fix:**
1. `components/app-sidebar.test.tsx`
2. `components/goals/delete-goal-dialog/delete-goal-dialog.test.tsx`
3. `components/goals/goal-form/goal-form.test.tsx`
4. `components/regions/delete-region-dialog/delete-region-dialog.test.tsx`
5. `components/regions/region-form/region-form.test.tsx`
6. `components/tasks/delete-task-dialog/delete-task-dialog.test.tsx`
7. `components/tasks/task-form/task-form.test.tsx`

**Changes Required:**

1. **Add ActionErrorCode import:**
```typescript
import { ActionErrorCode } from "@/lib/action-types";
```

2. **Fix success responses:**
```typescript
// OLD (WRONG)
mockAction.mockResolvedValue({
  success: true,
  goal: { id: "123", ... }
});

// NEW (CORRECT)
mockAction.mockResolvedValue({
  success: true,
  data: { id: "123", ... }
});
```

3. **Fix delete success responses:**
```typescript
// OLD (WRONG)
mockDeleteAction.mockResolvedValue({
  success: true
});

// NEW (CORRECT)
mockDeleteAction.mockResolvedValue({
  success: true,
  data: { deleted: true }
});
```

4. **Fix error responses:**
```typescript
// OLD (WRONG)
mockAction.mockResolvedValue({
  success: false,
  code: "DELETE_ERROR",
  error: "Failed to delete"
});

// NEW (CORRECT)
mockAction.mockResolvedValue({
  error: "Failed to delete",
  code: ActionErrorCode.DATABASE_ERROR
});
```

### Phase 2: Service Test Fixes

**Approach:** Add explicit type assertions for Prisma mock methods

**Files to Fix:**
1. `lib/services/goals.service.test.ts`
2. `lib/services/regions.service.test.ts`
3. `lib/services/tasks.service.test.ts`

**Pattern to Apply:**

```typescript
// After mockPrisma declaration
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// Add type assertions for each Prisma method
const mockGoalFindMany = mockPrisma.goal.findMany as unknown as jest.Mock;
const mockGoalFindFirst = mockPrisma.goal.findFirst as unknown as jest.Mock;
const mockGoalCreate = mockPrisma.goal.create as unknown as jest.Mock;
const mockGoalUpdate = mockPrisma.goal.update as unknown as jest.Mock;
const mockGoalDelete = mockPrisma.goal.delete as unknown as jest.Mock;

// Then replace all occurrences
// OLD: mockPrisma.goal.findMany.mockResolvedValue(...)
// NEW: mockGoalFindMany.mockResolvedValue(...)

// Also update assertions
// OLD: expect(mockPrisma.goal.findMany).toHaveBeenCalledWith(...)
// NEW: expect(mockGoalFindMany).toHaveBeenCalledWith(...)
```

**For each service test file:**
- Goals service: Add 5 mock type assertions (findMany, findFirst, create, update, delete)
- Regions service: Add 6 mock type assertions (5 region methods + goal.findFirst for verification)
- Tasks service: Add 6 mock type assertions (5 task methods + region.findFirst for verification)

### Phase 3: Verification

**Steps:**
1. Run TypeScript compilation: `pnpm tsc --noEmit`
2. Run full test suite: `pnpm test`
3. Run build: `pnpm build`
4. Verify no regressions

**Success Criteria:**
- TypeScript errors reduced to auth-related only (~9 errors)
- All 228 tests still passing
- Build succeeds
- No new warnings or errors

---

## Implementation Details

### Component Test Pattern

**For each component test file:**

1. **Check imports:**
   - Add `ActionErrorCode` import if not present
   - Verify action imports

2. **Find all `mockResolvedValue` calls:**
   - Search for pattern: `.mockResolvedValue({`
   - Identify whether success or error response

3. **Fix success responses:**
   - Look for `success: true` with entity property (goal, region, task, etc.)
   - Change entity property to `data`
   - For delete actions, add `data: { deleted: true }`

4. **Fix error responses:**
   - Remove `success: false` if present
   - Change string code to `ActionErrorCode.DATABASE_ERROR`
   - Keep error message unchanged

5. **Verify no other changes needed:**
   - Test assertions should work unchanged
   - Only mock responses need updating

### Service Test Pattern

**For each service test file:**

1. **Locate mockPrisma declaration:**
   - Should be near top of describe block
   - `const mockPrisma = prisma as jest.Mocked<typeof prisma>;`

2. **Add mock type assertions:**
   - After mockPrisma declaration
   - One const for each Prisma method used in tests
   - Format: `const mockEntityMethod = mockPrisma.entity.method as unknown as jest.Mock;`

3. **Replace all mock usages:**
   - Find: `mockPrisma.entity.method`
   - Replace: `mockEntityMethod`
   - Both in `.mockResolvedValue()` calls and `expect()` assertions

4. **Test the changes:**
   - Run: `pnpm test services/[filename]`
   - Should have no TypeScript errors
   - All tests should still pass

---

## Risk Analysis

### Low Risk
- ✅ Only test files being modified
- ✅ No production code changes
- ✅ Changes are type-only (mocks)
- ✅ All tests verify functionality remains intact

### Medium Risk
- ⚠️ Bulk find-replace could miss edge cases
- **Mitigation:** Review each file individually, run tests after each change

### No Risk
- Production runtime behavior unchanged
- User-facing features unaffected
- Database operations unaffected

---

## Testing Strategy

### Unit Test Verification
```bash
# Run all tests
pnpm test

# Expected: 228/228 passing
# No new failures
```

### TypeScript Compilation
```bash
# Check TypeScript errors
pnpm tsc --noEmit

# Expected: Down from ~77 to ~9 errors (auth-related only)
```

### Build Verification
```bash
# Production build
pnpm build

# Expected: Success in ~3.7s
```

### Manual Verification
- Review git diff for each changed file
- Verify pattern consistency across files
- Check no unintended changes

---

## Rollback Plan

### If Tests Fail
1. Check which test file failed
2. Review changes in that specific file
3. Compare old vs new mock response format
4. Revert that file if needed: `git checkout -- path/to/file`

### If Build Fails
1. Check TypeScript error output
2. Identify which file has issue
3. Verify imports are correct
4. Check for syntax errors in type assertions

### Full Rollback
```bash
# If needed, revert all changes
git reset --hard HEAD
```

**Note:** This should not be necessary as changes are isolated and well-understood.

---

## Timeline

### Estimated Time per Phase
- **Phase 1:** Component Tests - 60 minutes
  - 7 files × ~8 min each (review, edit, verify)

- **Phase 2:** Service Tests - 45 minutes
  - 3 files × ~15 min each (add assertions, replace usages, verify)

- **Phase 3:** Verification - 15 minutes
  - Run tests, tsc, build
  - Review changes

**Total:** ~2 hours

### Actual Time
- **Phase 1:** ~45 minutes (agent helped with bulk fixes)
- **Phase 2:** ~30 minutes (pattern was repetitive)
- **Phase 3:** ~15 minutes
- **Total:** ~1.5 hours

---

## Success Metrics

### Quantitative
- ✅ TypeScript errors: 77 → 9 (88% reduction)
- ✅ Test success rate: 228/228 (100%)
- ✅ Files modified: 14 files
- ✅ Build time: Unchanged (~3.7s)

### Qualitative
- ✅ Consistent pattern across all test files
- ✅ Type-safe mock responses
- ✅ Clearer error handling in tests
- ✅ Better developer experience (no IDE errors)

---

## Documentation Updates

### Files to Update After This Task
1. **TESTING.md:**
   - Add section on action response mock patterns
   - Include ActionErrorCode usage examples
   - Document Prisma mock typing pattern

2. **CLAUDE.md:**
   - Add ActionResponse type examples
   - Reference action-types.ts for response format

3. **BEST_PRACTICES.md:**
   - Add "Testing" section if not exists
   - Include mock response format guidelines

---

## Future Enhancements

### Short-term
1. Create mock helper utilities:
```typescript
// test-utils.ts
export const createSuccessMock = <T>(data: T) => ({
  success: true,
  data
});

export const createErrorMock = (message: string, code = ActionErrorCode.DATABASE_ERROR) => ({
  error: message,
  code
});
```

2. Fix remaining auth-related TypeScript errors

### Long-term
1. Evaluate `jest-mock-extended` for cleaner Prisma mocking
2. Add ESLint rule to enforce ActionErrorCode enum usage
3. Create automated checks for response format consistency in CI/CD

---

**Last Updated:** 2025-11-06
**Status:** ✅ COMPLETED
