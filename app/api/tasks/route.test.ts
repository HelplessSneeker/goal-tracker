/**
 * @jest-environment node
 */
import { GET, POST } from "./route";
import { mockTasks } from "@/lib/mock-data";

describe("Tasks API - /api/tasks", () => {
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
        status: "active",
        createdAt: "2025-10-02T10:00:00.000Z",
      },
      {
        id: "3",
        regionId: "region-2",
        title: "Task 3",
        description: "Description 3",
        deadline: "2025-10-25T00:00:00.000Z",
        status: "completed",
        createdAt: "2025-10-03T10:00:00.000Z",
      }
    );
  });

  describe("GET /api/tasks", () => {
    it("should return all tasks when no regionId filter is provided", async () => {
      const request = new Request("http://localhost:3000/api/tasks");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(3);
    });

    it("should filter tasks by regionId when provided", async () => {
      const request = new Request(
        "http://localhost:3000/api/tasks?regionId=region-1"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);
      expect(data.every((t: any) => t.regionId === "region-1")).toBe(true);
    });

    it("should return empty array when regionId has no tasks", async () => {
      const request = new Request(
        "http://localhost:3000/api/tasks?regionId=nonexistent"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });

    it("should return tasks with correct structure", async () => {
      const request = new Request("http://localhost:3000/api/tasks");
      const response = await GET(request);
      const data = await response.json();

      const firstTask = data[0];
      expect(firstTask).toHaveProperty("id");
      expect(firstTask).toHaveProperty("regionId");
      expect(firstTask).toHaveProperty("title");
      expect(firstTask).toHaveProperty("description");
      expect(firstTask).toHaveProperty("deadline");
      expect(firstTask).toHaveProperty("status");
      expect(firstTask).toHaveProperty("createdAt");
      expect(typeof firstTask.id).toBe("string");
      expect(typeof firstTask.regionId).toBe("string");
      expect(typeof firstTask.title).toBe("string");
      expect(typeof firstTask.description).toBe("string");
      expect(typeof firstTask.deadline).toBe("string");
      expect(["active", "completed"]).toContain(firstTask.status);
      expect(typeof firstTask.createdAt).toBe("string");
    });
  });

  describe("POST /api/tasks", () => {
    it("should create a new task with valid data", async () => {
      const newTask = {
        regionId: "region-1",
        title: "New Task",
        description: "New task description",
        deadline: "2025-12-01T00:00:00.000Z",
      };

      const request = new Request("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.regionId).toBe(newTask.regionId);
      expect(data.title).toBe(newTask.title);
      expect(data.description).toBe(newTask.description);
      expect(data.deadline).toBe(newTask.deadline);
      expect(data.id).toBeDefined();
      expect(data.status).toBe("active"); // Default status
      expect(data.createdAt).toBeDefined();
      expect(typeof data.id).toBe("string");
      expect(typeof data.createdAt).toBe("string");
    });

    it("should add the task to mockTasks array", async () => {
      const initialLength = mockTasks.length;

      const newTask = {
        regionId: "region-2",
        title: "Another Task",
        description: "Description here",
        deadline: "2025-11-30T00:00:00.000Z",
      };

      const request = new Request("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      await POST(request);

      expect(mockTasks.length).toBe(initialLength + 1);
      expect(mockTasks[mockTasks.length - 1].title).toBe("Another Task");
      expect(mockTasks[mockTasks.length - 1].regionId).toBe("region-2");
    });

    it("should handle special characters in title and description", async () => {
      const newTask = {
        regionId: "region-1",
        title: 'Task with "quotes" & special chars',
        description: "Description with <tags> and @symbols",
        deadline: "2025-12-15T00:00:00.000Z",
      };

      const request = new Request("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.title).toBe(newTask.title);
      expect(data.description).toBe(newTask.description);
    });

    it("should create tasks for different regions", async () => {
      const task1 = {
        regionId: "region-1",
        title: "Task for Region 1",
        description: "Description",
        deadline: "2025-11-01T00:00:00.000Z",
      };

      const task2 = {
        regionId: "region-3",
        title: "Task for Region 3",
        description: "Description",
        deadline: "2025-11-05T00:00:00.000Z",
      };

      const request1 = new Request("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task1),
      });

      const request2 = new Request("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task2),
      });

      const response1 = await POST(request1);
      const response2 = await POST(request2);
      const data1 = await response1.json();
      const data2 = await response2.json();

      expect(data1.regionId).toBe("region-1");
      expect(data2.regionId).toBe("region-3");
      expect(data1.id).not.toBe(data2.id);
    });

    it("should generate unique IDs for each task", async () => {
      const task1 = {
        regionId: "region-1",
        title: "Task 1",
        description: "Description 1",
        deadline: "2025-11-10T00:00:00.000Z",
      };

      const task2 = {
        regionId: "region-1",
        title: "Task 2",
        description: "Description 2",
        deadline: "2025-11-11T00:00:00.000Z",
      };

      const request1 = new Request("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task1),
      });

      const request2 = new Request("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task2),
      });

      const response1 = await POST(request1);
      const response2 = await POST(request2);
      const data1 = await response1.json();
      const data2 = await response2.json();

      expect(data1.id).not.toBe(data2.id);
    });
  });
});
