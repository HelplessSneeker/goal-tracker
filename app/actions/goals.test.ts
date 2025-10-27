/**
 * @jest-environment node
 */
// Unmock the actions module for this test file
jest.unmock("@/app/actions/goals");

import {
  createGoalAction,
  updateGoalAction,
  deleteGoalAction,
} from "./goals";
import { mockGetServerSession } from "@/jest.setup";
import * as goalsService from "@/lib/services/goals.service";

// Mock the services
jest.mock("@/lib/services/goals.service");
const mockGoalsService = goalsService as jest.Mocked<typeof goalsService>;

// Mock Next.js revalidatePath
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("Goals Server Actions", () => {
  const mockUserId = "clxyz123456789";
  const mockSession = {
    user: {
      id: mockUserId,
      email: "test@example.com",
      name: "Test User",
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetServerSession.mockResolvedValue(mockSession);
  });

  describe("createGoalAction", () => {
    it("should return error when user is not authenticated", async () => {
      mockGetServerSession.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("title", "Test Goal");
      formData.append("description", "Test Description");

      const result = await createGoalAction(formData);

      expect(result).toEqual({ error: "Unauthorized" });
      expect(mockGoalsService.createGoal).not.toHaveBeenCalled();
    });

    it("should create a goal with valid data", async () => {
      const mockGoal = {
        id: "goal-1",
        title: "Test Goal",
        description: "Test Description",
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockGoalsService.createGoal.mockResolvedValue(mockGoal);

      const formData = new FormData();
      formData.append("title", "Test Goal");
      formData.append("description", "Test Description");

      const result = await createGoalAction(formData);

      expect(result).toEqual({ success: true, goal: mockGoal });
      expect(mockGoalsService.createGoal).toHaveBeenCalledWith(mockUserId, {
        title: "Test Goal",
        description: "Test Description",
      });
    });

    it("should handle empty description", async () => {
      const mockGoal = {
        id: "goal-1",
        title: "Test Goal",
        description: null,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockGoalsService.createGoal.mockResolvedValue(mockGoal);

      const formData = new FormData();
      formData.append("title", "Test Goal");

      const result = await createGoalAction(formData);

      expect(result).toEqual({ success: true, goal: mockGoal });
      expect(mockGoalsService.createGoal).toHaveBeenCalledWith(mockUserId, {
        title: "Test Goal",
        description: "",
      });
    });

    it("should return error when title is missing", async () => {
      const formData = new FormData();

      const result = await createGoalAction(formData);

      expect(result).toEqual({ error: "Title is required" });
      expect(mockGoalsService.createGoal).not.toHaveBeenCalled();
    });

    it("should handle service errors", async () => {
      mockGoalsService.createGoal.mockRejectedValue(
        new Error("Database error")
      );

      const formData = new FormData();
      formData.append("title", "Test Goal");

      const result = await createGoalAction(formData);

      expect(result).toEqual({ error: "Failed to create goal" });
    });
  });

  describe("updateGoalAction", () => {
    it("should return error when user is not authenticated", async () => {
      mockGetServerSession.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("title", "Updated Title");

      const result = await updateGoalAction("goal-1", formData);

      expect(result).toEqual({ error: "Unauthorized" });
      expect(mockGoalsService.updateGoal).not.toHaveBeenCalled();
    });

    it("should update a goal with valid data", async () => {
      const mockGoal = {
        id: "goal-1",
        title: "Updated Title",
        description: "Updated Description",
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockGoalsService.updateGoal.mockResolvedValue(mockGoal);

      const formData = new FormData();
      formData.append("title", "Updated Title");
      formData.append("description", "Updated Description");

      const result = await updateGoalAction("goal-1", formData);

      expect(result).toEqual({ success: true, goal: mockGoal });
      expect(mockGoalsService.updateGoal).toHaveBeenCalledWith(
        "goal-1",
        mockUserId,
        {
          title: "Updated Title",
          description: "Updated Description",
        }
      );
    });

    it("should allow partial updates (title only)", async () => {
      const mockGoal = {
        id: "goal-1",
        title: "New Title",
        description: "Old Description",
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockGoalsService.updateGoal.mockResolvedValue(mockGoal);

      const formData = new FormData();
      formData.append("title", "New Title");

      const result = await updateGoalAction("goal-1", formData);

      expect(result).toEqual({ success: true, goal: mockGoal });
    });

    it("should return error when goal not found", async () => {
      mockGoalsService.updateGoal.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("title", "Updated Title");

      const result = await updateGoalAction("nonexistent", formData);

      expect(result).toEqual({ error: "Goal not found or unauthorized" });
    });

    it("should return error when title is missing", async () => {
      const formData = new FormData();

      const result = await updateGoalAction("goal-1", formData);

      expect(result).toEqual({ error: "Title is required" });
      expect(mockGoalsService.updateGoal).not.toHaveBeenCalled();
    });

    it("should handle service errors", async () => {
      mockGoalsService.updateGoal.mockRejectedValue(
        new Error("Database error")
      );

      const formData = new FormData();
      formData.append("title", "Updated Title");

      const result = await updateGoalAction("goal-1", formData);

      expect(result).toEqual({ error: "Failed to update goal" });
    });
  });

  describe("deleteGoalAction", () => {
    it("should return error when user is not authenticated", async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await deleteGoalAction("goal-1");

      expect(result).toEqual({ error: "Unauthorized" });
      expect(mockGoalsService.deleteGoal).not.toHaveBeenCalled();
    });

    it("should delete a goal successfully", async () => {
      mockGoalsService.deleteGoal.mockResolvedValue(true);

      const result = await deleteGoalAction("goal-1");

      expect(result).toEqual({ success: true });
      expect(mockGoalsService.deleteGoal).toHaveBeenCalledWith(
        "goal-1",
        mockUserId
      );
    });

    it("should return error when goal not found", async () => {
      mockGoalsService.deleteGoal.mockResolvedValue(false);

      const result = await deleteGoalAction("nonexistent");

      expect(result).toEqual({ error: "Goal not found or unauthorized" });
    });

    it("should handle service errors", async () => {
      mockGoalsService.deleteGoal.mockRejectedValue(
        new Error("Database error")
      );

      const result = await deleteGoalAction("goal-1");

      expect(result).toEqual({ error: "Failed to delete goal" });
    });
  });
});
