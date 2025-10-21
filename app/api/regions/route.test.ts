/**
 * @jest-environment node
 */
import { GET, POST } from "./route";
import prisma from "@/lib/prisma";

// Type the mocked prisma
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("Regions API - /api/regions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/regions", () => {
    it("should return all regions when no goalId filter is provided", async () => {
      const mockRegionsData = [
        { id: "uuid-1", goalId: "goal-1", title: "Region 1", description: "Desc 1", userId: 0, createdAt: new Date(), updatedAt: new Date() },
        { id: "uuid-2", goalId: "goal-1", title: "Region 2", description: "Desc 2", userId: 0, createdAt: new Date(), updatedAt: new Date() },
        { id: "uuid-3", goalId: "goal-2", title: "Region 3", description: "Desc 3", userId: 0, createdAt: new Date(), updatedAt: new Date() },
      ];

      mockPrisma.region.findMany.mockResolvedValue(mockRegionsData);

      const request = new Request("http://localhost:3000/api/regions");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(3);
      expect(mockPrisma.region.findMany).toHaveBeenCalledWith({});
    });

    it("should filter regions by goalId when provided", async () => {
      const mockRegionsData = [
        { id: "uuid-1", goalId: "goal-1", title: "Region 1", description: "Desc 1", userId: 0, createdAt: new Date(), updatedAt: new Date() },
        { id: "uuid-2", goalId: "goal-1", title: "Region 2", description: "Desc 2", userId: 0, createdAt: new Date(), updatedAt: new Date() },
      ];

      mockPrisma.region.findMany.mockResolvedValue(mockRegionsData);

      const request = new Request(
        "http://localhost:3000/api/regions?goalId=goal-1",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);
      expect(data.every((r: any) => r.goalId === "goal-1")).toBe(true);
      expect(mockPrisma.region.findMany).toHaveBeenCalledWith({
        where: { goalId: "goal-1" },
      });
    });

    it("should return empty array when goalId has no regions", async () => {
      mockPrisma.region.findMany.mockResolvedValue([]);

      const request = new Request(
        "http://localhost:3000/api/regions?goalId=nonexistent",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
      expect(mockPrisma.region.findMany).toHaveBeenCalledWith({
        where: { goalId: "nonexistent" },
      });
    });

    it("should return regions with correct structure", async () => {
      const mockRegionsData = [
        { id: "uuid-1", goalId: "goal-1", title: "Region 1", description: "Desc 1", userId: 0, createdAt: new Date(), updatedAt: new Date() },
      ];

      mockPrisma.region.findMany.mockResolvedValue(mockRegionsData);

      const request = new Request("http://localhost:3000/api/regions");
      const response = await GET(request);
      const data = await response.json();

      const firstRegion = data[0];
      expect(firstRegion).toHaveProperty("id");
      expect(firstRegion).toHaveProperty("goalId");
      expect(firstRegion).toHaveProperty("title");
      expect(firstRegion).toHaveProperty("description");
      expect(typeof firstRegion.id).toBe("string");
      expect(typeof firstRegion.goalId).toBe("string");
      expect(typeof firstRegion.title).toBe("string");
      expect(typeof firstRegion.description).toBe("string");
    });
  });

  describe("POST /api/regions", () => {
    it("should create a new region with valid data", async () => {
      const newRegion = {
        goalId: "goal-1",
        title: "New Region",
        description: "New region description",
      };

      const createdRegion = {
        id: "uuid-new",
        goalId: newRegion.goalId,
        title: newRegion.title,
        description: newRegion.description,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.region.create.mockResolvedValue(createdRegion);

      const request = new Request("http://localhost:3000/api/regions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRegion),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.goalId).toBe(newRegion.goalId);
      expect(data.title).toBe(newRegion.title);
      expect(data.description).toBe(newRegion.description);
      expect(data.id).toBeDefined();
      expect(typeof data.id).toBe("string");
      expect(mockPrisma.region.create).toHaveBeenCalledWith({
        data: {
          goalId: newRegion.goalId,
          title: newRegion.title,
          description: newRegion.description,
          userId: 0,
        },
      });
    });

    it("should add the region to database via Prisma", async () => {
      const newRegion = {
        goalId: "goal-2",
        title: "Another Region",
        description: "Description here",
      };

      const createdRegion = {
        id: "uuid-new-2",
        goalId: newRegion.goalId,
        title: newRegion.title,
        description: newRegion.description,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.region.create.mockResolvedValue(createdRegion);

      const request = new Request("http://localhost:3000/api/regions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRegion),
      });

      await POST(request);

      expect(mockPrisma.region.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.region.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          goalId: "goal-2",
          title: "Another Region",
          description: "Description here",
        }),
      });
    });

    it("should handle special characters in title and description", async () => {
      const newRegion = {
        goalId: "goal-1",
        title: 'Region with "quotes" & special chars',
        description: "Description with <tags> and @symbols",
      };

      const createdRegion = {
        id: "uuid-special",
        goalId: newRegion.goalId,
        title: newRegion.title,
        description: newRegion.description,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.region.create.mockResolvedValue(createdRegion);

      const request = new Request("http://localhost:3000/api/regions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRegion),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.title).toBe(newRegion.title);
      expect(data.description).toBe(newRegion.description);
    });

    it("should create regions for different goals", async () => {
      const region1 = {
        goalId: "goal-1",
        title: "Region for Goal 1",
        description: "Description",
      };

      const region2 = {
        goalId: "goal-3",
        title: "Region for Goal 3",
        description: "Description",
      };

      const createdRegion1 = {
        id: "uuid-region-1",
        goalId: region1.goalId,
        title: region1.title,
        description: region1.description,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createdRegion2 = {
        id: "uuid-region-2",
        goalId: region2.goalId,
        title: region2.title,
        description: region2.description,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.region.create
        .mockResolvedValueOnce(createdRegion1)
        .mockResolvedValueOnce(createdRegion2);

      const request1 = new Request("http://localhost:3000/api/regions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(region1),
      });

      const request2 = new Request("http://localhost:3000/api/regions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(region2),
      });

      const response1 = await POST(request1);
      const response2 = await POST(request2);
      const data1 = await response1.json();
      const data2 = await response2.json();

      expect(data1.goalId).toBe("goal-1");
      expect(data2.goalId).toBe("goal-3");
      expect(data1.id).not.toBe(data2.id);
    });
  });
});
