"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  createWeeklyTask,
  updateWeeklyTask,
  deleteWeeklyTask,
  getWeeklyTasksForTask,
  getWeeklyTaskById,
} from "@/lib/services/weekly-tasks.service";
import { revalidatePath } from "next/cache";
import {
  type ActionResponse,
  ActionErrorCode,
  createError,
  createSuccess,
  isActionError,
} from "@/lib/action-types";
import {
  weeklyTaskSchemas,
  validateFormData,
  extractFormData,
} from "@/lib/validation";
import type { WeeklyTask } from "@/generated/prisma";

export async function createWeeklyTaskAction(
  formData: FormData
): Promise<ActionResponse<WeeklyTask>> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    // Extract and validate data
    const data = extractFormData(formData);
    const validated = validateFormData(weeklyTaskSchemas.create, data);

    if (isActionError(validated)) {
      return validated;
    }

    // Create weekly task via service
    const weeklyTask = await createWeeklyTask(session.user.id, {
      taskId: validated.taskId,
      title: validated.title,
      description: validated.description,
      priority: validated.priority,
      weekStartDate: validated.weekStartDate,
    });

    if (!weeklyTask) {
      return createError(
        "Task not found or you don't have permission to create weekly tasks for it",
        ActionErrorCode.NOT_FOUND
      );
    }

    // Revalidate relevant pages to show the new weekly task
    revalidatePath("/goals");

    return createSuccess(weeklyTask);
  } catch (error) {
    console.error("[createWeeklyTaskAction] Database error:", error);
    return createError(
      "Failed to create weekly task. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}

export async function updateWeeklyTaskAction(
  formData: FormData
): Promise<ActionResponse<WeeklyTask>> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    // Extract and validate data (including ID)
    const data = extractFormData(formData);
    const validated = validateFormData(weeklyTaskSchemas.update, data);

    if (isActionError(validated)) {
      return validated;
    }

    // Update weekly task via service (includes ownership check)
    const weeklyTask = await updateWeeklyTask(
      validated.id,
      session.user.id,
      {
        title: validated.title,
        description: validated.description,
        priority: validated.priority,
        weekStartDate: validated.weekStartDate,
        status: validated.status,
      }
    );

    if (!weeklyTask) {
      return createError(
        "Weekly task not found or you don't have permission to update it",
        ActionErrorCode.NOT_FOUND
      );
    }

    // Revalidate relevant pages
    revalidatePath("/goals");

    return createSuccess(weeklyTask);
  } catch (error) {
    console.error("[updateWeeklyTaskAction] Database error:", error);
    return createError(
      "Failed to update weekly task. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}

export async function deleteWeeklyTaskAction(
  id: string
): Promise<ActionResponse<{ deleted: true }>> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    // Delete weekly task via service (includes ownership check)
    const deleted = await deleteWeeklyTask(id, session.user.id);

    if (!deleted) {
      return createError(
        "Weekly task not found or you don't have permission to delete it",
        ActionErrorCode.NOT_FOUND
      );
    }

    // Revalidate relevant pages
    revalidatePath("/goals");

    return createSuccess({ deleted: true });
  } catch (error) {
    console.error("[deleteWeeklyTaskAction] Database error:", error);
    return createError(
      "Failed to delete weekly task. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}

export async function getWeeklyTasksAction(
  taskId: string,
  weekStartDate?: string
): Promise<ActionResponse<WeeklyTask[]>> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    // Convert weekStartDate string to Date if provided
    const weekStartDateObj = weekStartDate
      ? new Date(weekStartDate)
      : undefined;

    // Get weekly tasks via service
    const weeklyTasks = await getWeeklyTasksForTask(
      taskId,
      session.user.id,
      weekStartDateObj
    );

    return createSuccess(weeklyTasks);
  } catch (error) {
    console.error("[getWeeklyTasksAction] Database error:", error);
    return createError(
      "Failed to fetch weekly tasks. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}

export async function getWeeklyTaskAction(
  id: string
): Promise<ActionResponse<WeeklyTask>> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    // Get weekly task via service (includes ownership check)
    const weeklyTask = await getWeeklyTaskById(id, session.user.id);

    if (!weeklyTask) {
      return createError(
        "Weekly task not found or you don't have permission to view it",
        ActionErrorCode.NOT_FOUND
      );
    }

    return createSuccess(weeklyTask);
  } catch (error) {
    console.error("[getWeeklyTaskAction] Database error:", error);
    return createError(
      "Failed to fetch weekly task. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}
