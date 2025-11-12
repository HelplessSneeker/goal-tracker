"use server";

import { cookies } from "next/headers";
import { LOCALE_COOKIE_NAME } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";

/**
 * Server action to set the locale cookie
 * This ensures the cookie is set server-side and immediately available
 */
export async function setLocaleCookie(locale: Locale) {
  // Validate locale
  if (!locales.includes(locale)) {
    return { success: false, error: "Invalid locale" };
  }

  const cookieStore = await cookies();

  // Set cookie with proper options
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return { success: true };
}
