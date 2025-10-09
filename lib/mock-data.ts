import { Goal, Subgoal } from "./types";

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

export const mockSubgoals: Subgoal[] = [
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
