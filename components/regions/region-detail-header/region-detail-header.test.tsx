import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegionDetailHeader } from "./region-detail-header";
import { Region } from "@/lib/types";

describe("RegionDetailHeader", () => {
  const mockRegion: Region = {
    id: "region-1",
    goalId: "goal-1",
    title: "Server Components",
    description: "Master React Server Components",
  };

  const goalId = "goal-1";

  it("renders region title and description", () => {
    render(<RegionDetailHeader region={mockRegion} goalId={goalId} />);

    expect(screen.getByText("Server Components")).toBeInTheDocument();
    expect(screen.getByText("Master React Server Components")).toBeInTheDocument();
  });

  it("renders edit button with correct link", () => {
    render(<RegionDetailHeader region={mockRegion} goalId={goalId} />);

    const editButton = screen.getByRole("link", { name: /edit/i });
    expect(editButton).toHaveAttribute("href", "/goals/goal-1/region-1/edit");
  });

  it("renders delete button", () => {
    render(<RegionDetailHeader region={mockRegion} goalId={goalId} />);

    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("opens delete dialog when delete button is clicked", async () => {
    const user = userEvent.setup();
    render(<RegionDetailHeader region={mockRegion} goalId={goalId} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(
      screen.getByRole("heading", { name: /delete region/i }),
    ).toBeInTheDocument();
  });

  it("displays region title as h1 heading", () => {
    render(<RegionDetailHeader region={mockRegion} goalId={goalId} />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Server Components");
  });
});
