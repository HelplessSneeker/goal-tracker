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

export async function createGoalAction(formData: FormData) {
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

    // Create goal via service
    const goal = await createGoal(session.user.id, {
      title: title.trim(),
      description: description?.trim() || "",
    });

    // Revalidate the goals page to show the new goal
    revalidatePath("/goals");

    return { success: true, goal };
  } catch (error) {
    console.error("Error creating goal:", error);
    return { error: "Failed to create goal" };
  }
}

export async function updateGoalAction(id: string, formData: FormData) {
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

    // Update goal via service (includes ownership check)
    const goal = await updateGoal(id, session.user.id, {
      title: title.trim(),
      description: description?.trim() || "",
    });

    if (!goal) {
      return { error: "Goal not found or unauthorized" };
    }

    // Revalidate relevant pages
    revalidatePath("/goals");
    revalidatePath(`/goals/${id}`);

    return { success: true, goal };
  } catch (error) {
    console.error("Error updating goal:", error);
    return { error: "Failed to update goal" };
  }
}

export async function deleteGoalAction(id: string) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return { error: "Unauthorized" };
    }

    // Delete goal via service (includes ownership check)
    const success = await deleteGoal(id, session.user.id);

    if (!success) {
      return { error: "Goal not found or unauthorized" };
    }

    // Revalidate the goals page
    revalidatePath("/goals");

    return { success: true };
  } catch (error) {
    console.error("Error deleting goal:", error);
    return { error: "Failed to delete goal" };
  }
}

export async function getGoalsAction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return { error: "Unauthorized", goals: [] };
    }

    const goals = await getGoalsForUser(session.user.id);
    return { goals };
  } catch (error) {
    console.error("Error fetching goals:", error);
    return { error: "Failed to fetch goals", goals: [] };
  }
}

export async function getGoalAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return { error: "Unauthorized", goal: null };
    }

    const goal = await getGoalById(id, session.user.id);

    if (!goal) {
      return { error: "Goal not found", goal: null };
    }

    return { goal };
  } catch (error) {
    console.error("Error fetching goal:", error);
    return { error: "Failed to fetch goal", goal: null };
  }
}
