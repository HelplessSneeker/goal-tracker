import { getTaskByIdAction } from "@/app/actions/tasks";
import { WeeklyTaskForm } from "@/components/weekly-tasks";
import { getTranslations } from "next-intl/server";

interface NewWeeklyTaskPageProps {
  params: {
    id: string;
    regionId: string;
    taskId: string;
  };
}

export default async function NewWeeklyTaskPage({
  params,
}: NewWeeklyTaskPageProps) {
  const t = await getTranslations("weeklyTasks");
  const result = await getTaskByIdAction(params.taskId);

  if ("error" in result) {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <div className="text-center text-destructive">
          {result.error}
        </div>
      </div>
    );
  }

  const task = result.data;

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <WeeklyTaskForm
        mode="create"
        taskId={params.taskId}
        goalId={params.id}
        regionId={params.regionId}
        weekStartDate={new Date()}
      />
    </div>
  );
}
