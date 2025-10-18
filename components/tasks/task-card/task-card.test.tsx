import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskCard } from "./task-card";

// Mock useRouter
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

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

  beforeEach(() => {
    mockPush.mockClear();
  });

  it("should render task title and description", () => {
    render(<TaskCard task={mockTask} goalId="goal-1" />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("should display deadline date", () => {
    render(<TaskCard task={mockTask} goalId="goal-1" />);

    expect(screen.getByText(/Dec 1, 2025/i)).toBeInTheDocument();
  });

  it("should navigate to task detail when card is clicked", async () => {
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} goalId="goal-1" />);

    const cardTitle = screen.getByText("Test Task");
    await user.click(cardTitle);

    expect(mockPush).toHaveBeenCalledWith("/goals/goal-1/region-1/tasks/123");
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

  it("has hover styles for better UX", () => {
    const { container } = render(<TaskCard task={mockTask} goalId="goal-1" />);

    const card = container.querySelector('[class*="cursor-pointer"]');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("cursor-pointer");
    expect(card).toHaveClass("hover:shadow-lg");
  });
});
