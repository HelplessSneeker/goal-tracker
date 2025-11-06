/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserMenu } from "./user-menu";
import { useSession, signOut } from "next-auth/react";

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

// Mock next-intl
jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("UserMenu", () => {
  const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
  const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Authenticated State", () => {
    it("renders avatar with user initials from name", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
          },
          expires: "",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      render(<UserMenu />);

      const avatar = screen.getByText("JD");
      expect(avatar).toBeInTheDocument();
    });

    it("displays user email address", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
          },
          expires: "",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      render(<UserMenu />);

      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    it("hides email when hideEmail prop is true", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
          },
          expires: "",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      render(<UserMenu hideEmail={true} />);

      expect(screen.queryByText("john@example.com")).not.toBeInTheDocument();
    });

    it("shows dropdown menu on click", async () => {
      const user = userEvent.setup();

      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
          },
          expires: "",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      render(<UserMenu />);

      const trigger = screen.getByRole("button");
      await user.click(trigger);

      // Check for dropdown items (text is translated keys)
      const settingsItem = await screen.findByText("settings");
      const signOutItem = await screen.findByText("signOut");

      expect(settingsItem).toBeInTheDocument();
      expect(signOutItem).toBeInTheDocument();
    });

    it("dropdown contains Settings link to /settings", async () => {
      const user = userEvent.setup();

      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
          },
          expires: "",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      render(<UserMenu />);

      const trigger = screen.getByRole("button");
      await user.click(trigger);

      // Find settings item and check it's a link
      const settingsItem = await screen.findByText("settings");
      const settingsLink = settingsItem.closest("a");

      expect(settingsLink).toBeInTheDocument();
      expect(settingsLink).toHaveAttribute("href", "/settings");
    });

    it("dropdown contains Sign Out button", async () => {
      const user = userEvent.setup();

      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
          },
          expires: "",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      render(<UserMenu />);

      const trigger = screen.getByRole("button");
      await user.click(trigger);

      const signOutButton = await screen.findByRole("menuitem", { name: /signOut/i });
      expect(signOutButton).toBeInTheDocument();
    });

    it("calls signOut when Sign Out is clicked", async () => {
      const user = userEvent.setup();

      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
          },
          expires: "",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      render(<UserMenu />);

      const trigger = screen.getByRole("button");
      await user.click(trigger);

      const signOutButton = await screen.findByRole("menuitem", { name: /signOut/i });
      await user.click(signOutButton);

      expect(mockSignOut).toHaveBeenCalledWith({
        callbackUrl: "/auth/signin",
      });
    });

    it("generates initials from email when name is not provided", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "1",
            email: "john@example.com",
          },
          expires: "",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      render(<UserMenu />);

      const avatar = screen.getByText("J");
      expect(avatar).toBeInTheDocument();
    });

    it("handles single name correctly", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "1",
            name: "Madonna",
            email: "madonna@example.com",
          },
          expires: "",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      render(<UserMenu />);

      const avatar = screen.getByText("M");
      expect(avatar).toBeInTheDocument();
    });

    it("handles three or more names correctly (takes first two)", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "1",
            name: "John Paul George",
            email: "jpb@example.com",
          },
          expires: "",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      render(<UserMenu />);

      const avatar = screen.getByText("JP");
      expect(avatar).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("shows loading skeleton when session is loading", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "loading",
        update: jest.fn(),
      });

      render(<UserMenu />);

      // Check for skeleton or loading indicator
      // Using class name since skeleton might not have specific text
      const container = screen.getByTestId("user-menu-loading");
      expect(container).toBeInTheDocument();
    });
  });

  describe("Unauthenticated State", () => {
    it("renders nothing when session is unauthenticated", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
        update: jest.fn(),
      });

      const { container } = render(<UserMenu />);

      expect(container.firstChild).toBeNull();
    });

    it("renders nothing when session data is null but status is authenticated", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "authenticated",
        update: jest.fn(),
      });

      const { container } = render(<UserMenu />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty name gracefully", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "1",
            name: "",
            email: "test@example.com",
          },
          expires: "",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      render(<UserMenu />);

      const avatar = screen.getByText("T");
      expect(avatar).toBeInTheDocument();
    });

    it("handles user with no name and no email", () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            id: "1",
          },
          expires: "",
        },
        status: "authenticated",
        update: jest.fn(),
      });

      render(<UserMenu />);

      const avatar = screen.getByText("?");
      expect(avatar).toBeInTheDocument();
    });
  });
});
