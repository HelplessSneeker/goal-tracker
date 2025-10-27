"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
      setError(err instanceof Error ? err.message : "An error occurred");
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
          <DialogTitle>Delete Goal</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{goalTitle}</strong>?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
            <p className="text-sm text-destructive font-medium mb-2">
              Warning: This action cannot be undone
            </p>
            <p className="text-sm text-muted-foreground">
              This will permanently delete the goal and everything associated
              with it, including:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
              <li>All regions</li>
              <li>All tasks</li>
              <li>All weekly tasks</li>
              <li>All progress entries</li>
            </ul>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirm-title"
              className="text-sm font-medium leading-none"
            >
              To confirm, type the goal title: <strong>{goalTitle}</strong>
            </label>
            <Input
              id="confirm-title"
              type="text"
              placeholder="Type goal title to confirm"
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
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmValid || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
