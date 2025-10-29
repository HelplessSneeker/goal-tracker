"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { GoalForm } from "@/components/goals";
import { getGoalAction } from "@/app/actions/goals";
import { useTranslations } from "next-intl";

export default function EditGoalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = useTranslations("goals");
  const tNav = useTranslations("navigation");
  const tCommon = useTranslations("common");
  const [id, setId] = useState<string | null>(null);
  const [goalData, setGoalData] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchGoal = async () => {
      try {
        const result = await getGoalAction(id);

        if ("error" in result || !result.goal) {
          throw new Error(result.error || "Failed to fetch goal");
        }

        setGoalData({
          title: result.goal.title,
          description: result.goal.description,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : t("failedToLoad"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoal();
  }, [id, t]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl animate-fade-in">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">{tCommon("loading")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !goalData) {
    return (
      <div className="container mx-auto p-6 max-w-2xl animate-fade-in">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-destructive">
              {error || t("failedToLoad")}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl animate-fade-in">
      <Link
        href={id ? `/goals/${id}` : "/goals"}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        {tNav("backToGoal")}
      </Link>

      <GoalForm mode="edit" initialData={goalData} goalId={id || undefined} />
    </div>
  );
}
