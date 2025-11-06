# User Avatar Sidebar - Task Checklist

**Last Updated:** 2025-11-06

---

## Quick Status

**Current Phase:** Phase 0 - Documentation ✅ COMPLETE
**Next Phase:** Phase 1 - Setup & Dependencies
**Overall Progress:** 0/27 tasks complete (0%)

---

## Phase 0: Documentation ✅ COMPLETE

- [x] Create comprehensive implementation plan
- [x] Document key files and decisions
- [x] Create task checklist

---

## Phase 1: Setup & Dependencies ⏳ NOT STARTED

### 1.1 Install shadcn/ui Components
- [ ] Install Avatar component
  - Command: `npx shadcn@latest add avatar`
  - Verify: `components/ui/avatar.tsx` exists
  - Exports: `Avatar`, `AvatarImage`, `AvatarFallback`

- [ ] Install DropdownMenu component
  - Command: `npx shadcn@latest add dropdown-menu`
  - Verify: `components/ui/dropdown-menu.tsx` exists
  - Exports: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`

### 1.2 Add i18n Translation Keys
- [ ] Update `messages/en.json`
  - Add `"user"` namespace
  - Keys: `signOut`, `settings`, `account`, `settingsComingSoon`

- [ ] Update `messages/de.json`
  - Add `"user"` namespace with German translations
  - Keys: `signOut` → "Abmelden", `settings` → "Einstellungen", etc.

- [ ] Verify no build errors after i18n changes
  - Run: `pnpm build` (quick check)

---

## Phase 2: UserMenu Component (TDD) 🟡 IN PROGRESS

### 2.1 🔴 RED - Write Failing Tests
- [ ] Create test file: `components/user-menu/user-menu.test.tsx`

- [ ] Write test: Renders avatar with user initials
  - Mock session with user.name
  - Verify initials in avatar

- [ ] Write test: Displays user email address
  - Mock session with user.email
  - Verify email text in document

- [ ] Write test: Hides email when `hideEmail` prop is true
  - Pass `hideEmail={true}` prop
  - Verify email not in document

- [ ] Write test: Shows dropdown menu on click
  - Simulate click on avatar
  - Verify dropdown content appears

- [ ] Write test: Dropdown contains "Settings" link
  - Open dropdown
  - Verify link with href="/settings"

- [ ] Write test: Dropdown contains "Sign Out" button
  - Open dropdown
  - Verify "Sign Out" button exists

- [ ] Write test: "Sign Out" calls signOut function
  - Click "Sign Out" button
  - Verify `signOut()` mock was called

- [ ] Write test: Shows loading state when session loading
  - Mock `status: "loading"`
  - Verify loading skeleton or placeholder

- [ ] Write test: Handles unauthenticated state gracefully
  - Mock `status: "unauthenticated"`
  - Verify no crash, shows nothing or placeholder

- [ ] Write test: Generates initials from email if no name
  - Mock session with email only (no name)
  - Verify initials extracted from email

- [ ] Verify all tests fail
  - Run: `pnpm test user-menu`
  - All 10 tests should fail (component doesn't exist yet)

### 2.2 🟢 GREEN - Implement UserMenu Component
- [ ] Create component file: `components/user-menu/user-menu.tsx`
  - Add `"use client"` directive

- [ ] Import dependencies
  - `Avatar`, `AvatarFallback`, `AvatarImage` from `@/components/ui/avatar`
  - `DropdownMenu` components from `@/components/ui/dropdown-menu`
  - `useSession`, `signOut` from `next-auth/react`
  - `useTranslations` from `next-intl`
  - `Link` from `next/link`

- [ ] Define UserMenuProps interface
  - `hideEmail?: boolean`

- [ ] Implement getInitials helper function
  - Extract initials from name (first letters of first two words)
  - Fallback to first letter of email
  - Fallback to "?" if neither available

- [ ] Implement loading state
  - Check `status === "loading"`
  - Return Skeleton or loading placeholder

- [ ] Implement unauthenticated state
  - Check `status === "unauthenticated"` or `!session`
  - Return null or minimal placeholder

- [ ] Implement avatar rendering
  - Use `Avatar` component
  - `AvatarImage` for user.image (if exists)
  - `AvatarFallback` with initials

- [ ] Implement email display
  - Show email when `hideEmail` is false
  - Hide email when `hideEmail` is true

- [ ] Implement dropdown menu
  - `DropdownMenuTrigger` wrapping avatar
  - `DropdownMenuContent` with two items

- [ ] Add "Settings" menu item
  - Link to `/settings`
  - Use i18n: `t("settings")`

- [ ] Add "Sign Out" menu item
  - Button that calls `signOut({ callbackUrl: "/auth/signin" })`
  - Use i18n: `t("signOut")`

- [ ] Run tests
  - Command: `pnpm test user-menu`
  - All tests should pass

- [ ] Fix any failing tests
  - Adjust implementation as needed
  - Ensure 100% test coverage

### 2.3 ♻️ REFACTOR - Improve Code Quality
- [ ] Extract initials logic to utility function
  - Consider moving to `lib/utils.ts` if useful elsewhere

- [ ] Add ARIA labels for accessibility
  - Avatar should have aria-label with user info
  - Dropdown trigger should have proper ARIA attributes

- [ ] Add tooltips if helpful
  - Consider tooltip on avatar in collapsed mode

- [ ] Optimize re-renders
  - Use `useMemo` for initials if needed
  - Ensure no unnecessary renders

- [ ] Check code style
  - Run ESLint
  - Follow BEST_PRACTICES.md conventions

- [ ] Verify tests still pass
  - Run: `pnpm test user-menu`
  - All tests should still pass after refactoring

### 2.4 Create Component Exports
- [ ] Create `components/user-menu/index.ts`
  - Export: `export { UserMenu } from "./user-menu/user-menu";`

- [ ] Verify import works
  - Test: `import { UserMenu } from "@/components/user-menu";`

---

## Phase 3: Sidebar Integration ⏳ NOT STARTED

### 3.1 Update AppSidebar Component
- [ ] Open `components/app-sidebar.tsx`

- [ ] Add imports
  - `SidebarFooter` from `@/components/ui/sidebar`
  - `UserMenu` from `@/components/user-menu`

- [ ] Add `<SidebarFooter>` section
  - Place after `</SidebarContent>`, before `</Sidebar>`

- [ ] Render `<UserMenu />` inside footer
  - No props needed (CSS handles collapsed state)
  - Alternative: Pass `hideEmail` based on sidebar state if CSS doesn't work

- [ ] Test responsive behavior
  - Expand sidebar → avatar + email visible
  - Collapse sidebar → only avatar visible
  - Dropdown works in both states

### 3.2 Manual Testing
- [ ] Start dev server: `pnpm dev`

- [ ] Test: Avatar displays with correct initials
  - Verify initials match user name or email

- [ ] Test: Email displays in expanded mode
  - Expand sidebar
  - Verify email is visible

- [ ] Test: Email hides in collapsed mode
  - Collapse sidebar (click icon mode button)
  - Verify email is hidden

- [ ] Test: Click avatar opens dropdown
  - Click on avatar area
  - Verify dropdown menu appears

- [ ] Test: Settings link works
  - Click "Settings" in dropdown
  - Verify navigation to `/settings`

- [ ] Test: Sign out works
  - Click "Sign Out" in dropdown
  - Verify redirect to sign-in page
  - Verify session cleared

- [ ] Test: No layout shifts
  - Toggle sidebar collapse/expand
  - Verify smooth transition, no jumping

---

## Phase 4: Settings Page ⏳ NOT STARTED

### 4.1 Create Settings Page
- [ ] Create file: `app/[locale]/settings/page.tsx`

- [ ] Add imports
  - `getServerSession` from `next-auth`
  - `authOptions` from `@/lib/auth`
  - `redirect` from `next/navigation`
  - `getTranslations` from `next-intl/server`

- [ ] Implement authentication check
  - Get session: `const session = await getServerSession(authOptions);`
  - Redirect if not authenticated: `if (!session) redirect("/auth/signin");`

- [ ] Implement page UI
  - Container with heading
  - Use translations for title
  - Placeholder text for coming soon message

- [ ] Test page manually
  - Navigate to `/settings` while logged in
  - Verify page renders
  - Sign out, try to access `/settings`
  - Verify redirect to sign-in

### 4.2 Add Settings Page Translations
- [ ] Verify i18n keys from Phase 1.2 are sufficient
  - Should have: `user.settings`, `user.settingsComingSoon`

- [ ] Update if needed
  - Add any missing translation keys

---

## Phase 5: Testing & Verification ✅ COMPLETE

### 5.1 Run All Tests ✅
- [x] Run full test suite: `pnpm test`
  - All tests pass: 243/243 (added 15 new tests)
  - UserMenu tests: 15/15 passing
  - No regressions in existing tests

- [x] Check test coverage: `pnpm test:coverage`
  - UserMenu has 100% statement coverage
  - No regressions in other components

### 5.2 Run Linting ✅
- [x] Run ESLint: `pnpm lint`
  - No errors
  - No warnings

- [x] Check TypeScript errors
  - CLI shows no errors: `pnpm tsc --noEmit`
  - Build successful

### 5.3 Build Check ✅
- [x] Run production build: `pnpm build`
  - Build completes successfully in 3.7s
  - No build warnings
  - No type errors
  - /settings route visible in build output

### 5.4 Final Manual Testing ⏳
- [ ] Test full user flow (requires dev server)
- [ ] Test both locales
- [ ] Test responsiveness
- [ ] Browser testing
- [ ] Accessibility check

---

## Phase 6: Bug Fixes & Improvements 🟡 IN PROGRESS

### 6.1 Fix TypeScript Errors in IDE
- [ ] Add jest-dom type reference to `user-menu.test.tsx`
  - Add at line 1: `/// <reference types="@testing-library/jest-dom" />`
  - This fixes 23 TypeScript errors in Zed IDE
  - Errors are: "Property 'toBeInTheDocument' does not exist..."
  - **Note:** Tests run fine, this is purely IDE type checking

- [ ] Refactor jest.setup.ts to load translations dynamically
  - Location: `jest.setup.ts` lines 52-165 (replace hardcoded translationsMap)
  - **Why:** Hardcoded map gets out of sync, needs manual updates
  - **Better approach:** Import and flatten `messages/en.json`
  - **Steps:**
    1. Add import at top: `import translations from './messages/en.json';`
    2. Add flatten function (before translationsMap):
       ```typescript
       function flattenTranslations(obj: Record<string, any>, prefix = ''): Record<string, string> {
         return Object.keys(obj).reduce((acc, key) => {
           const fullKey = prefix ? `${prefix}.${key}` : key;
           if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
             Object.assign(acc, flattenTranslations(obj[key], fullKey));
           } else {
             acc[fullKey] = String(obj[key]);
           }
           return acc;
         }, {} as Record<string, string>);
       }
       ```
    3. Replace lines 52-165 with: `const translationsMap = flattenTranslations(translations);`
  - **Result:** Always in sync with messages/en.json, no manual updates needed

### 6.2 Add Tests for app-sidebar.tsx 🟡 IN PROGRESS
- [ ] Create `components/app-sidebar.test.tsx`
  - Currently: 0% test coverage
  - Component is complex with multiple features

- [ ] Test: Renders navigation items
  - Progress link
  - Goals section

- [ ] Test: Fetches and displays goals
  - Mock `getGoalsAction` to return test data
  - Verify goals render in sidebar

- [ ] Test: Fetches and displays regions
  - Mock `getRegionsAction` to return test data
  - Verify regions render under goals

- [ ] Test: Collapsible goals section
  - Test expanding/collapsing goals section
  - Verify ChevronRight icon rotates

- [ ] Test: Collapsible individual goals
  - Test expanding/collapsing individual goals
  - Verify regions show/hide

- [ ] Test: Auto-expansion based on pathname
  - Mock pathname: `/goals` → Goals section expands
  - Mock pathname: `/goals/[id]` → Goal expands
  - Mock pathname: `/goals/[id]/[regionId]` → Goal + Region visible

- [ ] Test: Collapse all functionality
  - Click collapse all button
  - Verify all sections collapse

- [ ] Test: UserMenu integration in footer
  - Verify UserMenu renders in SidebarFooter
  - Verify it receives correct props

- [ ] Test: Sidebar collapsible icon mode
  - Test sidebar state changes
  - Verify content adapts to collapsed mode

---

## Completion Checklist

Before marking this task as complete and archiving:

- [ ] All tasks in all phases complete
- [ ] All tests passing (target: ~238 tests)
- [ ] Build succeeds with no errors
- [ ] ESLint passes with no errors
- [ ] Manual testing complete in all scenarios
- [ ] Both English and German locales verified
- [ ] Code follows BEST_PRACTICES.md
- [ ] No console errors in browser
- [ ] Performance is acceptable (no lag)
- [ ] Accessibility requirements met

---

## Quick Resume

### If you need to resume this task:

1. **Check current phase:**
   - Look at phase markers (✅ COMPLETE, 🟡 IN PROGRESS, ⏳ NOT STARTED)

2. **Read context file:**
   - `user-avatar-sidebar-context.md` has SESSION PROGRESS
   - Shows what's completed, in progress, and blocked

3. **Find next task:**
   - Look for first `[ ]` unchecked item in current phase
   - If all items in current phase checked, move to next phase

4. **Reference plan file:**
   - `user-avatar-sidebar-plan.md` has detailed implementation guidance
   - Includes code examples, acceptance criteria, timelines

### Time Estimates by Phase

- Phase 0: Documentation → ✅ Complete
- Phase 1: Setup (20 min) → ⏳ Not Started
- Phase 2: UserMenu TDD (60 min) → ⏳ Not Started
- Phase 3: Integration (30 min) → ⏳ Not Started
- Phase 4: Settings Page (15 min) → ⏳ Not Started
- Phase 5: Testing (15 min) → ⏳ Not Started

**Total Remaining:** ~2 hours 20 minutes

---

## Notes

- Update this file as you complete tasks (check boxes)
- Update context file SESSION PROGRESS after major milestones
- If you discover new tasks, add them to the appropriate phase
- Keep phase status updated (⏳/🟡/✅)
