/**
 * @jest-environment node
 */
import {
  getGoalsForUser,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
} from "./goals.service";
import prisma from "@/lib/prisma";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("GoalsService", () => {
  const mockUserId = "clxyz123456789";
  const mockOtherUserId = "clxyz987654321";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getGoalsForUser", () => {
    it("should return all goals for a specific user", async () => {
      const mockGoals = [
        {
          id: "goal-1",
          title: "Test Goal 1",
          description: "Description 1",
          userId: mockUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "goal-2",
          title: "Test Goal 2",
          description: "Description 2",
          userId: mockUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.goal.findMany.mockResolvedValue(mockGoals);

      const result = await getGoalsForUser(mockUserId);

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockGoals);
      expect(mockPrisma.goal.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return empty array when user has no goals", async () => {
      mockPrisma.goal.findMany.mockResolvedValue([]);

      const result = await getGoalsForUser(mockUserId);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("should only return goals for the specified user", async () => {
      const mockGoals = [
        {
          id: "goal-1",
          title: "User 1 Goal",
          description: "Description",
          userId: mockUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.goal.findMany.mockResolvedValue(mockGoals);

      const result = await getGoalsForUser(mockUserId);

      expect(result.every((goal) => goal.userId === mockUserId)).toBe(true);
      expect(mockPrisma.goal.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("getGoalById", () => {
    it("should return a goal when it exists and user owns it", async () => {
      const mockGoal = {
        id: "goal-1",
        title: "Test Goal",
        description: "Description",
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.goal.findFirst.mockResolvedValue(mockGoal);

      const result = await getGoalById("goal-1", mockUserId);

      expect(result).toEqual(mockGoal);
      expect(mockPrisma.goal.findFirst).toHaveBeenCalledWith({
        where: {
          id: "goal-1",
          userId: mockUserId,
        },
      });
    });

    it("should return null when goal does not exist", async () => {
      mockPrisma.goal.findFirst.mockResolvedValue(null);

      const result = await getGoalById("nonexistent", mockUserId);

      expect(result).toBeNull();
    });

    it("should return null when goal exists but user does not own it", async () => {
      mockPrisma.goal.findFirst.mockResolvedValue(null);

      const result = await getGoalById("goal-1", mockOtherUserId);

      expect(result).toBeNull();
      expect(mockPrisma.goal.findFirst).toHaveBeenCalledWith({
        where: {
          id: "goal-1",
          userId: mockOtherUserId,
        },
      });
    });
  });

  describe("createGoal", () => {
    it("should create a new goal with valid data", async () => {
      const goalData = {
        title: "Learn Next.js",
        description: "Master Next.js 15 and App Router",
      };

      const createdGoal = {
        id: "uuid-new",
        ...goalData,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.goal.create.mockResolvedValue(createdGoal);

      const result = await createGoal(mockUserId, goalData);

      expect(result).toEqual(createdGoal);
      expect(mockPrisma.goal.create).toHaveBeenCalledWith({
        data: {
          title: goalData.title,
          description: goalData.description,
          userId: mockUserId,
        },
      });
    });

    it("should handle special characters in title and description", async () => {
      const goalData = {
        title: 'Learn "Advanced" React & TypeScript',
        description: "Master <components> with special chars: @#$%",
      };

      const createdGoal = {
        id: "uuid-special",
        ...goalData,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.goal.create.mockResolvedValue(createdGoal);

      const result = await createGoal(mockUserId, goalData);

      expect(result.title).toBe(goalData.title);
      expect(result.description).toBe(goalData.description);
    });

    it("should create goal with null description", async () => {
      const goalData = {
        title: "Goal without description",
        description: undefined,
      };

      const createdGoal = {
        id: "uuid-no-desc",
        title: goalData.title,
        description: null,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.goal.create.mockResolvedValue(createdGoal);

      const result = await createGoal(mockUserId, goalData);

      expect(result.description).toBeNull();
    });
  });

  describe("updateGoal", () => {
    it("should update an existing goal when user owns it", async () => {
      const updates = {
        title: "Updated Title",
        description: "Updated Description",
      };

      const existingGoal = {
        id: "goal-1",
        title: "Old Title",
        description: "Old Description",
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedGoal = {
        ...existingGoal,
        ...updates,
        updatedAt: new Date(),
      };

      mockPrisma.goal.findFirst.mockResolvedValue(existingGoal);
      mockPrisma.goal.update.mockResolvedValue(updatedGoal);

      const result = await updateGoal("goal-1", mockUserId, updates);

      expect(result).toEqual(updatedGoal);
      expect(mockPrisma.goal.findFirst).toHaveBeenCalledWith({
        where: {
          id: "goal-1",
          userId: mockUserId,
        },
      });
      expect(mockPrisma.goal.update).toHaveBeenCalledWith({
        where: { id: "goal-1" },
        data: updates,
      });
    });

    it("should return null when goal does not exist", async () => {
      mockPrisma.goal.findFirst.mockResolvedValue(null);

      const result = await updateGoal("nonexistent", mockUserId, {
        title: "Updated",
      });

      expect(result).toBeNull();
      expect(mockPrisma.goal.update).not.toHaveBeenCalled();
    });

    it("should return null when user does not own the goal", async () => {
      mockPrisma.goal.findFirst.mockResolvedValue(null);

      const result = await updateGoal("goal-1", mockOtherUserId, {
        title: "Updated",
      });

      expect(result).toBeNull();
      expect(mockPrisma.goal.update).not.toHaveBeenCalled();
    });

    it("should allow partial updates", async () => {
      const existingGoal = {
        id: "goal-1",
        title: "Old Title",
        description: "Old Description",
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedGoal = {
        ...existingGoal,
        title: "New Title",
        updatedAt: new Date(),
      };

      mockPrisma.goal.findFirst.mockResolvedValue(existingGoal);
      mockPrisma.goal.update.mockResolvedValue(updatedGoal);

      const result = await updateGoal("goal-1", mockUserId, {
        title: "New Title",
      });

      expect(result?.title).toBe("New Title");
      expect(result?.description).toBe("Old Description");
    });
  });

  describe("deleteGoal", () => {
    it("should delete an existing goal when user owns it", async () => {
      const existingGoal = {
        id: "goal-1",
        title: "Test Goal",
        description: "Description",
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.goal.findFirst.mockResolvedValue(existingGoal);
      mockPrisma.goal.delete.mockResolvedValue(existingGoal);

      const result = await deleteGoal("goal-1", mockUserId);

      expect(result).toBe(true);
      expect(mockPrisma.goal.findFirst).toHaveBeenCalledWith({
        where: {
          id: "goal-1",
          userId: mockUserId,
        },
      });
      expect(mockPrisma.goal.delete).toHaveBeenCalledWith({
        where: { id: "goal-1" },
      });
    });

    it("should return false when goal does not exist", async () => {
      mockPrisma.goal.findFirst.mockResolvedValue(null);

      const result = await deleteGoal("nonexistent", mockUserId);

      expect(result).toBe(false);
      expect(mockPrisma.goal.delete).not.toHaveBeenCalled();
    });

    it("should return false when user does not own the goal", async () => {
      mockPrisma.goal.findFirst.mockResolvedValue(null);

      const result = await deleteGoal("goal-1", mockOtherUserId);

      expect(result).toBe(false);
      expect(mockPrisma.goal.delete).not.toHaveBeenCalled();
    });
  });
});
