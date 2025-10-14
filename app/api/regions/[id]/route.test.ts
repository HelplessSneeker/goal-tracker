/**
 * @jest-environment node
 */
import { GET, PUT, DELETE } from "./route";
import { mockRegions } from "@/lib/mock-data";

describe("Regions API - /api/regions/[id]", () => {
  beforeEach(() => {
    // Reset mock data before each test
    mockRegions.length = 0;
    mockRegions.push(
      { id: "1", goalId: "goal-1", title: "Region 1", description: "Desc 1" },
      { id: "2", goalId: "goal-1", title: "Region 2", description: "Desc 2" },
      { id: "3", goalId: "goal-2", title: "Region 3", description: "Desc 3" },
    );
  });

  describe("GET /api/regions/[id]", () => {
    it("should return a region when it exists", async () => {
      const response = await GET(
        new Request("http://localhost:3000/api/regions/1"),
        { params: Promise.resolve({ id: "1" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        id: "1",
        goalId: "goal-1",
        title: "Region 1",
        description: "Desc 1",
      });
    });

    it("should return 404 when region does not exist", async () => {
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
      const response = await GET(
        new Request("http://localhost:3000/api/regions/2"),
        { params: Promise.resolve({ id: "2" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe("2");
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

      const request = new Request("http://localhost:3000/api/regions/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const response = await PUT(request, {
        params: Promise.resolve({ id: "1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe("1");
      expect(data.title).toBe("Updated Region Title");
      expect(data.description).toBe("Updated description");
      expect(data.goalId).toBe("goal-1"); // Should preserve goalId
    });

    it("should persist updates in mockRegions array", async () => {
      const updates = {
        title: "Persisted Update",
        description: "This should persist",
      };

      const request = new Request("http://localhost:3000/api/regions/2", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      await PUT(request, { params: Promise.resolve({ id: "2" }) });

      const updatedRegion = mockRegions.find((r) => r.id === "2");
      expect(updatedRegion?.title).toBe("Persisted Update");
      expect(updatedRegion?.description).toBe("This should persist");
    });

    it("should return 404 when updating non-existent region", async () => {
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

      const request = new Request("http://localhost:3000/api/regions/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const response = await PUT(request, {
        params: Promise.resolve({ id: "1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.goalId).toBe("goal-3");
    });

    it("should allow partial updates", async () => {
      const titleOnlyUpdate = {
        title: "Only Title Updated",
      };

      const request = new Request("http://localhost:3000/api/regions/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(titleOnlyUpdate),
      });

      const response = await PUT(request, {
        params: Promise.resolve({ id: "1" }),
      });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe("Only Title Updated");
      expect(data.description).toBe("Desc 1"); // Should preserve original
    });
  });

  describe("DELETE /api/regions/[id]", () => {
    it("should delete an existing region", async () => {
      const initialLength = mockRegions.length;

      const response = await DELETE(
        new Request("http://localhost:3000/api/regions/1"),
        { params: Promise.resolve({ id: "1" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockRegions.length).toBe(initialLength - 1);
      expect(mockRegions.find((r) => r.id === "1")).toBeUndefined();
    });

    it("should return 404 when deleting non-existent region", async () => {
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
      await DELETE(new Request("http://localhost:3000/api/regions/2"), {
        params: Promise.resolve({ id: "2" }),
      });

      expect(mockRegions.find((r) => r.id === "1")).toBeDefined();
      expect(mockRegions.find((r) => r.id === "3")).toBeDefined();
      expect(mockRegions.find((r) => r.id === "2")).toBeUndefined();
    });

    it("should delete regions from specific goal without affecting other goals", async () => {
      // Delete a region from goal-1
      await DELETE(new Request("http://localhost:3000/api/regions/1"), {
        params: Promise.resolve({ id: "1" }),
      });

      // Regions from goal-2 should still exist
      const goal2Regions = mockRegions.filter((r) => r.goalId === "goal-2");
      expect(goal2Regions.length).toBe(1);
    });

    it("should handle deleting the last region", async () => {
      // Delete all but one
      await DELETE(new Request("http://localhost:3000/api/regions/1"), {
        params: Promise.resolve({ id: "1" }),
      });
      await DELETE(new Request("http://localhost:3000/api/regions/2"), {
        params: Promise.resolve({ id: "2" }),
      });

      expect(mockRegions.length).toBe(1);

      const response = await DELETE(
        new Request("http://localhost:3000/api/regions/3"),
        { params: Promise.resolve({ id: "3" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockRegions.length).toBe(0);
    });
  });
});
