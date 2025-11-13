"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

/**
 * Theme Provider Component
 *
 * Wraps next-themes ThemeProvider to provide theme switching functionality.
 * Supports light, dark, and system themes with proper hydration handling.
 *
 * @param props - ThemeProvider props from next-themes
 * @returns Theme provider wrapper component
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
