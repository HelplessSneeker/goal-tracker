import { Task } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft, Calendar, Edit } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

async function getTask(taskId: string): Promise<Task | null> {
  try {
    const res = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch task:", error);
    return null;
  }
}

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string; regionId: string; taskId: string }>;
}) {
  const { id, regionId, taskId } = await params;
  const task = await getTask(taskId);

  if (!task) {
    notFound();
  }

  // Format deadline for display
  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate days until deadline
  const daysUntilDeadline = () => {
    const now = new Date();
    const deadline = new Date(task.deadline);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const days = daysUntilDeadline();

  return (
    <div className="container mx-auto p-6 max-w-4xl animate-fade-in">
      <Link
        href={`/goals/${id}/${regionId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Region
      </Link>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">{task.title}</CardTitle>
              <CardDescription className="text-base">
                {task.description}
              </CardDescription>
            </div>
            <Link href={`/goals/${id}/${regionId}/tasks/${taskId}/edit`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Deadline</p>
                <p className="text-sm text-muted-foreground">
                  {formatDeadline(task.deadline)}
                  {days >= 0 ? (
                    <span className="ml-2">
                      ({days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days remaining`})
                    </span>
                  ) : (
                    <span className="ml-2 text-destructive">
                      ({Math.abs(days)} {Math.abs(days) === 1 ? "day" : "days"} overdue)
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Status</p>
              <span
                className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {task.status}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Tasks</CardTitle>
          <CardDescription>
            Break this task down into weekly action items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Weekly tasks feature coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
