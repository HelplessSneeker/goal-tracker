import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegionCard } from "./region-card";
import { Region } from "@/lib/types";

// Mock useRouter
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("RegionCard", () => {
  const mockRegion: Region = {
    id: "region-1",
    goalId: "goal-1",
    title: "Server Components",
    description: "Learn React Server Components",
  };

  const goalId = "goal-1";

  beforeEach(() => {
    mockPush.mockClear();
  });

  it("renders region title and description", () => {
    render(<RegionCard region={mockRegion} goalId={goalId} />);

    expect(screen.getByText("Server Components")).toBeInTheDocument();
    expect(
      screen.getByText("Learn React Server Components"),
    ).toBeInTheDocument();
  });

  it("navigates to region detail when card is clicked", async () => {
    const user = userEvent.setup();
    render(<RegionCard region={mockRegion} goalId={goalId} />);

    const cardTitle = screen.getByText("Server Components");
    await user.click(cardTitle);

    expect(mockPush).toHaveBeenCalledWith("/goals/goal-1/region-1");
  });

  it("has hover styles for better UX", () => {
    const { container } = render(<RegionCard region={mockRegion} goalId={goalId} />);

    const card = container.querySelector('[class*="cursor-pointer"]');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("cursor-pointer");
    expect(card).toHaveClass("hover:shadow-lg");
  });
});
