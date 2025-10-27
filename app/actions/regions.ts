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

export async function createRegionAction(formData: FormData) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    // Extract and validate data
    const goalId = formData.get("goalId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!goalId || goalId.trim() === "") {
      return { error: "Goal ID is required" };
    }

    if (!title || title.trim() === "") {
      return { error: "Title is required" };
    }

    // Create region via service
    const region = await createRegion(session.user.id, {
      goalId: goalId.trim(),
      title: title.trim(),
      description: description?.trim() || "",
    });

    if (!region) {
      return { error: "Goal not found or unauthorized" };
    }

    // Revalidate relevant pages to show the new region
    revalidatePath("/goals");
    revalidatePath(`/goals/${goalId}`);

    return { success: true, region };
  } catch (error) {
    console.error("Error creating region:", error);
    return { error: "Failed to create region" };
  }
}

export async function updateRegionAction(id: string, formData: FormData) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    // Extract and validate data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title || title.trim() === "") {
      return { error: "Title is required" };
    }

    // Update region via service (includes ownership check)
    const region = await updateRegion(id, session.user.id, {
      title: title.trim(),
      description: description?.trim() || "",
    });

    if (!region) {
      return { error: "Region not found or unauthorized" };
    }

    // Revalidate relevant pages
    revalidatePath("/goals");
    revalidatePath(`/goals/${region.goalId}`);

    return { success: true, region };
  } catch (error) {
    console.error("Error updating region:", error);
    return { error: "Failed to update region" };
  }
}

export async function deleteRegionAction(id: string) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    // Delete region via service (includes ownership check)
    const success = await deleteRegion(id, session.user.id);

    if (!success) {
      return { error: "Region not found or unauthorized" };
    }

    // Revalidate the goals page
    revalidatePath("/goals");

    return { success: true };
  } catch (error) {
    console.error("Error deleting region:", error);
    return { error: "Failed to delete region" };
  }
}

export async function getRegionsAction(goalId?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return { error: "Unauthorized", regions: [] };
    }

    const regions = await getRegionsForGoal(goalId, session.user.id);
    return { regions };
  } catch (error) {
    console.error("Error fetching regions:", error);
    return { error: "Failed to fetch regions", regions: [] };
  }
}

export async function getRegionAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return { error: "Unauthorized", region: null };
    }

    const region = await getRegionById(id, session.user.id);

    if (!region) {
      return { error: "Region not found", region: null };
    }

    return { region };
  } catch (error) {
    console.error("Error fetching region:", error);
    return { error: "Failed to fetch region", region: null };
  }
}
