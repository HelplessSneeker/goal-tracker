"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  ActionErrorCode,
  createError,
  createSuccess,
  isActionError,
  type ActionResponse,
} from "@/lib/action-types";
import { updateUserName, type UserData } from "@/lib/services/user.service";
import {
  extractFormData,
  validateFormData,
  userSchemas,
} from "@/lib/validation";

/**
 * Update user name
 *
 * @param formData - Form data containing the name field
 * @returns ActionResponse with updated user data or error
 */
export async function updateUserNameAction(
  formData: FormData
): Promise<ActionResponse<UserData>> {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return createError(
        "You must be logged in to update your name",
        ActionErrorCode.UNAUTHORIZED
      );
    }

    // 2. Extract and validate form data
    const rawData = extractFormData(formData);
    const validated = validateFormData(userSchemas.updateName, rawData);

    if (isActionError(validated)) {
      return validated;
    }

    // 3. Update user name via service layer
    const updatedUser = await updateUserName(
      session.user.id,
      validated.name
    );

    // 4. Check if update was successful
    if (!updatedUser) {
      return createError("User not found", ActionErrorCode.NOT_FOUND);
    }

    // 5. Revalidate the settings page
    revalidatePath("/settings");

    // 6. Return success response
    return createSuccess(updatedUser);
  } catch (error) {
    console.error("[updateUserNameAction] Unexpected error:", error);
    return createError(
      "Failed to update name. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}
