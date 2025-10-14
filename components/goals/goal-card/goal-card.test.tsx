import { render, screen } from "@testing-library/react";
import { GoalCard } from "./goal-card";
import { Goal, Region } from "@/lib/types";

describe("GoalCard", () => {
  const mockGoal: Goal = {
    id: "1",
    title: "Learn Next.js",
    description: "Master the Next.js framework",
  };

  const mockRegions: Region[] = [
    {
      id: "r1",
      goalId: "1",
      title: "Server Components",
      description: "Learn RSC",
    },
    {
      id: "r2",
      goalId: "1",
      title: "App Router",
      description: "Master routing",
    },
    { id: "r3", goalId: "1", title: "API Routes", description: "Build APIs" },
  ];

  it("renders goal title and description", () => {
    render(<GoalCard goal={mockGoal} regions={[]} />);

    expect(screen.getByText("Learn Next.js")).toBeInTheDocument();
    expect(
      screen.getByText("Master the Next.js framework"),
    ).toBeInTheDocument();
  });

  it("renders as a link to goal detail page", () => {
    render(<GoalCard goal={mockGoal} regions={[]} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/goals/1");
  });

  it("displays regions list when regions exist", () => {
    render(<GoalCard goal={mockGoal} regions={mockRegions} />);

    expect(screen.getByText("Regions:")).toBeInTheDocument();
    expect(screen.getByText("Server Components")).toBeInTheDocument();
    expect(screen.getByText("App Router")).toBeInTheDocument();
    expect(screen.getByText("API Routes")).toBeInTheDocument();
  });

  it("does not display regions section when no regions exist", () => {
    render(<GoalCard goal={mockGoal} regions={[]} />);

    expect(screen.queryByText("Regions:")).not.toBeInTheDocument();
  });

  it("displays correct number of regions", () => {
    render(<GoalCard goal={mockGoal} regions={mockRegions} />);

    const regionItems = screen.getAllByRole("listitem");
    expect(regionItems).toHaveLength(3);
  });
});
