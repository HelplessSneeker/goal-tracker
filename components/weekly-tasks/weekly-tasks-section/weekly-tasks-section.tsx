"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeekSelector, getWeekStart } from "../week-selector/week-selector";
import { WeeklyTaskCard } from "../weekly-task-card/weekly-task-card";
import { getWeeklyTasksAction } from "@/app/actions/weekly-tasks";
import type { WeeklyTask } from "@prisma/client";

interface WeeklyTasksSectionProps {
  task: {
    id: string;
    goalId: string;
    regionId: string;
    title: string;
  };
}

export function WeeklyTasksSection({ task }: WeeklyTasksSectionProps) {
  const t = useTranslations("weeklyTasks");
  const tCommon = useTranslations("common");
  const [selectedWeek, setSelectedWeek] = useState<Date | null>(null);
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize selectedWeek on client side only
  useEffect(() => {
    if (!selectedWeek) {
      setSelectedWeek(getWeekStart(new Date()));
    }
  }, [selectedWeek]);

  const fetchWeeklyTasks = async (weekStart: Date) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getWeeklyTasksAction(task.id, weekStart);

      if ("error" in result) {
        setError(result.error);
        setWeeklyTasks([]);
      } else {
        setWeeklyTasks(result.data);
      }
    } catch (err) {
      setError("Failed to fetch weekly tasks");
      setWeeklyTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedWeek) {
      fetchWeeklyTasks(selectedWeek);
    }
  }, [selectedWeek]);

  const handleWeekChange = (newWeek: Date) => {
    setSelectedWeek(newWeek);
  };

  const handleTaskDeleted = () => {
    // Refetch tasks after successful deletion
    if (selectedWeek) {
      fetchWeeklyTasks(selectedWeek);
    }
  };

  const isAtMaxCapacity = weeklyTasks.length >= 3;
  const createHref = `/goals/${task.goalId}/regions/${task.regionId}/tasks/${task.id}/weekly-tasks/new`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("title")}</CardTitle>
          <Link
            href={createHref}
            aria-disabled={isAtMaxCapacity}
            className={isAtMaxCapacity ? "pointer-events-none" : ""}
          >
            <Button
              size="sm"
              aria-disabled={isAtMaxCapacity}
              disabled={isAtMaxCapacity}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("createNew")}
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedWeek && (
          <WeekSelector
            selectedWeekStart={selectedWeek}
            onWeekChange={handleWeekChange}
          />
        )}

        {!selectedWeek || isLoading ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            {tCommon("loading")}
          </div>
        ) : error ? (
          <div className="text-center text-sm text-destructive py-8">
            {error}
          </div>
        ) : weeklyTasks.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            {t("noWeeklyTasks")}
          </div>
        ) : (
          <div className="space-y-3">
            {weeklyTasks.map((weeklyTask) => (
              <WeeklyTaskCard
                key={weeklyTask.id}
                weeklyTask={weeklyTask}
                taskId={task.id}
                goalId={task.goalId}
                regionId={task.regionId}
                onDeleted={handleTaskDeleted}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
