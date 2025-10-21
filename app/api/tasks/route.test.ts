/**
 * @jest-environment node
 */
import { GET, POST } from "./route";
import prisma from "@/lib/prisma";

// Type the mocked prisma
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("Tasks API - /api/tasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/tasks", () => {
    it("should return all tasks when no regionId filter is provided", async () => {
      const mockTasksData = [
        {
          id: "1",
          regionId: "region-1",
          title: "Task 1",
          description: "Description 1",
          deadline: new Date("2025-10-31T00:00:00.000Z"),
          status: "active" as const,
          userId: 0,
          createdAt: new Date("2025-10-01T10:00:00.000Z"),
          updatedAt: new Date(),
        },
        {
          id: "2",
          regionId: "region-1",
          title: "Task 2",
          description: "Description 2",
          deadline: new Date("2025-11-15T00:00:00.000Z"),
          status: "active" as const,
          userId: 0,
          createdAt: new Date("2025-10-02T10:00:00.000Z"),
          updatedAt: new Date(),
        },
        {
          id: "3",
          regionId: "region-2",
          title: "Task 3",
          description: "Description 3",
          deadline: new Date("2025-10-25T00:00:00.000Z"),
          status: "completed" as const,
          userId: 0,
          createdAt: new Date("2025-10-03T10:00:00.000Z"),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.task.findMany.mockResolvedValue(mockTasksData);

      const request = new Request("http://localhost:3000/api/tasks");
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(3);
      expect(mockPrisma.task.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({});
    });

    it("should filter tasks by regionId when provided", async () => {
      const mockTasksData = [
        {
          id: "1",
          regionId: "region-1",
          title: "Task 1",
          description: "Description 1",
          deadline: new Date("2025-10-31T00:00:00.000Z"),
          status: "active" as const,
          userId: 0,
          createdAt: new Date("2025-10-01T10:00:00.000Z"),
          updatedAt: new Date(),
        },
        {
          id: "2",
          regionId: "region-1",
          title: "Task 2",
          description: "Description 2",
          deadline: new Date("2025-11-15T00:00:00.000Z"),
          status: "active" as const,
          userId: 0,
          createdAt: new Date("2025-10-02T10:00:00.000Z"),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.task.findMany.mockResolvedValue(mockTasksData);

      const request = new Request(
        "http://localhost:3000/api/tasks?regionId=region-1"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);
      expect(data.every((t: any) => t.regionId === "region-1")).toBe(true);
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: { regionId: "region-1" },
      });
    });

    it("should return empty array when regionId has no tasks", async () => {
      mockPrisma.task.findMany.mockResolvedValue([]);

      const request = new Request(
        "http://localhost:3000/api/tasks?regionId=nonexistent"
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        where: { regionId: "nonexistent" },
      });
    });

    it("should return tasks with correct structure", async () => {
      const mockTasksData = [
        {
          id: "uuid-1",
          regionId: "region-1",
          title: "Task 1",
          description: "Description 1",
          deadline: new Date("2025-10-31T00:00:00.000Z"),
          status: "active" as const,
          userId: 0,
          createdAt: new Date("2025-10-01T10:00:00.000Z"),
          updatedAt: new Date(),
        },
      ];

      mockPrisma.task.findMany.mockResolvedValue(mockTasksData);

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

      const createdTask = {
        id: "uuid-new",
        regionId: newTask.regionId,
        title: newTask.title,
        description: newTask.description,
        deadline: new Date(newTask.deadline),
        status: "active" as const,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.task.create.mockResolvedValue(createdTask);

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

    it("should add the task to database via Prisma", async () => {
      const newTask = {
        regionId: "region-2",
        title: "Another Task",
        description: "Description here",
        deadline: "2025-11-30T00:00:00.000Z",
      };

      const createdTask = {
        id: "uuid-new-2",
        regionId: newTask.regionId,
        title: newTask.title,
        description: newTask.description,
        deadline: new Date(newTask.deadline),
        status: "active" as const,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.task.create.mockResolvedValue(createdTask);

      const request = new Request("http://localhost:3000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      await POST(request);

      expect(mockPrisma.task.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          regionId: "region-2",
          title: "Another Task",
          description: "Description here",
          deadline: expect.any(Date),
          status: "active",
        }),
      });
    });

    it("should handle special characters in title and description", async () => {
      const newTask = {
        regionId: "region-1",
        title: 'Task with "quotes" & special chars',
        description: "Description with <tags> and @symbols",
        deadline: "2025-12-15T00:00:00.000Z",
      };

      const createdTask = {
        id: "uuid-special",
        regionId: newTask.regionId,
        title: newTask.title,
        description: newTask.description,
        deadline: new Date(newTask.deadline),
        status: "active" as const,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.task.create.mockResolvedValue(createdTask);

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

      const createdTask1 = {
        id: "uuid-1",
        regionId: task1.regionId,
        title: task1.title,
        description: task1.description,
        deadline: new Date(task1.deadline),
        status: "active" as const,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createdTask2 = {
        id: "uuid-2",
        regionId: task2.regionId,
        title: task2.title,
        description: task2.description,
        deadline: new Date(task2.deadline),
        status: "active" as const,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.task.create
        .mockResolvedValueOnce(createdTask1)
        .mockResolvedValueOnce(createdTask2);

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

      const createdTask1 = {
        id: "uuid-task-1",
        regionId: task1.regionId,
        title: task1.title,
        description: task1.description,
        deadline: new Date(task1.deadline),
        status: "active" as const,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const createdTask2 = {
        id: "uuid-task-2",
        regionId: task2.regionId,
        title: task2.title,
        description: task2.description,
        deadline: new Date(task2.deadline),
        status: "active" as const,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.task.create
        .mockResolvedValueOnce(createdTask1)
        .mockResolvedValueOnce(createdTask2);

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
