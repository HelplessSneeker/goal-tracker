/**
 * @jest-environment node
 */
import { GET, POST } from "./route";
import { mockRegions } from "@/lib/mock-data";

describe("Regions API - /api/regions", () => {
  beforeEach(() => {
    // Reset mock data before each test
    mockRegions.length = 0;
    mockRegions.push(
      { id: "1", goalId: "goal-1", title: "Region 1", description: "Desc 1" },
      { id: "2", goalId: "goal-1", title: "Region 2", description: "Desc 2" },
      { id: "3", goalId: "goal-2", title: "Region 3", description: "Desc 3" },
    );
  });

  describe("GET /api/regions", () => {
    it("should return all regions when no goalId filter is provided", async () => {
      const request = new Request("http://localhost:3000/api/regions");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(3);
    });

    it("should filter regions by goalId when provided", async () => {
      const request = new Request(
        "http://localhost:3000/api/regions?goalId=goal-1",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);
      expect(data.every((r: any) => r.goalId === "goal-1")).toBe(true);
    });

    it("should return empty array when goalId has no regions", async () => {
      const request = new Request(
        "http://localhost:3000/api/regions?goalId=nonexistent",
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });

    it("should return regions with correct structure", async () => {
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
      expect(data).toMatchObject(newRegion);
      expect(data.id).toBeDefined();
      expect(typeof data.id).toBe("string");
    });

    it("should add the region to mockRegions array", async () => {
      const initialLength = mockRegions.length;

      const newRegion = {
        goalId: "goal-2",
        title: "Another Region",
        description: "Description here",
      };

      const request = new Request("http://localhost:3000/api/regions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRegion),
      });

      await POST(request);

      expect(mockRegions.length).toBe(initialLength + 1);
      expect(mockRegions[mockRegions.length - 1].title).toBe("Another Region");
      expect(mockRegions[mockRegions.length - 1].goalId).toBe("goal-2");
    });

    it("should handle special characters in title and description", async () => {
      const newRegion = {
        goalId: "goal-1",
        title: 'Region with "quotes" & special chars',
        description: "Description with <tags> and @symbols",
      };

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
