import prisma from "@/lib/prisma";

export interface CreateRegionInput {
  goalId: string;
  title: string;
  description?: string;
}

export interface UpdateRegionInput {
  title?: string;
  description?: string;
}

/**
 * Get all regions for a specific goal or all user's regions (with ownership verification)
 * @param goalId - Optional goal ID. If provided, filters regions by goal. If undefined, returns all user's regions.
 * @param userId - The user's ID (to verify goal ownership)
 * @returns Array of regions for the goal or all user's regions
 */
export async function getRegionsForGoal(goalId: string | undefined, userId: string) {
  return await prisma.region.findMany({
    where: {
      ...(goalId ? { goalId } : {}),
      goal: {
        userId,
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get a single region by ID with ownership verification
 * @param id - The region ID
 * @param userId - The user's ID (to verify goal ownership)
 * @returns Region if found and user owns the goal, null otherwise
 */
export async function getRegionById(id: string, userId: string) {
  return await prisma.region.findFirst({
    where: {
      id,
      goal: {
        userId,
      },
    },
  });
}

/**
 * Create a new region for a goal (with ownership verification)
 * @param userId - The user's ID
 * @param data - Region data (goalId, title, description)
 * @returns Created region if successful, null if user doesn't own the goal
 */
export async function createRegion(userId: string, data: CreateRegionInput) {
  // First verify the user owns the goal
  const goal = await prisma.goal.findFirst({
    where: {
      id: data.goalId,
      userId,
    },
  });

  if (!goal) {
    return null;
  }

  return await prisma.region.create({
    data,
  });
}

/**
 * Update an existing region with ownership verification
 * @param id - The region ID
 * @param userId - The user's ID (to verify goal ownership)
 * @param data - Updated region data
 * @returns Updated region if successful, null if not found or user doesn't own the goal
 */
export async function updateRegion(
  id: string,
  userId: string,
  data: UpdateRegionInput
) {
  // First verify the region exists and user owns the goal
  const existingRegion = await prisma.region.findFirst({
    where: {
      id,
      goal: {
        userId,
      },
    },
  });

  if (!existingRegion) {
    return null;
  }

  return await prisma.region.update({
    where: { id },
    data,
  });
}

/**
 * Delete a region with ownership verification
 * @param id - The region ID
 * @param userId - The user's ID (to verify goal ownership)
 * @returns true if deleted successfully, false if not found or user doesn't own the goal
 */
export async function deleteRegion(id: string, userId: string) {
  // First verify the region exists and user owns the goal
  const existingRegion = await prisma.region.findFirst({
    where: {
      id,
      goal: {
        userId,
      },
    },
  });

  if (!existingRegion) {
    return false;
  }

  await prisma.region.delete({
    where: { id },
  });

  return true;
}
