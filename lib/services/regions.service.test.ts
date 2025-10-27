/**
 * @jest-environment node
 */
import {
  getRegionsForGoal,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
} from "./regions.service";
import prisma from "@/lib/prisma";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("RegionsService", () => {
  const mockUserId = "clxyz123456789";
  const mockOtherUserId = "clxyz987654321";
  const mockGoalId = "goal-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getRegionsForGoal", () => {
    it("should return all regions for a goal owned by user", async () => {
      const mockRegions = [
        {
          id: "region-1",
          title: "Region 1",
          description: "Description 1",
          goalId: mockGoalId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "region-2",
          title: "Region 2",
          description: "Description 2",
          goalId: mockGoalId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.region.findMany.mockResolvedValue(mockRegions);

      const result = await getRegionsForGoal(mockGoalId, mockUserId);

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockRegions);
      expect(mockPrisma.region.findMany).toHaveBeenCalledWith({
        where: {
          goalId: mockGoalId,
          goal: {
            userId: mockUserId,
          },
        },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should return empty array when goal has no regions", async () => {
      mockPrisma.region.findMany.mockResolvedValue([]);

      const result = await getRegionsForGoal(mockGoalId, mockUserId);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });

    it("should verify goal ownership when fetching regions", async () => {
      mockPrisma.region.findMany.mockResolvedValue([]);

      await getRegionsForGoal(mockGoalId, mockUserId);

      expect(mockPrisma.region.findMany).toHaveBeenCalledWith({
        where: {
          goalId: mockGoalId,
          goal: {
            userId: mockUserId,
          },
        },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("getRegionById", () => {
    it("should return a region when it exists and user owns the goal", async () => {
      const mockRegion = {
        id: "region-1",
        title: "Test Region",
        description: "Description",
        goalId: mockGoalId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.region.findFirst.mockResolvedValue(mockRegion);

      const result = await getRegionById("region-1", mockUserId);

      expect(result).toEqual(mockRegion);
      expect(mockPrisma.region.findFirst).toHaveBeenCalledWith({
        where: {
          id: "region-1",
          goal: {
            userId: mockUserId,
          },
        },
      });
    });

    it("should return null when region does not exist", async () => {
      mockPrisma.region.findFirst.mockResolvedValue(null);

      const result = await getRegionById("nonexistent", mockUserId);

      expect(result).toBeNull();
    });

    it("should return null when user does not own the goal", async () => {
      mockPrisma.region.findFirst.mockResolvedValue(null);

      const result = await getRegionById("region-1", mockOtherUserId);

      expect(result).toBeNull();
      expect(mockPrisma.region.findFirst).toHaveBeenCalledWith({
        where: {
          id: "region-1",
          goal: {
            userId: mockOtherUserId,
          },
        },
      });
    });
  });

  describe("createRegion", () => {
    it("should create a region for a goal owned by user", async () => {
      const regionData = {
        goalId: mockGoalId,
        title: "New Region",
        description: "New Description",
      };

      const createdRegion = {
        id: "region-new",
        ...regionData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Mock goal ownership check
      mockPrisma.goal.findFirst.mockResolvedValue({
        id: mockGoalId,
        title: "Goal",
        description: "Desc",
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockPrisma.region.create.mockResolvedValue(createdRegion);

      const result = await createRegion(mockUserId, regionData);

      expect(result).toEqual(createdRegion);
      expect(mockPrisma.goal.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockGoalId,
          userId: mockUserId,
        },
      });
      expect(mockPrisma.region.create).toHaveBeenCalledWith({
        data: regionData,
      });
    });

    it("should return null when user does not own the goal", async () => {
      const regionData = {
        goalId: mockGoalId,
        title: "New Region",
        description: "New Description",
      };

      mockPrisma.goal.findFirst.mockResolvedValue(null);

      const result = await createRegion(mockOtherUserId, regionData);

      expect(result).toBeNull();
      expect(mockPrisma.region.create).not.toHaveBeenCalled();
    });

    it("should handle special characters in title and description", async () => {
      const regionData = {
        goalId: mockGoalId,
        title: 'Region "Special" & Chars',
        description: "Description <with> special: @#$%",
      };

      const createdRegion = {
        id: "region-special",
        ...regionData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.goal.findFirst.mockResolvedValue({
        id: mockGoalId,
        title: "Goal",
        description: "Desc",
        userId: mockUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockPrisma.region.create.mockResolvedValue(createdRegion);

      const result = await createRegion(mockUserId, regionData);

      expect(result?.title).toBe(regionData.title);
      expect(result?.description).toBe(regionData.description);
    });
  });

  describe("updateRegion", () => {
    it("should update a region when user owns the goal", async () => {
      const updates = {
        title: "Updated Title",
        description: "Updated Description",
      };

      const existingRegion = {
        id: "region-1",
        title: "Old Title",
        description: "Old Description",
        goalId: mockGoalId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedRegion = {
        ...existingRegion,
        ...updates,
        updatedAt: new Date(),
      };

      mockPrisma.region.findFirst.mockResolvedValue(existingRegion);
      mockPrisma.region.update.mockResolvedValue(updatedRegion);

      const result = await updateRegion("region-1", mockUserId, updates);

      expect(result).toEqual(updatedRegion);
      expect(mockPrisma.region.findFirst).toHaveBeenCalledWith({
        where: {
          id: "region-1",
          goal: {
            userId: mockUserId,
          },
        },
      });
      expect(mockPrisma.region.update).toHaveBeenCalledWith({
        where: { id: "region-1" },
        data: updates,
      });
    });

    it("should return null when region does not exist", async () => {
      mockPrisma.region.findFirst.mockResolvedValue(null);

      const result = await updateRegion("nonexistent", mockUserId, {
        title: "Updated",
      });

      expect(result).toBeNull();
      expect(mockPrisma.region.update).not.toHaveBeenCalled();
    });

    it("should return null when user does not own the goal", async () => {
      mockPrisma.region.findFirst.mockResolvedValue(null);

      const result = await updateRegion("region-1", mockOtherUserId, {
        title: "Updated",
      });

      expect(result).toBeNull();
      expect(mockPrisma.region.update).not.toHaveBeenCalled();
    });

    it("should allow partial updates", async () => {
      const existingRegion = {
        id: "region-1",
        title: "Old Title",
        description: "Old Description",
        goalId: mockGoalId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedRegion = {
        ...existingRegion,
        title: "New Title",
        updatedAt: new Date(),
      };

      mockPrisma.region.findFirst.mockResolvedValue(existingRegion);
      mockPrisma.region.update.mockResolvedValue(updatedRegion);

      const result = await updateRegion("region-1", mockUserId, {
        title: "New Title",
      });

      expect(result?.title).toBe("New Title");
      expect(result?.description).toBe("Old Description");
    });
  });

  describe("deleteRegion", () => {
    it("should delete a region when user owns the goal", async () => {
      const existingRegion = {
        id: "region-1",
        title: "Test Region",
        description: "Description",
        goalId: mockGoalId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.region.findFirst.mockResolvedValue(existingRegion);
      mockPrisma.region.delete.mockResolvedValue(existingRegion);

      const result = await deleteRegion("region-1", mockUserId);

      expect(result).toBe(true);
      expect(mockPrisma.region.findFirst).toHaveBeenCalledWith({
        where: {
          id: "region-1",
          goal: {
            userId: mockUserId,
          },
        },
      });
      expect(mockPrisma.region.delete).toHaveBeenCalledWith({
        where: { id: "region-1" },
      });
    });

    it("should return false when region does not exist", async () => {
      mockPrisma.region.findFirst.mockResolvedValue(null);

      const result = await deleteRegion("nonexistent", mockUserId);

      expect(result).toBe(false);
      expect(mockPrisma.region.delete).not.toHaveBeenCalled();
    });

    it("should return false when user does not own the goal", async () => {
      mockPrisma.region.findFirst.mockResolvedValue(null);

      const result = await deleteRegion("region-1", mockOtherUserId);

      expect(result).toBe(false);
      expect(mockPrisma.region.delete).not.toHaveBeenCalled();
    });
  });
});
