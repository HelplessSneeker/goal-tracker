import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getUserPreferences } from "@/lib/services/user-preferences.service";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Goal Tracker",
  description: "Track your goals and regions",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const messages = await getMessages();

  // Fetch user's theme preference if authenticated
  let theme = "system"; // Default theme
  if (session?.user?.id) {
    const preferences = await getUserPreferences(session.user.id);
    if (preferences?.theme) {
      theme = preferences.theme;
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Providers theme={theme}>
            {session ? (
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 md:hidden">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold">Goal Tracker</h1>
                  </header>
                  {children}
                </SidebarInset>
              </SidebarProvider>
            ) : (
              children
            )}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
