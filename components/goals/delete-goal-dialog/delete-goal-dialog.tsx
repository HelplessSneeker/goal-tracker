"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { deleteGoalAction } from "@/app/actions/goals";

interface DeleteGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goalId: string;
  goalTitle: string;
}

export function DeleteGoalDialog({
  open,
  onOpenChange,
  goalId,
  goalTitle,
}: DeleteGoalDialogProps) {
  const router = useRouter();
  const t = useTranslations();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfirmValid = confirmText === goalTitle;

  const handleDelete = async () => {
    if (!isConfirmValid) return;

    setError(null);
    setIsDeleting(true);

    try {
      const result = await deleteGoalAction(goalId);

      if ("error" in result) {
        throw new Error(result.error);
      }

      router.push("/goals");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("common.error")
      );
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isDeleting) {
      setConfirmText("");
      setError(null);
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("delete.goal.title")}</DialogTitle>
          <DialogDescription>
            {t("delete.goal.warning")} <strong>{goalTitle}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
            <p className="text-sm text-destructive font-medium mb-2">
              {t("delete.goal.warningStrong")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("delete.goal.description")}
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
              <li>{t("delete.goal.consequence1")}</li>
              <li>{t("delete.goal.consequence2")}</li>
              <li>{t("delete.goal.consequence3")}</li>
              <li>{t("delete.goal.consequence4")}</li>
            </ul>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirm-title"
              className="text-sm font-medium leading-none"
            >
              {t("delete.goal.confirmPrompt")} <strong>{goalTitle}</strong>
            </label>
            <Input
              id="confirm-title"
              type="text"
              placeholder={t("delete.goal.confirmPlaceholder")}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={isDeleting}
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isDeleting}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmValid || isDeleting}
          >
            {isDeleting ? t("common.deleting") : t("delete.goal.deleteButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
