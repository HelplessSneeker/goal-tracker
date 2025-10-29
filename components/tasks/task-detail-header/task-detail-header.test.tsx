import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskDetailHeader } from "./task-detail-header";
import { Task } from "@/lib/types";

describe("TaskDetailHeader", () => {
  const mockTask: Task = {
    id: "task-1",
    regionId: "region-1",
    title: "Build 3 projects",
    description: "Complete three projects using Server Components",
    deadline: "2025-12-01T00:00:00.000Z",
    status: "active",
    createdAt: "2025-10-01T10:00:00.000Z",
  };

  const goalId = "goal-1";

  it("renders task title and description", () => {
    render(<TaskDetailHeader task={mockTask} goalId={goalId} />);

    expect(screen.getByText("Build 3 projects")).toBeInTheDocument();
    expect(
      screen.getByText("Complete three projects using Server Components"),
    ).toBeInTheDocument();
  });

  it("displays formatted deadline", () => {
    render(<TaskDetailHeader task={mockTask} goalId={goalId} />);

    expect(screen.getByText(/01\.12\.2025/)).toBeInTheDocument();
  });

  it("displays task status badge", () => {
    render(<TaskDetailHeader task={mockTask} goalId={goalId} />);

    expect(screen.getByText(/active/i)).toBeInTheDocument();
  });

  it("displays completed status badge with correct styling", () => {
    const completedTask = { ...mockTask, status: "completed" as const };
    render(<TaskDetailHeader task={completedTask} goalId={goalId} />);

    const statusBadge = screen.getByText(/completed/i);
    expect(statusBadge).toBeInTheDocument();
    expect(statusBadge).toHaveClass("bg-green-100");
    expect(statusBadge).toHaveClass("text-green-800");
  });

  it("renders edit button with correct link", () => {
    render(<TaskDetailHeader task={mockTask} goalId={goalId} />);

    const editButton = screen.getByRole("link", { name: /edit/i });
    expect(editButton).toHaveAttribute(
      "href",
      "/goals/goal-1/region-1/tasks/task-1/edit",
    );
  });

  it("renders delete button", () => {
    render(<TaskDetailHeader task={mockTask} goalId={goalId} />);

    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("opens delete dialog when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<TaskDetailHeader task={mockTask} goalId={goalId} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(
      screen.getByRole("heading", { name: /delete task/i }),
    ).toBeInTheDocument();
  });

  it("displays task title as h1 heading", () => {
    render(<TaskDetailHeader task={mockTask} goalId={goalId} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Build 3 projects");
  });
});
