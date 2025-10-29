// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import React from "react";

// Create mock functions that can be accessed in tests
export const mockRouterPush = jest.fn();
export const mockRouterRefresh = jest.fn();
export const mockRouterBack = jest.fn();

// Mock Next.js navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockRouterPush,
    replace: jest.fn(),
    refresh: mockRouterRefresh,
    back: mockRouterBack,
    forward: jest.fn(),
    prefetch: jest.fn(),
    pathname: "/",
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
  notFound: jest.fn(),
  redirect: jest.fn(),
}));

// Mock Next.js Link component - render as anchor tag
jest.mock("next/link", () => {
  return function Link({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Required for Link component props spreading in tests
    [key: string]: any;
  }) {
    return React.createElement("a", { href, ...props }, children);
  };
});

// Mock ResizeObserver (used by tooltips and other UI components)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Translation map for both client and server
const translationsMap: Record<string, string> = {
      // Common
      "common.title": "Title",
      "common.description": "Description",
      "common.cancel": "Cancel",
      "common.edit": "Edit",
      "common.delete": "Delete",
      "common.loading": "Loading...",
      "common.creating": "Creating...",
      "common.saving": "Saving...",
      "common.deleting": "Deleting...",
      "common.error": "An error occurred",
      "common.deadline": "Deadline",
      // Navigation
      "navigation.sidebar": "Navigation",
      "navigation.progress": "Progress",
      "navigation.goals": "Goals",
      "navigation.collapseAll": "Collapse all",
      "navigation.backToGoals": "Back to Goals",
      "navigation.backToGoal": "Back to Goal",
      "navigation.backToRegion": "Back to Region",
      "navigation.backToTask": "Back to Task",
      // Auth - Sign In
      "auth.signIn.title": "Sign In / Sign Up",
      "auth.signIn.description": "Enter your email to receive a magic link. Works for both new and existing accounts.",
      "auth.signIn.emailLabel": "Email",
      "auth.signIn.emailPlaceholder": "you@example.com",
      "auth.signIn.sending": "Sending...",
      "auth.signIn.submitButton": "Send Magic Link",
      "auth.signIn.errorEmail": "Failed to send email. Please try again.",
      "auth.signIn.errorUnexpected": "An unexpected error occurred. Please try again.",
      // Auth - Verify Request
      "auth.verifyRequest.title": "Check your email",
      "auth.verifyRequest.message1": "A sign in link has been sent to your email address",
      "auth.verifyRequest.message2": "Click the link in the email to sign in to your account.",
      "auth.verifyRequest.message3": "You can close this window and check your email inbox.",
      // Goals
      "goals.myGoals": "My Goals",
      "goals.newGoal": "New Goal",
      "goals.createNew": "Create New Goal",
      "goals.editGoal": "Edit Goal",
      "goals.createDescription": "Add a new goal to track your progress",
      "goals.editDescription": "Update your goal information",
      "goals.titlePlaceholder": "e.g., Learn Next.js",
      "goals.descriptionPlaceholder": "Describe your goal...",
      "goals.createButton": "Create Goal",
      "goals.saveButton": "Save Changes",
      "goals.failedToLoad": "Failed to load goal",
      "goals.regionsLabel": "Regions:",
      "goals.regions": "Regions",
      "goals.noRegions": "No regions for this goal yet.",
      // Regions
      "regions.newRegion": "New Region",
      "regions.createNew": "Create New Region",
      "regions.editRegion": "Edit Region",
      "regions.createDescription": "Add a new region to organize your work",
      "regions.editDescription": "Update your region information",
      "regions.titlePlaceholder": "e.g., Master Server Components",
      "regions.descriptionPlaceholder": "Describe this region...",
      "regions.createButton": "Create Region",
      "regions.saveButton": "Save Changes",
      "regions.failedToLoad": "Failed to load region",
      "regions.noTasks": "No tasks for this region yet.",
      // Tasks
      "tasks.newTask": "New Task",
      "tasks.createNew": "Create New Task",
      "tasks.editTask": "Edit Task",
      "tasks.createDescription": "Add a new task with a deadline to create urgency",
      "tasks.editDescription": "Update your task information",
      "tasks.titlePlaceholder": "e.g., Build 3 projects using Server Components",
      "tasks.descriptionPlaceholder": "Describe this task...",
      "tasks.createButton": "Create Task",
      "tasks.saveButton": "Save Changes",
      "tasks.failedToLoad": "Failed to load task",
      "tasks.tasks": "Tasks",
      "tasks.weeklyTasks": "Weekly Tasks",
      "tasks.weeklyTasksDescription": "Break this task down into weekly action items",
      "tasks.weeklyTasksComingSoon": "Weekly tasks feature coming soon...",
      "tasks.status.active": "active",
      "tasks.status.completed": "completed",
      // Delete goal
      "delete.goal.title": "Delete Goal",
      "delete.goal.warning": "Are you sure you want to delete",
      "delete.goal.warningStrong": "Warning: This action cannot be undone",
      "delete.goal.description": "This will permanently delete the goal and everything associated with it, including:",
      "delete.goal.consequence1": "All regions",
      "delete.goal.consequence2": "All tasks",
      "delete.goal.consequence3": "All weekly tasks",
      "delete.goal.consequence4": "All progress entries",
      "delete.goal.confirmPrompt": "To confirm, type the goal title:",
      "delete.goal.confirmPlaceholder": "Type goal title to confirm",
      "delete.goal.deleteButton": "Delete Goal",
      // Delete region
      "delete.region.title": "Delete Region",
      "delete.region.warning": "Are you sure you want to delete",
      "delete.region.warningStrong": "Warning: This action cannot be undone",
      "delete.region.description": "This will permanently delete the region and everything associated with it, including:",
      "delete.region.consequence1": "All tasks in this region",
      "delete.region.consequence2": "All weekly tasks for those tasks",
      "delete.region.consequence3": "All progress entries for those weekly tasks",
      "delete.region.confirmPrompt": "To confirm, type the region title:",
      "delete.region.confirmPlaceholder": "Type region title to confirm",
      "delete.region.deleteButton": "Delete Region",
      "delete.region.errorMismatch": "Region name does not match",
      // Delete task
      "delete.task.title": "Delete Task",
      "delete.task.warning": "This action cannot be undone. This will permanently delete the task",
      "delete.task.consequence1": "All weekly tasks associated with this task",
      "delete.task.consequence2": "All progress entries for those weekly tasks",
      "delete.task.confirmPrompt": "Please type {title} to confirm:",
      "delete.task.confirmPlaceholder": "Type task title to confirm",
      "delete.task.errorMismatch": "Task name does not match",
      "delete.task.deleteButton": "Delete Task",
};

// Translation function with param support
const translate = (key: string, params?: Record<string, string>): string => {
  let translation = translationsMap[key] || key;
  if (params) {
    Object.keys(params).forEach((param) => {
      translation = translation.replace(`{${param}}`, params[param]);
    });
  }
  return translation;
};

// Mock next-intl with translations from en.json
jest.mock("next-intl", () => ({
  useTranslations: (namespace?: string) => {
    return (key: string, params?: Record<string, string>) => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      return translate(fullKey, params);
    };
  },
  useFormatter: () => ({
    dateTime: (date: Date) => date.toLocaleDateString(),
  }),
}));

// Mock next-intl/server
jest.mock("next-intl/server", () => ({
  getTranslations: async (namespace?: string) => {
    return (key: string, params?: Record<string, string>) => {
      const fullKey = namespace ? `${namespace}.${key}` : key;
      return translate(fullKey, params);
    };
  },
  getFormatter: async () => ({
    dateTime: (date: Date) => date.toLocaleDateString(),
  }),
  setRequestLocale: jest.fn(),
  getLocale: async () => "en",
  getMessages: async () => translationsMap,
  getNow: async () => new Date(),
  getTimeZone: async () => "UTC",
  getRequestConfig: async () => ({ locale: "en", messages: translationsMap }),
}));

// Mock Prisma client with properly typed mock functions
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    goal: {
      findMany: jest.fn() as jest.Mock,
      findUnique: jest.fn() as jest.Mock,
      findFirst: jest.fn() as jest.Mock,
      create: jest.fn() as jest.Mock,
      update: jest.fn() as jest.Mock,
      delete: jest.fn() as jest.Mock,
      count: jest.fn() as jest.Mock,
    },
    region: {
      findMany: jest.fn() as jest.Mock,
      findUnique: jest.fn() as jest.Mock,
      findFirst: jest.fn() as jest.Mock,
      create: jest.fn() as jest.Mock,
      update: jest.fn() as jest.Mock,
      delete: jest.fn() as jest.Mock,
      count: jest.fn() as jest.Mock,
    },
    task: {
      findMany: jest.fn() as jest.Mock,
      findUnique: jest.fn() as jest.Mock,
      findFirst: jest.fn() as jest.Mock,
      create: jest.fn() as jest.Mock,
      update: jest.fn() as jest.Mock,
      delete: jest.fn() as jest.Mock,
      count: jest.fn() as jest.Mock,
    },
  },
}));

// Mock NextAuth
export const mockGetServerSession = jest.fn();
jest.mock("next-auth", () => ({
  getServerSession: mockGetServerSession,
}));

// Mock Server Actions for component tests
jest.mock("@/app/actions/goals", () => ({
  createGoalAction: jest.fn(),
  updateGoalAction: jest.fn(),
  deleteGoalAction: jest.fn(),
  getGoalsAction: jest.fn(),
  getGoalAction: jest.fn(),
}));

jest.mock("@/app/actions/regions", () => ({
  createRegionAction: jest.fn(),
  updateRegionAction: jest.fn(),
  deleteRegionAction: jest.fn(),
  getRegionsAction: jest.fn(),
  getRegionAction: jest.fn(),
}));

jest.mock("@/app/actions/tasks", () => ({
  createTaskAction: jest.fn(),
  updateTaskAction: jest.fn(),
  deleteTaskAction: jest.fn(),
  getTasksAction: jest.fn(),
  getTaskAction: jest.fn(),
}));

// Setup global mocks
beforeEach(() => {
  // Clear all mocks before each test
  mockRouterPush.mockClear();
  mockRouterRefresh.mockClear();
  mockRouterBack.mockClear();
  mockGetServerSession.mockClear();

  // Setup fetch mock
  global.fetch = jest.fn();
});
