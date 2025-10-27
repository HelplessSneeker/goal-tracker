import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { TaskDetailHeader } from "@/components/tasks";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTaskById } from "@/lib/services/tasks.service";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string; regionId: string; taskId: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/auth/signin");
  }

  const { id, regionId, taskId } = await params;
  const task = await getTaskById(taskId, session.user.id);

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
