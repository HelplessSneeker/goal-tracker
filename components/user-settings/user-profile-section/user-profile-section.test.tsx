import { render, screen } from "@testing-library/react";
import { UserProfileSection } from "./user-profile-section";

describe("UserProfileSection", () => {
  describe("Avatar Display", () => {
    it("renders avatar with image when provided", () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        image: "https://example.com/avatar.jpg",
      };

      const { container } = render(<UserProfileSection user={user} />);

      // Check that avatar container exists
      const avatar = container.querySelector('[data-slot="avatar"]');
      expect(avatar).toBeInTheDocument();

      // In test environment, avatar will show initials fallback even with image
      // This is expected behavior as images don't load in jest
      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("shows two-letter initials fallback when no image (two-word name)", () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserProfileSection user={user} />);

      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("shows one-letter initials fallback when no image (one-word name)", () => {
      const user = {
        name: "John",
        email: "john@example.com",
        image: null,
      };

      render(<UserProfileSection user={user} />);

      expect(screen.getByText("J")).toBeInTheDocument();
    });

    it("shows email initial when no name or image", () => {
      const user = {
        name: null,
        email: "test@example.com",
        image: null,
      };

      render(<UserProfileSection user={user} />);

      expect(screen.getByText("T")).toBeInTheDocument();
    });

    it("shows 'U' fallback when no name, email, or image", () => {
      const user = {
        name: null,
        email: null,
        image: null,
      };

      render(<UserProfileSection user={user} />);

      expect(screen.getByText("U")).toBeInTheDocument();
    });
  });

  describe("Profile Information", () => {
    it("displays user name when provided", () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserProfileSection user={user} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("shows 'No name set' when name is null", () => {
      const user = {
        name: null,
        email: "john@example.com",
        image: null,
      };

      render(<UserProfileSection user={user} />);

      expect(screen.getByText("No name set")).toBeInTheDocument();
    });

    it("displays user email", () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserProfileSection user={user} />);

      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });
  });

  describe("i18n", () => {
    it("displays translated labels correctly", () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserProfileSection user={user} />);

      // Check for translated labels (mocked in jest.setup.ts)
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("Your account information")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
    });
  });
});
