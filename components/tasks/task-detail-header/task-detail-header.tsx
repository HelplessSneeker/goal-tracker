"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteTaskDialog } from "@/components/tasks";
import { Task } from "@/lib/types";

interface TaskDetailHeaderProps {
  task: Task;
  goalId: string;
}

export function TaskDetailHeader({ task, goalId }: TaskDetailHeaderProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Format deadline for display
  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-3">{task.title}</h1>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-base">{formatDeadline(task.deadline)}</span>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {task.status}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/goals/${goalId}/${task.regionId}/tasks/${task.id}/edit`}>
              <Button size="sm" variant="outline" className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <Button
              size="sm"
              variant="destructive"
              className="gap-2"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
        <p className="text-lg text-muted-foreground">{task.description}</p>
      </div>

      <DeleteTaskDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        taskId={task.id}
        taskTitle={task.title}
        goalId={goalId}
        regionId={task.regionId}
      />
    </>
  );
}
