import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { mockRouterPush, mockRouterRefresh } from "@/jest.setup";
import { deleteTaskAction } from "@/app/actions/tasks";

jest.mock("@/app/actions/tasks");

const mockDeleteTaskAction = deleteTaskAction as jest.MockedFunction<
  typeof deleteTaskAction
>;

describe("DeleteTaskDialog", () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    taskId: "task-123",
    taskTitle: "Test Task",
    goalId: "goal-456",
    regionId: "region-789",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when open is true", () => {
    render(<DeleteTaskDialog {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: /delete task/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/this action cannot be undone/i),
    ).toBeInTheDocument();
  });

  it("shows cascade deletion warning for related data", () => {
    render(<DeleteTaskDialog {...defaultProps} />);

    expect(
      screen.getByText(/all weekly tasks associated with this task/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/all progress entries for those weekly tasks/i),
    ).toBeInTheDocument();
  });

  it("requires exact task title to enable delete button", async () => {
    const user = userEvent.setup();

    render(<DeleteTaskDialog {...defaultProps} />);

    const deleteButton = screen.getByRole("button", { name: /delete task/i });
    const input = screen.getByPlaceholderText("Test Task");

    expect(deleteButton).toBeDisabled();

    await user.type(input, "Wrong Name");
    expect(deleteButton).toBeDisabled();

    await user.clear(input);
    await user.type(input, "Test Task");
    expect(deleteButton).not.toBeDisabled();
  });

  it("calls deleteTaskAction when confirmed", async () => {
    const user = userEvent.setup();

    mockDeleteTaskAction.mockResolvedValueOnce({ success: true });

    render(<DeleteTaskDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText("Test Task");
    await user.type(input, "Test Task");

    const deleteButton = screen.getByRole("button", { name: /delete task/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteTaskAction).toHaveBeenCalledWith("task-123");
    });
  });

  it("navigates to region detail page after successful deletion", async () => {
    const user = userEvent.setup();

    mockDeleteTaskAction.mockResolvedValueOnce({ success: true });

    render(<DeleteTaskDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText("Test Task");
    await user.type(input, "Test Task");

    await user.click(screen.getByRole("button", { name: /delete task/i }));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith(
        "/goals/goal-456/region-789",
      );
      expect(mockRouterRefresh).toHaveBeenCalled();
    });
  });

  it("displays error message on action failure", async () => {
    const user = userEvent.setup();

    mockDeleteTaskAction.mockResolvedValueOnce({ error: "Failed to delete task" });

    render(<DeleteTaskDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText("Test Task");
    await user.type(input, "Test Task");

    await user.click(screen.getByRole("button", { name: /delete task/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to delete task/i)).toBeInTheDocument();
    });
  });

  it("does not close dialog while deleting", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    mockDeleteTaskAction.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 100),
        ),
    );

    render(<DeleteTaskDialog {...defaultProps} onOpenChange={onOpenChange} />);

    const input = screen.getByPlaceholderText("Test Task");
    await user.type(input, "Test Task");

    await user.click(screen.getByRole("button", { name: /delete task/i }));

    // Verify button shows deleting state
    expect(screen.getByRole("button", { name: /deleting/i })).toBeDisabled();
  });

  it("clears confirmation text when dialog is closed", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    const { rerender } = render(
      <DeleteTaskDialog {...defaultProps} onOpenChange={onOpenChange} />,
    );

    const input = screen.getByPlaceholderText("Test Task");
    await user.type(input, "Test Task");

    expect(input).toHaveValue("Test Task");

    // Close dialog
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onOpenChange).toHaveBeenCalledWith(false);

    // Reopen dialog
    rerender(
      <DeleteTaskDialog {...defaultProps} open={true} onOpenChange={onOpenChange} />,
    );

    // Input should be cleared
    const newInput = screen.getByPlaceholderText("Test Task");
    expect(newInput).toHaveValue("");
  });
});
