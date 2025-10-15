"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Region } from "@/lib/types";
import { RegionForm } from "@/components/regions";

export default function EditRegionPage({
  params,
}: {
  params: Promise<{ id: string; regionId: string }>;
}) {
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
        const res = await fetch(`/api/regions/${regionId}`);
        if (!res.ok) {
          throw new Error("Failed to fetch region");
        }
        const region: Region = await res.json();
        setRegionData({
          title: region.title,
          description: region.description,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load region");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegion();
  }, [regionId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-2xl animate-fade-in">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading...</p>
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
              {error || "Failed to load region"}
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
        Back to Region
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
