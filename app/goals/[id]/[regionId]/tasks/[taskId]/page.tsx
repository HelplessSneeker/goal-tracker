import { Task } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { TaskDetailHeader } from "@/components/tasks";

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

  return (
    <div className="container mx-auto p-6 max-w-4xl animate-fade-in">
      <Link
        href={`/goals/${id}/${regionId}`}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Region
      </Link>

      <TaskDetailHeader task={task} goalId={id} />

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
