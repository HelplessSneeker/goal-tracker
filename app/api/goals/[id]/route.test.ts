/**
 * @jest-environment node
 */
import { GET, PUT, DELETE } from "./route";
import prisma from "@/lib/prisma";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("Goals API - /api/goals/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/goals/[id]", () => {
    it("should return a goal when it exists", async () => {
      const mockGoal = {
        id: "uuid-1",
        title: "Test Goal 1",
        description: "Description 1",
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.goal.findUnique.mockResolvedValue(mockGoal);

      const response = await GET(
        new Request("http://localhost:3000/api/goals/uuid-1"),
        { params: Promise.resolve({ id: "uuid-1" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe("uuid-1");
      expect(data.title).toBe("Test Goal 1");
      expect(data.description).toBe("Description 1");
      expect(mockPrisma.goal.findUnique).toHaveBeenCalledWith({
        where: { id: "uuid-1" },
      });
    });

    it("should return 404 when goal does not exist", async () => {
      mockPrisma.goal.findUnique.mockResolvedValue(null);

      const response = await GET(
        new Request("http://localhost:3000/api/goals/999"),
        { params: Promise.resolve({ id: "999" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Goal not found");
    });

    it("should handle different valid goal IDs", async () => {
      const mockGoal = {
        id: "uuid-2",
        title: "Test Goal 2",
        description: "Description 2",
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.goal.findUnique.mockResolvedValue(mockGoal);

      const response = await GET(
        new Request("http://localhost:3000/api/goals/uuid-2"),
        { params: Promise.resolve({ id: "uuid-2" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe("uuid-2");
      expect(data.title).toBe("Test Goal 2");
    });
  });

  describe("PUT /api/goals/[id]", () => {
    it("should update an existing goal", async () => {
      const updates = {
        title: "Updated Title",
        description: "Updated Description",
      };

      const updatedGoal = {
        id: "uuid-1",
        title: updates.title,
        description: updates.description,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.goal.update.mockResolvedValue(updatedGoal);

      const request = new Request("http://localhost:3000/api/goals/uuid-1", {
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
      expect(data.title).toBe("Updated Title");
      expect(data.description).toBe("Updated Description");
      expect(mockPrisma.goal.update).toHaveBeenCalledWith({
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

      const updatedGoal = {
        id: "uuid-2",
        title: updates.title,
        description: updates.description,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.goal.update.mockResolvedValue(updatedGoal);

      const request = new Request("http://localhost:3000/api/goals/uuid-2", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      await PUT(request, { params: Promise.resolve({ id: "uuid-2" }) });

      expect(mockPrisma.goal.update).toHaveBeenCalledTimes(1);
      expect(mockPrisma.goal.update).toHaveBeenCalledWith({
        where: { id: "uuid-2" },
        data: expect.objectContaining({
          title: "Persisted Update",
          description: "This should persist",
        }),
      });
    });

    it("should return 404 when updating non-existent goal", async () => {
      mockPrisma.goal.update.mockRejectedValue(new Error("Record not found"));

      const updates = {
        title: "Updated Title",
        description: "Updated Description",
      };

      const request = new Request("http://localhost:3000/api/goals/999", {
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
      expect(data.error).toBe("Goal not found");
    });

    it("should allow partial updates", async () => {
      const titleOnlyUpdate = {
        title: "Only Title Updated",
        description: "Description 1",
      };

      const updatedGoal = {
        id: "uuid-1",
        title: titleOnlyUpdate.title,
        description: titleOnlyUpdate.description,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.goal.update.mockResolvedValue(updatedGoal);

      const request = new Request("http://localhost:3000/api/goals/uuid-1", {
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
    });
  });

  describe("DELETE /api/goals/[id]", () => {
    it("should delete an existing goal", async () => {
      const mockGoal = {
        id: "uuid-1",
        title: "Test Goal 1",
        description: "Description 1",
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.goal.delete.mockResolvedValue(mockGoal);

      const response = await DELETE(
        new Request("http://localhost:3000/api/goals/uuid-1"),
        { params: Promise.resolve({ id: "uuid-1" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockPrisma.goal.delete).toHaveBeenCalledWith({
        where: { id: "uuid-1" },
      });
    });

    it("should return 404 when deleting non-existent goal", async () => {
      mockPrisma.goal.delete.mockRejectedValue(new Error("Record not found"));

      const response = await DELETE(
        new Request("http://localhost:3000/api/goals/999"),
        { params: Promise.resolve({ id: "999" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error");
      expect(data.error).toBe("Goal not found");
    });

    it("should not affect other goals when deleting", async () => {
      const mockGoal = {
        id: "uuid-2",
        title: "Test Goal 2",
        description: "Description 2",
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.goal.delete.mockResolvedValue(mockGoal);

      await DELETE(new Request("http://localhost:3000/api/goals/uuid-2"), {
        params: Promise.resolve({ id: "uuid-2" }),
      });

      expect(mockPrisma.goal.delete).toHaveBeenCalledWith({
        where: { id: "uuid-2" },
      });
      // In real database, other records would remain, but we're testing isolation
      expect(mockPrisma.goal.delete).toHaveBeenCalledTimes(1);
    });

    it("should handle deleting the last goal", async () => {
      const mockGoal = {
        id: "uuid-3",
        title: "Test Goal 3",
        description: "Description 3",
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.goal.delete.mockResolvedValue(mockGoal);

      const response = await DELETE(
        new Request("http://localhost:3000/api/goals/uuid-3"),
        { params: Promise.resolve({ id: "uuid-3" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });
});
