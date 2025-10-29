/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-explicit-any -- Mock types in tests require any for flexibility */
/* eslint-disable @typescript-eslint/no-unused-vars -- Some mocks may be unused in certain test scenarios */
import { getServerSession } from "next-auth";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasksForRegion,
  getTaskById,
} from "@/lib/services/tasks.service";

// Unmock the actions module to test the actual implementations
jest.unmock("@/app/actions/tasks");

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

const mockCreateTask = createTask as jest.MockedFunction<typeof createTask>;
const mockUpdateTask = updateTask as jest.MockedFunction<typeof updateTask>;
const mockDeleteTask = deleteTask as jest.MockedFunction<typeof deleteTask>;
const mockGetTasksForRegion = getTasksForRegion as jest.MockedFunction<
  typeof getTasksForRegion
>;
const mockGetTaskById = getTaskById as jest.MockedFunction<typeof getTaskById>;

// Mock the services
jest.mock("@/lib/services/tasks.service");

// Mock revalidatePath
const mockRevalidatePath = jest.fn();
jest.mock("next/cache", () => ({
  revalidatePath: (...args: any[]) => mockRevalidatePath(...args),
}));

describe("Tasks Actions", () => {
  const mockUserId = "clxyz123456789";
  const mockRegionId = "550e8400-e29b-41d4-a716-446655440030";
  const mockGoalId = "550e8400-e29b-41d4-a716-446655440031";
  const mockTaskId = "550e8400-e29b-41d4-a716-446655440040";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTaskAction", () => {
    it("should create a task when authenticated", async () => {
      const { createTaskAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const mockTask = {
        id: mockTaskId,
        regionId: mockRegionId,
        title: "Test Task",
        description: "Test Description",
        deadline: new Date("2025-12-31"),
        status: "active" as const,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreateTask.mockResolvedValue(mockTask);

      const formData = new FormData();
      formData.append("regionId", mockRegionId);
      formData.append("title", "Test Task");
      formData.append("description", "Test Description");
      formData.append("deadline", "2025-12-31");

      const result = await createTaskAction(formData);

      expect(result).toEqual({ success: true, data: mockTask });
      expect(mockCreateTask).toHaveBeenCalledWith(mockUserId, {
        regionId: mockRegionId,
        title: "Test Task",
        description: "Test Description",
        deadline: new Date("2025-12-31"),
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/goals");
    });

    it("should return error when not authenticated", async () => {
      const { createTaskAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("regionId", mockRegionId);
      formData.append("title", "Test Task");
      formData.append("deadline", "2025-12-31");

      const result = await createTaskAction(formData);

      expect(result).toEqual({ error: "Unauthorized", code: "UNAUTHORIZED" });
      expect(mockCreateTask).not.toHaveBeenCalled();
    });

    it("should return error when regionId is missing", async () => {
      const { createTaskAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const formData = new FormData();
      formData.append("title", "Test Task");
      formData.append("deadline", "2025-12-31");

      const result = await createTaskAction(formData);

      expect(result).toEqual({
        error: "Validation failed. Please check your input.",
        code: "VALIDATION_ERROR",
        validationErrors: [{ field: "regionId", message: "Invalid input: expected string, received undefined" }],
      });
      expect(mockCreateTask).not.toHaveBeenCalled();
    });

    it("should return error when title is missing", async () => {
      const { createTaskAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const formData = new FormData();
      formData.append("regionId", mockRegionId);
      formData.append("title", "");
      formData.append("deadline", "2025-12-31");

      const result = await createTaskAction(formData);

      expect(result).toEqual({
        error: "Validation failed. Please check your input.",
        code: "VALIDATION_ERROR",
        validationErrors: [{ field: "title", message: "Title is required" }],
      });
      expect(mockCreateTask).not.toHaveBeenCalled();
    });

    it("should return error when deadline is missing", async () => {
      const { createTaskAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const formData = new FormData();
      formData.append("regionId", mockRegionId);
      formData.append("title", "Test Task");

      const result = await createTaskAction(formData);

      expect(result).toEqual({
        error: "Validation failed. Please check your input.",
        code: "VALIDATION_ERROR",
        validationErrors: [{ field: "deadline", message: "Invalid deadline date" }],
      });
      expect(mockCreateTask).not.toHaveBeenCalled();
    });

    it("should return error when user does not own the region", async () => {
      const { createTaskAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      mockCreateTask.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("regionId", mockRegionId);
      formData.append("title", "Test Task");
      formData.append("deadline", "2025-12-31");

      const result = await createTaskAction(formData);

      expect(result).toEqual({
        error: "Region not found or unauthorized",
        code: "NOT_FOUND",
      });
    });

    it("should trim title and description", async () => {
      const { createTaskAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const mockTask = {
        id: mockTaskId,
        regionId: mockRegionId,
        title: "Test Task",
        description: "Test Description",
        deadline: new Date("2025-12-31"),
        status: "active" as const,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreateTask.mockResolvedValue(mockTask);

      const formData = new FormData();
      formData.append("regionId", mockRegionId);
      formData.append("title", "  Test Task  ");
      formData.append("description", "  Test Description  ");
      formData.append("deadline", "2025-12-31");

      await createTaskAction(formData);

      expect(mockCreateTask).toHaveBeenCalledWith(mockUserId, {
        regionId: mockRegionId,
        title: "Test Task",
        description: "Test Description",
        deadline: new Date("2025-12-31"),
      });
    });
  });

  describe("updateTaskAction", () => {
    it("should update a task when authenticated", async () => {
      const { updateTaskAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const mockTask = {
        id: mockTaskId,
        regionId: mockRegionId,
        title: "Updated Task",
        description: "Updated Description",
        deadline: new Date("2026-01-01"),
        status: "completed" as const,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUpdateTask.mockResolvedValue(mockTask);

      const formData = new FormData();
      formData.append("title", "Updated Task");
      formData.append("description", "Updated Description");
      formData.append("deadline", "2026-01-01");
      formData.append("status", "completed");

      const result = await updateTaskAction(mockTaskId, formData);

      expect(result).toEqual({ success: true, data: mockTask });
      expect(mockUpdateTask).toHaveBeenCalledWith(mockTaskId, mockUserId, {
        title: "Updated Task",
        description: "Updated Description",
        deadline: new Date("2026-01-01"),
        status: "completed",
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/goals");
    });

    it("should return error when not authenticated", async () => {
      const { updateTaskAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("title", "Updated Task");

      const result = await updateTaskAction(mockTaskId, formData);

      expect(result).toEqual({ error: "Unauthorized", code: "UNAUTHORIZED" });
      expect(mockUpdateTask).not.toHaveBeenCalled();
    });

    it("should return error when title is missing", async () => {
      const { updateTaskAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const formData = new FormData();
      formData.append("title", "");

      const result = await updateTaskAction(mockTaskId, formData);

      expect(result).toEqual({
        error: "Validation failed. Please check your input.",
        code: "VALIDATION_ERROR",
        validationErrors: [
          { field: "title", message: "Title is required" },
          { field: "deadline", message: "Invalid deadline date" },
          { field: "status", message: "Status must be active, incomplete, or completed" },
        ],
      });
      expect(mockUpdateTask).not.toHaveBeenCalled();
    });

    it("should return error when task not found or unauthorized", async () => {
      const { updateTaskAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      mockUpdateTask.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("title", "Updated Task");
      formData.append("deadline", "2026-01-01");
      formData.append("status", "active");

      const result = await updateTaskAction(mockTaskId, formData);

      expect(result).toEqual({
        error: "Task not found or unauthorized",
        code: "NOT_FOUND",
      });
    });
  });

  describe("deleteTaskAction", () => {
    it("should delete a task when authenticated", async () => {
      const { deleteTaskAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      mockDeleteTask.mockResolvedValue(true);

      const result = await deleteTaskAction(mockTaskId);

      expect(result).toEqual({ success: true, data: { deleted: true } });
      expect(mockDeleteTask).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/goals");
    });

    it("should return error when not authenticated", async () => {
      const { deleteTaskAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue(null);

      const result = await deleteTaskAction(mockTaskId);

      expect(result).toEqual({ error: "Unauthorized", code: "UNAUTHORIZED" });
      expect(mockDeleteTask).not.toHaveBeenCalled();
    });

    it("should return error when task not found or unauthorized", async () => {
      const { deleteTaskAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      mockDeleteTask.mockResolvedValue(false);

      const result = await deleteTaskAction(mockTaskId);

      expect(result).toEqual({
        error: "Task not found or unauthorized",
        code: "NOT_FOUND",
      });
    });
  });

  describe("getTasksAction", () => {
    it("should get all tasks when no regionId provided", async () => {
      const { getTasksAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const mockTasks = [
        {
          id: "550e8400-e29b-41d4-a716-446655440041",
          regionId: "550e8400-e29b-41d4-a716-446655440032",
          title: "Task 1",
          description: "Description 1",
          deadline: new Date(),
          status: "active" as const,
          userId: mockUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440042",
          regionId: "550e8400-e29b-41d4-a716-446655440033",
          title: "Task 2",
          description: "Description 2",
          deadline: new Date(),
          status: "active" as const,
          userId: mockUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockGetTasksForRegion.mockResolvedValue(mockTasks);

      const result = await getTasksAction();

      expect(result).toEqual({ success: true, data: mockTasks });
      expect(mockGetTasksForRegion).toHaveBeenCalledWith(undefined, mockUserId);
    });

    it("should get tasks for specific region when regionId provided", async () => {
      const { getTasksAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const mockTasks = [
        {
          id: "550e8400-e29b-41d4-a716-446655440041",
          regionId: mockRegionId,
          title: "Task 1",
          description: "Description 1",
          deadline: new Date(),
          status: "active" as const,
          userId: mockUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockGetTasksForRegion.mockResolvedValue(mockTasks);

      const result = await getTasksAction(mockRegionId);

      expect(result).toEqual({ success: true, data: mockTasks });
      expect(mockGetTasksForRegion).toHaveBeenCalledWith(
        mockRegionId,
        mockUserId
      );
    });

    it("should return error when not authenticated", async () => {
      const { getTasksAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue(null);

      const result = await getTasksAction();

      expect(result).toEqual({ error: "Unauthorized", code: "UNAUTHORIZED" });
      expect(mockGetTasksForRegion).not.toHaveBeenCalled();
    });
  });

  describe("getTaskAction", () => {
    it("should get a task by id when authenticated", async () => {
      const { getTaskAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const mockTask = {
        id: mockTaskId,
        regionId: mockRegionId,
        title: "Test Task",
        description: "Test Description",
        deadline: new Date(),
        status: "active" as const,
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockGetTaskById.mockResolvedValue(mockTask);

      const result = await getTaskAction(mockTaskId);

      expect(result).toEqual({ success: true, data: mockTask });
      expect(mockGetTaskById).toHaveBeenCalledWith(mockTaskId, mockUserId);
    });

    it("should return error when not authenticated", async () => {
      const { getTaskAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue(null);

      const result = await getTaskAction(mockTaskId);

      expect(result).toEqual({ error: "Unauthorized", code: "UNAUTHORIZED" });
      expect(mockGetTaskById).not.toHaveBeenCalled();
    });

    it("should return error when task not found", async () => {
      const { getTaskAction } = await import("@/app/actions/tasks");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      mockGetTaskById.mockResolvedValue(null);

      const result = await getTaskAction(mockTaskId);

      expect(result).toEqual({ error: "Task not found", code: "NOT_FOUND" });
    });
  });
});
