/**
 * @jest-environment node
 */
import {
  getWeeklyTasksForTask,
  getWeeklyTaskById,
  createWeeklyTask,
  updateWeeklyTask,
  deleteWeeklyTask,
} from "./weekly-tasks.service";
import prisma from "@/lib/prisma";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// Type assertions for mock methods
const mockWeeklyTaskFindMany = mockPrisma.weeklyTask
  .findMany as unknown as jest.Mock;
const mockWeeklyTaskFindFirst = mockPrisma.weeklyTask
  .findFirst as unknown as jest.Mock;
const mockWeeklyTaskCreate = mockPrisma.weeklyTask
  .create as unknown as jest.Mock;
const mockWeeklyTaskUpdate = mockPrisma.weeklyTask
  .update as unknown as jest.Mock;
const mockWeeklyTaskDelete = mockPrisma.weeklyTask
  .delete as unknown as jest.Mock;
const mockTaskFindFirst = mockPrisma.task.findFirst as unknown as jest.Mock;

describe("WeeklyTasksService", () => {
  const mockUserId = "clxyz123456789";
  const mockOtherUserId = "clxyz987654321";
  const mockTaskId = "task-123";
  const mockWeeklyTaskId = "weekly-task-123";
  const mockWeekStartDate = new Date("2025-11-09"); // Sunday

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getWeeklyTasksForTask", () => {
    it("should return all weekly tasks for a task owned by user", async () => {
      const mockWeeklyTasks = [
        {
          id: "weekly-task-1",
          taskId: mockTaskId,
          title: "Weekly Task 1",
          description: "Description 1",
          priority: 1,
          weekStartDate: mockWeekStartDate,
          status: "pending" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "weekly-task-2",
          taskId: mockTaskId,
          title: "Weekly Task 2",
          description: "Description 2",
          priority: 2,
          weekStartDate: mockWeekStartDate,
          status: "in_progress" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockWeeklyTaskFindMany.mockResolvedValue(mockWeeklyTasks);

      const result = await getWeeklyTasksForTask(mockTaskId, mockUserId);

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockWeeklyTasks);
      expect(mockWeeklyTaskFindMany).toHaveBeenCalledWith({
        where: {
          taskId: mockTaskId,
          task: {
            region: {
              goal: { userId: mockUserId },
            },
          },
        },
        orderBy: { priority: "asc" },
      });
    });

    it("should return empty array when task has no weekly tasks", async () => {
      mockWeeklyTaskFindMany.mockResolvedValue([]);

      const result = await getWeeklyTasksForTask(mockTaskId, mockUserId);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("should filter by weekStartDate when provided", async () => {
      const mockWeeklyTasks = [
        {
          id: "weekly-task-1",
          taskId: mockTaskId,
          title: "Weekly Task 1",
          description: null,
          priority: 1,
          weekStartDate: mockWeekStartDate,
          status: "pending" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockWeeklyTaskFindMany.mockResolvedValue(mockWeeklyTasks);

      const result = await getWeeklyTasksForTask(
        mockTaskId,
        mockUserId,
        mockWeekStartDate,
      );

      expect(result).toHaveLength(1);
      expect(mockWeeklyTaskFindMany).toHaveBeenCalledWith({
        where: {
          taskId: mockTaskId,
          weekStartDate: mockWeekStartDate,
          task: {
            region: {
              goal: { userId: mockUserId },
            },
          },
        },
        orderBy: { priority: "asc" },
      });
    });

    it("should verify ownership through task chain", async () => {
      mockWeeklyTaskFindMany.mockResolvedValue([]);

      await getWeeklyTasksForTask(mockTaskId, mockUserId);

      expect(mockWeeklyTaskFindMany).toHaveBeenCalledWith({
        where: {
          taskId: mockTaskId,
          task: {
            region: {
              goal: { userId: mockUserId },
            },
          },
        },
        orderBy: { priority: "asc" },
      });
    });
  });

  describe("getWeeklyTaskById", () => {
    it("should return weekly task when it exists and user is authorized", async () => {
      const mockWeeklyTask = {
        id: mockWeeklyTaskId,
        taskId: mockTaskId,
        title: "Test Weekly Task",
        description: "Test Description",
        priority: 1,
        weekStartDate: mockWeekStartDate,
        status: "pending" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockWeeklyTaskFindFirst.mockResolvedValue(mockWeeklyTask);

      const result = await getWeeklyTaskById(mockWeeklyTaskId, mockUserId);

      expect(result).toEqual(mockWeeklyTask);
      expect(mockWeeklyTaskFindFirst).toHaveBeenCalledWith({
        where: {
          id: mockWeeklyTaskId,
          task: {
            region: {
              goal: { userId: mockUserId },
            },
          },
        },
      });
    });

    it("should return null when weekly task does not exist", async () => {
      mockWeeklyTaskFindFirst.mockResolvedValue(null);

      const result = await getWeeklyTaskById("non-existent-id", mockUserId);

      expect(result).toBeNull();
    });

    it("should return null when user is not authorized", async () => {
      mockWeeklyTaskFindFirst.mockResolvedValue(null);

      const result = await getWeeklyTaskById(mockWeeklyTaskId, mockOtherUserId);

      expect(result).toBeNull();
    });
  });

  describe("createWeeklyTask", () => {
    const createData = {
      taskId: mockTaskId,
      title: "New Weekly Task",
      description: "New Description",
      priority: 1,
      weekStartDate: mockWeekStartDate,
    };

    it("should create weekly task when task is owned by user", async () => {
      const mockTask = {
        id: mockTaskId,
        title: "Parent Task",
        regionId: "region-123",
      };

      const mockCreatedWeeklyTask = {
        id: "new-weekly-task-id",
        taskId: mockTaskId,
        title: createData.title,
        description: createData.description,
        priority: createData.priority,
        weekStartDate: createData.weekStartDate,
        status: "pending" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskFindFirst.mockResolvedValue(mockTask);
      mockWeeklyTaskCreate.mockResolvedValue(mockCreatedWeeklyTask);

      const result = await createWeeklyTask(mockUserId, createData);

      expect(result).toEqual(mockCreatedWeeklyTask);
      expect(mockTaskFindFirst).toHaveBeenCalledWith({
        where: {
          id: mockTaskId,
          region: {
            goal: { userId: mockUserId },
          },
        },
      });
      expect(mockWeeklyTaskCreate).toHaveBeenCalledWith({
        data: createData,
      });
    });

    it("should return null when task is not owned by user", async () => {
      mockTaskFindFirst.mockResolvedValue(null);

      const result = await createWeeklyTask(mockUserId, createData);

      expect(result).toBeNull();
      expect(mockWeeklyTaskCreate).not.toHaveBeenCalled();
    });

    it("should set default status to pending", async () => {
      const mockTask = { id: mockTaskId };
      const mockCreatedWeeklyTask = {
        id: "new-weekly-task-id",
        ...createData,
        status: "pending" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskFindFirst.mockResolvedValue(mockTask);
      mockWeeklyTaskCreate.mockResolvedValue(mockCreatedWeeklyTask);

      const result = await createWeeklyTask(mockUserId, createData);

      expect(result?.status).toBe("pending");
    });
  });

  describe("updateWeeklyTask", () => {
    const updateData = {
      title: "Updated Title",
      priority: 2,
      status: "in_progress" as const,
    };

    it("should update weekly task when user is authorized", async () => {
      const mockExistingWeeklyTask = {
        id: mockWeeklyTaskId,
        taskId: mockTaskId,
        title: "Original Title",
        description: "Original Description",
        priority: 1,
        weekStartDate: mockWeekStartDate,
        status: "pending" as const,
      };

      const mockUpdatedWeeklyTask = {
        ...mockExistingWeeklyTask,
        ...updateData,
        updatedAt: new Date(),
      };

      mockWeeklyTaskFindFirst.mockResolvedValue(mockExistingWeeklyTask);
      mockWeeklyTaskUpdate.mockResolvedValue(mockUpdatedWeeklyTask);

      const result = await updateWeeklyTask(
        mockWeeklyTaskId,
        mockUserId,
        updateData,
      );

      expect(result).toEqual(mockUpdatedWeeklyTask);
      expect(mockWeeklyTaskFindFirst).toHaveBeenCalledWith({
        where: {
          id: mockWeeklyTaskId,
          task: {
            region: {
              goal: { userId: mockUserId },
            },
          },
        },
      });
      expect(mockWeeklyTaskUpdate).toHaveBeenCalledWith({
        where: { id: mockWeeklyTaskId },
        data: updateData,
      });
    });

    it("should return null when weekly task does not exist", async () => {
      mockWeeklyTaskFindFirst.mockResolvedValue(null);

      const result = await updateWeeklyTask(
        mockWeeklyTaskId,
        mockUserId,
        updateData,
      );

      expect(result).toBeNull();
      expect(mockWeeklyTaskUpdate).not.toHaveBeenCalled();
    });

    it("should return null when user is not authorized", async () => {
      mockWeeklyTaskFindFirst.mockResolvedValue(null);

      const result = await updateWeeklyTask(
        mockWeeklyTaskId,
        mockOtherUserId,
        updateData,
      );

      expect(result).toBeNull();
      expect(mockWeeklyTaskUpdate).not.toHaveBeenCalled();
    });

    it("should allow partial updates", async () => {
      const partialUpdateData = { title: "Only Title Updated" };
      const mockExistingWeeklyTask = {
        id: mockWeeklyTaskId,
        taskId: mockTaskId,
        title: "Original",
        description: "Keep this",
        priority: 1,
        weekStartDate: mockWeekStartDate,
        status: "pending" as const,
      };

      const mockUpdatedWeeklyTask = {
        ...mockExistingWeeklyTask,
        ...partialUpdateData,
      };

      mockWeeklyTaskFindFirst.mockResolvedValue(mockExistingWeeklyTask);
      mockWeeklyTaskUpdate.mockResolvedValue(mockUpdatedWeeklyTask);

      const result = await updateWeeklyTask(
        mockWeeklyTaskId,
        mockUserId,
        partialUpdateData,
      );

      expect(result?.title).toBe("Only Title Updated");
      expect(result?.description).toBe("Keep this");
      expect(mockWeeklyTaskUpdate).toHaveBeenCalledWith({
        where: { id: mockWeeklyTaskId },
        data: partialUpdateData,
      });
    });

    it("should allow any status transition", async () => {
      const mockExistingWeeklyTask = {
        id: mockWeeklyTaskId,
        status: "completed" as const,
      };

      const statusUpdate = { status: "pending" as const };
      const mockUpdatedWeeklyTask = {
        ...mockExistingWeeklyTask,
        ...statusUpdate,
      };

      mockWeeklyTaskFindFirst.mockResolvedValue(mockExistingWeeklyTask);
      mockWeeklyTaskUpdate.mockResolvedValue(mockUpdatedWeeklyTask);

      const result = await updateWeeklyTask(
        mockWeeklyTaskId,
        mockUserId,
        statusUpdate,
      );

      expect(result?.status).toBe("pending");
    });
  });

  describe("deleteWeeklyTask", () => {
    it("should delete weekly task when user is authorized and return true", async () => {
      const mockWeeklyTask = {
        id: mockWeeklyTaskId,
        taskId: mockTaskId,
        title: "To Delete",
      };

      mockWeeklyTaskFindFirst.mockResolvedValue(mockWeeklyTask);
      mockWeeklyTaskDelete.mockResolvedValue(mockWeeklyTask);

      const result = await deleteWeeklyTask(mockWeeklyTaskId, mockUserId);

      expect(result).toBe(true);
      expect(mockWeeklyTaskFindFirst).toHaveBeenCalledWith({
        where: {
          id: mockWeeklyTaskId,
          task: {
            region: {
              goal: { userId: mockUserId },
            },
          },
        },
      });
      expect(mockWeeklyTaskDelete).toHaveBeenCalledWith({
        where: { id: mockWeeklyTaskId },
      });
    });

    it("should return false when weekly task does not exist", async () => {
      mockWeeklyTaskFindFirst.mockResolvedValue(null);

      const result = await deleteWeeklyTask(mockWeeklyTaskId, mockUserId);

      expect(result).toBe(false);
      expect(mockWeeklyTaskDelete).not.toHaveBeenCalled();
    });

    it("should return false when user is not authorized", async () => {
      mockWeeklyTaskFindFirst.mockResolvedValue(null);

      const result = await deleteWeeklyTask(mockWeeklyTaskId, mockOtherUserId);

      expect(result).toBe(false);
      expect(mockWeeklyTaskDelete).not.toHaveBeenCalled();
    });
  });
});
