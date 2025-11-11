/**
 * @jest-environment node
 */
// Unmock the actions module for this test file
jest.unmock("@/app/actions/user-preferences");

import {
  getUserPreferencesAction,
  updateUserPreferencesAction,
} from "./user-preferences";
import { mockGetServerSession } from "@/jest.setup";
import * as userPreferencesService from "@/lib/services/user-preferences.service";
import { ActionErrorCode } from "@/lib/action-types";

// Mock the services
jest.mock("@/lib/services/user-preferences.service");
const mockUserPreferencesService =
  userPreferencesService as jest.Mocked<typeof userPreferencesService>;

describe("User Preferences Server Actions", () => {
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

  describe("getUserPreferencesAction", () => {
    it("should return preferences when authenticated", async () => {
      const mockPreferences = {
        id: "pref-1",
        userId: mockUserId,
        language: "en",
        theme: "dark",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserPreferencesService.getUserPreferences.mockResolvedValue(
        mockPreferences
      );

      const result = await getUserPreferencesAction();

      expect(result).toEqual({ success: true, data: mockPreferences });
      expect(mockUserPreferencesService.getUserPreferences).toHaveBeenCalledWith(
        mockUserId
      );
    });

    it("should return UNAUTHORIZED error when not authenticated", async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await getUserPreferencesAction();

      expect(result).toEqual({
        error: "You must be logged in to view preferences",
        code: ActionErrorCode.UNAUTHORIZED,
      });
      expect(
        mockUserPreferencesService.getUserPreferences
      ).not.toHaveBeenCalled();
    });

    it("should return DATABASE_ERROR when service fails", async () => {
      mockUserPreferencesService.getUserPreferences.mockResolvedValue(null);

      const result = await getUserPreferencesAction();

      expect(result).toEqual({
        error: "Failed to load preferences",
        code: ActionErrorCode.DATABASE_ERROR,
      });
    });
  });

  describe("updateUserPreferencesAction", () => {
    it("should update preferences successfully with valid data", async () => {
      const mockUpdatedPreferences = {
        id: "pref-1",
        userId: mockUserId,
        language: "de",
        theme: "dark",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserPreferencesService.updateUserPreferences.mockResolvedValue(
        mockUpdatedPreferences
      );

      const formData = new FormData();
      formData.append("language", "de");
      formData.append("theme", "dark");

      const result = await updateUserPreferencesAction(formData);

      expect(result).toEqual({ success: true, data: mockUpdatedPreferences });
      expect(
        mockUserPreferencesService.updateUserPreferences
      ).toHaveBeenCalledWith(mockUserId, { language: "de", theme: "dark" });
    });

    it("should return UNAUTHORIZED when not authenticated", async () => {
      mockGetServerSession.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("language", "de");

      const result = await updateUserPreferencesAction(formData);

      expect(result).toEqual({
        error: "You must be logged in to update preferences",
        code: ActionErrorCode.UNAUTHORIZED,
      });
      expect(
        mockUserPreferencesService.updateUserPreferences
      ).not.toHaveBeenCalled();
    });

    it("should return VALIDATION_ERROR for invalid language", async () => {
      const formData = new FormData();
      formData.append("language", "fr"); // Invalid language

      const result = await updateUserPreferencesAction(formData);

      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("code", ActionErrorCode.VALIDATION_ERROR);
      expect(
        mockUserPreferencesService.updateUserPreferences
      ).not.toHaveBeenCalled();
    });

    it("should return VALIDATION_ERROR for invalid theme", async () => {
      const formData = new FormData();
      formData.append("theme", "blue"); // Invalid theme

      const result = await updateUserPreferencesAction(formData);

      expect(result).toHaveProperty("error");
      expect(result).toHaveProperty("code", ActionErrorCode.VALIDATION_ERROR);
      expect(
        mockUserPreferencesService.updateUserPreferences
      ).not.toHaveBeenCalled();
    });

    it("should return NOT_FOUND when preferences don't exist", async () => {
      mockUserPreferencesService.updateUserPreferences.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("language", "de");

      const result = await updateUserPreferencesAction(formData);

      expect(result).toEqual({
        error: "Preferences not found",
        code: ActionErrorCode.NOT_FOUND,
      });
    });

    it("should return DATABASE_ERROR when update fails", async () => {
      mockUserPreferencesService.updateUserPreferences.mockRejectedValue(
        new Error("Database error")
      );

      const formData = new FormData();
      formData.append("language", "de");

      const result = await updateUserPreferencesAction(formData);

      expect(result).toEqual({
        error: "Failed to update preferences",
        code: ActionErrorCode.DATABASE_ERROR,
      });
    });

    it("should update only language when only language is provided", async () => {
      const mockUpdatedPreferences = {
        id: "pref-1",
        userId: mockUserId,
        language: "de",
        theme: "system",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserPreferencesService.updateUserPreferences.mockResolvedValue(
        mockUpdatedPreferences
      );

      const formData = new FormData();
      formData.append("language", "de");

      const result = await updateUserPreferencesAction(formData);

      expect(result).toEqual({ success: true, data: mockUpdatedPreferences });
      expect(
        mockUserPreferencesService.updateUserPreferences
      ).toHaveBeenCalledWith(mockUserId, { language: "de" });
    });

    it("should update only theme when only theme is provided", async () => {
      const mockUpdatedPreferences = {
        id: "pref-1",
        userId: mockUserId,
        language: "en",
        theme: "dark",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserPreferencesService.updateUserPreferences.mockResolvedValue(
        mockUpdatedPreferences
      );

      const formData = new FormData();
      formData.append("theme", "dark");

      const result = await updateUserPreferencesAction(formData);

      expect(result).toEqual({ success: true, data: mockUpdatedPreferences });
      expect(
        mockUserPreferencesService.updateUserPreferences
      ).toHaveBeenCalledWith(mockUserId, { theme: "dark" });
    });
  });
});
