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
  const mockGoalId = "550e8400-e29b-41d4-a716-446655440010";
  const mockRegionId = "550e8400-e29b-41d4-a716-446655440020";

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

      expect(result).toEqual({ success: true, data: mockRegion });
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

      expect(result).toEqual({ error: "Unauthorized", code: "UNAUTHORIZED" });
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

      expect(result).toEqual({
        error: "Validation failed. Please check your input.",
        code: "VALIDATION_ERROR",
        validationErrors: [{ field: "goalId", message: "Invalid input: expected string, received undefined" }],
      });
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

      expect(result).toEqual({
        error: "Validation failed. Please check your input.",
        code: "VALIDATION_ERROR",
        validationErrors: [{ field: "title", message: "Title is required" }],
      });
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
        code: "NOT_FOUND",
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

      expect(result).toEqual({ success: true, data: mockRegion });
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

      expect(result).toEqual({ error: "Unauthorized", code: "UNAUTHORIZED" });
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

      expect(result).toEqual({
        error: "Validation failed. Please check your input.",
        code: "VALIDATION_ERROR",
        validationErrors: [{ field: "title", message: "Title is required" }],
      });
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
        code: "NOT_FOUND",
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

      expect(result).toEqual({ success: true, data: { deleted: true } });
      expect(mockDeleteRegion).toHaveBeenCalledWith(mockRegionId, mockUserId);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/goals");
    });

    it("should return error when not authenticated", async () => {
      const { deleteRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue(null);

      const result = await deleteRegionAction(mockRegionId);

      expect(result).toEqual({ error: "Unauthorized", code: "UNAUTHORIZED" });
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
        code: "NOT_FOUND",
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
          id: "550e8400-e29b-41d4-a716-446655440021",
          goalId: "550e8400-e29b-41d4-a716-446655440011",
          title: "Region 1",
          description: "Description 1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "550e8400-e29b-41d4-a716-446655440022",
          goalId: "550e8400-e29b-41d4-a716-446655440012",
          title: "Region 2",
          description: "Description 2",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockGetRegionsForGoal.mockResolvedValue(mockRegions);

      const result = await getRegionsAction();

      expect(result).toEqual({ success: true, data: mockRegions });
      expect(mockGetRegionsForGoal).toHaveBeenCalledWith(undefined, mockUserId);
    });

    it("should get regions for specific goal when goalId provided", async () => {
      const { getRegionsAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      const mockRegions = [
        {
          id: "550e8400-e29b-41d4-a716-446655440021",
          goalId: mockGoalId,
          title: "Region 1",
          description: "Description 1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockGetRegionsForGoal.mockResolvedValue(mockRegions);

      const result = await getRegionsAction(mockGoalId);

      expect(result).toEqual({ success: true, data: mockRegions });
      expect(mockGetRegionsForGoal).toHaveBeenCalledWith(mockGoalId, mockUserId);
    });

    it("should return error when not authenticated", async () => {
      const { getRegionsAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue(null);

      const result = await getRegionsAction();

      expect(result).toEqual({ error: "Unauthorized", code: "UNAUTHORIZED" });
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

      expect(result).toEqual({ success: true, data: mockRegion });
      expect(mockGetRegionById).toHaveBeenCalledWith(mockRegionId, mockUserId);
    });

    it("should return error when not authenticated", async () => {
      const { getRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue(null);

      const result = await getRegionAction(mockRegionId);

      expect(result).toEqual({ error: "Unauthorized", code: "UNAUTHORIZED" });
      expect(mockGetRegionById).not.toHaveBeenCalled();
    });

    it("should return error when region not found", async () => {
      const { getRegionAction } = await import("@/app/actions/regions");

      mockGetServerSession.mockResolvedValue({
        user: { id: mockUserId },
      } as any);

      mockGetRegionById.mockResolvedValue(null);

      const result = await getRegionAction(mockRegionId);

      expect(result).toEqual({ error: "Region not found", code: "NOT_FOUND" });
    });
  });
});
