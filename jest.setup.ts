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

// Mock Prisma client
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    goal: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    region: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    task: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
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
