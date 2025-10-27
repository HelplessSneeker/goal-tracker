"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/lib/types";
import { TaskForm } from "@/components/tasks";
import { getTaskAction } from "@/app/actions/tasks";

export default function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string; regionId: string; taskId: string }>;
}) {
  const [goalId, setGoalId] = useState<string | null>(null);
  const [regionId, setRegionId] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskData, setTaskData] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setGoalId(resolvedParams.id);
      setRegionId(resolvedParams.regionId);
      setTaskId(resolvedParams.taskId);
    });
  }, [params]);

  useEffect(() => {
    if (!taskId) return;

    const fetchTask = async () => {
      try {
        const result = await getTaskAction(taskId);

        if ("error" in result || !result.task) {
          throw new Error(result.error || "Failed to fetch task");
        }

        setTaskData(result.task);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load task");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

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

  if (error || !taskData || !goalId || !regionId || !taskId) {
    return (
      <div className="container mx-auto p-6 max-w-2xl animate-fade-in">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-destructive">
              {error || "Failed to load task"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl animate-fade-in">
      <Link
        href={`/goals/${goalId}/${regionId}/tasks/${taskId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Task
      </Link>

      <TaskForm
        mode="edit"
        regionId={regionId}
        goalId={goalId}
        initialData={taskData}
        taskId={taskId}
      />
    </div>
  );
}
