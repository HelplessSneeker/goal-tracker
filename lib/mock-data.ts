import { Goal, Region, Task } from "./types";

export const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Learn Next.js",
    description: "Master Next.js 15 with App Router and Server Components",
  },
  {
    id: "3",
    title: "Improve TypeScript Skills",
    description: "Become proficient in advanced TypeScript patterns",
  },
  {
    id: "2",
    title: "Build Goal Tracker",
    description: "Create a full-featured goal tracking application",
  },
];

export const mockRegions: Region[] = [
  {
    id: "1",
    goalId: "1",
    title: "Study Server Components",
    description: "Understand the difference between Server and Client Components",
  },
  {
    id: "2",
    goalId: "1",
    title: "Learn Server Actions",
    description: "Implement form handling with Server Actions",
  },
  {
    id: "3",
    goalId: "2",
    title: "Design UI Components",
    description: "Create reusable UI components with shadcn/ui",
  },
  {
    id: "4",
    goalId: "2",
    title: "Implement CRUD Operations",
    description: "Add create, read, update, and delete functionality for goals",
  },
  {
    id: "5",
    goalId: "3",
    title: "Learn Generics",
    description: "Master TypeScript generics and type constraints",
  },
];

export const mockTasks: Task[] = [
  {
    id: "1",
    regionId: "1",
    title: "Build 3 projects using Server Components",
    description: "Create practical projects to practice Server Components",
    deadline: "2025-10-31T00:00:00.000Z",
    status: "active",
    createdAt: "2025-10-01T10:00:00.000Z",
  },
  {
    id: "2",
    regionId: "1",
    title: "Study RSC rendering lifecycle",
    description: "Deep dive into React Server Components rendering",
    deadline: "2025-10-25T00:00:00.000Z",
    status: "active",
    createdAt: "2025-10-02T10:00:00.000Z",
  },
  {
    id: "3",
    regionId: "2",
    title: "Implement form with Server Actions",
    description: "Build a complete form using Server Actions for mutations",
    deadline: "2025-11-15T00:00:00.000Z",
    status: "active",
    createdAt: "2025-10-03T10:00:00.000Z",
  },
  {
    id: "4",
    regionId: "3",
    title: "Setup shadcn/ui component library",
    description: "Install and configure shadcn/ui in the project",
    deadline: "2025-10-20T00:00:00.000Z",
    status: "completed",
    createdAt: "2025-10-04T10:00:00.000Z",
  },
  {
    id: "5",
    regionId: "4",
    title: "Implement Task CRUD operations",
    description: "Add create, read, update, delete for tasks with TDD",
    deadline: "2025-10-18T00:00:00.000Z",
    status: "active",
    createdAt: "2025-10-05T10:00:00.000Z",
  },
];
