import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  UserProfileSection,
  UserPreferencesSection,
} from "@/components/user-settings";
import { getUserPreferences } from "@/lib/services/user-preferences.service";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("user");

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // Fetch real preferences (auto-creates if not exist)
  const preferences = await getUserPreferences(session.user.id);

  return (
    <div className="container mx-auto p-6 max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("settings")}</h1>
      </div>

      <div className="space-y-6">
        <UserProfileSection
          user={{
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          }}
        />

        <UserPreferencesSection
          initialPreferences={{
            language: preferences?.language || "en",
            theme: preferences?.theme || "system",
          }}
        />
      </div>
    </div>
  );
}
