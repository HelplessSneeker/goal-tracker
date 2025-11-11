"use client";

import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface UserProfileSectionProps {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

/**
 * Helper function to generate initials from name or email
 */
const getInitials = (name: string | null, email: string | null): string => {
  if (name) {
    const names = name.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }
  return email?.[0]?.toUpperCase() || "U";
};

export function UserProfileSection({ user }: UserProfileSectionProps) {
  const t = useTranslations("user");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profile")}</CardTitle>
        <CardDescription>{t("profileDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            {user.image && (
              <AvatarImage src={user.image} alt={user.name || "User"} />
            )}
            <AvatarFallback className="text-2xl">
              {getInitials(user.name, user.email)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium">{t("name")}</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {user.name || t("noNameSet")}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">{t("email")}</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
