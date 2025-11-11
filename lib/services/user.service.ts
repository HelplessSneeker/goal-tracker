import prisma from "@/lib/prisma";

/**
 * User data type returned by service functions
 */
export interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
}

/**
 * Get user by ID
 *
 * @param userId - The ID of the user to retrieve
 * @returns The user data or null if not found
 */
export async function getUserById(userId: string): Promise<UserData | null> {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
    },
  });
}

/**
 * Update user name
 *
 * @param userId - The ID of the user to update
 * @param name - The new name (or null to clear the name)
 * @returns The updated user data or null if user not found
 */
export async function updateUserName(
  userId: string,
  name: string | null
): Promise<UserData | null> {
  // Verify user exists
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    return null;
  }

  // Normalize the name:
  // - Trim whitespace
  // - Convert empty strings to null
  // - Convert whitespace-only strings to null
  let normalizedName: string | null = name;
  if (typeof normalizedName === "string") {
    normalizedName = normalizedName.trim();
    if (normalizedName === "") {
      normalizedName = null;
    }
  }

  // Update the user
  return await prisma.user.update({
    where: { id: userId },
    data: { name: normalizedName },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
    },
  });
}
