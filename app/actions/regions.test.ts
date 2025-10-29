/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-explicit-any -- Mock types in tests require any for flexibility */
import { getServerSession } from "next-auth";
import {
  createRegion,
  updateRegion,
  deleteRegion,
  getRegionsForGoal,
  getRegionById,
} from "@/lib/services/regions.service";

// Unmock the actions module to test the actual implementations
jest.unmock("@/app/actions/regions");

const mockGetServerSession = getServerSession as jest.MockedFunction<
  typeof getServerSession
>;

const mockCreateRegion = createRegion as jest.MockedFunction<
  typeof createRegion
>;
const mockUpdateRegion = updateRegion as jest.MockedFunction<
  typeof updateRegion
>;
const mockDeleteRegion = deleteRegion as jest.MockedFunction<
  typeof deleteRegion
>;
const mockGetRegionsForGoal = getRegionsForGoal as jest.MockedFunction<
  typeof getRegionsForGoal
>;
const mockGetRegionById = getRegionById as jest.MockedFunction<
  typeof getRegionById
>;

// Mock the services
jest.mock("@/lib/services/regions.service");

// Mock revalidatePath
const mockRevalidatePath = jest.fn();
jest.mock("next/cache", () => ({
  revalidatePath: (...args: any[]) => mockRevalidatePath(...args),
}));

describe("Regions Actions", () => {
  const mockUserId = "clxyz123456789";
  const mockGoalId = "goal-123";
  const mockRegionId = "region-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createRegionAction", () => {
    it("should create a region when authenticated", async () => {
      const { createRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const mockRegion = {
        id: mockRegionId,
        goalId: mockGoalId,
        title: "Test Region",
        description: "Test Description",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreateRegion.mockResolvedValue(mockRegion);

      const formData = new FormData();
      formData.append("goalId", mockGoalId);
      formData.append("title", "Test Region");
      formData.append("description", "Test Description");

      const result = await createRegionAction(formData);

      expect(result).toEqual({ success: true, region: mockRegion });
      expect(mockCreateRegion).toHaveBeenCalledWith(mockUserId, {
        goalId: mockGoalId,
        title: "Test Region",
        description: "Test Description",
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/goals");
      expect(mockRevalidatePath).toHaveBeenCalledWith(`/goals/${mockGoalId}`);
    });

    it("should return error when not authenticated", async () => {
      const { createRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("goalId", mockGoalId);
      formData.append("title", "Test Region");

      const result = await createRegionAction(formData);

      expect(result).toEqual({ error: "Unauthorized" });
      expect(mockCreateRegion).not.toHaveBeenCalled();
    });

    it("should return error when goalId is missing", async () => {
      const { createRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const formData = new FormData();
      formData.append("title", "Test Region");

      const result = await createRegionAction(formData);

      expect(result).toEqual({ error: "Goal ID is required" });
      expect(mockCreateRegion).not.toHaveBeenCalled();
    });

    it("should return error when title is missing", async () => {
      const { createRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const formData = new FormData();
      formData.append("goalId", mockGoalId);
      formData.append("title", "");

      const result = await createRegionAction(formData);

      expect(result).toEqual({ error: "Title is required" });
      expect(mockCreateRegion).not.toHaveBeenCalled();
    });

    it("should return error when user does not own the goal", async () => {
      const { createRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      mockCreateRegion.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("goalId", mockGoalId);
      formData.append("title", "Test Region");

      const result = await createRegionAction(formData);

      expect(result).toEqual({
        error: "Goal not found or unauthorized",
      });
    });

    it("should trim title and description", async () => {
      const { createRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const mockRegion = {
        id: mockRegionId,
        goalId: mockGoalId,
        title: "Test Region",
        description: "Test Description",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCreateRegion.mockResolvedValue(mockRegion);

      const formData = new FormData();
      formData.append("goalId", mockGoalId);
      formData.append("title", "  Test Region  ");
      formData.append("description", "  Test Description  ");

      await createRegionAction(formData);

      expect(mockCreateRegion).toHaveBeenCalledWith(mockUserId, {
        goalId: mockGoalId,
        title: "Test Region",
        description: "Test Description",
      });
    });
  });

  describe("updateRegionAction", () => {
    it("should update a region when authenticated", async () => {
      const { updateRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const mockRegion = {
        id: mockRegionId,
        goalId: mockGoalId,
        title: "Updated Region",
        description: "Updated Description",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUpdateRegion.mockResolvedValue(mockRegion);

      const formData = new FormData();
      formData.append("title", "Updated Region");
      formData.append("description", "Updated Description");

      const result = await updateRegionAction(mockRegionId, formData);

      expect(result).toEqual({ success: true, region: mockRegion });
      expect(mockUpdateRegion).toHaveBeenCalledWith(
        mockRegionId,
        mockUserId,
        {
          title: "Updated Region",
          description: "Updated Description",
        }
      );
      expect(mockRevalidatePath).toHaveBeenCalledWith("/goals");
      expect(mockRevalidatePath).toHaveBeenCalledWith(`/goals/${mockGoalId}`);
    });

    it("should return error when not authenticated", async () => {
      const { updateRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("title", "Updated Region");

      const result = await updateRegionAction(mockRegionId, formData);

      expect(result).toEqual({ error: "Unauthorized" });
      expect(mockUpdateRegion).not.toHaveBeenCalled();
    });

    it("should return error when title is missing", async () => {
      const { updateRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const formData = new FormData();
      formData.append("title", "");

      const result = await updateRegionAction(mockRegionId, formData);

      expect(result).toEqual({ error: "Title is required" });
      expect(mockUpdateRegion).not.toHaveBeenCalled();
    });

    it("should return error when region not found or unauthorized", async () => {
      const { updateRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      mockUpdateRegion.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("title", "Updated Region");

      const result = await updateRegionAction(mockRegionId, formData);

      expect(result).toEqual({
        error: "Region not found or unauthorized",
      });
    });
  });

  describe("deleteRegionAction", () => {
    it("should delete a region when authenticated", async () => {
      const { deleteRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      mockDeleteRegion.mockResolvedValue(true);

      const result = await deleteRegionAction(mockRegionId);

      expect(result).toEqual({ success: true });
      expect(mockDeleteRegion).toHaveBeenCalledWith(mockRegionId, mockUserId);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/goals");
    });

    it("should return error when not authenticated", async () => {
      const { deleteRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue(null);

      const result = await deleteRegionAction(mockRegionId);

      expect(result).toEqual({ error: "Unauthorized" });
      expect(mockDeleteRegion).not.toHaveBeenCalled();
    });

    it("should return error when region not found or unauthorized", async () => {
      const { deleteRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      mockDeleteRegion.mockResolvedValue(false);

      const result = await deleteRegionAction(mockRegionId);

      expect(result).toEqual({
        error: "Region not found or unauthorized",
      });
    });
  });

  describe("getRegionsAction", () => {
    it("should get all regions when no goalId provided", async () => {
      const { getRegionsAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const mockRegions = [
        {
          id: "region-1",
          goalId: "goal-1",
          title: "Region 1",
          description: "Description 1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "region-2",
          goalId: "goal-2",
          title: "Region 2",
          description: "Description 2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockGetRegionsForGoal.mockResolvedValue(mockRegions);

      const result = await getRegionsAction();

      expect(result).toEqual({ regions: mockRegions });
      expect(mockGetRegionsForGoal).toHaveBeenCalledWith(undefined, mockUserId);
    });

    it("should get regions for specific goal when goalId provided", async () => {
      const { getRegionsAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const mockRegions = [
        {
          id: "region-1",
          goalId: mockGoalId,
          title: "Region 1",
          description: "Description 1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockGetRegionsForGoal.mockResolvedValue(mockRegions);

      const result = await getRegionsAction(mockGoalId);

      expect(result).toEqual({ regions: mockRegions });
      expect(mockGetRegionsForGoal).toHaveBeenCalledWith(mockGoalId, mockUserId);
    });

    it("should return error when not authenticated", async () => {
      const { getRegionsAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue(null);

      const result = await getRegionsAction();

      expect(result).toEqual({ error: "Unauthorized", regions: [] });
      expect(mockGetRegionsForGoal).not.toHaveBeenCalled();
    });
  });

  describe("getRegionAction", () => {
    it("should get a region by id when authenticated", async () => {
      const { getRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const mockRegion = {
        id: mockRegionId,
        goalId: mockGoalId,
        title: "Test Region",
        description: "Test Description",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockGetRegionById.mockResolvedValue(mockRegion);

      const result = await getRegionAction(mockRegionId);

      expect(result).toEqual({ region: mockRegion });
      expect(mockGetRegionById).toHaveBeenCalledWith(mockRegionId, mockUserId);
    });

    it("should return error when not authenticated", async () => {
      const { getRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue(null);

      const result = await getRegionAction(mockRegionId);

      expect(result).toEqual({ error: "Unauthorized", region: null });
      expect(mockGetRegionById).not.toHaveBeenCalled();
    });

    it("should return error when region not found", async () => {
      const { getRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      mockGetRegionById.mockResolvedValue(null);

      const result = await getRegionAction(mockRegionId);

      expect(result).toEqual({ error: "Region not found", region: null });
    });
  });
});
