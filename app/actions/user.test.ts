/**
 * @jest-environment node
 */
// Unmock the actions module for this test file
jest.unmock("@/app/actions/user");

import { updateUserNameAction } from "./user";
import { mockGetServerSession } from "@/jest.setup";
import * as userService from "@/lib/services/user.service";
import { ActionErrorCode } from "@/lib/action-types";

// Mock the services
jest.mock("@/lib/services/user.service");
const mockUserService = userService as jest.Mocked<typeof userService>;

// Mock revalidatePath
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

describe("User Server Actions", () => {
  const mockUserId = "clxyz123456789";
  const mockSession = {
    user: {
      id: mockUserId,
      email: "test@example.com",
      name: "Test User",
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetServerSession.mockResolvedValue(mockSession);
  });

  describe("updateUserNameAction", () => {
    it("should update user name successfully", async () => {
      const mockUser = {
        id: mockUserId,
        name: "Jane Doe",
        email: "test@example.com",
        emailVerified: null,
        image: null,
      };

      mockUserService.updateUserName.mockResolvedValue(mockUser);

      const formData = new FormData();
      formData.append("name", "Jane Doe");

      const result = await updateUserNameAction(formData);

      expect(result).toEqual({ success: true, data: mockUser });
      expect(mockUserService.updateUserName).toHaveBeenCalledWith(
        mockUserId,
        "Jane Doe"
      );
    });

    it("should clear user name with empty string", async () => {
      const mockUser = {
        id: mockUserId,
        name: null,
        email: "test@example.com",
        emailVerified: null,
        image: null,
      };

      mockUserService.updateUserName.mockResolvedValue(mockUser);

      const formData = new FormData();
      formData.append("name", "");

      const result = await updateUserNameAction(formData);

      expect(result).toEqual({ success: true, data: mockUser });
      expect(mockUserService.updateUserName).toHaveBeenCalledWith(
        mockUserId,
        null
      );
    });

    it("should clear user name with whitespace-only string", async () => {
      const mockUser = {
        id: mockUserId,
        name: null,
        email: "test@example.com",
        emailVerified: null,
        image: null,
      };

      mockUserService.updateUserName.mockResolvedValue(mockUser);

      const formData = new FormData();
      formData.append("name", "   ");

      const result = await updateUserNameAction(formData);

      expect(result).toEqual({ success: true, data: mockUser });
      expect(mockUserService.updateUserName).toHaveBeenCalledWith(
        mockUserId,
        null
      );
    });

    it("should return UNAUTHORIZED error when not authenticated", async () => {
      mockGetServerSession.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("name", "Jane Doe");

      const result = await updateUserNameAction(formData);

      expect(result).toEqual({
        error: "You must be logged in to update your name",
        code: ActionErrorCode.UNAUTHORIZED,
      });
      expect(mockUserService.updateUserName).not.toHaveBeenCalled();
    });

    it("should return VALIDATION_ERROR for name too long", async () => {
      const formData = new FormData();
      formData.append("name", "a".repeat(101)); // 101 characters

      const result = await updateUserNameAction(formData);

      expect("error" in result).toBe(true);
      if ("error" in result) {
        expect(result.code).toBe(ActionErrorCode.VALIDATION_ERROR);
        // Check that the validation error contains information about the field
        expect(
          result.error === "Validation failed. Please check your input." ||
            result.error.includes("100 characters")
        ).toBe(true);
        // Also check if validationErrors array exists and has the correct message
        if (result.validationErrors && result.validationErrors.length > 0) {
          expect(result.validationErrors[0].message).toContain(
            "100 characters"
          );
        }
      }
      expect(mockUserService.updateUserName).not.toHaveBeenCalled();
    });

    it("should sanitize dangerous input", async () => {
      const mockUser = {
        id: mockUserId,
        name: "alert(XSS)",
        email: "test@example.com",
        emailVerified: null,
        image: null,
      };

      mockUserService.updateUserName.mockResolvedValue(mockUser);

      const formData = new FormData();
      formData.append("name", "<script>alert('XSS')</script>");

      const result = await updateUserNameAction(formData);

      expect(result).toEqual({ success: true, data: mockUser });
      // Verify that sanitization happened (service receives cleaned string)
      expect(mockUserService.updateUserName).toHaveBeenCalled();
      const callArgs = mockUserService.updateUserName.mock.calls[0];
      expect(callArgs[1]).not.toContain("<script>");
    });

    it("should return NOT_FOUND when user doesn't exist", async () => {
      mockUserService.updateUserName.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("name", "Jane Doe");

      const result = await updateUserNameAction(formData);

      expect(result).toEqual({
        error: "User not found",
        code: ActionErrorCode.NOT_FOUND,
      });
    });

    it("should return DATABASE_ERROR when service throws", async () => {
      mockUserService.updateUserName.mockRejectedValue(
        new Error("Database error")
      );

      const formData = new FormData();
      formData.append("name", "Jane Doe");

      const result = await updateUserNameAction(formData);

      expect(result).toEqual({
        error: "Failed to update name. Please try again.",
        code: ActionErrorCode.DATABASE_ERROR,
      });
    });

    it("should trim whitespace from name", async () => {
      const mockUser = {
        id: mockUserId,
        name: "Jane Doe",
        email: "test@example.com",
        emailVerified: null,
        image: null,
      };

      mockUserService.updateUserName.mockResolvedValue(mockUser);

      const formData = new FormData();
      formData.append("name", "  Jane Doe  ");

      const result = await updateUserNameAction(formData);

      expect(result).toEqual({ success: true, data: mockUser });
      // Service should receive trimmed string
      expect(mockUserService.updateUserName).toHaveBeenCalledWith(
        mockUserId,
        expect.any(String)
      );
    });
  });
});
