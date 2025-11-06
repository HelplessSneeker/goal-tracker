/**
 * @jest-environment node
 */
import {
  getTasksForRegion,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "./tasks.service";
import prisma from "@/lib/prisma";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// Type assertions for mock methods
const mockTaskFindMany = mockPrisma.task.findMany as unknown as jest.Mock;
const mockTaskFindFirst = mockPrisma.task.findFirst as unknown as jest.Mock;
const mockTaskCreate = mockPrisma.task.create as unknown as jest.Mock;
const mockTaskUpdate = mockPrisma.task.update as unknown as jest.Mock;
const mockTaskDelete = mockPrisma.task.delete as unknown as jest.Mock;
const mockRegionFindFirst = mockPrisma.region.findFirst as unknown as jest.Mock;

describe("TasksService", () => {
  const mockUserId = "clxyz123456789";
  const mockOtherUserId = "clxyz987654321";
  const mockRegionId = "region-123";
  const mockGoalId = "goal-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTasksForRegion", () => {
    it("should return all tasks for a region owned by user", async () => {
      const mockTasks = [
        {
          id: "task-1",
          title: "Task 1",
          description: "Description 1",
          regionId: mockRegionId,
          deadline: new Date(),
          status: "active",
          userId: mockUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "task-2",
          title: "Task 2",
          description: "Description 2",
          regionId: mockRegionId,
          deadline: new Date(),
          status: "active",
          userId: mockUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockTaskFindMany.mockResolvedValue(mockTasks);

      const result = await getTasksForRegion(mockRegionId, mockUserId);

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockTasks);
      expect(mockTaskFindMany).toHaveBeenCalledWith({
        where: {
          regionId: mockRegionId,
          region: {
            goal: { userId: mockUserId },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return empty array when region has no tasks", async () => {
      mockTaskFindMany.mockResolvedValue([]);

      const result = await getTasksForRegion(mockRegionId, mockUserId);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("should verify goal ownership through region when fetching tasks", async () => {
      mockTaskFindMany.mockResolvedValue([]);

      await getTasksForRegion(mockRegionId, mockUserId);

      expect(mockTaskFindMany).toHaveBeenCalledWith({
        where: {
          regionId: mockRegionId,
          region: {
            goal: { userId: mockUserId },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should allow fetching all tasks for a user when no regionId provided", async () => {
      const mockTasks = [
        {
          id: "task-1",
          title: "Task 1",
          description: "Description 1",
          regionId: "region-1",
          deadline: new Date(),
          status: "active",
          userId: mockUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockTaskFindMany.mockResolvedValue(mockTasks);

      const result = await getTasksForRegion(undefined, mockUserId);

      expect(result).toEqual(mockTasks);
      expect(mockTaskFindMany).toHaveBeenCalledWith({
        where: {
          region: {
            goal: { userId: mockUserId },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("getTaskById", () => {
    it("should return a task when it exists and user owns the goal", async () => {
      const mockTask = {
        id: "task-1",
        title: "Test Task",
        description: "Description",
        regionId: mockRegionId,
        deadline: new Date(),
        status: "active",
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskFindFirst.mockResolvedValue(mockTask);

      const result = await getTaskById("task-1", mockUserId);

      expect(result).toEqual(mockTask);
      expect(mockTaskFindFirst).toHaveBeenCalledWith({
        where: {
          id: "task-1",
          region: {
            goal: { userId: mockUserId },
          },
        },
      });
    });

    it("should return null when task does not exist", async () => {
      mockTaskFindFirst.mockResolvedValue(null);

      const result = await getTaskById("nonexistent", mockUserId);

      expect(result).toBeNull();
    });

    it("should return null when user does not own the goal", async () => {
      mockTaskFindFirst.mockResolvedValue(null);

      const result = await getTaskById("task-1", mockOtherUserId);

      expect(result).toBeNull();
      expect(mockTaskFindFirst).toHaveBeenCalledWith({
        where: {
          id: "task-1",
          region: {
            goal: { userId: mockOtherUserId },
          },
        },
      });
    });
  });

  describe("createTask", () => {
    it("should create a task for a region owned by user", async () => {
      const taskData = {
        regionId: mockRegionId,
        title: "New Task",
        description: "New Description",
        deadline: new Date("2025-12-31"),
      };

      const createdTask = {
        id: "task-new",
        ...taskData,
        status: "active",
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock region ownership check
      mockRegionFindFirst.mockResolvedValue({
        id: mockRegionId,
        title: "Region",
        description: "Desc",
        goalId: mockGoalId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockTaskCreate.mockResolvedValue(createdTask);

      const result = await createTask(mockUserId, taskData);

      expect(result).toEqual(createdTask);
      expect(mockRegionFindFirst).toHaveBeenCalledWith({
        where: {
          id: mockRegionId,
          goal: { userId: mockUserId },
        },
      });
      expect(mockTaskCreate).toHaveBeenCalledWith({
        data: {
          ...taskData,
          status: "active",
        },
      });
    });

    it("should return null when user does not own the region's goal", async () => {
      const taskData = {
        regionId: mockRegionId,
        title: "New Task",
        description: "New Description",
        deadline: new Date("2025-12-31"),
      };

      mockRegionFindFirst.mockResolvedValue(null);

      const result = await createTask(mockOtherUserId, taskData);

      expect(result).toBeNull();
      expect(mockTaskCreate).not.toHaveBeenCalled();
    });
  });

  describe("updateTask", () => {
    it("should update a task when user owns the goal", async () => {
      const updates = {
        title: "Updated Title",
        description: "Updated Description",
        deadline: new Date("2026-01-01"),
        status: "completed" as const,
      };

      const existingTask = {
        id: "task-1",
        title: "Old Title",
        description: "Old Description",
        regionId: mockRegionId,
        deadline: new Date(),
        status: "active" as const,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedTask = {
        ...existingTask,
        ...updates,
        updatedAt: new Date(),
      };

      mockTaskFindFirst.mockResolvedValue(existingTask);
      mockTaskUpdate.mockResolvedValue(updatedTask);

      const result = await updateTask("task-1", mockUserId, updates);

      expect(result).toEqual(updatedTask);
      expect(mockTaskFindFirst).toHaveBeenCalledWith({
        where: {
          id: "task-1",
          region: {
            goal: { userId: mockUserId },
          },
        },
      });
      expect(mockTaskUpdate).toHaveBeenCalledWith({
        where: { id: "task-1" },
        data: updates,
      });
    });

    it("should return null when task does not exist", async () => {
      mockTaskFindFirst.mockResolvedValue(null);

      const result = await updateTask("nonexistent", mockUserId, {
        title: "Updated",
      });

      expect(result).toBeNull();
      expect(mockTaskUpdate).not.toHaveBeenCalled();
    });

    it("should return null when user does not own the goal", async () => {
      mockTaskFindFirst.mockResolvedValue(null);

      const result = await updateTask("task-1", mockOtherUserId, {
        title: "Updated",
      });

      expect(result).toBeNull();
      expect(mockTaskUpdate).not.toHaveBeenCalled();
    });

    it("should allow partial updates", async () => {
      const existingTask = {
        id: "task-1",
        title: "Old Title",
        description: "Old Description",
        regionId: mockRegionId,
        deadline: new Date(),
        status: "active" as const,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedTask = {
        ...existingTask,
        title: "New Title",
        updatedAt: new Date(),
      };

      mockTaskFindFirst.mockResolvedValue(existingTask);
      mockTaskUpdate.mockResolvedValue(updatedTask);

      const result = await updateTask("task-1", mockUserId, {
        title: "New Title",
      });

      expect(result?.title).toBe("New Title");
      expect(result?.description).toBe("Old Description");
    });
  });

  describe("deleteTask", () => {
    it("should delete a task when user owns the goal", async () => {
      const existingTask = {
        id: "task-1",
        title: "Test Task",
        description: "Description",
        regionId: mockRegionId,
        deadline: new Date(),
        status: "active" as const,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskFindFirst.mockResolvedValue(existingTask);
      mockTaskDelete.mockResolvedValue(existingTask);

      const result = await deleteTask("task-1", mockUserId);

      expect(result).toBe(true);
      expect(mockTaskFindFirst).toHaveBeenCalledWith({
        where: {
          id: "task-1",
          region: {
            goal: { userId: mockUserId },
          },
        },
      });
      expect(mockTaskDelete).toHaveBeenCalledWith({
        where: { id: "task-1" },
      });
    });

    it("should return false when task does not exist", async () => {
      mockTaskFindFirst.mockResolvedValue(null);

      const result = await deleteTask("nonexistent", mockUserId);

      expect(result).toBe(false);
      expect(mockTaskDelete).not.toHaveBeenCalled();
    });

    it("should return false when user does not own the goal", async () => {
      mockTaskFindFirst.mockResolvedValue(null);

      const result = await deleteTask("task-1", mockOtherUserId);

      expect(result).toBe(false);
      expect(mockTaskDelete).not.toHaveBeenCalled();
    });
  });
});
