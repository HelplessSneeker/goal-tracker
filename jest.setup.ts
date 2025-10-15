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

// Setup global mocks
beforeEach(() => {
  // Clear all mocks before each test
  mockRouterPush.mockClear();
  mockRouterRefresh.mockClear();
  mockRouterBack.mockClear();

  // Setup fetch mock
  global.fetch = jest.fn();
});
