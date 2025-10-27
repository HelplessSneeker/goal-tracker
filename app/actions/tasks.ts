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

export async function createTaskAction(formData: FormData) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    // Extract and validate data
    const regionId = formData.get("regionId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const deadline = formData.get("deadline") as string;

    if (!regionId || regionId.trim() === "") {
      return { error: "Region ID is required" };
    }

    if (!title || title.trim() === "") {
      return { error: "Title is required" };
    }

    if (!deadline || deadline.trim() === "") {
      return { error: "Deadline is required" };
    }

    // Create task via service
    const task = await createTask(session.user.id, {
      regionId: regionId.trim(),
      title: title.trim(),
      description: description?.trim() || "",
      deadline: new Date(deadline),
    });

    if (!task) {
      return { error: "Region not found or unauthorized" };
    }

    // Revalidate relevant pages to show the new task
    revalidatePath("/goals");

    return { success: true, task };
  } catch (error) {
    console.error("Error creating task:", error);
    return { error: "Failed to create task" };
  }
}

export async function updateTaskAction(id: string, formData: FormData) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    // Extract and validate data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const deadline = formData.get("deadline") as string;
    const status = formData.get("status") as "active" | "completed";

    if (!title || title.trim() === "") {
      return { error: "Title is required" };
    }

    // Update task via service (includes ownership check)
    const task = await updateTask(id, session.user.id, {
      title: title.trim(),
      description: description?.trim() || "",
      ...(deadline ? { deadline: new Date(deadline) } : {}),
      ...(status ? { status } : {}),
    });

    if (!task) {
      return { error: "Task not found or unauthorized" };
    }

    // Revalidate relevant pages
    revalidatePath("/goals");

    return { success: true, task };
  } catch (error) {
    console.error("Error updating task:", error);
    return { error: "Failed to update task" };
  }
}

export async function deleteTaskAction(id: string) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    // Delete task via service (includes ownership check)
    const success = await deleteTask(id, session.user.id);

    if (!success) {
      return { error: "Task not found or unauthorized" };
    }

    // Revalidate the goals page
    revalidatePath("/goals");

    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { error: "Failed to delete task" };
  }
}

export async function getTasksAction(regionId?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return { error: "Unauthorized", tasks: [] };
    }

    const tasks = await getTasksForRegion(regionId, session.user.id);
    return { tasks };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { error: "Failed to fetch tasks", tasks: [] };
  }
}

export async function getTaskAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return { error: "Unauthorized", task: null };
    }

    const task = await getTaskById(id, session.user.id);

    if (!task) {
      return { error: "Task not found", task: null };
    }

    return { task };
  } catch (error) {
    console.error("Error fetching task:", error);
    return { error: "Failed to fetch task", task: null };
  }
}
