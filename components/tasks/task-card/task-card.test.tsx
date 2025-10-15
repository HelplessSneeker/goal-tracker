import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskCard } from "./task-card";

describe("TaskCard", () => {
  const mockTask = {
    id: "123",
    regionId: "region-1",
    title: "Test Task",
    description: "Test Description",
    deadline: "2025-12-01T00:00:00.000Z",
    status: "active" as const,
    createdAt: "2025-10-01T10:00:00.000Z",
  };

  it("should render task title and description", () => {
    render(<TaskCard task={mockTask} goalId="goal-1" />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("should display deadline date", () => {
    render(<TaskCard task={mockTask} goalId="goal-1" />);

    expect(screen.getByText(/Dec 1, 2025/i)).toBeInTheDocument();
  });

  it("should show view button with correct link", () => {
    render(<TaskCard task={mockTask} goalId="goal-1" />);

    const viewButton = screen.getByRole("link", { name: /view task/i });
    expect(viewButton).toHaveAttribute(
      "href",
      "/goals/goal-1/region-1/tasks/123",
    );
  });

  it("should show edit button with correct link", () => {
    render(<TaskCard task={mockTask} goalId="goal-1" />);

    const editButton = screen.getByRole("link", { name: /edit task/i });
    expect(editButton).toHaveAttribute(
      "href",
      "/goals/goal-1/region-1/tasks/123/edit",
    );
  });

  it("should show delete button", () => {
    render(<TaskCard task={mockTask} goalId="goal-1" />);

    expect(
      screen.getByRole("button", { name: /delete task/i }),
    ).toBeInTheDocument();
  });

  it("should open delete dialog when delete button clicked", async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} goalId="goal-1" />);

    await user.click(screen.getByRole("button", { name: /delete task/i }));

    expect(
      screen.getByRole("heading", { name: /delete task/i }),
    ).toBeInTheDocument();
  });

  it("should display task status badge", () => {
    render(<TaskCard task={mockTask} goalId="goal-1" />);

    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });

  it("should display completed status", () => {
    const completedTask = { ...mockTask, status: "completed" as const };
    render(<TaskCard task={completedTask} goalId="goal-1" />);

    expect(screen.getByText(/completed/i)).toBeInTheDocument();
  });
});
