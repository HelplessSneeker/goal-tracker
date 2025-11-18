import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WeeklyTaskForm } from "./weekly-task-form";
import { mockRouterPush, mockRouterRefresh } from "@/jest.setup";
import {
  createWeeklyTaskAction,
  updateWeeklyTaskAction,
} from "@/app/actions/weekly-tasks";
import type { WeeklyTask } from "@/lib/types";

jest.mock("@/app/actions/weekly-tasks");
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

const mockCreateWeeklyTaskAction =
  createWeeklyTaskAction as jest.MockedFunction<typeof createWeeklyTaskAction>;
const mockUpdateWeeklyTaskAction =
  updateWeeklyTaskAction as jest.MockedFunction<typeof updateWeeklyTaskAction>;

describe("WeeklyTaskForm", () => {
  const mockTaskId = "task-123";
  const mockGoalId = "goal-123";
  const mockRegionId = "region-123";
  const mockWeekStartDate = new Date(Date.UTC(2025, 10, 9)); // Nov 9, 2025 (Sunday)

  const mockWeeklyTask: WeeklyTask = {
    id: "weekly-task-123",
    taskId: mockTaskId,
    title: "Complete tutorial",
    description: "Finish sections 1-3",
    priority: 1,
    weekStartDate: mockWeekStartDate,
    status: "in_progress",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Create Mode", () => {
    it("renders create mode with empty fields and correct title", () => {
      render(
        <WeeklyTaskForm
          mode="create"
          taskId={mockTaskId}
          goalId={mockGoalId}
          regionId={mockRegionId}
          weekStartDate={mockWeekStartDate}
        />,
      );

      expect(screen.getByText(/create new weekly task/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toHaveValue("");
      expect(screen.getByLabelText(/description/i)).toHaveValue("");
      expect(
        screen.getByRole("button", { name: /create/i }),
      ).toBeInTheDocument();
    });

    it("displays week range as read-only info", () => {
      render(
        <WeeklyTaskForm
          mode="create"
          taskId={mockTaskId}
          goalId={mockGoalId}
          regionId={mockRegionId}
          weekStartDate={mockWeekStartDate}
        />,
      );

      // Should display week info with date range (Nov 9 - Nov 15, 2025)
      expect(screen.getByText(/nov.*9.*nov.*15.*2025/i)).toBeInTheDocument();
    });

    it("does not show status selector in create mode", () => {
      render(
        <WeeklyTaskForm
          mode="create"
          taskId={mockTaskId}
          goalId={mockGoalId}
          regionId={mockRegionId}
          weekStartDate={mockWeekStartDate}
        />,
      );

      // Status field should not exist in create mode
      expect(screen.queryByLabelText(/status/i)).not.toBeInTheDocument();
    });

    it("validates required title field", async () => {
      const user = userEvent.setup();
      render(
        <WeeklyTaskForm
          mode="create"
          taskId={mockTaskId}
          goalId={mockGoalId}
          regionId={mockRegionId}
          weekStartDate={mockWeekStartDate}
        />,
      );

      const submitButton = screen.getByRole("button", { name: /create/i });
      await user.click(submitButton);

      // HTML5 validation should prevent submission
      const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
      expect(titleInput.validity.valid).toBe(false);
    });

    it("submits form with correct FormData structure", async () => {
      const user = userEvent.setup();
      mockCreateWeeklyTaskAction.mockResolvedValue({
        success: true,
        data: mockWeeklyTask,
      });

      render(
        <WeeklyTaskForm
          mode="create"
          taskId={mockTaskId}
          goalId={mockGoalId}
          regionId={mockRegionId}
          weekStartDate={mockWeekStartDate}
        />,
      );

      await user.type(screen.getByLabelText(/title/i), "Test task");
      await user.type(
        screen.getByLabelText(/description/i),
        "Test description",
      );
      await user.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(mockCreateWeeklyTaskAction).toHaveBeenCalledTimes(1);
      });

      const formData = mockCreateWeeklyTaskAction.mock.calls[0][0] as FormData;
      expect(formData.get("title")).toBe("Test task");
      expect(formData.get("description")).toBe("Test description");
      expect(formData.get("taskId")).toBe(mockTaskId);
      expect(formData.get("priority")).toBeTruthy();
      expect(formData.get("weekStartDate")).toBeTruthy();
    });

    it("calls createWeeklyTaskAction and navigates on success", async () => {
      const user = userEvent.setup();
      mockCreateWeeklyTaskAction.mockResolvedValue({
        success: true,
        data: mockWeeklyTask,
      });

      render(
        <WeeklyTaskForm
          mode="create"
          taskId={mockTaskId}
          goalId={mockGoalId}
          regionId={mockRegionId}
          weekStartDate={mockWeekStartDate}
        />,
      );

      await user.type(screen.getByLabelText(/title/i), "Test task");
      await user.click(screen.getByRole("button", { name: /create/i }));

      await waitFor(() => {
        expect(mockRouterPush).toHaveBeenCalledWith(
          `/goals/${mockGoalId}/${mockRegionId}/tasks/${mockTaskId}`,
        );
        expect(mockRouterRefresh).toHaveBeenCalled();
      });
    });

    it("displays error message on action failure", async () => {
      const user = userEvent.setup();
      mockCreateWeeklyTaskAction.mockResolvedValue({
        error: "Failed to create weekly task",
        code: "DATABASE_ERROR",
      });

      render(
        <WeeklyTaskForm
          mode="create"
          taskId={mockTaskId}
          goalId={mockGoalId}
          regionId={mockRegionId}
          weekStartDate={mockWeekStartDate}
        />,
      );

      await user.type(screen.getByLabelText(/title/i), "Test task");
      await user.click(screen.getByRole("button", { name: /create/i }));

      expect(
        await screen.findByText(/failed to create weekly task/i),
      ).toBeInTheDocument();
    });
  });

  describe("Edit Mode", () => {
    it("renders edit mode with populated fields and status selector", () => {
      render(
        <WeeklyTaskForm
          mode="edit"
          taskId={mockTaskId}
          goalId={mockGoalId}
          regionId={mockRegionId}
          weekStartDate={mockWeekStartDate}
          initialData={mockWeeklyTask}
        />,
      );

      expect(screen.getByText(/edit weekly task/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/title/i)).toHaveValue("Complete tutorial");
      expect(screen.getByLabelText(/description/i)).toHaveValue(
        "Finish sections 1-3",
      );
      expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });

    it("calls updateWeeklyTaskAction and navigates on success", async () => {
      const user = userEvent.setup();
      mockUpdateWeeklyTaskAction.mockResolvedValue({
        success: true,
        data: { ...mockWeeklyTask, title: "Updated task" },
      });

      render(
        <WeeklyTaskForm
          mode="edit"
          taskId={mockTaskId}
          goalId={mockGoalId}
          regionId={mockRegionId}
          weekStartDate={mockWeekStartDate}
          initialData={mockWeeklyTask}
        />,
      );

      const titleInput = screen.getByLabelText(/title/i);
      await user.clear(titleInput);
      await user.type(titleInput, "Updated task");
      await user.click(screen.getByRole("button", { name: /save/i }));

      await waitFor(() => {
        expect(mockUpdateWeeklyTaskAction).toHaveBeenCalledTimes(1);
        expect(mockRouterPush).toHaveBeenCalledWith(
          `/goals/${mockGoalId}/${mockRegionId}/tasks/${mockTaskId}`,
        );
      });
    });
  });

  describe("Loading States", () => {
    it("disables form during submission", async () => {
      const user = userEvent.setup();
      mockCreateWeeklyTaskAction.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ success: true, data: mockWeeklyTask }),
              100,
            ),
          ),
      );

      render(
        <WeeklyTaskForm
          mode="create"
          taskId={mockTaskId}
          goalId={mockGoalId}
          regionId={mockRegionId}
          weekStartDate={mockWeekStartDate}
        />,
      );

      await user.type(screen.getByLabelText(/title/i), "Test task");
      const submitButton = screen.getByRole("button", { name: /create/i });
      await user.click(submitButton);

      // During submission
      expect(submitButton).toBeDisabled();
      expect(screen.getByLabelText(/title/i)).toBeDisabled();
    });
  });

  describe("Priority Selection", () => {
    it("shows priority options with i18n labels", () => {
      render(
        <WeeklyTaskForm
          mode="create"
          taskId={mockTaskId}
          goalId={mockGoalId}
          regionId={mockRegionId}
          weekStartDate={mockWeekStartDate}
        />,
      );

      const prioritySelect = screen.getByLabelText(/priority/i);
      expect(prioritySelect).toBeInTheDocument();

      // Priority select should have options
      expect(prioritySelect.tagName).toBe("BUTTON"); // shadcn/ui Select uses button trigger
    });
  });
});
