"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Task } from "@/lib/types";
import { DeleteTaskDialog } from "@/components/tasks";

interface TaskCardProps {
  task: Task;
  goalId: string;
}

export function TaskCard({ task, goalId }: TaskCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
      <Card className="relative hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-1">
              <CardTitle className="text-lg">{task.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDeadline(task.deadline)}</span>
                <span
                  className={`ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    task.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {task.status}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/goals/${goalId}/${task.regionId}/tasks/${task.id}`}
                      aria-label="View task"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-8 w-8 hover:bg-accent"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View task details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/goals/${goalId}/${task.regionId}/tasks/${task.id}/edit`}
                      aria-label="Edit task"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-8 w-8 hover:bg-accent"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit task</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete task</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </CardContent>
      </Card>

      <DeleteTaskDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        taskId={task.id}
        taskTitle={task.title}
        goalId={goalId}
        regionId={task.regionId}
      />
    </>
  );
}
