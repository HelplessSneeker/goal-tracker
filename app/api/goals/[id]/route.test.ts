/**
 * @jest-environment node
 */
import { GET, PUT, DELETE } from "./route";
import { mockGoals } from "@/lib/mock-data";

describe("Goals API - /api/goals/[id]", () => {
  beforeEach(() => {
    // Reset mock data before each test
    mockGoals.length = 0;
    mockGoals.push(
      { id: "1", title: "Test Goal 1", description: "Description 1" },
      { id: "2", title: "Test Goal 2", description: "Description 2" },
      { id: "3", title: "Test Goal 3", description: "Description 3" },
    );
  });

  describe("GET /api/goals/[id]", () => {
    it("should return a goal when it exists", async () => {
      const response = await GET(
        new Request("http://localhost:3000/api/goals/1"),
        { params: Promise.resolve({ id: "1" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        id: "1",
        title: "Test Goal 1",
        description: "Description 1",
      });
    });

    it("should return 404 when goal does not exist", async () => {
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
      const response = await GET(
        new Request("http://localhost:3000/api/goals/2"),
        { params: Promise.resolve({ id: "2" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe("2");
      expect(data.title).toBe("Test Goal 2");
    });
  });

  describe("PUT /api/goals/[id]", () => {
    it("should update an existing goal", async () => {
      const updates = {
        title: "Updated Title",
        description: "Updated Description",
      };

      const request = new Request("http://localhost:3000/api/goals/1", {
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
      expect(data.title).toBe("Updated Title");
      expect(data.description).toBe("Updated Description");
    });

    it("should persist updates in mockGoals array", async () => {
      const updates = {
        title: "Persisted Update",
        description: "This should persist",
      };

      const request = new Request("http://localhost:3000/api/goals/2", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      await PUT(request, { params: Promise.resolve({ id: "2" }) });

      const updatedGoal = mockGoals.find((g) => g.id === "2");
      expect(updatedGoal?.title).toBe("Persisted Update");
      expect(updatedGoal?.description).toBe("This should persist");
    });

    it("should return 404 when updating non-existent goal", async () => {
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
        description: "Description 1", // keeping original
      };

      const request = new Request("http://localhost:3000/api/goals/1", {
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
    });
  });

  describe("DELETE /api/goals/[id]", () => {
    it("should delete an existing goal", async () => {
      const initialLength = mockGoals.length;

      const response = await DELETE(
        new Request("http://localhost:3000/api/goals/1"),
        { params: Promise.resolve({ id: "1" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockGoals.length).toBe(initialLength - 1);
      expect(mockGoals.find((g) => g.id === "1")).toBeUndefined();
    });

    it("should return 404 when deleting non-existent goal", async () => {
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
      await DELETE(new Request("http://localhost:3000/api/goals/2"), {
        params: Promise.resolve({ id: "2" }),
      });

      expect(mockGoals.find((g) => g.id === "1")).toBeDefined();
      expect(mockGoals.find((g) => g.id === "3")).toBeDefined();
      expect(mockGoals.find((g) => g.id === "2")).toBeUndefined();
    });

    it("should handle deleting the last goal", async () => {
      // Delete all but one
      await DELETE(new Request("http://localhost:3000/api/goals/1"), {
        params: Promise.resolve({ id: "1" }),
      });
      await DELETE(new Request("http://localhost:3000/api/goals/2"), {
        params: Promise.resolve({ id: "2" }),
      });

      expect(mockGoals.length).toBe(1);

      const response = await DELETE(
        new Request("http://localhost:3000/api/goals/3"),
        { params: Promise.resolve({ id: "3" }) },
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockGoals.length).toBe(0);
    });
  });
});
