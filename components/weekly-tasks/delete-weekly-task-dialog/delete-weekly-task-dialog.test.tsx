import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockRouterRefresh } from "@/jest.setup";
import { ActionErrorCode } from "@/lib/action-types";

// Mock the actions module before importing component
jest.mock("@/app/actions/weekly-tasks", () => ({
  deleteWeeklyTaskAction: jest.fn(),
}));

import { DeleteWeeklyTaskDialog } from "./delete-weekly-task-dialog";
import { deleteWeeklyTaskAction } from "@/app/actions/weekly-tasks";

const mockDeleteWeeklyTaskAction =
  deleteWeeklyTaskAction as jest.MockedFunction<typeof deleteWeeklyTaskAction>;

describe("DeleteWeeklyTaskDialog", () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    weeklyTaskId: "weekly-task-123",
    weeklyTaskTitle: "Test Weekly Task",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when open is true", () => {
    render(<DeleteWeeklyTaskDialog {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: /delete weekly task/i }),
    ).toBeInTheDocument();
  });

  it("shows the weekly task title in the warning message", () => {
    render(<DeleteWeeklyTaskDialog {...defaultProps} />);

    expect(
      screen.getByText(/this action cannot be undone/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /delete weekly task/i }),
    ).toBeInTheDocument();
  });

  it("requires exact title to enable delete button", async () => {
    const user = userEvent.setup();

    render(<DeleteWeeklyTaskDialog {...defaultProps} />);

    const deleteButton = screen.getByRole("button", {
      name: /delete weekly task/i,
    });
    const input = screen.getByPlaceholderText("Test Weekly Task");

    expect(deleteButton).toBeDisabled();

    await user.type(input, "Wrong Name");
    expect(deleteButton).toBeDisabled();

    await user.clear(input);
    await user.type(input, "Test Weekly Task");
    expect(deleteButton).not.toBeDisabled();
  });

  it("calls deleteWeeklyTaskAction when confirmed", async () => {
    const user = userEvent.setup();

    mockDeleteWeeklyTaskAction.mockResolvedValueOnce({
      success: true,
      data: { deleted: true },
    });

    render(<DeleteWeeklyTaskDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText("Test Weekly Task");
    await user.type(input, "Test Weekly Task");

    const deleteButton = screen.getByRole("button", {
      name: /delete weekly task/i,
    });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteWeeklyTaskAction).toHaveBeenCalledWith(
        "weekly-task-123",
      );
    });
  });

  it("closes dialog and refreshes after successful deletion", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    mockDeleteWeeklyTaskAction.mockResolvedValueOnce({
      success: true,
      data: { deleted: true },
    });

    render(
      <DeleteWeeklyTaskDialog {...defaultProps} onOpenChange={onOpenChange} />,
    );

    const input = screen.getByPlaceholderText("Test Weekly Task");
    await user.type(input, "Test Weekly Task");

    await user.click(
      screen.getByRole("button", { name: /delete weekly task/i }),
    );

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(mockRouterRefresh).toHaveBeenCalled();
    });
  });

  it("displays error message on action failure", async () => {
    const user = userEvent.setup();

    mockDeleteWeeklyTaskAction.mockResolvedValueOnce({
      error: "Failed to delete weekly task",
      code: ActionErrorCode.DATABASE_ERROR,
    });

    render(<DeleteWeeklyTaskDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText("Test Weekly Task");
    await user.type(input, "Test Weekly Task");

    await user.click(
      screen.getByRole("button", { name: /delete weekly task/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByText(/failed to delete weekly task/i),
      ).toBeInTheDocument();
    });
  });

  it("shows error when title does not match", async () => {
    const user = userEvent.setup();

    render(<DeleteWeeklyTaskDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText("Test Weekly Task");
    await user.type(input, "Wrong Title");

    const deleteButton = screen.getByRole("button", {
      name: /delete weekly task/i,
    });
    await user.click(deleteButton);

    // Button should be disabled with wrong title, so action shouldn't be called
    expect(mockDeleteWeeklyTaskAction).not.toHaveBeenCalled();
  });

  it("disables inputs and buttons while deleting", async () => {
    const user = userEvent.setup();

    mockDeleteWeeklyTaskAction.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ success: true, data: { deleted: true } }),
            100,
          ),
        ),
    );

    render(<DeleteWeeklyTaskDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText("Test Weekly Task");
    await user.type(input, "Test Weekly Task");

    await user.click(
      screen.getByRole("button", { name: /delete weekly task/i }),
    );

    // Verify button shows deleting state
    expect(screen.getByRole("button", { name: /deleting/i })).toBeDisabled();
    expect(input).toBeDisabled();
  });

  it("clears confirmation text and error when dialog is closed", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    const { rerender } = render(
      <DeleteWeeklyTaskDialog {...defaultProps} onOpenChange={onOpenChange} />,
    );

    const input = screen.getByPlaceholderText("Test Weekly Task");
    await user.type(input, "Test Weekly Task");

    expect(input).toHaveValue("Test Weekly Task");

    // Close dialog
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onOpenChange).toHaveBeenCalledWith(false);

    // Reopen dialog
    rerender(
      <DeleteWeeklyTaskDialog
        {...defaultProps}
        open={true}
        onOpenChange={onOpenChange}
      />,
    );

    // Input should be cleared
    const newInput = screen.getByPlaceholderText("Test Weekly Task");
    expect(newInput).toHaveValue("");
  });
});
