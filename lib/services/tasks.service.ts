import prisma from "@/lib/prisma";

export interface CreateTaskInput {
  regionId: string;
  title: string;
  description?: string;
  deadline: Date;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  deadline?: Date;
  status?: "active" | "incomplete" | "completed";
}

/**
 * Get all tasks for a specific region (with ownership verification)
 * @param regionId - The region's ID (optional - if not provided, returns all tasks for user)
 * @param userId - The user's ID (to verify goal ownership)
 * @returns Array of tasks for the region
 */
export async function getTasksForRegion(regionId: string | undefined, userId: string) {
  return await prisma.task.findMany({
    where: {
      ...(regionId ? { regionId } : {}),
      region: {
        goal: {
          userId,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get a single task by ID with ownership verification
 * @param id - The task ID
 * @param userId - The user's ID (to verify goal ownership)
 * @returns Task if found and user owns the goal, null otherwise
 */
export async function getTaskById(id: string, userId: string) {
  return await prisma.task.findFirst({
    where: {
      id,
      region: {
        goal: {
          userId,
        },
      },
    },
  });
}

/**
 * Create a new task for a region (with ownership verification)
 * @param userId - The user's ID
 * @param data - Task data (regionId, title, description, deadline)
 * @returns Created task if successful, null if user doesn't own the region's goal
 */
export async function createTask(userId: string, data: CreateTaskInput) {
  // First verify the user owns the region's goal
  const region = await prisma.region.findFirst({
    where: {
      id: data.regionId,
      goal: {
        userId,
      },
    },
  });

  if (!region) {
    return null;
  }

  return await prisma.task.create({
    data: {
      ...data,
      status: "active",
    },
  });
}

/**
 * Update an existing task with ownership verification
 * @param id - The task ID
 * @param userId - The user's ID (to verify goal ownership)
 * @param data - Updated task data
 * @returns Updated task if successful, null if not found or user doesn't own the goal
 */
export async function updateTask(
  id: string,
  userId: string,
  data: UpdateTaskInput
) {
  // First verify the task exists and user owns the goal
  const existingTask = await prisma.task.findFirst({
    where: {
      id,
      region: {
        goal: {
          userId,
        },
      },
    },
  });

  if (!existingTask) {
    return null;
  }

  return await prisma.task.update({
    where: { id },
    data,
  });
}

/**
 * Delete a task with ownership verification
 * @param id - The task ID
 * @param userId - The user's ID (to verify goal ownership)
 * @returns true if deleted successfully, false if not found or user doesn't own the goal
 */
export async function deleteTask(id: string, userId: string) {
  // First verify the task exists and user owns the goal
  const existingTask = await prisma.task.findFirst({
    where: {
      id,
      region: {
        goal: {
          userId,
        },
      },
    },
  });

  if (!existingTask) {
    return false;
  }

  await prisma.task.delete({
    where: { id },
  });

  return true;
}
