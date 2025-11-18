"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createWeeklyTaskAction,
  updateWeeklyTaskAction,
} from "@/app/actions/weekly-tasks";
import type { WeeklyTask } from "@/lib/types";
import { getWeekStart } from "../week-selector/week-selector";

interface WeeklyTaskFormProps {
  mode: "create" | "edit";
  taskId: string;
  goalId: string;
  regionId: string;
  weekStartDate: Date;
  initialData?: WeeklyTask;
  onSuccess?: () => void;
}

export function WeeklyTaskForm({
  mode,
  taskId,
  goalId,
  regionId,
  weekStartDate,
  initialData,
  onSuccess,
}: WeeklyTaskFormProps) {
  const router = useRouter();
  const t = useTranslations();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [priority, setPriority] = useState(
    initialData?.priority?.toString() || "1",
  );
  const [status, setStatus] = useState(initialData?.status || "pending");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Normalize week start date to Sunday
  const normalizedWeekStart = getWeekStart(weekStartDate);

  // Format week range for display
  const weekEnd = new Date(normalizedWeekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  };

  const weekRange = `${formatDate(normalizedWeekStart)} - ${formatDate(weekEnd)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("priority", priority);
      formData.append("weekStartDate", normalizedWeekStart.toISOString());

      if (mode === "create") {
        formData.append("taskId", taskId);
      } else {
        formData.append("id", initialData!.id);
        formData.append("status", status);
      }

      const result =
        mode === "create"
          ? await createWeeklyTaskAction(formData)
          : await updateWeeklyTaskAction(formData);

      if ("error" in result) {
        throw new Error(result.error);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/goals/${goalId}/${regionId}/tasks/${taskId}`);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create"
            ? t("weeklyTasks.createNew")
            : t("weeklyTasks.editWeeklyTask")}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? t("weeklyTasks.createDescription")
            : t("weeklyTasks.editDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Week Info (read-only) */}
          <div className="rounded-md bg-muted p-3 text-sm">
            <span className="font-medium">{t("weeklyTasks.week")}:</span>{" "}
            {weekRange}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("common.title")}
            </label>
            <Input
              id="title"
              type="text"
              placeholder={t("weeklyTasks.titlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
              maxLength={255}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("common.description")}
            </label>
            <textarea
              id="description"
              placeholder={t("weeklyTasks.descriptionPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="priority"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("weeklyTasks.priority")}
            </label>
            <Select
              value={priority}
              onValueChange={setPriority}
              disabled={isSubmitting}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder={t("weeklyTasks.priority")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  {t("weeklyTasks.priorityLevel.1")}
                </SelectItem>
                <SelectItem value="2">
                  {t("weeklyTasks.priorityLevel.2")}
                </SelectItem>
                <SelectItem value="3">
                  {t("weeklyTasks.priorityLevel.3")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode === "edit" && (
            <div className="space-y-2">
              <label
                htmlFor="status"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Status
              </label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as "pending" | "in_progress" | "completed")
                }
                disabled={isSubmitting}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    {t("weeklyTasks.status.pending")}
                  </SelectItem>
                  <SelectItem value="in_progress">
                    {t("weeklyTasks.status.in_progress")}
                  </SelectItem>
                  <SelectItem value="completed">
                    {t("weeklyTasks.status.completed")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? mode === "create"
                  ? t("common.creating")
                  : t("common.saving")
                : mode === "create"
                  ? t("weeklyTasks.createButton")
                  : t("weeklyTasks.saveButton")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
