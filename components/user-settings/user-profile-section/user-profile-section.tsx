"use client";

import { useState, useTransition, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateUserNameAction } from "@/app/actions/user";

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
  const tCommon = useTranslations("common");

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [displayName, setDisplayName] = useState(user.name || "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Update display name when user prop changes (after page reload)
  useEffect(() => {
    setDisplayName(user.name || "");
    setName(user.name || "");
  }, [user.name]);

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(user.name || "");
    setError(null);
    setSuccess(null);
  };

  const handleSave = () => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", name);

      const result = await updateUserNameAction(formData);

      if ("error" in result) {
        setError(result.error);
      } else {
        // Update display name immediately for optimistic UI
        setDisplayName(name || "");
        setSuccess(t("nameUpdated"));
        setIsEditing(false);

        // Reload the page to refresh the session with the new name
        setTimeout(() => {
          window.location.reload();
        }, 1500); // Give user time to see success message
      }
    });
  };

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

          <div className="space-y-3 flex-1">
            {/* Name field */}
            <div>
              <Label className="text-sm font-medium">{t("name")}</Label>
              {isEditing ? (
                <div className="mt-1 space-y-2">
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("name")}
                    disabled={isPending}
                    className="max-w-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={isPending}
                      size="sm"
                    >
                      {isPending ? tCommon("saving") : t("saveName")}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      disabled={isPending}
                      variant="outline"
                      size="sm"
                    >
                      {tCommon("cancel")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">
                    {displayName || t("noNameSet")}
                  </p>
                  <Button
                    onClick={handleEdit}
                    variant="ghost"
                    size="sm"
                    className="h-auto py-1 px-2"
                  >
                    {t("editName")}
                  </Button>
                </div>
              )}
            </div>

            {/* Email field */}
            <div>
              <Label className="text-sm font-medium">{t("email")}</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {user.email}
              </p>
            </div>

            {/* Success message */}
            {success && (
              <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 p-3 rounded-md">
                {success}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
