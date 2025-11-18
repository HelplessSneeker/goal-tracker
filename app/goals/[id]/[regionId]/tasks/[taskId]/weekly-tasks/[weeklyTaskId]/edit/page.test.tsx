// Mock server actions
jest.mock("@/app/actions/tasks", () => ({
  getTaskAction: jest.fn(),
}));

jest.mock("@/app/actions/weekly-tasks", () => ({
  getWeeklyTaskAction: jest.fn(),
}));

// Mock next-intl server
jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn(() => async (key: string) => key),
}));

// Mock WeeklyTaskForm component
jest.mock("@/components/weekly-tasks", () => ({
  WeeklyTaskForm: () => null,
}));

import { getTaskAction } from "@/app/actions/tasks";
import { getWeeklyTaskAction } from "@/app/actions/weekly-tasks";
import { ActionErrorCode } from "@/lib/action-types";
import EditWeeklyTaskPage from "./page";

const mockGetTask = getTaskAction as jest.MockedFunction<typeof getTaskAction>;
const mockGetWeeklyTask = getWeeklyTaskAction as jest.MockedFunction<
  typeof getWeeklyTaskAction
>;

describe("EditWeeklyTaskPage", () => {
  const mockParams = {
    id: "goal-1",
    regionId: "region-1",
    taskId: "task-1",
    weeklyTaskId: "weekly-1",
  };

  const mockTaskData = {
    id: "task-1",
    regionId: "region-1",
    title: "Test Task",
    description: "Test Description",
    deadline: new Date("2025-12-31"),
    status: "active" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockWeeklyTaskData = {
    id: "weekly-1",
    taskId: "task-1",
    title: "Weekly Task 1",
    description: "Description 1",
    priority: 1,
    weekStartDate: new Date(Date.UTC(2025, 10, 9)),
    status: "pending" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches both task and weekly task data", async () => {
    mockGetTask.mockResolvedValue({
      success: true,
      data: mockTaskData,
    });
    mockGetWeeklyTask.mockResolvedValue({
      success: true,
      data: mockWeeklyTaskData,
    });

    await EditWeeklyTaskPage({ params: mockParams });

    expect(mockGetTask).toHaveBeenCalledWith("task-1");
    expect(mockGetWeeklyTask).toHaveBeenCalledWith("weekly-1");
  });

  it("handles task not found error", async () => {
    mockGetTask.mockResolvedValue({
      error: "Task not found",
      code: ActionErrorCode.NOT_FOUND,
    });
    mockGetWeeklyTask.mockResolvedValue({
      success: true,
      data: mockWeeklyTaskData,
    });

    const result = await EditWeeklyTaskPage({ params: mockParams });

    expect(result).toBeDefined();
  });

  it("handles weekly task not found error", async () => {
    mockGetTask.mockResolvedValue({
      success: true,
      data: mockTaskData,
    });
    mockGetWeeklyTask.mockResolvedValue({
      error: "Weekly task not found",
      code: ActionErrorCode.NOT_FOUND,
    });

    const result = await EditWeeklyTaskPage({ params: mockParams });

    expect(result).toBeDefined();
  });

  it("renders successfully when both resources are found", async () => {
    mockGetTask.mockResolvedValue({
      success: true,
      data: mockTaskData,
    });
    mockGetWeeklyTask.mockResolvedValue({
      success: true,
      data: mockWeeklyTaskData,
    });

    const result = await EditWeeklyTaskPage({ params: mockParams });

    expect(result).toBeDefined();
  });

  it("uses correct IDs from URL params", async () => {
    const customParams = {
      id: "custom-goal",
      regionId: "custom-region",
      taskId: "custom-task",
      weeklyTaskId: "custom-weekly",
    };

    mockGetTask.mockResolvedValue({
      success: true,
      data: {
        ...mockTaskData,
        id: "custom-task",
      },
    });
    mockGetWeeklyTask.mockResolvedValue({
      success: true,
      data: {
        ...mockWeeklyTaskData,
        id: "custom-weekly",
        taskId: "custom-task",
      },
    });

    await EditWeeklyTaskPage({ params: customParams });

    expect(mockGetTask).toHaveBeenCalledWith("custom-task");
    expect(mockGetWeeklyTask).toHaveBeenCalledWith("custom-weekly");
  });
});
