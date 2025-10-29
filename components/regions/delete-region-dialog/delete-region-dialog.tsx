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
import { deleteRegionAction } from "@/app/actions/regions";

interface DeleteRegionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  regionId: string;
  regionTitle: string;
  goalId: string;
}

export function DeleteRegionDialog({
  open,
  onOpenChange,
  regionId,
  regionTitle,
  goalId,
}: DeleteRegionDialogProps) {
  const t = useTranslations();
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmText !== regionTitle) {
      setError(t("delete.region.errorMismatch"));
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteRegionAction(regionId);

      if ("error" in result) {
        throw new Error(result.error);
      }

      onOpenChange(false);
      router.push(`/goals/${goalId}`);
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
          <DialogTitle>{t("delete.region.title")}</DialogTitle>
          <DialogDescription>
            {t("delete.region.warning")} <strong>&quot;{regionTitle}&quot;</strong>. {t("delete.region.warningStrong")}. {t("delete.region.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
            <li>{t("delete.region.consequence1")}</li>
            <li>{t("delete.region.consequence2")}</li>
            <li>{t("delete.region.consequence3")}</li>
          </ul>

          <div className="space-y-2">
            <label
              htmlFor="confirm-text"
              className="text-sm font-medium leading-none"
            >
              {t("delete.region.confirmPrompt")} <strong>{regionTitle}</strong>
            </label>
            <Input
              id="confirm-text"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={regionTitle}
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
            disabled={isDeleting || confirmText !== regionTitle}
          >
            {isDeleting ? t("common.deleting") : t("delete.region.deleteButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
