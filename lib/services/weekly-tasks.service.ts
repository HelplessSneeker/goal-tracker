import prisma from "@/lib/prisma";

export interface CreateWeeklyTaskInput {
  taskId: string;
  title: string;
  description?: string;
  priority: number;
  weekStartDate: Date;
}

export interface UpdateWeeklyTaskInput {
  title?: string;
  description?: string;
  priority?: number;
  weekStartDate?: Date;
  status?: "pending" | "in_progress" | "completed";
}

/**
 * Get all weekly tasks for a specific task (with ownership verification)
 * @param taskId - The task's ID
 * @param userId - The user's ID (to verify goal ownership through task chain)
 * @param weekStartDate - Optional filter by week start date (Sunday)
 * @returns Array of weekly tasks for the task
 */
export async function getWeeklyTasksForTask(
  taskId: string,
  userId: string,
  weekStartDate?: Date,
) {
  return await prisma.weeklyTask.findMany({
    where: {
      taskId,
      ...(weekStartDate ? { weekStartDate } : {}),
      task: {
        region: {
          goal: {
            userId,
          },
        },
      },
    },
    orderBy: { priority: "asc" },
  });
}

/**
 * Get a single weekly task by ID with ownership verification
 * @param id - The weekly task ID
 * @param userId - The user's ID (to verify goal ownership through task chain)
 * @returns Weekly task if found and user owns the goal, null otherwise
 */
export async function getWeeklyTaskById(id: string, userId: string) {
  return await prisma.weeklyTask.findFirst({
    where: {
      id,
      task: {
        region: {
          goal: {
            userId,
          },
        },
      },
    },
  });
}

/**
 * Create a new weekly task for a task (with ownership verification)
 * @param userId - The user's ID
 * @param data - Weekly task data (taskId, title, description, priority, weekStartDate)
 * @returns Created weekly task if successful, null if user doesn't own the task's goal
 */
export async function createWeeklyTask(
  userId: string,
  data: CreateWeeklyTaskInput,
) {
  // First verify the user owns the task's goal
  const task = await prisma.task.findFirst({
    where: {
      id: data.taskId,
      region: {
        goal: {
          userId,
        },
      },
    },
  });

  if (!task) {
    return null;
  }

  return await prisma.weeklyTask.create({
    data,
  });
}

/**
 * Update an existing weekly task with ownership verification
 * @param id - The weekly task ID
 * @param userId - The user's ID (to verify goal ownership through task chain)
 * @param data - Updated weekly task data
 * @returns Updated weekly task if successful, null if not found or user doesn't own the goal
 */
export async function updateWeeklyTask(
  id: string,
  userId: string,
  data: UpdateWeeklyTaskInput,
) {
  // First verify the weekly task exists and user owns the goal
  const existingWeeklyTask = await prisma.weeklyTask.findFirst({
    where: {
      id,
      task: {
        region: {
          goal: {
            userId,
          },
        },
      },
    },
  });

  if (!existingWeeklyTask) {
    return null;
  }

  return await prisma.weeklyTask.update({
    where: { id },
    data,
  });
}

/**
 * Delete a weekly task with ownership verification
 * @param id - The weekly task ID
 * @param userId - The user's ID (to verify goal ownership through task chain)
 * @returns true if deleted successfully, false if not found or user doesn't own the goal
 */
export async function deleteWeeklyTask(id: string, userId: string) {
  // First verify the weekly task exists and user owns the goal
  const existingWeeklyTask = await prisma.weeklyTask.findFirst({
    where: {
      id,
      task: {
        region: {
          goal: {
            userId,
          },
        },
      },
    },
  });

  if (!existingWeeklyTask) {
    return false;
  }

  await prisma.weeklyTask.delete({
    where: { id },
  });

  return true;
}
