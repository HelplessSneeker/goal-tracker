/// <reference types="@testing-library/jest-dom" />
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppSidebar } from "./app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getGoalsAction } from "@/app/actions/goals";
import { getRegionsAction } from "@/app/actions/regions";

// Note: next/navigation is globally mocked in jest.setup.ts
// We need to access the mock through the module
const nextNavigationMock = jest.requireMock("next/navigation");

// Mock UserMenu component
jest.mock("@/components/user-menu", () => ({
  UserMenu: () => <div data-testid="user-menu">UserMenu</div>,
}));

// Helper to render AppSidebar with required provider
const renderAppSidebar = () => {
  return render(
    <SidebarProvider>
      <AppSidebar />
    </SidebarProvider>
  );
};

describe("AppSidebar", () => {
  const mockGetGoalsAction = getGoalsAction as jest.MockedFunction<
    typeof getGoalsAction
  >;
  const mockGetRegionsAction = getRegionsAction as jest.MockedFunction<
    typeof getRegionsAction
  >;

  const mockGoals = [
    {
      id: "goal-1",
      title: "Learn Next.js",
      description: "Master the Next.js framework",
      userId: "user-1",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "goal-2",
      title: "Build Projects",
      description: "Create real-world applications",
      userId: "user-1",
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
    },
  ];

  const mockRegions = [
    {
      id: "region-1",
      goalId: "goal-1",
      title: "Server Components",
      description: "Learn RSC",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "region-2",
      goalId: "goal-1",
      title: "App Router",
      description: "Master routing",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "region-3",
      goalId: "goal-2",
      title: "Authentication",
      description: "Build auth system",
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset pathname to default
    nextNavigationMock.usePathname = jest.fn(() => "/");

    // Default successful responses
    mockGetGoalsAction.mockResolvedValue({
      success: true,
      data: mockGoals,
    });

    mockGetRegionsAction.mockResolvedValue({
      success: true,
      data: mockRegions,
    });
  });

  describe("Basic Rendering", () => {
    it("renders navigation sidebar", async () => {
      renderAppSidebar();

      await waitFor(() => {
        expect(screen.getByText("Navigation")).toBeInTheDocument();
      });
    });

    it("renders Progress link", async () => {
      renderAppSidebar();

      await waitFor(() => {
        expect(screen.getByText("Progress")).toBeInTheDocument();
      });

      const progressLink = screen.getByRole("link", { name: /progress/i });
      expect(progressLink).toHaveAttribute("href", "/progress");
    });

    it("renders Goals section", async () => {
      renderAppSidebar();

      await waitFor(() => {
        expect(screen.getByText("Goals")).toBeInTheDocument();
      });

      const goalsLink = screen.getByRole("link", { name: /goals/i });
      expect(goalsLink).toHaveAttribute("href", "/goals");
    });

    it("renders UserMenu in footer", async () => {
      renderAppSidebar();

      await waitFor(() => {
        expect(screen.getByTestId("user-menu")).toBeInTheDocument();
      });
    });
  });

  describe("Data Fetching", () => {
    it("fetches and displays goals", async () => {
      const user = userEvent.setup();
      renderAppSidebar();

      await waitFor(() => {
        expect(mockGetGoalsAction).toHaveBeenCalledTimes(1);
      });

      // Expand Goals section to see the goals
      await waitFor(() => {
        expect(screen.getByText("Goals")).toBeInTheDocument();
      });

      // Find the Goals link and get its parent to find the chevron
      const goalsLink = screen.getByRole("link", { name: /goals/i });
      const goalsParent = goalsLink.closest("div");
      const chevron = goalsParent?.querySelector("button") as HTMLElement;

      if (chevron) {
        await user.click(chevron);
      }

      // Now goals should be visible
      await waitFor(() => {
        expect(screen.getByText("Learn Next.js")).toBeInTheDocument();
        expect(screen.getByText("Build Projects")).toBeInTheDocument();
      });
    });

    it("fetches and displays regions under goals", async () => {
      renderAppSidebar();

      await waitFor(() => {
        expect(mockGetRegionsAction).toHaveBeenCalledTimes(1);
      });

      // Goals need to be expanded to see regions
      // We'll test this in the collapsible tests
    });

    it("handles failed goal fetch gracefully", async () => {
      mockGetGoalsAction.mockResolvedValue({
        success: false,
        error: "Failed to fetch goals",
      });

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      renderAppSidebar();

      await waitFor(() => {
        expect(mockGetGoalsAction).toHaveBeenCalled();
      });

      // Should not crash, goals just won't display
      expect(screen.queryByText("Learn Next.js")).not.toBeInTheDocument();

      consoleSpy.mockRestore();
    });

    it("handles failed region fetch gracefully", async () => {
      const user = userEvent.setup();
      mockGetRegionsAction.mockResolvedValue({
        success: false,
        error: "Failed to fetch regions",
      });

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      renderAppSidebar();

      await waitFor(() => {
        expect(mockGetRegionsAction).toHaveBeenCalled();
      });

      // Expand Goals section to verify goals still display
      await waitFor(() => {
        expect(screen.getByText("Goals")).toBeInTheDocument();
      });

      const goalsLink = screen.getByRole("link", { name: /goals/i });
      const goalsParent = goalsLink.closest("div");
      const chevron = goalsParent?.querySelector("button") as HTMLElement;

      if (chevron) {
        await user.click(chevron);
      }

      // Goals should still display even though regions failed
      await waitFor(() => {
        expect(screen.getByText("Learn Next.js")).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe("Collapsible Goals Section", () => {
    it("goals section starts collapsed by default", async () => {
      renderAppSidebar();

      await waitFor(() => {
        expect(screen.getByText("Goals")).toBeInTheDocument();
      });

      // Goals should not be visible initially
      expect(screen.queryByText("Learn Next.js")).not.toBeInTheDocument();
    });

    it("expands goals section when chevron is clicked", async () => {
      const user = userEvent.setup();
      renderAppSidebar();

      await waitFor(() => {
        expect(screen.getByText("Goals")).toBeInTheDocument();
      });

      // Find the Goals link and get its parent to find the chevron
      const goalsLink = screen.getByRole("link", { name: /goals/i });
      const goalsParent = goalsLink.closest("div");
      const chevron = goalsParent?.querySelector("button") as HTMLElement;

      expect(chevron).toBeTruthy();

      // Click the chevron to expand
      await user.click(chevron);

      // Goals should now be visible
      await waitFor(() => {
        expect(screen.getByText("Learn Next.js")).toBeInTheDocument();
        expect(screen.getByText("Build Projects")).toBeInTheDocument();
      });
    });
  });

  describe("Collapsible Individual Goals", () => {
    it("expands individual goal to show regions", async () => {
      const user = userEvent.setup();
      renderAppSidebar();

      // First expand Goals section
      await waitFor(() => {
        expect(screen.getByText("Goals")).toBeInTheDocument();
      });

      const goalsLink = screen.getByRole("link", { name: /goals/i });
      const goalsParent = goalsLink.closest("div");
      const goalsChevron = goalsParent?.querySelector("button") as HTMLElement;

      expect(goalsChevron).toBeTruthy();
      await user.click(goalsChevron);

      // Wait for goals to appear
      await waitFor(() => {
        expect(screen.getByText("Learn Next.js")).toBeInTheDocument();
      });

      // Regions should not be visible yet
      expect(screen.queryByText("Server Components")).not.toBeInTheDocument();

      // Find and click chevron for "Learn Next.js" goal
      const learnNextLink = screen.getByRole("link", { name: /learn next\.js/i });
      const goalItem = learnNextLink.closest("div");
      const goalChevron = goalItem?.querySelector("button") as HTMLElement;

      expect(goalChevron).toBeTruthy();
      await user.click(goalChevron);

      // Regions should now be visible
      await waitFor(() => {
        expect(screen.getByText("Server Components")).toBeInTheDocument();
        expect(screen.getByText("App Router")).toBeInTheDocument();
      });
    });
  });

  describe("Auto-expansion based on pathname", () => {
    it("auto-expands Goals section when on /goals route", async () => {
      nextNavigationMock.usePathname = jest.fn(() => "/goals");

      renderAppSidebar();

      // Goals section should auto-expand
      await waitFor(() => {
        expect(screen.getByText("Learn Next.js")).toBeInTheDocument();
        expect(screen.getByText("Build Projects")).toBeInTheDocument();
      });
    });

    it("auto-expands specific goal when on goal detail page", async () => {
      nextNavigationMock.usePathname = jest.fn(() => "/goals/goal-1");

      renderAppSidebar();

      // Goals section should be expanded
      await waitFor(() => {
        expect(screen.getByText("Learn Next.js")).toBeInTheDocument();
      });

      // Specific goal should be expanded showing regions
      await waitFor(() => {
        expect(screen.getByText("Server Components")).toBeInTheDocument();
        expect(screen.getByText("App Router")).toBeInTheDocument();
      });
    });

    it("auto-expands goal when on region page", async () => {
      nextNavigationMock.usePathname = jest.fn(() => "/goals/goal-1/region-1");

      renderAppSidebar();

      // Goals section and specific goal should be expanded
      await waitFor(() => {
        expect(screen.getByText("Learn Next.js")).toBeInTheDocument();
        expect(screen.getByText("Server Components")).toBeInTheDocument();
      });
    });
  });

  describe("Collapse All functionality", () => {
    it("collapses all sections when collapse all button is clicked", async () => {
      const user = userEvent.setup();
      nextNavigationMock.usePathname = jest.fn(() => "/goals/goal-1");

      renderAppSidebar();

      // Wait for auto-expansion
      await waitFor(() => {
        expect(screen.getByText("Learn Next.js")).toBeInTheDocument();
        expect(screen.getByText("Server Components")).toBeInTheDocument();
      });

      // Find and click collapse all button (has ChevronsDownUp icon)
      const collapseButton = screen.getAllByRole("button").find((btn) =>
        btn.getAttribute("title")?.includes("Collapse all")
      );

      if (collapseButton) {
        await user.click(collapseButton);
      }

      // Everything should be collapsed
      await waitFor(() => {
        expect(screen.queryByText("Learn Next.js")).not.toBeInTheDocument();
        expect(screen.queryByText("Server Components")).not.toBeInTheDocument();
      });

      // But Goals link should still be visible
      expect(screen.getByText("Goals")).toBeInTheDocument();
    });
  });

  describe("Navigation Links", () => {
    it("renders correct href for goal links", async () => {
      nextNavigationMock.usePathname = jest.fn(() => "/goals");

      renderAppSidebar();

      await waitFor(() => {
        expect(screen.getByText("Learn Next.js")).toBeInTheDocument();
      });

      const goalLink = screen.getByRole("link", { name: /learn next\.js/i });
      expect(goalLink).toHaveAttribute("href", "/goals/goal-1");
    });

    it("renders correct href for region links", async () => {
      nextNavigationMock.usePathname = jest.fn(() => "/goals/goal-1");

      renderAppSidebar();

      await waitFor(() => {
        expect(screen.getByText("Server Components")).toBeInTheDocument();
      });

      const regionLink = screen.getByRole("link", {
        name: /server components/i,
      });
      expect(regionLink).toHaveAttribute("href", "/goals/goal-1/region-1");
    });
  });
});
