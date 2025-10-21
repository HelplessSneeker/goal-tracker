import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (in reverse order to respect foreign keys)
  console.log("🗑️  Clearing existing data...");
  await prisma.task.deleteMany();
  await prisma.region.deleteMany();
  await prisma.goal.deleteMany();

  // Seed Goals
  console.log("📝 Seeding goals...");
  const goal1 = await prisma.goal.create({
    data: {
      title: "Learn Next.js",
      description: "Master Next.js 15 with App Router and Server Components",
      userId: 1, // Placeholder user ID
    },
  });

  const goal2 = await prisma.goal.create({
    data: {
      title: "Build Goal Tracker",
      description: "Create a full-featured goal tracking application",
      userId: 1,
    },
  });

  const goal3 = await prisma.goal.create({
    data: {
      title: "Improve TypeScript Skills",
      description: "Become proficient in advanced TypeScript patterns",
      userId: 1,
    },
  });

  // Seed Regions
  console.log("🗂️  Seeding regions...");
  const region1 = await prisma.region.create({
    data: {
      goalId: goal1.id,
      title: "Study Server Components",
      description:
        "Understand the difference between Server and Client Components",
      userId: 1,
    },
  });

  const region2 = await prisma.region.create({
    data: {
      goalId: goal1.id,
      title: "Learn Server Actions",
      description: "Implement form handling with Server Actions",
      userId: 1,
    },
  });

  const region3 = await prisma.region.create({
    data: {
      goalId: goal2.id,
      title: "Design UI Components",
      description: "Create reusable UI components with shadcn/ui",
      userId: 1,
    },
  });

  const region4 = await prisma.region.create({
    data: {
      goalId: goal2.id,
      title: "Implement CRUD Operations",
      description:
        "Add create, read, update, and delete functionality for goals",
      userId: 1,
    },
  });

  const region5 = await prisma.region.create({
    data: {
      goalId: goal3.id,
      title: "Learn Generics",
      description: "Master TypeScript generics and type constraints",
      userId: 1,
    },
  });

  // Seed Tasks
  console.log("✅ Seeding tasks...");
  await prisma.task.create({
    data: {
      regionId: region1.id,
      title: "Build 3 projects using Server Components",
      description: "Create practical projects to practice Server Components",
      deadline: new Date("2025-10-31T00:00:00.000Z"),
      status: "active",
      createdAt: new Date("2025-10-01T10:00:00.000Z"),
      userId: 1,
    },
  });

  await prisma.task.create({
    data: {
      regionId: region1.id,
      title: "Study RSC rendering lifecycle",
      description: "Deep dive into React Server Components rendering",
      deadline: new Date("2025-10-25T00:00:00.000Z"),
      status: "active",
      createdAt: new Date("2025-10-02T10:00:00.000Z"),
      userId: 1,
    },
  });

  await prisma.task.create({
    data: {
      regionId: region2.id,
      title: "Implement form with Server Actions",
      description: "Build a complete form using Server Actions for mutations",
      deadline: new Date("2025-11-15T00:00:00.000Z"),
      status: "active",
      createdAt: new Date("2025-10-03T10:00:00.000Z"),
      userId: 1,
    },
  });

  await prisma.task.create({
    data: {
      regionId: region3.id,
      title: "Setup shadcn/ui component library",
      description: "Install and configure shadcn/ui in the project",
      deadline: new Date("2025-10-20T00:00:00.000Z"),
      status: "completed",
      createdAt: new Date("2025-10-04T10:00:00.000Z"),
      userId: 1,
    },
  });

  await prisma.task.create({
    data: {
      regionId: region4.id,
      title: "Implement Task CRUD operations",
      description: "Add create, read, update, delete for tasks with TDD",
      deadline: new Date("2025-10-18T00:00:00.000Z"),
      status: "active",
      createdAt: new Date("2025-10-05T10:00:00.000Z"),
      userId: 1,
    },
  });

  console.log("✨ Database seeded successfully!");
  console.log(`Created ${await prisma.goal.count()} goals`);
  console.log(`Created ${await prisma.region.count()} regions`);
  console.log(`Created ${await prisma.task.count()} tasks`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
