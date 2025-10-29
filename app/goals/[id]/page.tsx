import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { GoalDetailHeader } from "@/components/goals";
import { Button } from "@/components/ui/button";
import { RegionCard } from "@/components/regions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getGoalById } from "@/lib/services/goals.service";
import { getRegionsForGoal } from "@/lib/services/regions.service";
import { getTranslations } from "next-intl/server";

export default async function GoalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("goals");
  const tRegions = await getTranslations("regions");
  const tNav = await getTranslations("navigation");
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/auth/signin");
  }

  const { id } = await params;
  const goal = await getGoalById(id, session.user.id);

  if (!goal) {
    notFound();
  }

  const regions = await getRegionsForGoal(id, session.user.id);

  return (
    <div className="container mx-auto p-6 max-w-4xl animate-fade-in">
      <Link
        href="/goals"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        {tNav("backToGoals")}
      </Link>

      <GoalDetailHeader goal={goal} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">{t("regions")}</h2>
          <Link href={`/goals/${id}/addRegion`}>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              {tRegions("newRegion")}
            </Button>
          </Link>
        </div>
        {regions.length > 0 ? (
          <div className="grid gap-4">
            {regions.map((region) => (
              <RegionCard key={region.id} region={region} goalId={id} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                {t("noRegions")}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
