import prisma from "@/lib/prisma";

export interface UserPreferencesData {
  id: string;
  userId: string;
  language: string;
  theme: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserPreferencesData {
  language?: string;
  theme?: string;
}

/**
 * Get user preferences, create with defaults if not exist
 * @param userId - The user's ID
 * @returns User preferences or null if user doesn't exist
 */
export async function getUserPreferences(
  userId: string
): Promise<UserPreferencesData | null> {
  let preferences = await prisma.userPreferences.findUnique({
    where: { userId },
  });

  // Auto-create defaults if not exist
  if (!preferences) {
    preferences = await prisma.userPreferences.create({
      data: {
        userId,
        language: "en",
        theme: "system",
      },
    });
  }

  return preferences;
}

/**
 * Update user preferences
 * @param userId - The user's ID
 * @param data - Preferences data to update (language and/or theme)
 * @returns Updated preferences or null if unauthorized
 */
export async function updateUserPreferences(
  userId: string,
  data: UpdateUserPreferencesData
): Promise<UserPreferencesData | null> {
  // Verify ownership
  const existing = await prisma.userPreferences.findUnique({
    where: { userId },
  });

  if (!existing || existing.userId !== userId) {
    return null;
  }

  return await prisma.userPreferences.update({
    where: { userId },
    data,
  });
}
