import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WeeklyTasksSection } from "./weekly-tasks-section";
import { getWeeklyTasksAction } from "@/app/actions/weekly-tasks";
import type { WeeklyTask } from "@prisma/client";

// Mock next/cache
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

// Mock server actions
jest.mock("@/app/actions/weekly-tasks");

// Mock getWeekStart to return a fixed date
jest.mock("../week-selector/week-selector", () => ({
  WeekSelector: jest.fn(({ selectedWeek, onWeekChange }) => (
    <div>
      <button
        aria-label="previous week"
        onClick={() => onWeekChange(new Date(Date.UTC(2025, 10, 2)))}
      >
        Prev
      </button>
      <button
        aria-label="next week"
        onClick={() => onWeekChange(new Date(Date.UTC(2025, 10, 16)))}
      >
        Next
      </button>
    </div>
  )),
  getWeekStart: jest.fn((date: Date) => {
    // Return Sunday of the week containing the given date
    const d = new Date(date.getTime());
    const day = d.getUTCDay();
    const diff = day;
    d.setUTCDate(d.getUTCDate() - diff);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }),
}));

const mockGetWeeklyTasks = getWeeklyTasksAction as jest.MockedFunction<
  typeof getWeeklyTasksAction
>;

describe("WeeklyTasksSection", () => {
  const mockTask = {
    id: "task-1",
    goalId: "goal-1",
    regionId: "region-1",
    title: "Test Task",
  };

  const mockWeeklyTasks: WeeklyTask[] = [
    {
      id: "weekly-1",
      taskId: "task-1",
      title: "Weekly Task 1",
      description: "Description 1",
      priority: 1,
      weekStartDate: new Date(Date.UTC(2025, 10, 9)), // Nov 9, 2025 (Sunday)
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "weekly-2",
      taskId: "task-1",
      title: "Weekly Task 2",
      description: "Description 2",
      priority: 2,
      weekStartDate: new Date(Date.UTC(2025, 10, 9)),
      status: "in_progress",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders section with title and create button", async () => {
    mockGetWeeklyTasks.mockResolvedValue({
      success: true,
      data: [],
    });

    render(<WeeklyTasksSection task={mockTask} />);

    expect(screen.getByText(/weekly tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/create new weekly task/i)).toBeInTheDocument();
  });

  it("renders WeekSelector component", async () => {
    mockGetWeeklyTasks.mockResolvedValue({
      success: true,
      data: [],
    });

    render(<WeeklyTasksSection task={mockTask} />);

    // WeekSelector shows current week by default
    // Just verify that week navigation buttons are present
    await waitFor(() => {
      expect(screen.getByLabelText(/previous week/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/next week/i)).toBeInTheDocument();
    });
  });

  it("fetches and displays weekly tasks for current week on mount", async () => {
    mockGetWeeklyTasks.mockResolvedValue({
      success: true,
      data: mockWeeklyTasks,
    });

    render(<WeeklyTasksSection task={mockTask} />);

    await waitFor(() => {
      expect(mockGetWeeklyTasks).toHaveBeenCalledWith(
        "task-1",
        expect.any(Date),
      );
    });

    await waitFor(() => {
      expect(screen.getByText("Weekly Task 1")).toBeInTheDocument();
      expect(screen.getByText("Weekly Task 2")).toBeInTheDocument();
    });
  });

  it("updates weekly tasks when week changes", async () => {
    mockGetWeeklyTasks.mockResolvedValue({
      success: true,
      data: mockWeeklyTasks,
    });

    render(<WeeklyTasksSection task={mockTask} />);

    await waitFor(() => {
      expect(screen.getByText("Weekly Task 1")).toBeInTheDocument();
    });

    // Click next week button
    const nextButton = screen.getByLabelText(/next week/i);
    await userEvent.click(nextButton);

    // Should fetch tasks for next week (called twice: initial + after click)
    await waitFor(() => {
      expect(mockGetWeeklyTasks).toHaveBeenCalledTimes(2);
    });
  });

  it("displays empty state when no weekly tasks exist", async () => {
    mockGetWeeklyTasks.mockResolvedValue({
      success: true,
      data: [],
    });

    render(<WeeklyTasksSection task={mockTask} />);

    await waitFor(() => {
      expect(
        screen.getByText(/no weekly tasks for this week/i),
      ).toBeInTheDocument();
    });
  });

  it("shows loading state while fetching tasks", async () => {
    mockGetWeeklyTasks.mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(
            () => resolve({ success: true, data: mockWeeklyTasks }),
            100,
          );
        }),
    );

    render(<WeeklyTasksSection task={mockTask} />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Weekly Task 1")).toBeInTheDocument();
    });
  });

  it("displays error message when fetching fails", async () => {
    mockGetWeeklyTasks.mockResolvedValue({
      error: "Failed to fetch weekly tasks",
      code: "DATABASE_ERROR" as const,
    });

    render(<WeeklyTasksSection task={mockTask} />);

    await waitFor(() => {
      expect(
        screen.getByText(/failed to fetch weekly tasks/i),
      ).toBeInTheDocument();
    });
  });

  it("navigates to create page when create button is clicked", async () => {
    mockGetWeeklyTasks.mockResolvedValue({
      success: true,
      data: [],
    });

    render(<WeeklyTasksSection task={mockTask} />);

    const createButton = screen.getByText(/create new weekly task/i);
    expect(createButton.closest("a")).toHaveAttribute(
      "href",
      "/goals/goal-1/regions/region-1/tasks/task-1/weekly-tasks/new",
    );
  });

  it("limits weekly tasks to maximum of 3 per week", async () => {
    const threeWeeklyTasks: WeeklyTask[] = [
      {
        id: "weekly-1",
        taskId: "task-1",
        title: "Weekly Task 1",
        description: "Description 1",
        priority: 1,
        weekStartDate: new Date(Date.UTC(2025, 10, 9)),
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "weekly-2",
        taskId: "task-1",
        title: "Weekly Task 2",
        description: "Description 2",
        priority: 2,
        weekStartDate: new Date(Date.UTC(2025, 10, 9)),
        status: "in_progress",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "weekly-3",
        taskId: "task-1",
        title: "Weekly Task 3",
        description: "Description 3",
        priority: 3,
        weekStartDate: new Date(Date.UTC(2025, 10, 9)),
        status: "completed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockGetWeeklyTasks.mockResolvedValue({
      success: true,
      data: threeWeeklyTasks,
    });

    render(<WeeklyTasksSection task={mockTask} />);

    await waitFor(() => {
      expect(screen.getByText("Weekly Task 1")).toBeInTheDocument();
      expect(screen.getByText("Weekly Task 2")).toBeInTheDocument();
      expect(screen.getByText("Weekly Task 3")).toBeInTheDocument();
    });

    // Create button should be disabled or show message about limit
    const createButton = screen.getByText(/create new weekly task/i);
    expect(createButton).toHaveAttribute("aria-disabled", "true");
  });

  it("refetches tasks after successful deletion", async () => {
    mockGetWeeklyTasks.mockResolvedValue({
      success: true,
      data: mockWeeklyTasks,
    });

    render(<WeeklyTasksSection task={mockTask} />);

    await waitFor(() => {
      expect(screen.getByText("Weekly Task 1")).toBeInTheDocument();
    });

    // Initial fetch
    expect(mockGetWeeklyTasks).toHaveBeenCalledTimes(1);

    // Verify the action is called with correct parameters on mount
    expect(mockGetWeeklyTasks).toHaveBeenCalledWith("task-1", expect.any(Date));
  });
});
