import prisma from "@/lib/prisma";

export interface CreateGoalInput {
  title: string;
  description?: string;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
}

/**
 * Get all goals for a specific user
 * @param userId - The user's ID
 * @returns Array of goals owned by the user
 */
export async function getGoalsForUser(userId: string) {
  return await prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get a single goal by ID with ownership verification
 * @param id - The goal ID
 * @param userId - The user's ID
 * @returns Goal if found and owned by user, null otherwise
 */
export async function getGoalById(id: string, userId: string) {
  return await prisma.goal.findFirst({
    where: {
      id,
      userId,
    },
  });
}

/**
 * Create a new goal for a user
 * @param userId - The user's ID
 * @param data - Goal data (title and optional description)
 * @returns Created goal
 */
export async function createGoal(userId: string, data: CreateGoalInput) {
  return await prisma.goal.create({
    data: {
      title: data.title,
      description: data.description,
      userId,
    },
  });
}

/**
 * Update an existing goal with ownership verification
 * @param id - The goal ID
 * @param userId - The user's ID
 * @param data - Updated goal data
 * @returns Updated goal if successful, null if not found or not owned
 */
export async function updateGoal(
  id: string,
  userId: string,
  data: UpdateGoalInput
) {
  // First verify the goal exists and user owns it
  const existingGoal = await prisma.goal.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!existingGoal) {
    return null;
  }

  return await prisma.goal.update({
    where: { id },
    data,
  });
}

/**
 * Delete a goal with ownership verification
 * @param id - The goal ID
 * @param userId - The user's ID
 * @returns true if deleted successfully, false if not found or not owned
 */
export async function deleteGoal(id: string, userId: string) {
  // First verify the goal exists and user owns it
  const existingGoal = await prisma.goal.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!existingGoal) {
    return false;
  }

  await prisma.goal.delete({
    where: { id },
  });

  return true;
}
