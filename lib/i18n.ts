import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { LOCALE_COOKIE_NAME } from "./constants";

// Supported locales
export const locales = ["en", "de"] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = "en";

// Locale configuration for next-intl
export default getRequestConfig(async () => {
  // Get locale from cookie directly
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(LOCALE_COOKIE_NAME)?.value;
  // Validate locale, fallback to default if invalid
  let locale: string = localeCookie || defaultLocale;

  if (!locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
