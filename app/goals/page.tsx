import { GoalCard } from "@/components/goals";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getGoalsForUser } from "@/lib/services/goals.service";
import { getRegionsForGoal } from "@/lib/services/regions.service";
import { getTranslations } from "next-intl/server";

export default async function GoalsPage() {
  const t = await getTranslations("goals");
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/auth/signin");
  }

  // Use service layer for goals
  const goals = await getGoalsForUser(session.user.id);

  // Fetch regions for each goal using service layer with ownership verification
  const regionsPromises = goals.map((goal) =>
    getRegionsForGoal(goal.id, session.user!.id)
  );
  const regionsArrays = await Promise.all(regionsPromises);
  const regions = regionsArrays.flat();

  return (
    <div className="container mx-auto p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t("myGoals")}</h1>
        <Link href="/goals/create">
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            {t("newGoal")}
          </Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((goal) => {
          const goalRegions = regions.filter((r) => r.goalId === goal.id);
          return <GoalCard key={goal.id} goal={goal} regions={goalRegions} />;
        })}
      </div>
    </div>
  );
}
