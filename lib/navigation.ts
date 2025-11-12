"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { Locale } from "./i18n";
import { setLocaleCookie } from "@/app/actions/locale";

/**
 * Hook for changing the application locale
 *
 * Sets a cookie via server action that is read by i18n.ts to determine the locale,
 * then triggers a page reload to apply the new locale.
 *
 * @example
 * ```tsx
 * const changeLocale = useChangeLocale();
 *
 * const handleLanguageChange = async (newLanguage: Locale) => {
 *   // Save to database first
 *   await updateUserPreferencesAction(formData);
 *   // Then change locale
 *   await changeLocale(newLanguage);
 * };
 * ```
 */
export function useChangeLocale() {
  const router = useRouter();

  const changeLocale = useCallback(
    async (newLocale: Locale) => {
      // Set cookie via server action (ensures it's set server-side)
      await setLocaleCookie(newLocale);

      // Refresh the router cache
      router.refresh();

      // Force a full reload to apply new locale
      window.location.reload();
    },
    [router],
  );

  return changeLocale;
}
