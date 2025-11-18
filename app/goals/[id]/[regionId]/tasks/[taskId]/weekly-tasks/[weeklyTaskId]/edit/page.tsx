import { getTaskAction } from "@/app/actions/tasks";
import { getWeeklyTaskAction } from "@/app/actions/weekly-tasks";
import { WeeklyTaskForm } from "@/components/weekly-tasks";
import { getTranslations } from "next-intl/server";

interface EditWeeklyTaskPageProps {
  params: {
    id: string;
    regionId: string;
    taskId: string;
    weeklyTaskId: string;
  };
}

export default async function EditWeeklyTaskPage({
  params,
}: EditWeeklyTaskPageProps) {
  const t = await getTranslations("weeklyTasks");

  // Fetch both task and weekly task data
  const [taskResult, weeklyTaskResult] = await Promise.all([
    getTaskAction(params.taskId),
    getWeeklyTaskAction(params.weeklyTaskId),
  ]);

  if ("error" in taskResult) {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <div className="text-center text-destructive">{taskResult.error}</div>
      </div>
    );
  }

  if ("error" in weeklyTaskResult) {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <div className="text-center text-destructive">
          {weeklyTaskResult.error}
        </div>
      </div>
    );
  }

  const task = taskResult.data;
  const weeklyTask = weeklyTaskResult.data;

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <WeeklyTaskForm
        mode="edit"
        taskId={params.taskId}
        goalId={params.id}
        regionId={params.regionId}
        weekStartDate={weeklyTask.weekStartDate}
        initialData={weeklyTask}
      />
    </div>
  );
}
