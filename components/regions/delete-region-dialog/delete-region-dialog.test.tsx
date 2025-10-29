import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteRegionDialog } from "./delete-region-dialog";
import { mockRouterPush, mockRouterRefresh } from "@/jest.setup";
import { deleteRegionAction } from "@/app/actions/regions";

jest.mock("@/app/actions/regions");

const mockDeleteRegionAction = deleteRegionAction as jest.MockedFunction<
  typeof deleteRegionAction
>;

describe("DeleteRegionDialog", () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    regionId: "region-123",
    regionTitle: "Test Region",
    goalId: "goal-456",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when open is true", () => {
    render(<DeleteRegionDialog {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: /delete region/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/this action cannot be undone/i),
    ).toBeInTheDocument();
  });

  it("shows cascade deletion warning for related data", () => {
    render(<DeleteRegionDialog {...defaultProps} />);

    expect(
      screen.getByText(/all tasks in this region/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/all weekly tasks for those tasks/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/all progress entries for those weekly tasks/i),
    ).toBeInTheDocument();
  });

  it("requires exact region title to enable delete button", async () => {
    const user = userEvent.setup();

    render(<DeleteRegionDialog {...defaultProps} />);

    const deleteButton = screen.getByRole("button", { name: /delete region/i });
    const input = screen.getByPlaceholderText("Test Region");

    expect(deleteButton).toBeDisabled();

    await user.type(input, "Wrong Name");
    expect(deleteButton).toBeDisabled();

    await user.clear(input);
    await user.type(input, "Test Region");
    expect(deleteButton).not.toBeDisabled();
  });

  it("calls deleteRegionAction when confirmed", async () => {
    const user = userEvent.setup();

    mockDeleteRegionAction.mockResolvedValueOnce({ success: true });

    render(<DeleteRegionDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText("Test Region");
    await user.type(input, "Test Region");

    const deleteButton = screen.getByRole("button", { name: /delete region/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteRegionAction).toHaveBeenCalledWith("region-123");
    });
  });

  it("navigates to goal detail page after successful deletion", async () => {
    const user = userEvent.setup();

    mockDeleteRegionAction.mockResolvedValueOnce({ success: true });

    render(<DeleteRegionDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText("Test Region");
    await user.type(input, "Test Region");

    await user.click(screen.getByRole("button", { name: /delete region/i }));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/goals/goal-456");
      expect(mockRouterRefresh).toHaveBeenCalled();
    });
  });

  it("displays error message on action failure", async () => {
    const user = userEvent.setup();

    mockDeleteRegionAction.mockResolvedValueOnce({ error: "Failed to delete region" });

    render(<DeleteRegionDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText("Test Region");
    await user.type(input, "Test Region");

    await user.click(screen.getByRole("button", { name: /delete region/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to delete region/i)).toBeInTheDocument();
    });
  });
});
