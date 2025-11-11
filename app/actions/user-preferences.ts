"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  getUserPreferences,
  updateUserPreferences,
  type UserPreferencesData,
} from "@/lib/services/user-preferences.service";
import {
  type ActionResponse,
  ActionErrorCode,
  createError,
  createSuccess,
  isActionError,
} from "@/lib/action-types";
import {
  updateUserPreferencesSchema,
  validateFormData,
  extractFormData,
} from "@/lib/validation";

/**
 * Get current user preferences
 */
export async function getUserPreferencesAction(): Promise<
  ActionResponse<UserPreferencesData>
> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createError(
        "You must be logged in to view preferences",
        ActionErrorCode.UNAUTHORIZED
      );
    }

    const preferences = await getUserPreferences(session.user.id);

    if (!preferences) {
      return createError(
        "Failed to load preferences",
        ActionErrorCode.DATABASE_ERROR
      );
    }

    return createSuccess(preferences);
  } catch (error) {
    console.error("Error in getUserPreferencesAction:", error);
    return createError(
      "Failed to load preferences",
      ActionErrorCode.UNKNOWN_ERROR
    );
  }
}

/**
 * Update user preferences
 */
export async function updateUserPreferencesAction(
  formData: FormData
): Promise<ActionResponse<UserPreferencesData>> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return createError(
        "You must be logged in to update preferences",
        ActionErrorCode.UNAUTHORIZED
      );
    }

    // Extract and validate data
    const data = extractFormData(formData);
    const validated = validateFormData(updateUserPreferencesSchema, data);

    if (isActionError(validated)) {
      return validated;
    }

    const updated = await updateUserPreferences(session.user.id, validated);

    if (!updated) {
      return createError("Preferences not found", ActionErrorCode.NOT_FOUND);
    }

    return createSuccess(updated);
  } catch (error) {
    console.error("Error in updateUserPreferencesAction:", error);
    return createError(
      "Failed to update preferences",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}
