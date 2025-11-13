"use client";

import { useTheme } from "next-themes";
import { updateUserPreferencesAction } from "@/app/actions/user-preferences";
import { useRouter } from "next/navigation";

/**
 * Custom hook for syncing theme changes between next-themes and database
 *
 * This hook provides a `setThemeSync` function that:
 * 1. Updates the theme in next-themes (for immediate UI change)
 * 2. Persists the theme preference to the database (for persistence across sessions)
 *
 * @returns Object with current theme and setThemeSync function
 */
export function useThemeSync() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();
  const router = useRouter();

  /**
   * Set theme and sync to database
   * @param newTheme - The theme to set ("light", "dark", or "system")
   */
  const setThemeSync = async (newTheme: string) => {
    // Update theme in next-themes immediately for instant UI feedback
    setTheme(newTheme);

    // Persist to database
    const formData = new FormData();
    formData.append("theme", newTheme);

    const result = await updateUserPreferencesAction(formData);

    if (!result.success && "error" in result) {
      console.error("Failed to save theme preference:", result.error);
      // Optionally revert theme on error
      // setTheme(theme || "system");
    } else {
      // Refresh router to ensure all server components get updated preference
      router.refresh();
    }
  };

  return {
    theme,
    systemTheme,
    resolvedTheme,
    setThemeSync,
  };
}
