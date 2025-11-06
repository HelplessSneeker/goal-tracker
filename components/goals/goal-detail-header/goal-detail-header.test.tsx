import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GoalDetailHeader } from "./goal-detail-header";
import { Goal } from "@/lib/types";

describe("GoalDetailHeader", () => {
  const mockGoal: Goal = {
    id: "123",
    title: "Test Goal Title",
    description: "Test goal description",
    userId: "user-1",
  };

  it("renders goal title and description", () => {
    render(<GoalDetailHeader goal={mockGoal} />);

    expect(screen.getByText("Test Goal Title")).toBeInTheDocument();
    expect(screen.getByText("Test goal description")).toBeInTheDocument();
  });

  it("renders edit button with correct link", () => {
    render(<GoalDetailHeader goal={mockGoal} />);

    const editButton = screen.getByRole("button", { name: /edit/i });
    expect(editButton).toBeInTheDocument();

    const editLink = editButton.closest("a");
    expect(editLink).toHaveAttribute("href", "/goals/123/edit");
  });

  it("renders delete button", () => {
    render(<GoalDetailHeader goal={mockGoal} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
  });

  it("opens delete dialog when delete button is clicked", async () => {
    const user = userEvent.setup();

    render(<GoalDetailHeader goal={mockGoal} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);

    // Dialog should appear
    expect(
      screen.getByText(/are you sure you want to delete/i),
    ).toBeInTheDocument();
  });
});
