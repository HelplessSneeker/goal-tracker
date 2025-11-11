import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserProfileSection } from "./user-profile-section";
import { updateUserNameAction } from "@/app/actions/user";
import { ActionErrorCode } from "@/lib/action-types";

// Mock the action
jest.mock("@/app/actions/user");
const mockUpdateUserNameAction = updateUserNameAction as jest.MockedFunction<
  typeof updateUserNameAction
>;

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

  describe("Name Editing", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("shows edit button in read-only mode", () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserProfileSection user={user} />);

      expect(screen.getByRole("button", { name: /edit name/i })).toBeInTheDocument();
    });

    it("enters edit mode when edit button is clicked", async () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserProfileSection user={user} />);

      const editButton = screen.getByRole("button", { name: /edit name/i });
      await userEvent.click(editButton);

      // Should show input field
      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(screen.getByRole("textbox")).toHaveValue("John Doe");

      // Should show save and cancel buttons
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();

      // Edit button should be hidden
      expect(screen.queryByRole("button", { name: /edit name/i })).not.toBeInTheDocument();
    });

    it("cancels edit mode and reverts changes", async () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      render(<UserProfileSection user={user} />);

      // Enter edit mode
      await userEvent.click(screen.getByRole("button", { name: /edit name/i }));

      // Change the name
      const input = screen.getByRole("textbox");
      await userEvent.clear(input);
      await userEvent.type(input, "Jane Doe");

      // Cancel
      await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

      // Should exit edit mode
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: /edit name/i })).toBeInTheDocument();

      // Should show original name
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("saves name successfully", async () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      const updatedUser = {
        id: "user-1",
        name: "Jane Doe",
        email: "john@example.com",
        emailVerified: null,
        image: null,
      };

      mockUpdateUserNameAction.mockResolvedValue({
        success: true,
        data: updatedUser,
      });

      render(<UserProfileSection user={user} />);

      // Enter edit mode
      await userEvent.click(screen.getByRole("button", { name: /edit name/i }));

      // Change the name
      const input = screen.getByRole("textbox");
      await userEvent.clear(input);
      await userEvent.type(input, "Jane Doe");

      // Save
      await userEvent.click(screen.getByRole("button", { name: /save/i }));

      // Should call the action
      await waitFor(() => {
        expect(mockUpdateUserNameAction).toHaveBeenCalledTimes(1);
      });

      // Check that FormData was passed correctly
      const call = mockUpdateUserNameAction.mock.calls[0][0] as FormData;
      expect(call.get("name")).toBe("Jane Doe");

      // Should show success message
      await waitFor(() => {
        expect(
          screen.getByText(/name updated successfully/i)
        ).toBeInTheDocument();
      });

      // Should exit edit mode
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: /edit name/i })).toBeInTheDocument();
    });

    it("clears name successfully", async () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      const updatedUser = {
        id: "user-1",
        name: null,
        email: "john@example.com",
        emailVerified: null,
        image: null,
      };

      mockUpdateUserNameAction.mockResolvedValue({
        success: true,
        data: updatedUser,
      });

      render(<UserProfileSection user={user} />);

      // Enter edit mode
      await userEvent.click(screen.getByRole("button", { name: /edit name/i }));

      // Clear the name
      const input = screen.getByRole("textbox");
      await userEvent.clear(input);

      // Save
      await userEvent.click(screen.getByRole("button", { name: /save/i }));

      // Should call the action with empty string
      await waitFor(() => {
        expect(mockUpdateUserNameAction).toHaveBeenCalledTimes(1);
      });

      const call = mockUpdateUserNameAction.mock.calls[0][0] as FormData;
      expect(call.get("name")).toBe("");

      // Should show success message
      await waitFor(() => {
        expect(
          screen.getByText(/name updated successfully/i)
        ).toBeInTheDocument();
      });
    });

    it("displays error message when save fails", async () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      mockUpdateUserNameAction.mockResolvedValue({
        error: "Failed to update name",
        code: ActionErrorCode.DATABASE_ERROR,
      });

      render(<UserProfileSection user={user} />);

      // Enter edit mode
      await userEvent.click(screen.getByRole("button", { name: /edit name/i }));

      // Change the name
      const input = screen.getByRole("textbox");
      await userEvent.clear(input);
      await userEvent.type(input, "Jane Doe");

      // Save
      await userEvent.click(screen.getByRole("button", { name: /save/i }));

      // Should show error message
      await waitFor(() => {
        expect(
          screen.getByText(/failed to update name/i)
        ).toBeInTheDocument();
      });

      // Should stay in edit mode
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("disables inputs during save", async () => {
      const user = {
        name: "John Doe",
        email: "john@example.com",
        image: null,
      };

      // Mock a slow response
      mockUpdateUserNameAction.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ success: true, data: { id: "1", name: "Jane Doe", email: "john@example.com", emailVerified: null, image: null } }), 100))
      );

      render(<UserProfileSection user={user} />);

      // Enter edit mode
      await userEvent.click(screen.getByRole("button", { name: /edit name/i }));

      // Start save
      await userEvent.click(screen.getByRole("button", { name: /save/i }));

      // Buttons and input should be disabled
      expect(screen.getByRole("textbox")).toBeDisabled();
      expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
      expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
    });
  });
});
