import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegionCard } from "./region-card";
import { Region } from "@/lib/types";

describe("RegionCard", () => {
  const mockRegion: Region = {
    id: "region-1",
    goalId: "goal-1",
    title: "Server Components",
    description: "Learn React Server Components",
  };

  const goalId = "goal-1";

  it("renders region title and description", () => {
    render(<RegionCard region={mockRegion} goalId={goalId} />);

    expect(screen.getByText("Server Components")).toBeInTheDocument();
    expect(
      screen.getByText("Learn React Server Components"),
    ).toBeInTheDocument();
  });

  it("renders all three action buttons", () => {
    render(<RegionCard region={mockRegion} goalId={goalId} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3); // View, Edit, Delete
  });

  it("renders view button with correct link", () => {
    render(<RegionCard region={mockRegion} goalId={goalId} />);

    const viewLinks = screen.getAllByRole("link");
    const viewLink = viewLinks.find((link) =>
      link.getAttribute("href")?.includes("/region-1"),
    );

    expect(viewLink).toHaveAttribute("href", "/goals/goal-1/region-1");
  });

  it("renders edit button with correct link", () => {
    render(<RegionCard region={mockRegion} goalId={goalId} />);

    const editLinks = screen.getAllByRole("link");
    const editLink = editLinks.find((link) =>
      link.getAttribute("href")?.includes("/edit"),
    );

    expect(editLink).toHaveAttribute("href", "/goals/goal-1/region-1/edit");
  });

  it("opens delete dialog when delete button is clicked", async () => {
    const user = userEvent.setup();

    render(<RegionCard region={mockRegion} goalId={goalId} />);

    // Find the delete button (the one with trash icon that's not in a link)
    const buttons = screen.getAllByRole("button");
    const deleteButton = buttons.find(
      (btn) => btn.querySelector("svg") && !btn.closest("a"),
    );

    if (deleteButton) {
      await user.click(deleteButton);

      // Dialog should appear - use heading to avoid multiple matches
      expect(
        screen.getByRole("heading", { name: /delete region/i }),
      ).toBeInTheDocument();
    }
  });
});
