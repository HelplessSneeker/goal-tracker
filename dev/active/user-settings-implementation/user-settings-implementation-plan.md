# User Settings Implementation - Strategic Plan

**Last Updated:** 2025-11-11

---

## Executive Summary

Implement a complete user settings page for the goal-tracking application in two distinct phases. Phase 1 focuses on UI structure and display without backend functionality, while Phase 2 adds database persistence and full interactivity. This approach allows for rapid UI prototyping and iterative development while maintaining the project's TDD standards.

**Total Estimated Effort:** XL (2-3 days)
- Phase 1: M (4-6 hours)
- Phase 2: L (8-12 hours)

---

## Current State Analysis

### Existing Implementation
- **Settings Page**: Minimal placeholder at `/app/settings/page.tsx`
  - Basic Server Component with authentication
  - Shows email in CardDescription
  - Contains "Coming soon..." placeholder text

- **User Data Available** (from NextAuth session):
  - `user.id` (String, CUID)
  - `user.email` (String, optional)
  - `user.name` (String, optional)
  - `user.image` (String, optional)

- **Related Components**:
  - UserMenu component (avatar display pattern established)
  - GoalForm component (form pattern to follow)

### Database Schema (Current)
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  goals         Goal[]
}
```

**Note:** No UserPreferences model exists yet (Phase 2 addition)

### Authentication Setup
- NextAuth.js with email provider (magic links)
- JWT session strategy (no database sessions)
- Session callback adds user ID from token
- Middleware protects routes at `/home/beni/Documents/github.com/HelplessSneeker/goal-tracker/middleware.ts`

### i18n Configuration
- next-intl v4.4.0
- Languages: English (en), German (de)
- Translation files: `/messages/en.json`, `/messages/de.json`
- Existing user keys: signOut, settings, account, settingsComingSoon

### Testing Infrastructure
- Jest + React Testing Library
- Current: 260/260 tests passing (~4.1s)
- 100% coverage requirement for services/actions
- TDD workflow enforced

---

## Proposed Future State

### Phase 1 Completion State
A fully functional settings page UI that:
- Displays user profile information (avatar, name, email)
- Shows preferences section with language and theme selectors
- Indicates upcoming functionality with "Coming soon" labels
- Follows established component patterns and styling
- Has comprehensive test coverage for UI rendering

### Phase 2 Completion State
A complete user settings system that:
- Persists user preferences in database (language, theme)
- Allows users to update their preferences
- Validates and sanitizes user input
- Follows TDD principles with 100% service/action coverage
- Integrates seamlessly with existing authentication
- Supports i18n for all UI elements

---

## Implementation Phases

---

## PHASE 1: UI STRUCTURE (No Backend Implementation)

**Goal:** Create a complete, visually functional settings page without database persistence

**Estimated Effort:** M (4-6 hours)

---

### Section 1.1: i18n Translation Setup

**Priority:** HIGH (Foundation for all UI work)

#### Task 1.1.1: Add English Translations
**Effort:** S
**File:** `/messages/en.json`

**Acceptance Criteria:**
- [ ] Add complete user settings translation keys to `en.json`
- [ ] All keys are organized under "user" namespace
- [ ] Translations are clear and concise
- [ ] No duplicate keys exist

**Required Keys:**
```json
"user": {
  "profile": "Profile",
  "profileDescription": "Your account information",
  "name": "Name",
  "email": "Email",
  "noNameSet": "No name set",
  "accountPreferences": "Account Preferences",
  "preferencesDescription": "Manage your account settings",
  "language": "Language",
  "english": "English",
  "german": "German",
  "theme": "Theme",
  "light": "Light",
  "dark": "Dark",
  "system": "System",
  "comingSoon": "(Coming soon)",
  "preferencesAvailableSoon": "Preference settings will be available soon"
}
```

**Dependencies:** None

---

#### Task 1.1.2: Add German Translations
**Effort:** S
**File:** `/messages/de.json`

**Acceptance Criteria:**
- [ ] Add German translations for all keys from 1.1.1
- [ ] Translations are grammatically correct
- [ ] Keys match exactly with English version
- [ ] Cultural appropriateness verified

**Required Keys:**
```json
"user": {
  "profile": "Profil",
  "profileDescription": "Ihre Kontoinformationen",
  "name": "Name",
  "email": "E-Mail",
  "noNameSet": "Kein Name festgelegt",
  "accountPreferences": "Kontoeinstellungen",
  "preferencesDescription": "Verwalten Sie Ihre Kontoeinstellungen",
  "language": "Sprache",
  "english": "Englisch",
  "german": "Deutsch",
  "theme": "Theme",
  "light": "Hell",
  "dark": "Dunkel",
  "system": "System",
  "comingSoon": "(Demnächst verfügbar)",
  "preferencesAvailableSoon": "Einstellungsoptionen werden bald verfügbar sein"
}
```

**Dependencies:** Task 1.1.1

---

### Section 1.2: UserProfileSection Component

**Priority:** HIGH (Core component)

#### Task 1.2.1: Create UserProfileSection Component
**Effort:** M
**File:** `/components/user-settings/user-profile-section/user-profile-section.tsx`

**Acceptance Criteria:**
- [ ] Client Component with `"use client"` directive
- [ ] Displays user avatar (large size: h-20 w-20)
- [ ] Shows user name or "No name set" fallback
- [ ] Shows user email
- [ ] Uses Card wrapper (shadcn/ui pattern)
- [ ] Implements avatar fallback logic (initials from name/email)
- [ ] Uses i18n translations (useTranslations hook)
- [ ] Follows established component styling patterns

**Component Interface:**
```typescript
interface UserProfileSectionProps {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}
```

**Design Pattern:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>{t("profile")}</CardTitle>
    <CardDescription>{t("profileDescription")}</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex items-center gap-6">
      <Avatar className="h-20 w-20">
        {/* Avatar logic */}
      </Avatar>
      <div className="space-y-2">
        <div>
          <Label>{t("name")}</Label>
          <p>{user.name || t("noNameSet")}</p>
        </div>
        <div>
          <Label>{t("email")}</Label>
          <p>{user.email}</p>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

**Dependencies:** Tasks 1.1.1, 1.1.2

---

#### Task 1.2.2: Create UserProfileSection Tests
**Effort:** M
**File:** `/components/user-settings/user-profile-section/user-profile-section.test.tsx`

**Acceptance Criteria:**
- [ ] All test cases pass
- [ ] Tests follow established patterns (from goal-form.test.tsx)
- [ ] Covers all rendering scenarios
- [ ] Uses proper mocks from jest.setup.ts

**Test Cases:**
```typescript
describe("UserProfileSection", () => {
  describe("Avatar Display", () => {
    it("renders avatar image when provided")
    it("shows initials fallback when no image (two-word name)")
    it("shows initials fallback when no image (one-word name)")
    it("shows email initial when no name or image")
  });

  describe("Profile Information", () => {
    it("displays user name when provided")
    it("shows 'No name set' when name is null")
    it("displays user email")
  });

  describe("i18n", () => {
    it("displays translated labels correctly")
  });
});
```

**Dependencies:** Task 1.2.1

---

### Section 1.3: UserPreferencesSection Component

**Priority:** HIGH (Core component)

#### Task 1.3.1: Create UserPreferencesSection Component
**Effort:** M
**File:** `/components/user-settings/user-preferences-section/user-preferences-section.tsx`

**Acceptance Criteria:**
- [ ] Client Component with `"use client"` directive
- [ ] Displays language selector (disabled, read-only)
- [ ] Displays theme selector (disabled, read-only)
- [ ] Shows "(Coming soon)" indicators
- [ ] Uses Card wrapper
- [ ] Uses i18n translations
- [ ] Accepts current preferences as props (for Phase 2 compatibility)

**Component Interface:**
```typescript
interface UserPreferencesSectionProps {
  preferences: {
    language: string; // 'en' | 'de'
    theme: string;    // 'light' | 'dark' | 'system'
  };
  readOnly?: boolean; // true for Phase 1, false for Phase 2
}
```

**Design Pattern:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>{t("accountPreferences")}</CardTitle>
    <CardDescription>{t("preferencesDescription")}</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {/* Language Selector */}
      <div className="space-y-2">
        <Label>{t("language")}</Label>
        <Select disabled={readOnly} value={preferences.language}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">{t("english")}</SelectItem>
            <SelectItem value="de">{t("german")}</SelectItem>
          </SelectContent>
        </Select>
        {readOnly && <p className="text-sm text-muted-foreground">{t("comingSoon")}</p>}
      </div>

      {/* Theme Selector */}
      <div className="space-y-2">
        <Label>{t("theme")}</Label>
        <Select disabled={readOnly} value={preferences.theme}>
          {/* Similar pattern */}
        </Select>
        {readOnly && <p className="text-sm text-muted-foreground">{t("comingSoon")}</p>}
      </div>
    </div>
  </CardContent>
</Card>
```

**Dependencies:** Tasks 1.1.1, 1.1.2

---

#### Task 1.3.2: Create UserPreferencesSection Tests
**Effort:** M
**File:** `/components/user-settings/user-preferences-section/user-preferences-section.test.tsx`

**Acceptance Criteria:**
- [ ] All test cases pass
- [ ] Tests cover read-only state (Phase 1)
- [ ] Tests verify disabled selectors
- [ ] Tests verify "Coming soon" messages display

**Test Cases:**
```typescript
describe("UserPreferencesSection", () => {
  describe("Read-Only Mode (Phase 1)", () => {
    it("renders language selector as disabled")
    it("renders theme selector as disabled")
    it("displays current language value")
    it("displays current theme value")
    it("shows 'Coming soon' indicator for language")
    it("shows 'Coming soon' indicator for theme")
  });

  describe("i18n", () => {
    it("displays translated labels correctly")
    it("displays translated preference options")
  });
});
```

**Dependencies:** Task 1.3.1

---

### Section 1.4: Component Organization

**Priority:** MEDIUM (Code organization)

#### Task 1.4.1: Create Component Index File
**Effort:** S
**File:** `/components/user-settings/index.ts`

**Acceptance Criteria:**
- [ ] Exports UserProfileSection component
- [ ] Exports UserPreferencesSection component
- [ ] Follows established export pattern

**Implementation:**
```typescript
export { UserProfileSection } from "./user-profile-section/user-profile-section";
export { UserPreferencesSection } from "./user-preferences-section/user-preferences-section";
```

**Dependencies:** Tasks 1.2.1, 1.3.1

---

### Section 1.5: Settings Page Integration

**Priority:** HIGH (Brings everything together)

#### Task 1.5.1: Update Settings Page
**Effort:** M
**File:** `/app/settings/page.tsx`

**Acceptance Criteria:**
- [ ] Remove placeholder content
- [ ] Import components from user-settings index
- [ ] Fetch session data (getServerSession)
- [ ] Pass user data to UserProfileSection
- [ ] Pass mock preferences to UserPreferencesSection with readOnly=true
- [ ] Use i18n for page title
- [ ] Follow established page layout patterns
- [ ] Handle session null case (redirect to signin)

**Implementation Pattern:**
```typescript
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { UserProfileSection, UserPreferencesSection } from "@/components/user-settings";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("user");

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Mock preferences for Phase 1 (will be fetched from DB in Phase 2)
  const mockPreferences = {
    language: "en", // Could detect from session or default
    theme: "system"
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("settings")}</h1>
      </div>

      <div className="space-y-6">
        <UserProfileSection
          user={{
            name: session.user.name,
            email: session.user.email,
            image: session.user.image
          }}
        />

        <UserPreferencesSection
          preferences={mockPreferences}
          readOnly={true}
        />
      </div>
    </div>
  );
}
```

**Dependencies:** Tasks 1.2.1, 1.3.1, 1.4.1

---

### Section 1.6: Testing & Validation

**Priority:** HIGH (Quality assurance)

#### Task 1.6.1: Run Test Suite
**Effort:** S

**Acceptance Criteria:**
- [ ] All existing tests still pass (260 tests)
- [ ] New component tests pass (expected ~10-12 new tests)
- [ ] Total test count: ~272-275 tests
- [ ] No TypeScript errors
- [ ] Test execution time < 5s

**Commands:**
```bash
pnpm test
pnpm lint
```

**Dependencies:** All Phase 1 tasks

---

#### Task 1.6.2: Manual Browser Testing
**Effort:** S

**Acceptance Criteria:**
- [ ] Settings page loads without errors
- [ ] User avatar displays correctly (with and without image)
- [ ] User name displays correctly (with null fallback)
- [ ] Email displays correctly
- [ ] Language selector shows current value, is disabled
- [ ] Theme selector shows current value, is disabled
- [ ] "Coming soon" messages display
- [ ] i18n works (switch locale, verify translations)
- [ ] Page layout matches other pages (Goals, Tasks, etc.)
- [ ] Responsive design works on mobile/tablet

**Test Scenarios:**
1. User with full profile (name, email, image)
2. User with no name (null)
3. User with no image (null)
4. Language switcher (/de/settings vs /en/settings)

**Dependencies:** Task 1.5.1

---

## PHASE 1 DELIVERABLES

- ✅ Functional settings page with profile display
- ✅ Preferences UI (read-only, "Coming soon" state)
- ✅ Complete i18n support (EN + DE)
- ✅ Comprehensive test coverage for UI components
- ✅ No TypeScript errors
- ✅ ~272-275 tests passing

**Definition of Done:**
- All Phase 1 tasks completed and checked off
- Test suite passes with new tests
- Manual testing confirms UI works as expected
- Code follows established patterns and conventions
- Ready to proceed to Phase 2 backend implementation

---

---

## PHASE 2: BACKEND FUNCTIONALITY IMPLEMENTATION

**Goal:** Add database persistence and full interactivity to user preferences

**Estimated Effort:** L (8-12 hours)

---

### Section 2.1: Database Schema Updates

**Priority:** CRITICAL (Foundation for all backend work)

#### Task 2.1.1: Design UserPreferences Model
**Effort:** S
**File:** `/prisma/schema.prisma`

**Acceptance Criteria:**
- [ ] UserPreferences model added to schema
- [ ] One-to-one relationship with User model
- [ ] Uses UUID primary key (consistent with project)
- [ ] Includes language and theme fields
- [ ] Has timestamps (createdAt, updatedAt)
- [ ] Proper indexes for userId

**Schema Design:**
```prisma
model UserPreferences {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Preferences
  language  String   @default("en")  // 'en' | 'de'
  theme     String   @default("system") // 'light' | 'dark' | 'system'

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

// Update User model to include relation
model User {
  id            String           @id @default(cuid())
  name          String?
  email         String?          @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  goals         Goal[]
  preferences   UserPreferences? // Add this line
}
```

**Dependencies:** None

---

#### Task 2.1.2: Run Database Migration
**Effort:** S

**Acceptance Criteria:**
- [ ] Schema pushed to database successfully
- [ ] Prisma client regenerated
- [ ] No migration errors
- [ ] Existing data preserved

**Commands:**
```bash
pnpm prisma db push
pnpm prisma generate
```

**Validation:**
```bash
pnpm prisma studio  # Verify UserPreferences table exists
```

**Dependencies:** Task 2.1.1

---

#### Task 2.1.3: Create Default Preferences Seed
**Effort:** S
**File:** `/prisma/seed.ts`

**Acceptance Criteria:**
- [ ] Seed creates default preferences for existing users
- [ ] Seed is idempotent (can run multiple times safely)
- [ ] Defaults: language='en', theme='system'

**Implementation:**
```typescript
// Add to existing seed.ts
async function createDefaultPreferences() {
  const users = await prisma.user.findMany({
    where: {
      preferences: null
    }
  });

  for (const user of users) {
    await prisma.userPreferences.create({
      data: {
        userId: user.id,
        language: 'en',
        theme: 'system'
      }
    });
  }

  console.log(`Created default preferences for ${users.length} users`);
}

// Call in main()
await createDefaultPreferences();
```

**Dependencies:** Task 2.1.2

---

### Section 2.2: Validation Layer

**Priority:** HIGH (Required for service/actions)

#### Task 2.2.1: Create Preferences Validation Schemas
**Effort:** S
**File:** `/lib/validation.ts`

**Acceptance Criteria:**
- [ ] Zod schemas for language and theme
- [ ] Enum validation for allowed values
- [ ] Update preferences schema with both fields
- [ ] Export schemas for use in actions

**Implementation:**
```typescript
// Add to validation.ts
export const languageSchema = z.enum(["en", "de"], {
  errorMap: () => ({ message: "Language must be either 'en' or 'de'" }),
});

export const themeSchema = z.enum(["light", "dark", "system"], {
  errorMap: () => ({ message: "Theme must be 'light', 'dark', or 'system'" }),
});

export const updateUserPreferencesSchema = z.object({
  language: languageSchema.optional(),
  theme: themeSchema.optional(),
});

export type UpdateUserPreferencesInput = z.infer<typeof updateUserPreferencesSchema>;
```

**Dependencies:** None

---

### Section 2.3: Service Layer (TDD Approach)

**Priority:** CRITICAL (Core business logic)

#### Task 2.3.1: Write User Preferences Service Tests (RED)
**Effort:** M
**File:** `/lib/services/user-preferences.service.test.ts`

**Acceptance Criteria:**
- [ ] Test file structure follows established pattern
- [ ] All tests initially fail (RED phase)
- [ ] Covers all CRUD operations
- [ ] Tests user ownership verification
- [ ] Tests null returns for unauthorized access
- [ ] Uses Prisma mocks from jest.setup.ts

**Test Structure:**
```typescript
import { prismaMock } from "@/lib/prisma";
import {
  getUserPreferences,
  createUserPreferences,
  updateUserPreferences,
} from "./user-preferences.service";

describe("UserPreferencesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserPreferences", () => {
    it("returns user preferences when found")
    it("returns null when preferences don't exist")
    it("returns null when userId doesn't match")
    it("creates default preferences if none exist")
  });

  describe("createUserPreferences", () => {
    it("creates preferences with default values")
    it("creates preferences with provided values")
    it("returns null if user doesn't exist")
  });

  describe("updateUserPreferences", () => {
    it("updates language preference")
    it("updates theme preference")
    it("updates both preferences")
    it("returns null if preferences don't exist")
    it("returns null if userId doesn't match (unauthorized)")
  });
});
```

**Expected Test Count:** ~10-12 tests
**Expected Result:** All tests fail (RED)

**Dependencies:** Task 2.2.1

---

#### Task 2.3.2: Implement User Preferences Service (GREEN)
**Effort:** M
**File:** `/lib/services/user-preferences.service.ts`

**Acceptance Criteria:**
- [ ] All tests from 2.3.1 pass (GREEN phase)
- [ ] Implements getUserPreferences with auto-creation logic
- [ ] Implements updateUserPreferences with ownership check
- [ ] Returns null for unauthorized access
- [ ] Proper TypeScript interfaces
- [ ] Follows established service patterns

**Implementation:**
```typescript
import { prisma } from "@/lib/prisma";

export interface UserPreferencesData {
  id: string;
  userId: string;
  language: string;
  theme: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserPreferencesData {
  language?: string;
  theme?: string;
}

/**
 * Get user preferences, create with defaults if not exist
 */
export async function getUserPreferences(
  userId: string
): Promise<UserPreferencesData | null> {
  let preferences = await prisma.userPreferences.findUnique({
    where: { userId },
  });

  // Auto-create defaults if not exist
  if (!preferences) {
    preferences = await prisma.userPreferences.create({
      data: {
        userId,
        language: "en",
        theme: "system",
      },
    });
  }

  return preferences;
}

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  userId: string,
  data: UpdateUserPreferencesData
): Promise<UserPreferencesData | null> {
  // Verify ownership
  const existing = await prisma.userPreferences.findUnique({
    where: { userId },
  });

  if (!existing || existing.userId !== userId) {
    return null;
  }

  return await prisma.userPreferences.update({
    where: { userId },
    data,
  });
}
```

**Dependencies:** Task 2.3.1

---

#### Task 2.3.3: Refactor Service (REFACTOR)
**Effort:** S

**Acceptance Criteria:**
- [ ] All tests still pass
- [ ] Code is DRY (no duplication)
- [ ] Error handling is robust
- [ ] Type safety improved where possible
- [ ] Comments added for complex logic

**Dependencies:** Task 2.3.2

---

### Section 2.4: Server Actions (TDD Approach)

**Priority:** CRITICAL (API layer)

#### Task 2.4.1: Write User Preferences Action Tests (RED)
**Effort:** M
**File:** `/app/actions/user-preferences.test.ts`

**Acceptance Criteria:**
- [ ] Test file follows established action test pattern
- [ ] All tests initially fail (RED phase)
- [ ] Tests authentication requirements
- [ ] Tests validation errors
- [ ] Tests success responses
- [ ] Tests error responses with ActionErrorCode
- [ ] Mocks service layer functions

**Test Structure:**
```typescript
import { getServerSession } from "next-auth";
import {
  getUserPreferencesAction,
  updateUserPreferencesAction
} from "./user-preferences";
import * as userPreferencesService from "@/lib/services/user-preferences.service";
import { ActionErrorCode } from "@/lib/action-types";

jest.mock("next-auth");
jest.mock("@/lib/services/user-preferences.service");

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>;
const mockGetUserPreferences = userPreferencesService.getUserPreferences as jest.MockedFunction<
  typeof userPreferencesService.getUserPreferences
>;
const mockUpdateUserPreferences = userPreferencesService.updateUserPreferences as jest.MockedFunction<
  typeof userPreferencesService.updateUserPreferences
>;

describe("User Preferences Actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserPreferencesAction", () => {
    it("returns preferences when authenticated")
    it("returns UNAUTHORIZED error when not authenticated")
    it("returns DATABASE_ERROR when service fails")
  });

  describe("updateUserPreferencesAction", () => {
    it("updates preferences successfully with valid data")
    it("returns UNAUTHORIZED when not authenticated")
    it("returns VALIDATION_ERROR for invalid language")
    it("returns VALIDATION_ERROR for invalid theme")
    it("returns NOT_FOUND when preferences don't exist")
    it("returns DATABASE_ERROR when update fails")
  });
});
```

**Expected Test Count:** ~8-10 tests
**Expected Result:** All tests fail (RED)

**Dependencies:** Task 2.3.2

---

#### Task 2.4.2: Implement User Preferences Actions (GREEN)
**Effort:** M
**File:** `/app/actions/user-preferences.ts`

**Acceptance Criteria:**
- [ ] All tests from 2.4.1 pass (GREEN phase)
- [ ] Uses getServerSession for authentication
- [ ] Validates FormData with Zod schemas
- [ ] Calls service layer functions
- [ ] Returns ActionResponse<T> format
- [ ] Proper error handling with ActionErrorCode
- [ ] Follows established action patterns

**Implementation:**
```typescript
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getUserPreferences,
  updateUserPreferences,
  type UserPreferencesData
} from "@/lib/services/user-preferences.service";
import {
  updateUserPreferencesSchema,
  validateFormData
} from "@/lib/validation";
import {
  type ActionResponse,
  ActionErrorCode
} from "@/lib/action-types";

/**
 * Get current user preferences
 */
export async function getUserPreferencesAction(): Promise<
  ActionResponse<UserPreferencesData>
> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        error: "You must be logged in to view preferences",
        code: ActionErrorCode.UNAUTHORIZED,
      };
    }

    const preferences = await getUserPreferences(session.user.id);

    if (!preferences) {
      return {
        error: "Failed to load preferences",
        code: ActionErrorCode.DATABASE_ERROR,
      };
    }

    return { success: true, data: preferences };
  } catch (error) {
    console.error("Error in getUserPreferencesAction:", error);
    return {
      error: "Failed to load preferences",
      code: ActionErrorCode.UNKNOWN_ERROR,
    };
  }
}

/**
 * Update user preferences
 */
export async function updateUserPreferencesAction(
  formData: FormData
): Promise<ActionResponse<UserPreferencesData>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        error: "You must be logged in to update preferences",
        code: ActionErrorCode.UNAUTHORIZED,
      };
    }

    const validation = validateFormData(formData, updateUserPreferencesSchema);
    if ("error" in validation) {
      return validation;
    }

    const updated = await updateUserPreferences(
      session.user.id,
      validation.data
    );

    if (!updated) {
      return {
        error: "Preferences not found",
        code: ActionErrorCode.NOT_FOUND,
      };
    }

    return { success: true, data: updated };
  } catch (error) {
    console.error("Error in updateUserPreferencesAction:", error);
    return {
      error: "Failed to update preferences",
      code: ActionErrorCode.DATABASE_ERROR,
    };
  }
}
```

**Dependencies:** Task 2.4.1

---

#### Task 2.4.3: Refactor Actions (REFACTOR)
**Effort:** S

**Acceptance Criteria:**
- [ ] All tests still pass
- [ ] Error messages are user-friendly
- [ ] Consistent error handling
- [ ] Code follows DRY principles

**Dependencies:** Task 2.4.2

---

### Section 2.5: Component Updates

**Priority:** HIGH (Connect UI to backend)

#### Task 2.5.1: Update UserPreferencesSection for Interactivity
**Effort:** M
**File:** `/components/user-settings/user-preferences-section/user-preferences-section.tsx`

**Acceptance Criteria:**
- [ ] Remove readOnly prop logic (make fully interactive)
- [ ] Add state for preferences (useState)
- [ ] Add loading/submitting state
- [ ] Call updateUserPreferencesAction on change
- [ ] Show success/error messages
- [ ] Optimistic UI updates
- [ ] Remove "Coming soon" messages

**Key Changes:**
```typescript
"use client";

import { useState, useTransition } from "react";
import { updateUserPreferencesAction } from "@/app/actions/user-preferences";
import { useToast } from "@/hooks/use-toast";

export function UserPreferencesSection({
  initialPreferences
}: {
  initialPreferences: { language: string; theme: string }
}) {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleUpdate = (key: 'language' | 'theme', value: string) => {
    // Optimistic update
    setPreferences(prev => ({ ...prev, [key]: value }));

    startTransition(async () => {
      const formData = new FormData();
      formData.append(key, value);

      const result = await updateUserPreferencesAction(formData);

      if ("error" in result) {
        // Revert on error
        setPreferences(initialPreferences);
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Preferences updated",
          description: "Your preferences have been saved.",
        });
      }
    });
  };

  return (
    <Card>
      {/* Selects are now enabled, call handleUpdate onChange */}
    </Card>
  );
}
```

**Dependencies:** Task 2.4.2

---

#### Task 2.5.2: Update UserPreferencesSection Tests
**Effort:** M
**File:** `/components/user-settings/user-preferences-section/user-preferences-section.test.tsx`

**Acceptance Criteria:**
- [ ] Update tests for interactive mode
- [ ] Add tests for preference changes
- [ ] Add tests for loading states
- [ ] Add tests for error handling
- [ ] Add tests for success messages
- [ ] Mock updateUserPreferencesAction

**New Test Cases:**
```typescript
describe("UserPreferencesSection", () => {
  // Keep existing rendering tests

  describe("Interactive Mode (Phase 2)", () => {
    it("enables language selector")
    it("enables theme selector")
    it("calls action when language changes")
    it("calls action when theme changes")
    it("shows loading state during update")
    it("shows success toast on successful update")
    it("shows error toast on failed update")
    it("reverts optimistic update on error")
  });
});
```

**Dependencies:** Task 2.5.1

---

#### Task 2.5.3: Update Settings Page to Fetch Real Preferences
**Effort:** S
**File:** `/app/settings/page.tsx`

**Acceptance Criteria:**
- [ ] Call getUserPreferences service directly (Server Component)
- [ ] Remove mock preferences
- [ ] Handle null case (should auto-create via service)
- [ ] Pass real data to components

**Key Changes:**
```typescript
import { getUserPreferences } from "@/lib/services/user-preferences.service";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  // ... auth check

  // Fetch real preferences (auto-creates if not exist)
  const preferences = await getUserPreferences(session.user.id);

  return (
    <div className="container mx-auto p-6 max-w-4xl animate-fade-in">
      <UserProfileSection user={session.user} />

      <UserPreferencesSection
        initialPreferences={{
          language: preferences?.language || "en",
          theme: preferences?.theme || "system"
        }}
      />
    </div>
  );
}
```

**Dependencies:** Task 2.5.1

---

### Section 2.6: Test Infrastructure Updates

**Priority:** MEDIUM (Enable component testing)

#### Task 2.6.1: Update Jest Setup with Action Mocks
**Effort:** S
**File:** `/jest.setup.ts`

**Acceptance Criteria:**
- [ ] Mock getUserPreferencesAction
- [ ] Mock updateUserPreferencesAction
- [ ] Mocks return proper ActionResponse format
- [ ] Consistent with existing action mocks

**Implementation:**
```typescript
// Add to jest.setup.ts
jest.mock("@/app/actions/user-preferences", () => ({
  getUserPreferencesAction: jest.fn(),
  updateUserPreferencesAction: jest.fn(),
}));
```

**Dependencies:** Task 2.4.2

---

### Section 2.7: Integration Testing

**Priority:** HIGH (Quality assurance)

#### Task 2.7.1: Run Full Test Suite
**Effort:** S

**Acceptance Criteria:**
- [ ] All 260+ existing tests pass
- [ ] All new service tests pass (~10-12 tests)
- [ ] All new action tests pass (~8-10 tests)
- [ ] Updated component tests pass (~10-12 tests)
- [ ] Total: ~290-295 tests passing
- [ ] No TypeScript errors
- [ ] Test execution time < 6s

**Commands:**
```bash
pnpm test
pnpm test:coverage  # Verify 100% coverage for services/actions
pnpm lint
```

**Dependencies:** All Phase 2 implementation tasks

---

#### Task 2.7.2: Database Integration Testing
**Effort:** M

**Acceptance Criteria:**
- [ ] Can create user preferences via seed
- [ ] Can read preferences via Prisma Studio
- [ ] Can update preferences via UI
- [ ] Updates persist across sessions
- [ ] Cascade delete works (delete user → preferences deleted)

**Test Scenarios:**
```bash
# 1. Reset database
pnpm prisma db push --force-reset

# 2. Run seed
pnpm prisma db seed

# 3. Verify in Prisma Studio
pnpm prisma studio
# Check: UserPreferences table has entries for all users

# 4. Test in browser (manual)
```

**Dependencies:** Task 2.1.3

---

#### Task 2.7.3: End-to-End Manual Testing
**Effort:** M

**Acceptance Criteria:**
- [ ] User can view current preferences
- [ ] User can change language preference
- [ ] Language change persists (reload page)
- [ ] User can change theme preference
- [ ] Theme change persists (reload page)
- [ ] Success toasts display correctly
- [ ] Error handling works (simulate DB failure)
- [ ] Loading states display during updates
- [ ] Works in both English and German locales
- [ ] Responsive design maintained

**Test Scenarios:**
1. **First-time user**: Preferences auto-created with defaults
2. **Existing user**: Preferences loaded correctly
3. **Update language**: EN → DE, verify persistence
4. **Update theme**: System → Dark, verify persistence
5. **Error handling**: Disconnect DB, verify error toast
6. **Concurrent updates**: Change multiple preferences quickly

**Dependencies:** All Phase 2 tasks

---

## PHASE 2 DELIVERABLES

- ✅ UserPreferences database model with migrations
- ✅ Complete service layer with 100% test coverage
- ✅ Complete server actions with 100% test coverage
- ✅ Interactive preferences UI (language, theme selection)
- ✅ Data persistence and validation
- ✅ Error handling and user feedback (toasts)
- ✅ ~290-295 tests passing
- ✅ End-to-end functionality verified

**Definition of Done:**
- All Phase 2 tasks completed and checked off
- Database schema updated and migrated
- TDD workflow followed (RED → GREEN → REFACTOR)
- All tests passing with 100% service/action coverage
- Manual testing confirms full functionality
- User preferences persist across sessions
- Error handling works correctly
- Ready for production deployment

---

---

## Risk Assessment and Mitigation Strategies

### Technical Risks

#### Risk 1: Database Migration Issues
**Probability:** MEDIUM
**Impact:** HIGH

**Description:** Prisma schema changes may cause migration conflicts or data loss

**Mitigation:**
- Use `db push` in development (not production)
- Test migration on separate database first
- Back up existing data before migration
- Use cascade delete to maintain referential integrity
- Verify migration with Prisma Studio before proceeding

**Rollback Plan:**
- Keep copy of schema before changes
- Use `git revert` if needed
- Re-run `prisma db push` with old schema

---

#### Risk 2: Session State Synchronization
**Probability:** MEDIUM
**Impact:** MEDIUM

**Description:** User preferences (language, theme) may be cached in session/cookies, causing sync issues

**Mitigation:**
- Use database as single source of truth
- Implement optimistic UI updates with revert on error
- Clear client-side cache after updates
- Consider revalidating session after preference changes
- Use toast notifications to confirm updates

**Monitoring:**
- Test with multiple tabs open
- Verify updates reflect immediately
- Check cookie/session state in dev tools

---

#### Risk 3: Test Complexity with FormData
**Probability:** LOW
**Impact:** LOW

**Description:** FormData validation in tests can be tricky to mock correctly

**Mitigation:**
- Follow established patterns from goals/regions/tasks tests
- Use helper functions for FormData creation
- Validate both success and error paths
- Mock service layer consistently

**Example:**
```typescript
const formData = new FormData();
formData.append("language", "de");
```

---

#### Risk 4: i18n Translation Gaps
**Probability:** LOW
**Impact:** LOW

**Description:** Missing or incorrect translations could break UI

**Mitigation:**
- Add all keys to both EN and DE files simultaneously
- Use TypeScript for translation key validation
- Manual testing in both locales
- Keep translations simple and clear

**Validation:**
- Switch locale in browser
- Verify all labels display correctly
- Check jest.setup.ts has matching mocks

---

### User Experience Risks

#### Risk 5: Preferences Not Loading
**Probability:** LOW
**Impact:** MEDIUM

**Description:** Auto-creation logic in getUserPreferences might fail

**Mitigation:**
- Comprehensive service layer tests
- Error handling in service + action layers
- Fallback to defaults if DB read fails
- Seed default preferences for existing users

**Monitoring:**
- Check logs for service errors
- Verify Prisma queries in Studio
- Test with users who have/don't have preferences

---

#### Risk 6: Slow Update Response
**Probability:** LOW
**Impact:** LOW

**Description:** DB writes might feel slow to users

**Mitigation:**
- Implement optimistic UI updates
- Show loading indicators during updates
- Use toast notifications for feedback
- Consider debouncing rapid changes

**Performance Targets:**
- Update response < 500ms
- Optimistic update immediate
- Toast appears within 100ms

---

### Development Process Risks

#### Risk 7: Phase 1 Incomplete Before Phase 2
**Probability:** LOW
**Impact:** MEDIUM

**Description:** Starting Phase 2 before Phase 1 is solid could cause rework

**Mitigation:**
- Strict task ordering and dependencies
- Definition of Done for Phase 1
- Full test suite passing before Phase 2
- Manual testing checkpoint

**Checkpoint Criteria:**
- All Phase 1 tests passing
- UI visually complete
- i18n working in both locales
- Code review complete (if applicable)

---

#### Risk 8: Breaking Existing Functionality
**Probability:** LOW
**Impact:** HIGH

**Description:** Changes to User model or auth flow could break goals/regions/tasks

**Mitigation:**
- Run full test suite after every change
- Maintain 260+ existing tests passing
- Optional relation (User.preferences?)
- No changes to existing User fields

**Validation:**
- Test goal creation/editing
- Test region creation/editing
- Test task creation/editing
- Verify UserMenu still works

---

## Success Metrics

### Phase 1 Success Criteria
- [ ] Settings page loads without errors
- [ ] Profile section displays all user data correctly
- [ ] Preferences section shows selectors (disabled)
- [ ] "Coming soon" indicators present
- [ ] ~272-275 tests passing (added ~12-15 tests)
- [ ] Zero TypeScript errors
- [ ] i18n works for both EN and DE
- [ ] Manual testing in browser successful
- [ ] Code follows established patterns

---

### Phase 2 Success Criteria
- [ ] UserPreferences table exists in database
- [ ] Default preferences created for all users
- [ ] Service layer: 100% test coverage (~10-12 tests)
- [ ] Actions layer: 100% test coverage (~8-10 tests)
- [ ] Component tests updated (~10-12 tests)
- [ ] ~290-295 total tests passing
- [ ] Zero TypeScript errors
- [ ] User can update preferences via UI
- [ ] Preferences persist across sessions
- [ ] Error handling works (error toasts display)
- [ ] Loading states display during updates
- [ ] Optimistic updates work correctly
- [ ] Manual end-to-end testing successful

---

### Overall Project Success Criteria
- [ ] User settings feature complete and functional
- [ ] No regressions in existing features (goals, regions, tasks)
- [ ] Documentation updated (CLAUDE.md, TODOs.md)
- [ ] Test coverage maintained at 100% for services/actions
- [ ] Performance: Settings page loads < 1s
- [ ] Performance: Preference updates < 500ms
- [ ] Accessibility: Keyboard navigation works
- [ ] Responsive: Works on mobile, tablet, desktop
- [ ] i18n: Full support for English and German
- [ ] Code quality: Passes lint with zero errors

---

## Required Resources and Dependencies

### External Dependencies
- **Database:** PostgreSQL instance (existing)
- **Packages:** No new packages required
  - Existing: Prisma, NextAuth, next-intl, Zod, shadcn/ui

### Internal Dependencies

#### Phase 1
- Existing components: Card, Avatar, Select, Label
- Existing utilities: cn(), useTranslations
- Existing mocks: jest.setup.ts
- Translation files: messages/en.json, messages/de.json

#### Phase 2
- Prisma client and schema
- NextAuth session handling
- Validation utilities (Zod)
- Action response types
- Service layer patterns
- Toast notification system (shadcn/ui)

### Development Environment
- Node.js (current version)
- pnpm package manager
- PostgreSQL database
- TypeScript 5.x
- Jest + React Testing Library

### Knowledge Requirements
- Next.js 15 App Router patterns
- Server Actions and Server Components
- Prisma ORM (schema design, migrations)
- NextAuth.js session handling
- Zod validation
- TDD methodology (RED-GREEN-REFACTOR)
- React Testing Library patterns
- i18n with next-intl

---

## Timeline Estimates

### Phase 1: UI Structure
**Total: 4-6 hours**

| Section | Tasks | Estimated Time |
|---------|-------|----------------|
| 1.1 i18n Setup | 2 tasks | 30 min |
| 1.2 UserProfileSection | 2 tasks | 1.5 hours |
| 1.3 UserPreferencesSection | 2 tasks | 1.5 hours |
| 1.4 Component Organization | 1 task | 15 min |
| 1.5 Settings Page Integration | 1 task | 45 min |
| 1.6 Testing & Validation | 2 tasks | 45 min |
| **Buffer** | - | 30 min |

**Milestones:**
- Hour 1-2: i18n + UserProfileSection complete
- Hour 3-4: UserPreferencesSection complete
- Hour 4-5: Integration + testing
- Hour 5-6: Manual testing + refinement

---

### Phase 2: Backend Functionality
**Total: 8-12 hours**

| Section | Tasks | Estimated Time |
|---------|-------|----------------|
| 2.1 Database Schema | 3 tasks | 1 hour |
| 2.2 Validation Layer | 1 task | 30 min |
| 2.3 Service Layer (TDD) | 3 tasks | 2.5 hours |
| 2.4 Server Actions (TDD) | 3 tasks | 2.5 hours |
| 2.5 Component Updates | 3 tasks | 2 hours |
| 2.6 Test Infrastructure | 1 task | 30 min |
| 2.7 Integration Testing | 3 tasks | 2 hours |
| **Buffer** | - | 1 hour |

**Milestones:**
- Hour 1-2: Database + validation setup
- Hour 3-5: Service layer (TDD)
- Hour 6-8: Server actions (TDD)
- Hour 9-10: Component integration
- Hour 11-12: Testing + validation

---

### Combined Timeline
**Total: 12-18 hours** (1.5 - 2.5 days)

**Suggested Schedule:**
- **Day 1 Morning:** Phase 1 (4-6 hours)
- **Day 1 Afternoon:** Phase 2 Database + Validation (1.5 hours)
- **Day 2 Morning:** Phase 2 Service Layer (2.5 hours)
- **Day 2 Afternoon:** Phase 2 Actions + Components (4.5 hours)
- **Day 3 Morning:** Phase 2 Testing + Refinement (2 hours)

**Critical Path:**
1. Phase 1 must complete before Phase 2 starts
2. Database schema must complete before service/actions
3. Service layer must complete before actions
4. Actions must complete before component integration
5. All implementation before integration testing

---

## Appendix: Code Examples and Patterns

### A. Avatar Initials Logic (from UserMenu)
```typescript
const getInitials = (name: string | null, email: string | null): string => {
  if (name) {
    const names = name.split(" ");
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return names[0][0];
  }
  return email?.[0] || "U";
};
```

### B. ActionResponse Pattern
```typescript
// Success
return { success: true, data: preferences };

// Error
return {
  error: "Failed to update preferences",
  code: ActionErrorCode.VALIDATION_ERROR
};
```

### C. FormData Validation Pattern
```typescript
const validation = validateFormData(formData, updateUserPreferencesSchema);
if ("error" in validation) {
  return validation; // Return ActionError
}
// Use validation.data (typed)
```

### D. Service Layer Ownership Check
```typescript
const existing = await prisma.userPreferences.findUnique({
  where: { userId },
});

if (!existing || existing.userId !== userId) {
  return null; // Unauthorized
}
```

### E. Test Mock Pattern
```typescript
// Mock service
mockGetUserPreferences.mockResolvedValue({
  id: "pref-123",
  userId: "user-123",
  language: "en",
  theme: "system",
  createdAt: new Date(),
  updatedAt: new Date(),
});

// Mock action
mockUpdateUserPreferencesAction.mockResolvedValue({
  success: true,
  data: { ...preferences }
});
```

---

## Document Version Control

**Version:** 1.0
**Created:** 2025-11-11
**Last Updated:** 2025-11-11
**Author:** Planning Agent
**Status:** Active Development Plan

**Change Log:**
- 2025-11-11: Initial plan created for two-phase implementation
