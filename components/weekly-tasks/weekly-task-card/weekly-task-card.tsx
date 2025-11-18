"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WeeklyTask } from "@/lib/types";

interface WeeklyTaskCardProps {
  weeklyTask: WeeklyTask;
  goalId: string;
  regionId: string;
  taskId: string;
  onDeleted?: (weeklyTask: WeeklyTask) => void;
}

export function WeeklyTaskCard({
  weeklyTask,
  goalId,
  regionId,
  taskId,
  onDeleted,
}: WeeklyTaskCardProps) {
  const router = useRouter();
  const t = useTranslations();

  const handleEdit = () => {
    router.push(
      `/goals/${goalId}/${regionId}/tasks/${taskId}/weekly-tasks/${weeklyTask.id}/edit`,
    );
  };

  const handleDelete = () => {
    if (onDeleted) {
      onDeleted(weeklyTask);
    }
  };

  // Priority badge configuration
  const getPriorityBadge = (priority: number) => {
    switch (priority) {
      case 1:
        return (
          <Badge variant="destructive">
            {t("weeklyTasks.priority")} {priority}
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
            {t("weeklyTasks.priority")} {priority}
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-green-500 text-white hover:bg-green-600">
            {t("weeklyTasks.priority")} {priority}
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {t("weeklyTasks.priority")} {priority}
          </Badge>
        );
    }
  };

  // Status display with translation
  const getStatusDisplay = (status: string) => {
    if (status === "in_progress") {
      return t("weeklyTasks.status.in_progress");
    }
    return t(`weeklyTasks.status.${status}`);
  };

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{weeklyTask.title}</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              aria-label={t("common.edit")}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              aria-label={t("common.delete")}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getPriorityBadge(weeklyTask.priority)}
          <span className="text-sm text-muted-foreground">
            {getStatusDisplay(weeklyTask.status)}
          </span>
        </div>
      </CardHeader>

      {weeklyTask.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {weeklyTask.description}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
