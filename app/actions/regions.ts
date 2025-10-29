"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  createRegion,
  updateRegion,
  deleteRegion,
  getRegionsForGoal,
  getRegionById,
} from "@/lib/services/regions.service";
import { revalidatePath } from "next/cache";
import {
  type ActionResponse,
  ActionErrorCode,
  createError,
  createSuccess,
  isActionError,
} from "@/lib/action-types";
import {
  regionSchemas,
  validateFormData,
  extractFormData,
} from "@/lib/validation";
import type { Region } from "@/generated/prisma";

export async function createRegionAction(
  formData: FormData
): Promise<ActionResponse<Region>> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    // Extract and validate data
    const data = extractFormData(formData);
    const validated = validateFormData(regionSchemas.create, data);

    if (isActionError(validated)) {
      return validated;
    }

    // Create region via service
    const region = await createRegion(session.user.id, {
      goalId: validated.goalId,
      title: validated.title,
      description: validated.description,
    });

    if (!region) {
      return createError(
        "Goal not found or unauthorized",
        ActionErrorCode.NOT_FOUND
      );
    }

    // Revalidate relevant pages to show the new region
    revalidatePath("/goals");
    revalidatePath(`/goals/${validated.goalId}`);

    return createSuccess(region);
  } catch (error) {
    console.error("[createRegionAction] Database error:", error);
    return createError(
      "Failed to create region. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}

export async function updateRegionAction(
  id: string,
  formData: FormData
): Promise<ActionResponse<Region>> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    // Extract and validate data (including ID)
    const data = { id, ...extractFormData(formData) };
    const validated = validateFormData(regionSchemas.update, data);

    if (isActionError(validated)) {
      return validated;
    }

    // Update region via service (includes ownership check)
    const region = await updateRegion(validated.id, session.user.id, {
      title: validated.title,
      description: validated.description,
    });

    if (!region) {
      return createError(
        "Region not found or unauthorized",
        ActionErrorCode.NOT_FOUND
      );
    }

    // Revalidate relevant pages
    revalidatePath("/goals");
    revalidatePath(`/goals/${region.goalId}`);

    return createSuccess(region);
  } catch (error) {
    console.error("[updateRegionAction] Database error:", error);
    return createError(
      "Failed to update region. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}

export async function deleteRegionAction(
  id: string
): Promise<ActionResponse<{ deleted: true }>> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    // Validate ID
    const validated = validateFormData(regionSchemas.delete, { id });

    if (isActionError(validated)) {
      return validated;
    }

    // Delete region via service (includes ownership check)
    const success = await deleteRegion(validated.id, session.user.id);

    if (!success) {
      return createError(
        "Region not found or unauthorized",
        ActionErrorCode.NOT_FOUND
      );
    }

    // Revalidate the goals page
    revalidatePath("/goals");

    return createSuccess({ deleted: true });
  } catch (error) {
    console.error("[deleteRegionAction] Database error:", error);
    return createError(
      "Failed to delete region. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}

export async function getRegionsAction(
  goalId?: string
): Promise<ActionResponse<Region[]>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    const regions = await getRegionsForGoal(goalId, session.user.id);
    return createSuccess(regions);
  } catch (error) {
    console.error("[getRegionsAction] Database error:", error);
    return createError(
      "Failed to fetch regions. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}

export async function getRegionAction(
  id: string
): Promise<ActionResponse<Region>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createError("Unauthorized", ActionErrorCode.UNAUTHORIZED);
    }

    const region = await getRegionById(id, session.user.id);

    if (!region) {
      return createError("Region not found", ActionErrorCode.NOT_FOUND);
    }

    return createSuccess(region);
  } catch (error) {
    console.error("[getRegionAction] Database error:", error);
    return createError(
      "Failed to fetch region. Please try again.",
      ActionErrorCode.DATABASE_ERROR
    );
  }
}
