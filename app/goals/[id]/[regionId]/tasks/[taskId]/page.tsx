import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { TaskDetailHeader } from "@/components/tasks";
import { WeeklyTasksSection } from "@/components/weekly-tasks";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTaskById } from "@/lib/services/tasks.service";
import { getTranslations } from "next-intl/server";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string; regionId: string; taskId: string }>;
}) {
  const t = await getTranslations("tasks");
  const tNav = await getTranslations("navigation");
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
        {tNav("backToRegion")}
      </Link>

      <TaskDetailHeader task={task} goalId={id} />

      <WeeklyTasksSection
        task={{
          id: task.id,
          goalId: id,
          regionId: regionId,
          title: task.title,
        }}
      />
    </div>
  );
}
