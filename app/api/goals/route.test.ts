/**
 * @jest-environment node
 */
import { GET, POST } from "./route";
import { mockGoals } from "@/lib/mock-data";

describe("Goals API - /api/goals", () => {
  describe("GET /api/goals", () => {
    it("should return all goals", async () => {
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    });

    it("should return goals with correct structure", async () => {
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
    beforeEach(() => {
      // Clear the mock goals array to ensure clean state
      mockGoals.length = 0;
      mockGoals.push(
        { id: "1", title: "Test Goal 1", description: "Description 1" },
        { id: "2", title: "Test Goal 2", description: "Description 2" },
      );
    });

    it("should create a new goal with valid data", async () => {
      const newGoal = {
        title: "Learn Next.js",
        description: "Master Next.js 15 and App Router",
      };

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
      expect(data).toMatchObject(newGoal);
      expect(data.id).toBeDefined();
      expect(typeof data.id).toBe("string");
    });

    it("should add the goal to mockGoals array", async () => {
      const initialLength = mockGoals.length;

      const newGoal = {
        title: "New Goal",
        description: "New Description",
      };

      const request = new Request("http://localhost:3000/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGoal),
      });

      await POST(request);

      expect(mockGoals.length).toBe(initialLength + 1);
      expect(mockGoals[mockGoals.length - 1].title).toBe("New Goal");
    });

    it("should handle special characters in title and description", async () => {
      const newGoal = {
        title: 'Learn "Advanced" React & TypeScript',
        description: "Master <components> with special chars: @#$%",
      };

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
