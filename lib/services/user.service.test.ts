/**
 * @jest-environment node
 */
import { getUserById, updateUserName } from "./user.service";
import prisma from "@/lib/prisma";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

// Type assertions for mock methods
const mockUserFindUnique = mockPrisma.user.findUnique as unknown as jest.Mock;
const mockUserUpdate = mockPrisma.user.update as unknown as jest.Mock;

describe("UserService", () => {
  const mockUserId = "clxyz123456789";
  const mockOtherUserId = "clxyz987654321";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserById", () => {
    it("should return user when found", async () => {
      const mockUser = {
        id: mockUserId,
        name: "John Doe",
        email: "john@example.com",
        emailVerified: null,
        image: null,
      };

      mockUserFindUnique.mockResolvedValue(mockUser);

      const result = await getUserById(mockUserId);

      expect(result).toEqual(mockUser);
      expect(mockUserFindUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
        },
      });
    });

    it("should return null when user not found", async () => {
      mockUserFindUnique.mockResolvedValue(null);

      const result = await getUserById("nonexistent-id");

      expect(result).toBeNull();
      expect(mockUserFindUnique).toHaveBeenCalledWith({
        where: { id: "nonexistent-id" },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
        },
      });
    });
  });

  describe("updateUserName", () => {
    it("should update user name with valid string", async () => {
      const mockUser = {
        id: mockUserId,
        name: "John Doe",
        email: "john@example.com",
        emailVerified: null,
        image: null,
      };

      // First call verifies user exists
      mockUserFindUnique.mockResolvedValue(mockUser);

      // Second call returns updated user
      const updatedUser = { ...mockUser, name: "Jane Doe" };
      mockUserUpdate.mockResolvedValue(updatedUser);

      const result = await updateUserName(mockUserId, "Jane Doe");

      expect(result).toEqual(updatedUser);
      expect(mockUserFindUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
      });
      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: { name: "Jane Doe" },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
        },
      });
    });

    it("should clear user name when null is provided", async () => {
      const mockUser = {
        id: mockUserId,
        name: "John Doe",
        email: "john@example.com",
        emailVerified: null,
        image: null,
      };

      mockUserFindUnique.mockResolvedValue(mockUser);

      const updatedUser = { ...mockUser, name: null };
      mockUserUpdate.mockResolvedValue(updatedUser);

      const result = await updateUserName(mockUserId, null);

      expect(result).toEqual(updatedUser);
      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: { name: null },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
        },
      });
    });

    it("should return null when user does not exist", async () => {
      mockUserFindUnique.mockResolvedValue(null);

      const result = await updateUserName("nonexistent-id", "New Name");

      expect(result).toBeNull();
      expect(mockUserFindUnique).toHaveBeenCalledWith({
        where: { id: "nonexistent-id" },
      });
      expect(mockUserUpdate).not.toHaveBeenCalled();
    });

    it("should trim whitespace from name", async () => {
      const mockUser = {
        id: mockUserId,
        name: "John Doe",
        email: "john@example.com",
        emailVerified: null,
        image: null,
      };

      mockUserFindUnique.mockResolvedValue(mockUser);

      const updatedUser = { ...mockUser, name: "Jane Doe" };
      mockUserUpdate.mockResolvedValue(updatedUser);

      const result = await updateUserName(mockUserId, "  Jane Doe  ");

      expect(result).toEqual(updatedUser);
      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: { name: "Jane Doe" },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
        },
      });
    });

    it("should convert empty string to null", async () => {
      const mockUser = {
        id: mockUserId,
        name: "John Doe",
        email: "john@example.com",
        emailVerified: null,
        image: null,
      };

      mockUserFindUnique.mockResolvedValue(mockUser);

      const updatedUser = { ...mockUser, name: null };
      mockUserUpdate.mockResolvedValue(updatedUser);

      const result = await updateUserName(mockUserId, "");

      expect(result).toEqual(updatedUser);
      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: { name: null },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
        },
      });
    });

    it("should convert whitespace-only string to null", async () => {
      const mockUser = {
        id: mockUserId,
        name: "John Doe",
        email: "john@example.com",
        emailVerified: null,
        image: null,
      };

      mockUserFindUnique.mockResolvedValue(mockUser);

      const updatedUser = { ...mockUser, name: null };
      mockUserUpdate.mockResolvedValue(updatedUser);

      const result = await updateUserName(mockUserId, "   ");

      expect(result).toEqual(updatedUser);
      expect(mockUserUpdate).toHaveBeenCalledWith({
        where: { id: mockUserId },
        data: { name: null },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
        },
      });
    });
  });
});
