"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserPreferencesAction } from "@/app/actions/user-preferences";

interface UserPreferencesSectionProps {
  initialPreferences: {
    language: string; // 'en' | 'de'
    theme: string; // 'light' | 'dark' | 'system'
  };
}

export function UserPreferencesSection({
  initialPreferences,
}: UserPreferencesSectionProps) {
  const t = useTranslations("user");
  const [preferences, setPreferences] = useState(initialPreferences);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (key: "language" | "theme", value: string) => {
    // Optimistic update
    const previousPreferences = preferences;
    setPreferences((prev) => ({ ...prev, [key]: value }));

    startTransition(async () => {
      const formData = new FormData();
      formData.append(key, value);

      const result = await updateUserPreferencesAction(formData);

      if ("error" in result) {
        // Revert on error
        setPreferences(previousPreferences);
        console.error("Failed to update preferences:", result.error);
      } else {
        console.log("Preferences updated successfully");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("accountPreferences")}</CardTitle>
        <CardDescription>{t("preferencesDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Language Selector */}
          <div className="space-y-2">
            <Label htmlFor="language">{t("language")}</Label>
            <Select
              disabled={isPending}
              value={preferences.language}
              onValueChange={(value) => handleUpdate("language", value)}
            >
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t("english")}</SelectItem>
                <SelectItem value="de">{t("german")}</SelectItem>
              </SelectContent>
            </Select>
            {isPending && (
              <p className="text-sm text-muted-foreground">Updating...</p>
            )}
          </div>

          {/* Theme Selector */}
          <div className="space-y-2">
            <Label htmlFor="theme">{t("theme")}</Label>
            <Select
              disabled={isPending}
              value={preferences.theme}
              onValueChange={(value) => handleUpdate("theme", value)}
            >
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t("light")}</SelectItem>
                <SelectItem value="dark">{t("dark")}</SelectItem>
                <SelectItem value="system">{t("system")}</SelectItem>
              </SelectContent>
            </Select>
            {isPending && (
              <p className="text-sm text-muted-foreground">Updating...</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
