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
import { deleteWeeklyTaskAction } from "@/app/actions/weekly-tasks";

interface DeleteWeeklyTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weeklyTaskId: string;
  weeklyTaskTitle: string;
}

export function DeleteWeeklyTaskDialog({
  open,
  onOpenChange,
  weeklyTaskId,
  weeklyTaskTitle,
}: DeleteWeeklyTaskDialogProps) {
  const router = useRouter();
  const t = useTranslations();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmText !== weeklyTaskTitle) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteWeeklyTaskAction(weeklyTaskId);

      if ("error" in result) {
        throw new Error(result.error);
      }

      onOpenChange(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
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
          <DialogTitle>{t("delete.weeklyTask.title")}</DialogTitle>
          <DialogDescription>
            {t("delete.weeklyTask.warning")}{" "}
            <strong>&quot;{weeklyTaskTitle}&quot;</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-2">
            <label
              htmlFor="confirm-text"
              className="text-sm font-medium leading-none"
            >
              {t("delete.weeklyTask.confirmPrompt", { title: weeklyTaskTitle })}
            </label>
            <Input
              id="confirm-text"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={weeklyTaskTitle}
              disabled={isDeleting}
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md mt-4">
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
            disabled={isDeleting || confirmText !== weeklyTaskTitle}
          >
            {isDeleting
              ? t("common.deleting")
              : t("delete.weeklyTask.deleteButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
