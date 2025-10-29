"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalsForUser,
  getGoalById,
} from "@/lib/services/goals.service";
import { revalidatePath } from "next/cache";
import {
  type ActionResponse,
  ActionErrorCode,
  createError,
  createSuccess,
  isActionError,
} from "@/lib/action-types";
import {
  goalSchemas,
  validateFormData,
  extractFormData,
} from "@/lib/validation";
import type { Goal } from "@/generated/prisma";

export async function createGoalAction(
  formData: FormData
): Promise<ActionResponse<Goal>> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    // Extract and validate data
    const data = extractFormData(formData);
    const validated = validateFormData(goalSchemas.create, data);

    if (isActionError(validated)) {
      return validated;
    }

    // Create goal via service
    const goal = await createGoal(session.user.id, {
      title: validated.title,
      description: validated.description,
    });

    // Revalidate the goals page to show the new goal
    revalidatePath("/goals");

    return createSuccess(goal);
  } catch (error) {
    console.error("[createGoalAction] Database error:", error);
    return createError(
      "Failed to create goal. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}

export async function updateGoalAction(
  id: string,
  formData: FormData
): Promise<ActionResponse<Goal>> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    // Extract and validate data (including ID)
    const data = { id, ...extractFormData(formData) };
    const validated = validateFormData(goalSchemas.update, data);

    if (isActionError(validated)) {
      return validated;
    }

    // Update goal via service (includes ownership check)
    const goal = await updateGoal(validated.id, session.user.id, {
      title: validated.title,
      description: validated.description,
    });

    if (!goal) {
      return createError(
        "Goal not found or unauthorized",
        ActionErrorCode.NOT_FOUND
      );
    }

    // Revalidate relevant pages
    revalidatePath("/goals");
    revalidatePath(`/goals/${id}`);

    return createSuccess(goal);
  } catch (error) {
    console.error("[updateGoalAction] Database error:", error);
    return createError(
      "Failed to update goal. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}

export async function deleteGoalAction(
  id: string
): Promise<ActionResponse<{ deleted: true }>> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    // Validate ID
    const validated = validateFormData(goalSchemas.delete, { id });

    if (isActionError(validated)) {
      return validated;
    }

    // Delete goal via service (includes ownership check)
    const success = await deleteGoal(validated.id, session.user.id);

    if (!success) {
      return createError(
        "Goal not found or unauthorized",
        ActionErrorCode.NOT_FOUND
      );
    }

    // Revalidate the goals page
    revalidatePath("/goals");

    return createSuccess({ deleted: true });
  } catch (error) {
    console.error("[deleteGoalAction] Database error:", error);
    return createError(
      "Failed to delete goal. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}

export async function getGoalsAction(): Promise<ActionResponse<Goal[]>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    const goals = await getGoalsForUser(session.user.id);
    return createSuccess(goals);
  } catch (error) {
    console.error("[getGoalsAction] Database error:", error);
    return createError(
      "Failed to fetch goals. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}

export async function getGoalAction(id: string): Promise<ActionResponse<Goal>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    const goal = await getGoalById(id, session.user.id);

    if (!goal) {
      return createError("Goal not found", ActionErrorCode.NOT_FOUND);
    }

    return createSuccess(goal);
  } catch (error) {
    console.error("[getGoalAction] Database error:", error);
    return createError(
      "Failed to fetch goal. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}
