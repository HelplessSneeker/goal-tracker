"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { RegionForm } from "@/components/regions";
import { getRegionAction } from "@/app/actions/regions";
import { useTranslations } from "next-intl";

export default function EditRegionPage({
  params,
}: {
  params: Promise<{ id: string; regionId: string }>;
}) {
  const t = useTranslations("regions");
  const tNav = useTranslations("navigation");
  const tCommon = useTranslations("common");
  const [goalId, setGoalId] = useState<string | null>(null);
  const [regionId, setRegionId] = useState<string | null>(null);
  const [regionData, setRegionData] = useState<{
    title: string;
    description: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setGoalId(resolvedParams.id);
      setRegionId(resolvedParams.regionId);
    });
  }, [params]);

  useEffect(() => {
    if (!regionId) return;

    const fetchRegion = async () => {
      try {
        const result = await getRegionAction(regionId);

        if ("error" in result || !result.region) {
          throw new Error(result.error || "Failed to fetch region");
        }

        setRegionData({
          title: result.region.title,
          description: result.region.description,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : t("failedToLoad"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegion();
  }, [regionId, t]);

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

  if (error || !regionData || !goalId || !regionId) {
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
        href={`/goals/${goalId}/${regionId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        {tNav("backToRegion")}
      </Link>

      <RegionForm
        mode="edit"
        goalId={goalId}
        initialData={regionData}
        regionId={regionId}
      />
    </div>
  );
}
