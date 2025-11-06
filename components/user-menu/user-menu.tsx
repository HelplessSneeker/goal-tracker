"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession, signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Settings, LogOut } from "lucide-react";

interface UserMenuProps {
  hideEmail?: boolean;
}

/**
 * Get user initials from name or email
 */
function getInitials(user?: { name?: string | null; email?: string | null }): string {
  if (!user) return "?";

  // Try to get initials from name first
  if (user.name && user.name.trim()) {
    const nameParts = user.name.trim().split(" ");
    if (nameParts.length >= 2) {
      // Take first letter of first two words
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    // Single name - just first letter
    return nameParts[0][0].toUpperCase();
  }

  // Fallback to email
  if (user.email && user.email.trim()) {
    return user.email[0].toUpperCase();
  }

  // No name or email
  return "?";
}

export function UserMenu({ hideEmail = false }: UserMenuProps) {
  const { data: session, status } = useSession();
  const t = useTranslations("user");

  // Loading state
  if (status === "loading") {
    return (
      <div
        data-testid="user-menu-loading"
        className="flex items-center gap-3 p-2"
      >
        <Skeleton className="h-10 w-10 rounded-full" />
        {!hideEmail && <Skeleton className="h-4 w-32" />}
      </div>
    );
  }

  // Unauthenticated or no session
  if (status === "unauthenticated" || !session?.user) {
    return null;
  }

  const initials = getInitials(session.user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 w-full p-2 hover:bg-sidebar-accent rounded-md transition-colors">
          <Avatar className="h-10 w-10">
            {session.user.image && (
              <AvatarImage src={session.user.image} alt={session.user.name || session.user.email || "User"} />
            )}
            <AvatarFallback className="bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!hideEmail && session.user.email && (
            <span className="text-sm text-sidebar-foreground truncate flex-1 text-left">
              {session.user.email}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem asChild>
          <Link
            href="/settings"
            className="flex items-center gap-2 cursor-pointer"
          >
            <Settings className="h-4 w-4" />
            <span>{t("settings")}</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span>{t("signOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
