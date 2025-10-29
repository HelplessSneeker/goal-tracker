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
  createRegionAction,
  updateRegionAction,
} from "@/app/actions/regions";

interface RegionFormProps {
  mode: "create" | "edit";
  goalId: string;
  initialData?: {
    title: string;
    description: string;
  };
  regionId?: string;
  onSuccess?: () => void;
}

export function RegionForm({
  mode,
  goalId,
  initialData = { title: "", description: "" },
  regionId,
  onSuccess,
}: RegionFormProps) {
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
      if (mode === "create") {
        formData.append("goalId", goalId);
      }

      const result =
        mode === "create"
          ? await createRegionAction(formData)
          : await updateRegionAction(regionId!, formData);

      if ("error" in result) {
        throw new Error(result.error);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/goals/${goalId}`);
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
            ? t("regions.createNew")
            : t("regions.editRegion")}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? t("regions.createDescription")
            : t("regions.editDescription")}
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
              placeholder={t("regions.titlePlaceholder")}
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
              placeholder={t("regions.descriptionPlaceholder")}
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
                  ? t("regions.createButton")
                  : t("regions.saveButton")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
