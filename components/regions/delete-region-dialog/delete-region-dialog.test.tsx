import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteRegionDialog } from "./delete-region-dialog";
import { mockRouterPush, mockRouterRefresh } from "@/jest.setup";

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
      screen.getByText(/all tasks within this region/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/all weekly tasks associated with those tasks/i),
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

  it("calls DELETE API when confirmed", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<DeleteRegionDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText("Test Region");
    await user.type(input, "Test Region");

    const deleteButton = screen.getByRole("button", { name: /delete region/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/regions/region-123", {
        method: "DELETE",
      });
    });
  });

  it("navigates to goal detail page after successful deletion", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<DeleteRegionDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText("Test Region");
    await user.type(input, "Test Region");

    await user.click(screen.getByRole("button", { name: /delete region/i }));

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith("/goals/goal-456");
      expect(mockRouterRefresh).toHaveBeenCalled();
    });
  });

  it("displays error message on API failure", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    render(<DeleteRegionDialog {...defaultProps} />);

    const input = screen.getByPlaceholderText("Test Region");
    await user.type(input, "Test Region");

    await user.click(screen.getByRole("button", { name: /delete region/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to delete region/i)).toBeInTheDocument();
    });
  });
});
