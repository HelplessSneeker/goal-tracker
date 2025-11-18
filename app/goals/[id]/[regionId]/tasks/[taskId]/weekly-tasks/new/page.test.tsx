// Mock server actions
jest.mock("@/app/actions/tasks", () => ({
  getTaskByIdAction: jest.fn(),
}));

// Mock next-intl server
jest.mock("next-intl/server", () => ({
  getTranslations: jest.fn(() => async (key: string) => key),
}));

// Mock WeeklyTaskForm component - just return null to avoid rendering issues
jest.mock("@/components/weekly-tasks", () => ({
  WeeklyTaskForm: () => null,
}));

import { getTaskByIdAction } from "@/app/actions/tasks";
import NewWeeklyTaskPage from "./page";

const mockGetTask = getTaskByIdAction as jest.MockedFunction<
  typeof getTaskByIdAction
>;

describe("NewWeeklyTaskPage", () => {
  const mockParams = {
    id: "goal-1",
    regionId: "region-1",
    taskId: "task-1",
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches task data using getTaskByIdAction", async () => {
    mockGetTask.mockResolvedValue({
      success: true,
      data: mockTaskData,
    });

    await NewWeeklyTaskPage({ params: mockParams });

    expect(mockGetTask).toHaveBeenCalledWith("task-1");
    expect(mockGetTask).toHaveBeenCalledTimes(1);
  });

  it("handles task not found error", async () => {
    mockGetTask.mockResolvedValue({
      error: "Task not found",
      code: "NOT_FOUND" as const,
    });

    const result = await NewWeeklyTaskPage({ params: mockParams });

    // Should return JSX (not throw an error)
    expect(result).toBeDefined();
  });

  it("renders successfully when task is found", async () => {
    mockGetTask.mockResolvedValue({
      success: true,
      data: mockTaskData,
    });

    const result = await NewWeeklyTaskPage({ params: mockParams });

    // Should return JSX (not throw an error)
    expect(result).toBeDefined();
  });

  it("uses correct taskId from URL params", async () => {
    const customParams = {
      id: "custom-goal",
      regionId: "custom-region",
      taskId: "custom-task",
    };

    mockGetTask.mockResolvedValue({
      success: true,
      data: {
        ...mockTaskData,
        id: "custom-task",
        regionId: "custom-region",
      },
    });

    await NewWeeklyTaskPage({ params: customParams });

    expect(mockGetTask).toHaveBeenCalledWith("custom-task");
  });

  it("handles different task data correctly", async () => {
    const differentTask = {
      id: "task-2",
      regionId: "region-2",
      title: "Different Task",
      description: "Different Description",
      deadline: new Date("2026-01-01"),
      status: "completed" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetTask.mockResolvedValue({
      success: true,
      data: differentTask,
    });

    const result = await NewWeeklyTaskPage({
      params: { id: "goal-2", regionId: "region-2", taskId: "task-2" },
    });

    expect(result).toBeDefined();
    expect(mockGetTask).toHaveBeenCalledWith("task-2");
  });
});
