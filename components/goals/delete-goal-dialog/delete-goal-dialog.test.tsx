import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteGoalDialog } from "./delete-goal-dialog";
import { mockRouterPush, mockRouterRefresh } from "@/jest.setup";
import * as goalsActions from "@/app/actions/goals";

// Get the mocked action
const mockDeleteGoalAction = goalsActions.deleteGoalAction as jest.MockedFunction<
  typeof goalsActions.deleteGoalAction
>;

describe("DeleteGoalDialog", () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    goalId: "123",
    goalTitle: "Test Goal",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when open is true", () => {
    render(<DeleteGoalDialog {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: /delete goal/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/are you sure you want to delete/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/warning: this action cannot be undone/i),
    ).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(<DeleteGoalDialog {...defaultProps} open={false} />);

    expect(screen.queryByText(/delete goal/i)).not.toBeInTheDocument();
  });

  it("shows cascade deletion warning", () => {
    render(<DeleteGoalDialog {...defaultProps} />);

    expect(screen.getByText(/all regions/i)).toBeInTheDocument();
    expect(screen.getByText(/all tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/all weekly tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/all progress entries/i)).toBeInTheDocument();
  });

  it("requires exact goal title to enable delete button", async () => {
    const user = userEvent.setup();

    render(<DeleteGoalDialog {...defaultProps} />);

    const deleteButton = screen.getByRole("button", { name: /delete goal/i });
    const input = screen.getByPlaceholderText(/type goal title to confirm/i);

    // Button should be disabled initially
    expect(deleteButton).toBeDisabled();

    // Type wrong name
    await user.type(input, "Wrong Name");
    expect(deleteButton).toBeDisabled();

    // Clear and type correct name
    await user.clear(input);
    await user.type(input, "Test Goal");
    expect(deleteButton).not.toBeDisabled();
  });

  it("calls deleteGoalAction when confirmed", async () => {
    const user = userEvent.setup();

    mockDeleteGoalAction.mockResolvedValueOnce({ success: true });

    render(<DeleteGoalDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText(/type goal title to confirm/i);
    await user.type(input, "Test Goal");

    const deleteButton = screen.getByRole("button", { name: /delete goal/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteGoalAction).toHaveBeenCalledWith("123");
    });
  });

  it("navigates to goals page after successful deletion", async () => {
    const user = userEvent.setup();

    mockDeleteGoalAction.mockResolvedValueOnce({ success: true });

    render(<DeleteGoalDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText(/type goal title to confirm/i);
    await user.type(input, "Test Goal");

    await user.click(screen.getByRole("button", { name: /delete goal/i }));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/goals");
      expect(mockRouterRefresh).toHaveBeenCalled();
    });
  });

  it("displays error message on failure", async () => {
    const user = userEvent.setup();

    mockDeleteGoalAction.mockResolvedValueOnce({ error: "Failed to delete goal" });

    render(<DeleteGoalDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText(/type goal title to confirm/i);
    await user.type(input, "Test Goal");

    await user.click(screen.getByRole("button", { name: /delete goal/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to delete goal/i)).toBeInTheDocument();
    });
  });

  it("shows deleting state during action", async () => {
    const user = userEvent.setup();

    mockDeleteGoalAction.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 100),
        ),
    );

    render(<DeleteGoalDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText(/type goal title to confirm/i);
    await user.type(input, "Test Goal");

    await user.click(screen.getByRole("button", { name: /delete goal/i }));

    expect(screen.getByText(/deleting/i)).toBeInTheDocument();
  });

  it("disables buttons during deletion", async () => {
    const user = userEvent.setup();

    mockDeleteGoalAction.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ success: true }), 100),
        ),
    );

    render(<DeleteGoalDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText(/type goal title to confirm/i);
    await user.type(input, "Test Goal");

    const deleteButton = screen.getByRole("button", { name: /delete goal/i });
    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    await user.click(deleteButton);

    expect(deleteButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it("calls onOpenChange when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();

    render(<DeleteGoalDialog {...defaultProps} onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
