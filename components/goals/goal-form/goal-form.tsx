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
import { createGoalAction, updateGoalAction } from "@/app/actions/goals";

interface GoalFormProps {
  mode: "create" | "edit";
  initialData?: {
    title: string;
    description: string;
  };
  goalId?: string;
  onSuccess?: () => void;
}

export function GoalForm({
  mode,
  initialData = { title: "", description: "" },
  goalId,
  onSuccess,
}: GoalFormProps) {
  const router = useRouter();
  const t = useTranslations();
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);

      const result =
        mode === "create"
          ? await createGoalAction(formData)
          : await updateGoalAction(goalId!, formData);

      if ("error" in result) {
        throw new Error(result.error);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        const redirectPath =
          mode === "create" ? "/goals" : `/goals/${goalId}`;
        router.push(redirectPath);
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("common.error")
      );
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "create"
            ? t("goals.createNew")
            : t("goals.editGoal")}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? t("goals.createDescription")
            : t("goals.editDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder={t("goals.titlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
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
              placeholder={t("goals.descriptionPlaceholder")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isSubmitting}
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

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
                  ? t("goals.createButton")
                  : t("goals.saveButton")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
