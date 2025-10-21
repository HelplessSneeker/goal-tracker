/**
 * @jest-environment node
 */
import { GET, POST } from "./route";
import prisma from "@/lib/prisma";

// Type the mocked prisma
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("Goals API - /api/goals", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/goals", () => {
    it("should return all goals", async () => {
      const mockGoalsData = [
        { id: "1", title: "Test Goal 1", description: "Description 1", userId: 0, createdAt: new Date(), updatedAt: new Date() },
        { id: "2", title: "Test Goal 2", description: "Description 2", userId: 0, createdAt: new Date(), updatedAt: new Date() },
      ];

      mockPrisma.goal.findMany.mockResolvedValue(mockGoalsData);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);
      expect(mockPrisma.goal.findMany).toHaveBeenCalledTimes(1);
    });

    it("should return goals with correct structure", async () => {
      const mockGoalsData = [
        { id: "uuid-1", title: "Test Goal", description: "Test Description", userId: 0, createdAt: new Date(), updatedAt: new Date() },
      ];

      mockPrisma.goal.findMany.mockResolvedValue(mockGoalsData);

      const response = await GET();
      const data = await response.json();

      const firstGoal = data[0];
      expect(firstGoal).toHaveProperty("id");
      expect(firstGoal).toHaveProperty("title");
      expect(firstGoal).toHaveProperty("description");
      expect(typeof firstGoal.id).toBe("string");
      expect(typeof firstGoal.title).toBe("string");
      expect(typeof firstGoal.description).toBe("string");
    });
  });

  describe("POST /api/goals", () => {
    it("should create a new goal with valid data", async () => {
      const newGoal = {
        title: "Learn Next.js",
        description: "Master Next.js 15 and App Router",
      };

      const createdGoal = {
        id: "uuid-new",
        title: newGoal.title,
        description: newGoal.description,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.goal.create.mockResolvedValue(createdGoal);

      const request = new Request("http://localhost:3000/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGoal),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.title).toBe(newGoal.title);
      expect(data.description).toBe(newGoal.description);
      expect(data.id).toBeDefined();
      expect(typeof data.id).toBe("string");
      expect(mockPrisma.goal.create).toHaveBeenCalledWith({
        data: {
          title: newGoal.title,
          description: newGoal.description,
          userId: 0,
        },
      });
    });

    it("should add the goal to database via Prisma", async () => {
      const newGoal = {
        title: "New Goal",
        description: "New Description",
      };

      const createdGoal = {
        id: "uuid-new-2",
        title: newGoal.title,
        description: newGoal.description,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.goal.create.mockResolvedValue(createdGoal);

      const request = new Request("http://localhost:3000/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGoal),
      });

      await POST(request);

      expect(mockPrisma.goal.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.goal.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: "New Goal",
          description: "New Description",
        }),
      });
    });

    it("should handle special characters in title and description", async () => {
      const newGoal = {
        title: 'Learn "Advanced" React & TypeScript',
        description: "Master <components> with special chars: @#$%",
      };

      const createdGoal = {
        id: "uuid-special",
        title: newGoal.title,
        description: newGoal.description,
        userId: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.goal.create.mockResolvedValue(createdGoal);

      const request = new Request("http://localhost:3000/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGoal),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.title).toBe(newGoal.title);
      expect(data.description).toBe(newGoal.description);
    });
  });
});
