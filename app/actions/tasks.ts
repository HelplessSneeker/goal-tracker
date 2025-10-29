"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasksForRegion,
  getTaskById,
} from "@/lib/services/tasks.service";
import { revalidatePath } from "next/cache";
import {
  type ActionResponse,
  ActionErrorCode,
  createError,
  createSuccess,
  isActionError,
} from "@/lib/action-types";
import {
  taskSchemas,
  validateFormData,
  extractFormData,
} from "@/lib/validation";
import type { Task } from "@/generated/prisma";

export async function createTaskAction(
  formData: FormData
): Promise<ActionResponse<Task>> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    // Extract and validate data
    const data = extractFormData(formData);
    const validated = validateFormData(taskSchemas.create, data);

    if (isActionError(validated)) {
      return validated;
    }

    // Create task via service
    const task = await createTask(session.user.id, {
      regionId: validated.regionId,
      title: validated.title,
      description: validated.description,
      deadline: validated.deadline,
    });

    if (!task) {
      return createError(
        "Region not found or unauthorized",
        ActionErrorCode.NOT_FOUND
      );
    }

    // Revalidate relevant pages to show the new task
    revalidatePath("/goals");

    return createSuccess(task);
  } catch (error) {
    console.error("[createTaskAction] Database error:", error);
    return createError(
      "Failed to create task. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}

export async function updateTaskAction(
  id: string,
  formData: FormData
): Promise<ActionResponse<Task>> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    // Extract and validate data (including ID)
    const data = { id, ...extractFormData(formData) };
    const validated = validateFormData(taskSchemas.update, data);

    if (isActionError(validated)) {
      return validated;
    }

    // Update task via service (includes ownership check)
    const task = await updateTask(validated.id, session.user.id, {
      title: validated.title,
      description: validated.description,
      deadline: validated.deadline,
      status: validated.status,
    });

    if (!task) {
      return createError(
        "Task not found or unauthorized",
        ActionErrorCode.NOT_FOUND
      );
    }

    // Revalidate relevant pages
    revalidatePath("/goals");

    return createSuccess(task);
  } catch (error) {
    console.error("[updateTaskAction] Database error:", error);
    return createError(
      "Failed to update task. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}

export async function deleteTaskAction(
  id: string
): Promise<ActionResponse<{ deleted: true }>> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    // Validate ID
    const validated = validateFormData(taskSchemas.delete, { id });

    if (isActionError(validated)) {
      return validated;
    }

    // Delete task via service (includes ownership check)
    const success = await deleteTask(validated.id, session.user.id);

    if (!success) {
      return createError(
        "Task not found or unauthorized",
        ActionErrorCode.NOT_FOUND
      );
    }

    // Revalidate the goals page
    revalidatePath("/goals");

    return createSuccess({ deleted: true });
  } catch (error) {
    console.error("[deleteTaskAction] Database error:", error);
    return createError(
      "Failed to delete task. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}

export async function getTasksAction(
  regionId?: string
): Promise<ActionResponse<Task[]>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    const tasks = await getTasksForRegion(regionId, session.user.id);
    return createSuccess(tasks);
  } catch (error) {
    console.error("[getTasksAction] Database error:", error);
    return createError(
      "Failed to fetch tasks. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}

export async function getTaskAction(
  id: string
): Promise<ActionResponse<Task>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    const task = await getTaskById(id, session.user.id);

    if (!task) {
      return createError("Task not found", ActionErrorCode.NOT_FOUND);
    }

    return createSuccess(task);
  } catch (error) {
    console.error("[getTaskAction] Database error:", error);
    return createError(
      "Failed to fetch task. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}
