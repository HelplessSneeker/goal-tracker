"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { RegionForm } from "@/components/regions/region-form";

export default function AddRegionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [goalId, setGoalId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setGoalId(resolvedParams.id);
    });
  }, [params]);

  if (!goalId) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl animate-fade-in">
      <Link
        href={`/goals/${goalId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Goal
      </Link>

      <RegionForm mode="create" goalId={goalId} />
    </div>
  );
}
