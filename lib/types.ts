import {
  Goal as PrismaGoal,
  Region as PrismaRegion,
  Task as PrismaTask,
} from "@/generated/prisma/client";

// API response types - Accepts both Prisma Date objects (server-side) and ISO strings (client-side after serialization)
export type Goal = Omit<PrismaGoal, "createdAt" | "updatedAt" | "description"> & {
  description: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type Region = Omit<PrismaRegion, "createdAt" | "updatedAt" | "description"> & {
  description: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type Task = Omit<PrismaTask, "createdAt" | "updatedAt" | "deadline" | "description"> & {
  description: string | null;
  deadline: string | Date;
  createdAt: string | Date;
  updatedAt?: string | Date;
};
