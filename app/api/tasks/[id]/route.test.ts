/**
 * @jest-environment node
 */
import { GET, PUT, DELETE } from "./route";
import { mockTasks } from "@/lib/mock-data";

describe("Tasks API - /api/tasks/[id]", () => {
  beforeEach(() => {
    // Reset mock data before each test
    mockTasks.length = 0;
    mockTasks.push(
      {
        id: "1",
        regionId: "region-1",
        title: "Task 1",
        description: "Description 1",
        deadline: "2025-10-31T00:00:00.000Z",
        status: "active",
        createdAt: "2025-10-01T10:00:00.000Z",
      },
      {
        id: "2",
        regionId: "region-1",
        title: "Task 2",
        description: "Description 2",
        deadline: "2025-11-15T00:00:00.000Z",
        status: "completed",
        createdAt: "2025-10-02T10:00:00.000Z",
      }
    );
  });

  describe("GET /api/tasks/[id]", () => {
    it("should return existing task", async () => {
      const request = new Request("http://localhost:3000/api/tasks/1");
      const response = await GET(request, { params: Promise.resolve({ id: "1" }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toMatchObject({
        id: "1",
        regionId: "region-1",
        title: "Task 1",
        description: "Description 1",
        deadline: "2025-10-31T00:00:00.000Z",
        status: "active",
      });
    });

    it("should return 404 for non-existent task", async () => {
      const request = new Request("http://localhost:3000/api/tasks/999");
      const response = await GET(request, { params: Promise.resolve({ id: "999" }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Task not found");
    });
  });

  describe("PUT /api/tasks/[id]", () => {
    it("should update existing task", async () => {
      const updatedTask = {
        title: "Updated Task",
        description: "Updated description",
        deadline: "2025-12-01T00:00:00.000Z",
        status: "completed",
      };

      const request = new Request("http://localhost:3000/api/tasks/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      const response = await PUT(request, { params: Promise.resolve({ id: "1" }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe("Updated Task");
      expect(data.description).toBe("Updated description");
      expect(data.deadline).toBe("2025-12-01T00:00:00.000Z");
      expect(data.status).toBe("completed");
    });

    it("should persist updates across calls", async () => {
      const updatedTask = {
        title: "Persisted Update",
        description: "This should persist",
        deadline: "2025-12-15T00:00:00.000Z",
      };

      const updateRequest = new Request("http://localhost:3000/api/tasks/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      await PUT(updateRequest, { params: Promise.resolve({ id: "1" }) });

      // Verify with GET request
      const getRequest = new Request("http://localhost:3000/api/tasks/1");
      const response = await GET(getRequest, { params: Promise.resolve({ id: "1" }) });
      const data = await response.json();

      expect(data.title).toBe("Persisted Update");
      expect(data.description).toBe("This should persist");
      expect(data.deadline).toBe("2025-12-15T00:00:00.000Z");
    });

    it("should return 404 for non-existent task", async () => {
      const request = new Request("http://localhost:3000/api/tasks/999", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Update" }),
      });

      const response = await PUT(request, { params: Promise.resolve({ id: "999" }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Task not found");
    });

    it("should allow partial updates (title only)", async () => {
      const partialUpdate = {
        title: "Only Title Updated",
      };

      const request = new Request("http://localhost:3000/api/tasks/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partialUpdate),
      });

      const response = await PUT(request, { params: Promise.resolve({ id: "1" }) });
      const data = await response.json();

      expect(data.title).toBe("Only Title Updated");
      expect(data.description).toBe("Description 1"); // Original description preserved
      expect(data.regionId).toBe("region-1"); // Original regionId preserved
    });

    it("should allow updating deadline", async () => {
      const newDeadline = "2026-01-15T00:00:00.000Z";

      const request = new Request("http://localhost:3000/api/tasks/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deadline: newDeadline }),
      });

      const response = await PUT(request, { params: Promise.resolve({ id: "1" }) });
      const data = await response.json();

      expect(data.deadline).toBe(newDeadline);
    });

    it("should allow updating status", async () => {
      const request = new Request("http://localhost:3000/api/tasks/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      const response = await PUT(request, { params: Promise.resolve({ id: "1" }) });
      const data = await response.json();

      expect(data.status).toBe("completed");
      expect(data.title).toBe("Task 1"); // Other fields preserved
    });
  });

  describe("DELETE /api/tasks/[id]", () => {
    it("should delete existing task", async () => {
      const request = new Request("http://localhost:3000/api/tasks/1", {
        method: "DELETE",
      });

      const response = await DELETE(request, { params: Promise.resolve({ id: "1" }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockTasks.find((t) => t.id === "1")).toBeUndefined();
      expect(mockTasks.length).toBe(1); // One task remaining
    });

    it("should return 404 for non-existent task", async () => {
      const request = new Request("http://localhost:3000/api/tasks/999", {
        method: "DELETE",
      });

      const response = await DELETE(request, { params: Promise.resolve({ id: "999" }) });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Task not found");
    });

    it("should not affect other tasks (isolation)", async () => {
      const request = new Request("http://localhost:3000/api/tasks/1", {
        method: "DELETE",
      });

      await DELETE(request, { params: Promise.resolve({ id: "1" }) });

      // Verify task 2 is still there
      expect(mockTasks.find((t) => t.id === "2")).toBeDefined();
      expect(mockTasks.find((t) => t.id === "2")?.title).toBe("Task 2");
    });

    it("should handle deleting last task", async () => {
      // Delete first task
      const request1 = new Request("http://localhost:3000/api/tasks/1", {
        method: "DELETE",
      });
      await DELETE(request1, { params: Promise.resolve({ id: "1" }) });

      // Delete second (last) task
      const request2 = new Request("http://localhost:3000/api/tasks/2", {
        method: "DELETE",
      });
      const response = await DELETE(request2, { params: Promise.resolve({ id: "2" }) });

      expect(response.status).toBe(200);
      expect(mockTasks.length).toBe(0);
    });
  });
});
