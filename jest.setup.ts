// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import React from "react";
import translations from "./messages/en.json";

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

// Mock matchMedia (used by use-mobile hook in sidebar)
// Only add if window is defined (jsdom environment)
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Flatten nested JSON to dot notation (e.g., "user.signOut" from {user: {signOut: "Sign Out"}})
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Generic function for flattening any nested object
function flattenTranslations(
  obj: Record<string, any>,
  prefix = "",
): Record<string, string> {
  return Object.keys(obj).reduce(
    (acc, key) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        Object.assign(acc, flattenTranslations(obj[key], fullKey));
      } else {
        acc[fullKey] = String(obj[key]);
      }
      return acc;
    },
    {} as Record<string, string>,
  );
}

// Translation map dynamically loaded from messages/en.json
// This ensures tests always use the same translations as the app
const translationsMap: Record<string, string> =
  flattenTranslations(translations);

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
    userPreferences: {
      findMany: jest.fn() as jest.Mock,
      findUnique: jest.fn() as jest.Mock,
      findFirst: jest.fn() as jest.Mock,
      create: jest.fn() as jest.Mock,
      update: jest.fn() as jest.Mock,
      delete: jest.fn() as jest.Mock,
      count: jest.fn() as jest.Mock,
    },
    user: {
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

// Mock locale server action
jest.mock("@/app/actions/locale", () => ({
  setLocaleCookie: jest.fn().mockResolvedValue({ success: true }),
}));

// Mock navigation hooks for locale switching
export const mockChangeLocale = jest.fn();
jest.mock("@/lib/navigation", () => ({
  useChangeLocale: () => mockChangeLocale,
}));

// Mock next-themes
export const mockSetTheme = jest.fn();
jest.mock("next-themes", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  useTheme: () => ({
    theme: "light",
    setTheme: mockSetTheme,
    systemTheme: "light",
    resolvedTheme: "light",
    themes: ["light", "dark", "system"],
  }),
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

jest.mock("@/app/actions/user-preferences", () => ({
  getUserPreferencesAction: jest.fn(),
  updateUserPreferencesAction: jest.fn(),
}));

jest.mock("@/app/actions/user", () => ({
  updateUserNameAction: jest.fn(),
}));

// Setup global mocks
beforeEach(() => {
  // Clear all mocks before each test
  mockRouterPush.mockClear();
  mockRouterRefresh.mockClear();
  mockRouterBack.mockClear();
  mockGetServerSession.mockClear();
  mockChangeLocale.mockClear();
  mockSetTheme.mockClear();

  // Setup fetch mock
  global.fetch = jest.fn();
});
