/**
 * @jest-environment node
 */
import { GET, PUT, DELETE } from "./route";
import prisma from "@/lib/prisma";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("Regions API - /api/regions/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/regions/[id]", () => {
    it("should return a region when it exists", async () => {
      const mockRegion = {
        id: "uuid-1",
        goalId: "goal-1",
        title: "Region 1",
        description: "Desc 1",
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.region.findUnique.mockResolvedValue(mockRegion);

      const response = await GET(
        new Request("http://localhost:3000/api/regions/uuid-1"),
        { params: Promise.resolve({ id: "uuid-1" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe("uuid-1");
      expect(data.goalId).toBe("goal-1");
      expect(data.title).toBe("Region 1");
      expect(data.description).toBe("Desc 1");
      expect(mockPrisma.region.findUnique).toHaveBeenCalledWith({
        where: { id: "uuid-1" },
      });
    });

    it("should return 404 when region does not exist", async () => {
      mockPrisma.region.findUnique.mockResolvedValue(null);

      const response = await GET(
        new Request("http://localhost:3000/api/regions/999"),
        { params: Promise.resolve({ id: "999" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Region not found");
    });

    it("should handle different valid region IDs", async () => {
      const mockRegion = {
        id: "uuid-2",
        goalId: "goal-1",
        title: "Region 2",
        description: "Desc 2",
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.region.findUnique.mockResolvedValue(mockRegion);

      const response = await GET(
        new Request("http://localhost:3000/api/regions/uuid-2"),
        { params: Promise.resolve({ id: "uuid-2" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe("uuid-2");
      expect(data.title).toBe("Region 2");
      expect(data.goalId).toBe("goal-1");
    });
  });

  describe("PUT /api/regions/[id]", () => {
    it("should update an existing region", async () => {
      const updates = {
        title: "Updated Region Title",
        description: "Updated description",
      };

      const updatedRegion = {
        id: "uuid-1",
        goalId: "goal-1",
        title: updates.title,
        description: updates.description,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.region.update.mockResolvedValue(updatedRegion);

      const request = new Request("http://localhost:3000/api/regions/uuid-1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const response = await PUT(request, {
        params: Promise.resolve({ id: "uuid-1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe("uuid-1");
      expect(data.title).toBe("Updated Region Title");
      expect(data.description).toBe("Updated description");
      expect(data.goalId).toBe("goal-1"); // Should preserve goalId
      expect(mockPrisma.region.update).toHaveBeenCalledWith({
        where: { id: "uuid-1" },
        data: {
          title: updates.title,
          description: updates.description,
        },
      });
    });

    it("should persist updates via Prisma", async () => {
      const updates = {
        title: "Persisted Update",
        description: "This should persist",
      };

      const updatedRegion = {
        id: "uuid-2",
        goalId: "goal-1",
        title: updates.title,
        description: updates.description,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.region.update.mockResolvedValue(updatedRegion);

      const request = new Request("http://localhost:3000/api/regions/uuid-2", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      await PUT(request, { params: Promise.resolve({ id: "uuid-2" }) });

      expect(mockPrisma.region.update).toHaveBeenCalledTimes(1);
      expect(mockPrisma.region.update).toHaveBeenCalledWith({
        where: { id: "uuid-2" },
        data: expect.objectContaining({
          title: "Persisted Update",
          description: "This should persist",
        }),
      });
    });

    it("should return 404 when updating non-existent region", async () => {
      mockPrisma.region.update.mockRejectedValue(new Error("Record not found"));

      const updates = {
        title: "Updated Title",
        description: "Updated Description",
      };

      const request = new Request("http://localhost:3000/api/regions/999", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const response = await PUT(request, {
        params: Promise.resolve({ id: "999" }),
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Region not found");
    });

    it("should allow updating goalId", async () => {
      const updates = {
        goalId: "goal-3",
        title: "Region 1",
        description: "Desc 1",
      };

      const updatedRegion = {
        id: "uuid-1",
        goalId: updates.goalId,
        title: updates.title,
        description: updates.description,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.region.update.mockResolvedValue(updatedRegion);

      const request = new Request("http://localhost:3000/api/regions/uuid-1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const response = await PUT(request, {
        params: Promise.resolve({ id: "uuid-1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.goalId).toBe("goal-3");
    });

    it("should allow partial updates", async () => {
      const titleOnlyUpdate = {
        title: "Only Title Updated",
      };

      const updatedRegion = {
        id: "uuid-1",
        goalId: "goal-1",
        title: titleOnlyUpdate.title,
        description: "Desc 1",
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.region.update.mockResolvedValue(updatedRegion);

      const request = new Request("http://localhost:3000/api/regions/uuid-1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(titleOnlyUpdate),
      });

      const response = await PUT(request, {
        params: Promise.resolve({ id: "uuid-1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe("Only Title Updated");
      expect(data.description).toBe("Desc 1"); // Should preserve original
    });
  });

  describe("DELETE /api/regions/[id]", () => {
    it("should delete an existing region", async () => {
      const mockRegion = {
        id: "uuid-1",
        goalId: "goal-1",
        title: "Region 1",
        description: "Desc 1",
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.region.delete.mockResolvedValue(mockRegion);

      const response = await DELETE(
        new Request("http://localhost:3000/api/regions/uuid-1"),
        { params: Promise.resolve({ id: "uuid-1" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockPrisma.region.delete).toHaveBeenCalledWith({
        where: { id: "uuid-1" },
      });
    });

    it("should return 404 when deleting non-existent region", async () => {
      mockPrisma.region.delete.mockRejectedValue(new Error("Record not found"));

      const response = await DELETE(
        new Request("http://localhost:3000/api/regions/999"),
        { params: Promise.resolve({ id: "999" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Region not found");
    });

    it("should not affect other regions when deleting", async () => {
      const mockRegion = {
        id: "uuid-2",
        goalId: "goal-1",
        title: "Region 2",
        description: "Desc 2",
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.region.delete.mockResolvedValue(mockRegion);

      await DELETE(new Request("http://localhost:3000/api/regions/uuid-2"), {
        params: Promise.resolve({ id: "uuid-2" }),
      });

      expect(mockPrisma.region.delete).toHaveBeenCalledWith({
        where: { id: "uuid-2" },
      });
      // In real database, other records would remain, but we're testing isolation
      expect(mockPrisma.region.delete).toHaveBeenCalledTimes(1);
    });

    it("should delete regions from specific goal without affecting other goals", async () => {
      const mockRegion = {
        id: "uuid-1",
        goalId: "goal-1",
        title: "Region 1",
        description: "Desc 1",
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.region.delete.mockResolvedValue(mockRegion);

      // Delete a region from goal-1
      await DELETE(new Request("http://localhost:3000/api/regions/uuid-1"), {
        params: Promise.resolve({ id: "uuid-1" }),
      });

      expect(mockPrisma.region.delete).toHaveBeenCalledWith({
        where: { id: "uuid-1" },
      });
      // In real database, regions from goal-2 would still exist
      // We're just verifying the correct delete call was made
    });

    it("should handle deleting the last region", async () => {
      const mockRegion = {
        id: "uuid-3",
        goalId: "goal-2",
        title: "Region 3",
        description: "Desc 3",
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.region.delete.mockResolvedValue(mockRegion);

      const response = await DELETE(
        new Request("http://localhost:3000/api/regions/uuid-3"),
        { params: Promise.resolve({ id: "uuid-3" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});
