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
import { deleteTaskAction } from "@/app/actions/tasks";

interface DeleteTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  taskTitle: string;
  goalId: string;
  regionId: string;
}

export function DeleteTaskDialog({
  open,
  onOpenChange,
  taskId,
  taskTitle,
  goalId,
  regionId,
}: DeleteTaskDialogProps) {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (confirmText !== taskTitle) {
      setError("Task name does not match");
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const result = await deleteTaskAction(taskId);

      if ("error" in result) {
        throw new Error(result.error);
      }

      onOpenChange(false);
      router.push(`/goals/${goalId}/${regionId}`);
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
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the task{" "}
            <strong>&quot;{taskTitle}&quot;</strong> and all associated data
            including:
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-4">
            <li>All weekly tasks associated with this task</li>
            <li>All progress entries for those weekly tasks</li>
          </ul>

          <div className="space-y-2">
            <label
              htmlFor="confirm-text"
              className="text-sm font-medium leading-none"
            >
              Please type <strong>{taskTitle}</strong> to confirm:
            </label>
            <Input
              id="confirm-text"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={taskTitle}
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
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || confirmText !== taskTitle}
          >
            {isDeleting ? "Deleting..." : "Delete Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
