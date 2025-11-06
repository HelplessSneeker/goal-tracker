# User Avatar Sidebar - Implementation Plan

**Last Updated:** 2025-11-06

---

## Executive Summary

Add user profile functionality to the sidebar footer with an avatar displaying user initials, email address, and a dropdown menu containing "Sign Out" and "Settings" options. This completes the initial user functionality by providing easy access to account management features.

**Scope:**
- Install shadcn/ui Avatar and DropdownMenu components
- Create UserMenu component with TDD approach
- Integrate into sidebar footer with responsive behavior
- Create placeholder settings page
- Full i18n support (English, German)

**Timeline:** ~2-3 hours

**Risk Level:** Low (UI-only change, no database modifications)

---

## Current State Analysis

### Existing Infrastructure

**Sidebar Component** (`components/app-sidebar.tsx:112-237`)
- Client component with `"use client"` directive
- Uses shadcn/ui sidebar primitives
- Contains SidebarHeader and SidebarContent
- **Missing:** SidebarFooter (perfect place for user menu)
- Already responsive with collapsible icon mode

**Authentication** (`lib/auth.ts`)
- NextAuth.js with email provider (magic links)
- JWT session strategy
- Session includes: `user.id`, `user.email`, `user.name`, `user.image`
- Middleware already protects routes

**Available Components**
- ✅ Button, Card, Collapsible, Dialog, Input, Label, Separator, Sheet, Sidebar, Skeleton, Tooltip
- ❌ Avatar - **needs installation**
- ❌ DropdownMenu - **needs installation**

**Session Access Pattern**
```typescript
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const { data: session } = useSession();
// session.user: { id, email, name, image }
```

**Testing Infrastructure**
- Jest + React Testing Library
- Global Next.js mocks configured
- Server action mocks available
- Component tests follow pattern: `components/[feature]/[component]/[component].test.tsx`

### Gaps to Address

1. **Missing UI Components:** Avatar and DropdownMenu not installed
2. **No UserMenu Component:** Need new component for avatar + dropdown
3. **No SidebarFooter:** Sidebar lacks footer section
4. **No Settings Page:** Need `/settings` route (placeholder for now)
5. **Missing i18n Keys:** Need translations for "Sign Out", "Settings", etc.

---

## Proposed Future State

### Architecture

```
AppSidebar (components/app-sidebar.tsx)
├── SidebarHeader (existing)
├── SidebarContent (existing)
└── SidebarFooter (NEW)
    └── UserMenu (NEW component)
        ├── Avatar (user initials)
        ├── Email display
        └── DropdownMenu
            ├── Settings link → /settings
            └── Sign Out button
```

### User Experience

**Expanded Sidebar:**
```
┌─────────────────────┐
│  [☰] [Collapse All] │ ← Header
├─────────────────────┤
│  Progress           │
│  Goals ˅            │ ← Content
│    • Learn Next.js  │
├─────────────────────┤
│  [JD] john@ex.com   │ ← Footer (NEW)
│      ˅ Dropdown     │
└─────────────────────┘
```

**Collapsed Sidebar (Icon Mode):**
```
┌───┐
│ ☰ │ ← Header
├───┤
│ 📊│
│ 🎯│ ← Content
├───┤
│JD │ ← Footer (avatar only)
└───┘
```

**Dropdown Menu:**
- Settings → Navigate to `/settings`
- Sign Out → Call `signOut()` from NextAuth

### Component Structure

```
components/user-menu/
├── index.ts                  # Export UserMenu
├── user-menu.tsx            # Main component
└── user-menu.test.tsx       # Component tests
```

---

## Implementation Phases

### Phase 1: Setup & Dependencies (20 min)

**Goal:** Install required shadcn/ui components

#### Task 1.1: Install Avatar Component
- **Action:** `npx shadcn@latest add avatar`
- **Acceptance Criteria:**
  - `components/ui/avatar.tsx` created
  - Avatar, AvatarImage, AvatarFallback exported
  - No build errors

#### Task 1.2: Install DropdownMenu Component
- **Action:** `npx shadcn@latest add dropdown-menu`
- **Acceptance Criteria:**
  - `components/ui/dropdown-menu.tsx` created
  - DropdownMenu primitives available
  - No build errors

#### Task 1.3: Add i18n Translation Keys
- **Files:** `messages/en.json`, `messages/de.json`
- **Keys to Add:**
  ```json
  {
    "user": {
      "signOut": "Sign Out",
      "settings": "Settings",
      "account": "Account"
    }
  }
  ```
- **Acceptance Criteria:**
  - Keys added to both English and German
  - No duplicate keys

---

### Phase 2: UserMenu Component (TDD) (60 min)

**Goal:** Create UserMenu component following TDD workflow

#### Task 2.1: 🔴 RED - Write Failing Tests
- **File:** `components/user-menu/user-menu.test.tsx`
- **Test Cases:**
  1. Renders avatar with user initials (first letter of email)
  2. Displays user email address
  3. Shows dropdown menu on click
  4. Dropdown contains "Settings" link
  5. Dropdown contains "Sign Out" button
  6. "Settings" links to `/settings`
  7. "Sign Out" calls `signOut()` function
  8. Hides email when `hideEmail` prop is true (for collapsed sidebar)
  9. Shows loading state when session is loading
  10. Handles missing session gracefully

- **Mocks Needed:**
  - `useSession` from next-auth/react
  - `signOut` from next-auth/react
  - `useTranslations` from next-intl

- **Acceptance Criteria:**
  - All 10 tests written
  - All tests fail (no implementation yet)
  - Tests follow project patterns (see `goal-card.test.tsx`)

#### Task 2.2: 🟢 GREEN - Implement UserMenu Component
- **File:** `components/user-menu/user-menu.tsx`
- **Implementation:**
  ```typescript
  "use client";

  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
  import { useSession, signOut } from "next-auth/react";
  import { useTranslations } from "next-intl";
  import Link from "next/link";

  interface UserMenuProps {
    hideEmail?: boolean;
  }

  export function UserMenu({ hideEmail = false }: UserMenuProps) {
    const { data: session, status } = useSession();
    const t = useTranslations("user");

    // Implementation details...
  }
  ```

- **Features:**
  - Extract user initials from name or email
  - Display avatar with fallback
  - Show/hide email based on prop
  - Dropdown with Settings and Sign Out
  - Loading skeleton for session loading state

- **Acceptance Criteria:**
  - All tests pass
  - Component renders correctly
  - TypeScript compiles with no errors
  - Follows project code style

#### Task 2.3: ♻️ REFACTOR - Improve Code Quality
- **Refactoring:**
  - Extract initials generation logic to utility function
  - Optimize re-renders
  - Improve accessibility (ARIA labels)
  - Add proper tooltips

- **Acceptance Criteria:**
  - All tests still pass
  - Code follows BEST_PRACTICES.md
  - ESLint passes
  - No console warnings

#### Task 2.4: Create Index Export
- **File:** `components/user-menu/index.ts`
- **Content:**
  ```typescript
  export { UserMenu } from "./user-menu/user-menu";
  ```
- **Acceptance Criteria:**
  - Import works: `import { UserMenu } from "@/components/user-menu";`

---

### Phase 3: Sidebar Integration (30 min)

**Goal:** Add UserMenu to sidebar footer with responsive behavior

#### Task 3.1: Update AppSidebar Component
- **File:** `components/app-sidebar.tsx`
- **Changes:**
  1. Import `SidebarFooter` from `@/components/ui/sidebar`
  2. Import `UserMenu` from `@/components/user-menu`
  3. Add `<SidebarFooter>` after `<SidebarContent>`
  4. Render `<UserMenu />` inside footer
  5. Pass `hideEmail` prop based on collapsed state

- **Implementation Pattern:**
  ```typescript
  import { SidebarFooter } from "@/components/ui/sidebar";
  import { UserMenu } from "@/components/user-menu";

  // Inside return statement, after SidebarContent:
  <SidebarFooter>
    <UserMenu />
  </SidebarFooter>
  ```

- **Responsive Behavior:**
  - Expanded: Show avatar + email + dropdown
  - Collapsed (icon mode): Show only avatar + dropdown
  - Use `group-data-[collapsible=icon]:hidden` class for email

- **Acceptance Criteria:**
  - User menu appears at bottom of sidebar
  - Collapses properly in icon mode
  - Dropdown still works when collapsed
  - No layout shifts

#### Task 3.2: Manual Testing
- **Test Scenarios:**
  1. Open app, verify avatar shows with correct initials
  2. Verify email displays correctly
  3. Click avatar, verify dropdown opens
  4. Click "Settings", verify navigation to `/settings`
  5. Collapse sidebar, verify email hides
  6. Collapsed mode dropdown still accessible
  7. Click "Sign Out", verify logout works

- **Acceptance Criteria:**
  - All manual tests pass
  - UI looks polished
  - No console errors

---

### Phase 4: Settings Page (15 min)

**Goal:** Create placeholder settings page

#### Task 4.1: Create Settings Page
- **File:** `app/[locale]/settings/page.tsx`
- **Implementation:**
  ```typescript
  import { getServerSession } from "next-auth";
  import { authOptions } from "@/lib/auth";
  import { redirect } from "next/navigation";
  import { getTranslations } from "next-intl/server";

  export default async function SettingsPage() {
    const session = await getServerSession(authOptions);
    const t = await getTranslations("user");

    if (!session) {
      redirect("/auth/signin");
    }

    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{t("settings")}</h1>
        <p className="text-muted-foreground">
          Settings page coming soon...
        </p>
      </div>
    );
  }
  ```

- **Acceptance Criteria:**
  - Page renders for authenticated users
  - Redirects to signin if not authenticated
  - Uses i18n for title
  - No errors

#### Task 4.2: Add Settings Translation
- **Files:** `messages/en.json`, `messages/de.json`
- **Update user object:**
  ```json
  {
    "user": {
      "signOut": "Sign Out",
      "settings": "Settings",
      "account": "Account",
      "settingsComingSoon": "Settings page coming soon..."
    }
  }
  ```

- **Acceptance Criteria:**
  - Both languages updated
  - Page uses translations

---

### Phase 5: Testing & Verification (15 min)

**Goal:** Ensure everything works end-to-end

#### Task 5.1: Run All Tests
- **Command:** `pnpm test`
- **Expected:**
  - All existing tests pass (228 tests)
  - New UserMenu tests pass (~10 tests)
  - Total: ~238 tests passing

- **Acceptance Criteria:**
  - No test failures
  - No console warnings
  - Test coverage maintained

#### Task 5.2: Run Linting
- **Command:** `pnpm lint`
- **Acceptance Criteria:**
  - No ESLint errors
  - No TypeScript errors
  - Code follows style guide

#### Task 5.3: Build Check
- **Command:** `pnpm build`
- **Acceptance Criteria:**
  - Build completes successfully
  - No build warnings
  - No type errors

#### Task 5.4: Final Manual Testing
- **Test Full Workflow:**
  1. Fresh login → avatar appears
  2. Navigate around app → avatar persists
  3. Toggle sidebar → responsive behavior works
  4. Settings page → placeholder renders
  5. Sign out → redirects to signin page
  6. Both locales (English, German) → translations work

- **Acceptance Criteria:**
  - All workflows complete successfully
  - UI is polished and professional
  - No bugs discovered

---

## Risk Assessment & Mitigation

### Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Session not available in client component | High | Low | Use `useSession()` hook properly, handle loading state |
| Sidebar styling conflicts | Medium | Low | Test in both collapsed and expanded modes |
| Avatar initials logic edge cases | Low | Medium | Handle null/undefined names gracefully, test with various email formats |
| Dropdown positioning issues | Medium | Low | Use shadcn dropdown defaults, test on mobile |
| i18n keys conflict | Low | Low | Check for existing "user" namespace before adding |

### UX Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Avatar too small when collapsed | Medium | Medium | Test icon mode sizing, adjust if needed |
| Dropdown hard to access in collapsed mode | High | Low | Ensure click target is large enough |
| Sign out without confirmation | Low | High | Acceptable for MVP; can add confirmation later |

---

## Success Metrics

### Functional Requirements
- ✅ User avatar displays with correct initials
- ✅ Email address shown in expanded mode
- ✅ Dropdown menu accessible via click
- ✅ "Settings" navigates to `/settings` page
- ✅ "Sign Out" logs user out
- ✅ Responsive behavior in collapsed/expanded modes
- ✅ i18n works for both English and German

### Quality Requirements
- ✅ All tests pass (target: 100% UserMenu coverage)
- ✅ No TypeScript errors
- ✅ No ESLint warnings
- ✅ Build succeeds
- ✅ No console errors in browser
- ✅ Accessible (keyboard navigation, ARIA labels)

### Performance
- No measurable impact on page load time
- Dropdown opens instantly (<100ms)
- No layout shifts when toggling sidebar

---

## Dependencies

### External Dependencies
- shadcn/ui Avatar component (to be installed)
- shadcn/ui DropdownMenu component (to be installed)
- NextAuth.js (already configured)
- next-intl (already configured)

### Internal Dependencies
- `components/ui/sidebar.tsx` - SidebarFooter component exists
- `lib/auth.ts` - Session configuration
- `messages/*.json` - i18n translation files

### No Blockers
- All required infrastructure exists
- No database changes needed
- No API changes needed
- No authentication changes needed

---

## Timeline Estimates

| Phase | Tasks | Estimated Time | Cumulative |
|-------|-------|----------------|------------|
| Phase 1: Setup | 3 tasks | 20 min | 20 min |
| Phase 2: UserMenu (TDD) | 4 tasks | 60 min | 80 min |
| Phase 3: Sidebar Integration | 2 tasks | 30 min | 110 min |
| Phase 4: Settings Page | 2 tasks | 15 min | 125 min |
| Phase 5: Testing | 4 tasks | 15 min | 140 min |

**Total Estimated Time:** 2 hours 20 minutes

**Buffer for unexpected issues:** +30 minutes

**Total with buffer:** ~3 hours

---

## Post-Implementation

### Future Enhancements (Out of Scope)
- User profile image upload
- Settings page functionality (theme, language, etc.)
- Confirmation dialog before sign out
- User preferences management
- Avatar color customization

### Documentation Updates
- Update CLAUDE.md if needed
- Add to TODOs.md completed items

### Testing
- Consider adding E2E tests for auth flow
- Add visual regression tests for sidebar

---

## Quick Reference

### Key Files to Modify
- `components/app-sidebar.tsx` - Add SidebarFooter
- `components/user-menu/user-menu.tsx` - New component
- `components/user-menu/user-menu.test.tsx` - New tests
- `app/[locale]/settings/page.tsx` - New page
- `messages/en.json`, `messages/de.json` - Add translations

### Key Commands
```bash
# Install components
npx shadcn@latest add avatar
npx shadcn@latest add dropdown-menu

# Run tests
pnpm test
pnpm test:watch

# Build check
pnpm build
pnpm lint
```

### Import Patterns
```typescript
// UserMenu component
import { UserMenu } from "@/components/user-menu";

// Session hooks
import { useSession, signOut } from "next-auth/react";

// Sidebar components
import { SidebarFooter } from "@/components/ui/sidebar";
```
