/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-explicit-any -- Mock types in tests require any for flexibility */
/* eslint-disable @typescript-eslint/no-unused-vars -- Some mocks may be unused in certain test scenarios */
import { getServerSession } from "next-auth";
import {
  getWeeklyTasksForTask,
  getWeeklyTaskById,
  createWeeklyTask,
  updateWeeklyTask,
  deleteWeeklyTask,
} from "@/lib/services/weekly-tasks.service";
import { ActionErrorCode } from "@/lib/action-types";

// Unmock the actions module to test the actual implementations
jest.unmock("@/app/actions/weekly-tasks");

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

const mockCreateWeeklyTask = createWeeklyTask as jest.MockedFunction<
  typeof createWeeklyTask
>;
const mockUpdateWeeklyTask = updateWeeklyTask as jest.MockedFunction<
  typeof updateWeeklyTask
>;
const mockDeleteWeeklyTask = deleteWeeklyTask as jest.MockedFunction<
  typeof deleteWeeklyTask
>;
const mockGetWeeklyTasksForTask = getWeeklyTasksForTask as jest.MockedFunction<
  typeof getWeeklyTasksForTask
>;
const mockGetWeeklyTaskById = getWeeklyTaskById as jest.MockedFunction<
  typeof getWeeklyTaskById
>;

// Mock the services
jest.mock("@/lib/services/weekly-tasks.service");

// Mock revalidatePath
const mockRevalidatePath = jest.fn();
jest.mock("next/cache", () => ({
  revalidatePath: (...args: any[]) => mockRevalidatePath(...args),
}));

describe("Weekly Tasks Actions", () => {
  const mockUserId = "clxyz123456789";
  const mockTaskId = "550e8400-e29b-41d4-a716-446655440040";
  const mockWeeklyTaskId = "550e8400-e29b-41d4-a716-446655440050";
  const mockWeekStartDate = new Date("2025-11-09"); // Sunday

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createWeeklyTaskAction", () => {
    it("should create a weekly task when authenticated", async () => {
      const { createWeeklyTaskAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

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

      mockCreateWeeklyTask.mockResolvedValue(mockWeeklyTask);

      const formData = new FormData();
      formData.append("taskId", mockTaskId);
      formData.append("title", "Test Weekly Task");
      formData.append("description", "Test Description");
      formData.append("priority", "1");
      formData.append("weekStartDate", "2025-11-09");

      const result = await createWeeklyTaskAction(formData);

      expect(result).toEqual({ success: true, data: mockWeeklyTask });
      expect(mockCreateWeeklyTask).toHaveBeenCalledWith(mockUserId, {
        taskId: mockTaskId,
        title: "Test Weekly Task",
        description: "Test Description",
        priority: 1,
        weekStartDate: new Date("2025-11-09"),
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/goals");
    });

    it("should return error when not authenticated", async () => {
      const { createWeeklyTaskAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("taskId", mockTaskId);
      formData.append("title", "Test Weekly Task");
      formData.append("priority", "1");
      formData.append("weekStartDate", "2025-11-09");

      const result = await createWeeklyTaskAction(formData);

      expect(result).toEqual({
        error: "Unauthorized",
        code: ActionErrorCode.UNAUTHORIZED,
      });
      expect(mockCreateWeeklyTask).not.toHaveBeenCalled();
    });

    it("should return error when taskId is missing", async () => {
      const { createWeeklyTaskAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const formData = new FormData();
      formData.append("title", "Test Weekly Task");
      formData.append("priority", "1");
      formData.append("weekStartDate", "2025-11-09");

      const result = await createWeeklyTaskAction(formData);

      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("code", ActionErrorCode.VALIDATION_ERROR);
      expect(mockCreateWeeklyTask).not.toHaveBeenCalled();
    });

    it("should return error when title is missing", async () => {
      const { createWeeklyTaskAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const formData = new FormData();
      formData.append("taskId", mockTaskId);
      formData.append("title", "");
      formData.append("priority", "1");
      formData.append("weekStartDate", "2025-11-09");

      const result = await createWeeklyTaskAction(formData);

      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("code", ActionErrorCode.VALIDATION_ERROR);
      expect(mockCreateWeeklyTask).not.toHaveBeenCalled();
    });

    it("should return error when priority is invalid", async () => {
      const { createWeeklyTaskAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const formData = new FormData();
      formData.append("taskId", mockTaskId);
      formData.append("title", "Test Weekly Task");
      formData.append("priority", "5"); // Invalid: must be 1-3
      formData.append("weekStartDate", "2025-11-09");

      const result = await createWeeklyTaskAction(formData);

      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("code", ActionErrorCode.VALIDATION_ERROR);
      expect(mockCreateWeeklyTask).not.toHaveBeenCalled();
    });

    it("should return error when service returns null (task not owned)", async () => {
      const { createWeeklyTaskAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      mockCreateWeeklyTask.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("taskId", mockTaskId);
      formData.append("title", "Test Weekly Task");
      formData.append("priority", "1");
      formData.append("weekStartDate", "2025-11-09");

      const result = await createWeeklyTaskAction(formData);

      expect(result).toEqual({
        error:
          "Task not found or you don't have permission to create weekly tasks for it",
        code: ActionErrorCode.NOT_FOUND,
      });
    });

    it("should use default priority of 1 when not provided", async () => {
      const { createWeeklyTaskAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const mockWeeklyTask = {
        id: mockWeeklyTaskId,
        taskId: mockTaskId,
        title: "Test Weekly Task",
        description: null,
        priority: 1,
        weekStartDate: mockWeekStartDate,
        status: "pending" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreateWeeklyTask.mockResolvedValue(mockWeeklyTask);

      const formData = new FormData();
      formData.append("taskId", mockTaskId);
      formData.append("title", "Test Weekly Task");
      formData.append("weekStartDate", "2025-11-09");
      // Priority not provided - should default to 1

      const result = await createWeeklyTaskAction(formData);

      expect(result).toEqual({ success: true, data: mockWeeklyTask });
      expect(mockCreateWeeklyTask).toHaveBeenCalledWith(
        mockUserId,
        expect.objectContaining({
          priority: 1,
        }),
      );
    });
  });

  describe("updateWeeklyTaskAction", () => {
    it("should update a weekly task when authenticated", async () => {
      const { updateWeeklyTaskAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const mockUpdatedWeeklyTask = {
        id: mockWeeklyTaskId,
        taskId: mockTaskId,
        title: "Updated Title",
        description: "Updated Description",
        priority: 2,
        weekStartDate: mockWeekStartDate,
        status: "in_progress" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUpdateWeeklyTask.mockResolvedValue(mockUpdatedWeeklyTask);

      const formData = new FormData();
      formData.append("id", mockWeeklyTaskId);
      formData.append("title", "Updated Title");
      formData.append("description", "Updated Description");
      formData.append("priority", "2");
      formData.append("weekStartDate", "2025-11-09");
      formData.append("status", "in_progress");

      const result = await updateWeeklyTaskAction(formData);

      expect(result).toEqual({ success: true, data: mockUpdatedWeeklyTask });
      expect(mockUpdateWeeklyTask).toHaveBeenCalledWith(
        mockWeeklyTaskId,
        mockUserId,
        {
          title: "Updated Title",
          description: "Updated Description",
          priority: 2,
          weekStartDate: new Date("2025-11-09"),
          status: "in_progress",
        },
      );
      expect(mockRevalidatePath).toHaveBeenCalledWith("/goals");
    });

    it("should return error when not authenticated", async () => {
      const { updateWeeklyTaskAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("id", mockWeeklyTaskId);
      formData.append("title", "Updated Title");
      formData.append("priority", "2");
      formData.append("weekStartDate", "2025-11-09");
      formData.append("status", "in_progress");

      const result = await updateWeeklyTaskAction(formData);

      expect(result).toEqual({
        error: "Unauthorized",
        code: ActionErrorCode.UNAUTHORIZED,
      });
      expect(mockUpdateWeeklyTask).not.toHaveBeenCalled();
    });

    it("should return error when service returns null (not found or unauthorized)", async () => {
      const { updateWeeklyTaskAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      mockUpdateWeeklyTask.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("id", mockWeeklyTaskId);
      formData.append("title", "Updated Title");
      formData.append("priority", "2");
      formData.append("weekStartDate", "2025-11-09");
      formData.append("status", "in_progress");

      const result = await updateWeeklyTaskAction(formData);

      expect(result).toEqual({
        error:
          "Weekly task not found or you don't have permission to update it",
        code: ActionErrorCode.NOT_FOUND,
      });
    });

    it("should allow status changes freely", async () => {
      const { updateWeeklyTaskAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const mockUpdatedWeeklyTask = {
        id: mockWeeklyTaskId,
        taskId: mockTaskId,
        title: "Test",
        description: null,
        priority: 1,
        weekStartDate: mockWeekStartDate,
        status: "pending" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUpdateWeeklyTask.mockResolvedValue(mockUpdatedWeeklyTask);

      const formData = new FormData();
      formData.append("id", mockWeeklyTaskId);
      formData.append("title", "Test");
      formData.append("priority", "1");
      formData.append("weekStartDate", "2025-11-09");
      formData.append("status", "pending"); // Changed from completed back to pending

      const result = await updateWeeklyTaskAction(formData);

      expect(result).toHaveProperty("success", true);
      expect(mockUpdateWeeklyTask).toHaveBeenCalledWith(
        mockWeeklyTaskId,
        mockUserId,
        expect.objectContaining({
          status: "pending",
        }),
      );
    });
  });

  describe("deleteWeeklyTaskAction", () => {
    it("should delete a weekly task when authenticated", async () => {
      const { deleteWeeklyTaskAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      mockDeleteWeeklyTask.mockResolvedValue(true);

      const result = await deleteWeeklyTaskAction(mockWeeklyTaskId);

      expect(result).toEqual({ success: true, data: { deleted: true } });
      expect(mockDeleteWeeklyTask).toHaveBeenCalledWith(
        mockWeeklyTaskId,
        mockUserId,
      );
      expect(mockRevalidatePath).toHaveBeenCalledWith("/goals");
    });

    it("should return error when not authenticated", async () => {
      const { deleteWeeklyTaskAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue(null);

      const result = await deleteWeeklyTaskAction(mockWeeklyTaskId);

      expect(result).toEqual({
        error: "Unauthorized",
        code: ActionErrorCode.UNAUTHORIZED,
      });
      expect(mockDeleteWeeklyTask).not.toHaveBeenCalled();
    });

    it("should return error when service returns false (not found or unauthorized)", async () => {
      const { deleteWeeklyTaskAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      mockDeleteWeeklyTask.mockResolvedValue(false);

      const result = await deleteWeeklyTaskAction(mockWeeklyTaskId);

      expect(result).toEqual({
        error:
          "Weekly task not found or you don't have permission to delete it",
        code: ActionErrorCode.NOT_FOUND,
      });
    });
  });

  describe("getWeeklyTasksAction", () => {
    it("should get weekly tasks for a task when authenticated", async () => {
      const { getWeeklyTasksAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

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
        {
          id: "weekly-task-2",
          taskId: mockTaskId,
          title: "Weekly Task 2",
          description: "Description",
          priority: 2,
          weekStartDate: mockWeekStartDate,
          status: "in_progress" as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockGetWeeklyTasksForTask.mockResolvedValue(mockWeeklyTasks);

      const result = await getWeeklyTasksAction(mockTaskId);

      expect(result).toEqual({ success: true, data: mockWeeklyTasks });
      expect(mockGetWeeklyTasksForTask).toHaveBeenCalledWith(
        mockTaskId,
        mockUserId,
        undefined,
      );
    });

    it("should filter by weekStartDate when provided", async () => {
      const { getWeeklyTasksAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

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

      mockGetWeeklyTasksForTask.mockResolvedValue(mockWeeklyTasks);

      const result = await getWeeklyTasksAction(mockTaskId, "2025-11-09");

      expect(result).toEqual({ success: true, data: mockWeeklyTasks });
      expect(mockGetWeeklyTasksForTask).toHaveBeenCalledWith(
        mockTaskId,
        mockUserId,
        new Date("2025-11-09"),
      );
    });

    it("should return error when not authenticated", async () => {
      const { getWeeklyTasksAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue(null);

      const result = await getWeeklyTasksAction(mockTaskId);

      expect(result).toEqual({
        error: "Unauthorized",
        code: ActionErrorCode.UNAUTHORIZED,
      });
      expect(mockGetWeeklyTasksForTask).not.toHaveBeenCalled();
    });
  });

  describe("getWeeklyTaskAction", () => {
    it("should get a weekly task by id when authenticated", async () => {
      const { getWeeklyTaskAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const mockWeeklyTask = {
        id: mockWeeklyTaskId,
        taskId: mockTaskId,
        title: "Test Weekly Task",
        description: "Description",
        priority: 1,
        weekStartDate: mockWeekStartDate,
        status: "pending" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockGetWeeklyTaskById.mockResolvedValue(mockWeeklyTask);

      const result = await getWeeklyTaskAction(mockWeeklyTaskId);

      expect(result).toEqual({ success: true, data: mockWeeklyTask });
      expect(mockGetWeeklyTaskById).toHaveBeenCalledWith(
        mockWeeklyTaskId,
        mockUserId,
      );
    });

    it("should return error when not authenticated", async () => {
      const { getWeeklyTaskAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue(null);

      const result = await getWeeklyTaskAction(mockWeeklyTaskId);

      expect(result).toEqual({
        error: "Unauthorized",
        code: ActionErrorCode.UNAUTHORIZED,
      });
      expect(mockGetWeeklyTaskById).not.toHaveBeenCalled();
    });

    it("should return error when service returns null (not found or unauthorized)", async () => {
      const { getWeeklyTaskAction } = await import(
        "@/app/actions/weekly-tasks"
      );

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      mockGetWeeklyTaskById.mockResolvedValue(null);

      const result = await getWeeklyTaskAction(mockWeeklyTaskId);

      expect(result).toEqual({
        error: "Weekly task not found or you don't have permission to view it",
        code: ActionErrorCode.NOT_FOUND,
      });
    });
  });
});
