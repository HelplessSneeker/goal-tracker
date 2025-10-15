"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TaskForm } from "@/components/tasks";

export default function AddTaskPage({
  params,
}: {
  params: Promise<{ id: string; regionId: string }>;
}) {
  const [goalId, setGoalId] = useState<string | null>(null);
  const [regionId, setRegionId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setGoalId(resolvedParams.id);
      setRegionId(resolvedParams.regionId);
    });
  }, [params]);

  if (!goalId || !regionId) {
    return null;
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

      <TaskForm mode="create" regionId={regionId} goalId={goalId} />
    </div>
  );
}
