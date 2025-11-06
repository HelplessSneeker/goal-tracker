import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations("user");

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">{t("settings")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("account")}</CardTitle>
          <CardDescription>{session.user?.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t("settingsComingSoon")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
