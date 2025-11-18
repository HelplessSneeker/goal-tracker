import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WeeklyTaskCard } from "./weekly-task-card";

// Mock useRouter
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("WeeklyTaskCard", () => {
  const mockWeeklyTask = {
    id: "weekly-task-123",
    taskId: "task-123",
    title: "Test Weekly Task",
    description: "Test Description",
    priority: 1,
    weekStartDate: "2025-11-10T00:00:00.000Z",
    status: "pending" as const,
    createdAt: "2025-11-01T10:00:00.000Z",
  };

  const defaultProps = {
    weeklyTask: mockWeeklyTask,
    goalId: "goal-123",
    regionId: "region-123",
    taskId: "task-123",
  };

  beforeEach(() => {
    mockPush.mockClear();
  });

  it("should render weekly task title and description", () => {
    render(<WeeklyTaskCard {...defaultProps} />);

    expect(screen.getByText("Test Weekly Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("should render weekly task with null description", () => {
    const taskWithNoDesc = {
      ...mockWeeklyTask,
      description: null,
    };
    render(<WeeklyTaskCard {...defaultProps} weeklyTask={taskWithNoDesc} />);

    expect(screen.getByText("Test Weekly Task")).toBeInTheDocument();
    expect(screen.queryByText("Test Description")).not.toBeInTheDocument();
  });

  describe("Priority Badges", () => {
    it("should display priority 1 with red/destructive badge", () => {
      render(<WeeklyTaskCard {...defaultProps} />);

      const badge = screen.getByText(/priority 1/i);
      expect(badge).toBeInTheDocument();
      expect(badge.className).toMatch(/destructive/);
    });

    it("should display priority 2 with yellow/warning badge", () => {
      const priority2Task = { ...mockWeeklyTask, priority: 2 };
      render(<WeeklyTaskCard {...defaultProps} weeklyTask={priority2Task} />);

      const badge = screen.getByText(/priority 2/i);
      expect(badge).toBeInTheDocument();
      expect(badge.className).toMatch(/bg-yellow/);
    });

    it("should display priority 3 with green/success badge", () => {
      const priority3Task = { ...mockWeeklyTask, priority: 3 };
      render(<WeeklyTaskCard {...defaultProps} weeklyTask={priority3Task} />);

      const badge = screen.getByText(/priority 3/i);
      expect(badge).toBeInTheDocument();
      expect(badge.className).toMatch(/bg-green/);
    });
  });

  describe("Status Display", () => {
    it("should display pending status", () => {
      render(<WeeklyTaskCard {...defaultProps} />);
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });

    it("should display in_progress status", () => {
      const inProgressTask = {
        ...mockWeeklyTask,
        status: "in_progress" as const,
      };
      render(<WeeklyTaskCard {...defaultProps} weeklyTask={inProgressTask} />);
      expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    });

    it("should display completed status", () => {
      const completedTask = { ...mockWeeklyTask, status: "completed" as const };
      render(<WeeklyTaskCard {...defaultProps} weeklyTask={completedTask} />);
      expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });
  });

  describe("Action Buttons", () => {
    it("should render Edit button", () => {
      render(<WeeklyTaskCard {...defaultProps} />);
      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    });

    it("should render Delete button", () => {
      render(<WeeklyTaskCard {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /delete/i }),
      ).toBeInTheDocument();
    });

    it("should navigate to edit page when Edit button is clicked", async () => {
      const user = userEvent.setup();
      render(<WeeklyTaskCard {...defaultProps} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      await user.click(editButton);

      expect(mockPush).toHaveBeenCalledWith(
        "/goals/goal-123/region-123/tasks/task-123/weekly-tasks/weekly-task-123/edit",
      );
    });

    it("should call onDeleted when Delete button is clicked", async () => {
      const mockOnDeleted = jest.fn();
      const user = userEvent.setup();
      render(<WeeklyTaskCard {...defaultProps} onDeleted={mockOnDeleted} />);

      const deleteButton = screen.getByRole("button", { name: /delete/i });
      await user.click(deleteButton);

      expect(mockOnDeleted).toHaveBeenCalledWith(mockWeeklyTask);
    });
  });

  it("should have proper card styling", () => {
    const { container } = render(<WeeklyTaskCard {...defaultProps} />);

    const card = container.querySelector('[class*="border"]');
    expect(card).toBeInTheDocument();
  });
});
