"use client";

import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  goalId: string;
}

export function TaskCard({ task, goalId }: TaskCardProps) {
  const router = useRouter();

  // Format deadline for display
  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCardClick = () => {
    router.push(`/goals/${goalId}/${task.regionId}/tasks/${task.id}`);
  };

  return (
    <Card
      className="relative cursor-pointer transition-shadow hover:shadow-lg"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
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
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">{task.description}</p>
      </CardContent>
    </Card>
  );
}
