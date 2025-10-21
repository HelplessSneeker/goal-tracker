import {
  Goal as PrismaGoal,
  Region as PrismaRegion,
  Task as PrismaTask,
} from "@/generated/prisma/client";

// API response types - Prisma Date objects are serialized to ISO strings in JSON
export type Goal = Omit<PrismaGoal, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

export type Region = Omit<PrismaRegion, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

export type Task = Omit<PrismaTask, "createdAt" | "updatedAt" | "deadline"> & {
  deadline: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt?: string;
};
