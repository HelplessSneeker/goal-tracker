/**
 * @jest-environment node
 */
import {
  getUserPreferences,
  updateUserPreferences,
} from "./user-preferences.service";
import prisma from "@/lib/prisma";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// Type assertions for mock methods
const mockUserPreferencesFindUnique =
  mockPrisma.userPreferences.findUnique as unknown as jest.Mock;
const mockUserPreferencesCreate =
  mockPrisma.userPreferences.create as unknown as jest.Mock;
const mockUserPreferencesUpdate =
  mockPrisma.userPreferences.update as unknown as jest.Mock;

describe("UserPreferencesService", () => {
  const mockUserId = "clxyz123456789";
  const mockOtherUserId = "clxyz987654321";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserPreferences", () => {
    it("should return user preferences when found", async () => {
      const mockPreferences = {
        id: "pref-1",
        userId: mockUserId,
        language: "en",
        theme: "dark",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserPreferencesFindUnique.mockResolvedValue(mockPreferences);

      const result = await getUserPreferences(mockUserId);

      expect(result).toEqual(mockPreferences);
      expect(mockUserPreferencesFindUnique).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
    });

    it("should create and return default preferences if none exist", async () => {
      const mockCreatedPreferences = {
        id: "pref-1",
        userId: mockUserId,
        language: "en",
        theme: "system",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // First call returns null (not found), second call creates it
      mockUserPreferencesFindUnique.mockResolvedValue(null);
      mockUserPreferencesCreate.mockResolvedValue(mockCreatedPreferences);

      const result = await getUserPreferences(mockUserId);

      expect(result).toEqual(mockCreatedPreferences);
      expect(mockUserPreferencesFindUnique).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
      expect(mockUserPreferencesCreate).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          language: "en",
          theme: "system",
        },
      });
    });
  });

  describe("updateUserPreferences", () => {
    it("should update language preference", async () => {
      const existingPreferences = {
        id: "pref-1",
        userId: mockUserId,
        language: "en",
        theme: "system",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedPreferences = {
        ...existingPreferences,
        language: "de",
      };

      mockUserPreferencesFindUnique.mockResolvedValue(existingPreferences);
      mockUserPreferencesUpdate.mockResolvedValue(updatedPreferences);

      const result = await updateUserPreferences(mockUserId, {
        language: "de",
      });

      expect(result).toEqual(updatedPreferences);
      expect(mockUserPreferencesFindUnique).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
      expect(mockUserPreferencesUpdate).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        data: { language: "de" },
      });
    });

    it("should update theme preference", async () => {
      const existingPreferences = {
        id: "pref-1",
        userId: mockUserId,
        language: "en",
        theme: "system",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedPreferences = {
        ...existingPreferences,
        theme: "dark",
      };

      mockUserPreferencesFindUnique.mockResolvedValue(existingPreferences);
      mockUserPreferencesUpdate.mockResolvedValue(updatedPreferences);

      const result = await updateUserPreferences(mockUserId, { theme: "dark" });

      expect(result).toEqual(updatedPreferences);
      expect(mockUserPreferencesUpdate).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        data: { theme: "dark" },
      });
    });

    it("should update both language and theme preferences", async () => {
      const existingPreferences = {
        id: "pref-1",
        userId: mockUserId,
        language: "en",
        theme: "system",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedPreferences = {
        ...existingPreferences,
        language: "de",
        theme: "dark",
      };

      mockUserPreferencesFindUnique.mockResolvedValue(existingPreferences);
      mockUserPreferencesUpdate.mockResolvedValue(updatedPreferences);

      const result = await updateUserPreferences(mockUserId, {
        language: "de",
        theme: "dark",
      });

      expect(result).toEqual(updatedPreferences);
      expect(mockUserPreferencesUpdate).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        data: { language: "de", theme: "dark" },
      });
    });

    it("should return null if preferences don't exist", async () => {
      mockUserPreferencesFindUnique.mockResolvedValue(null);

      const result = await updateUserPreferences(mockUserId, {
        language: "de",
      });

      expect(result).toBeNull();
      expect(mockUserPreferencesFindUnique).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
      expect(mockUserPreferencesUpdate).not.toHaveBeenCalled();
    });

    it("should return null if userId doesn't match (unauthorized)", async () => {
      const existingPreferences = {
        id: "pref-1",
        userId: mockOtherUserId,
        language: "en",
        theme: "system",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserPreferencesFindUnique.mockResolvedValue(existingPreferences);

      const result = await updateUserPreferences(mockUserId, {
        language: "de",
      });

      expect(result).toBeNull();
      expect(mockUserPreferencesUpdate).not.toHaveBeenCalled();
    });
  });
});
