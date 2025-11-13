import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// ============================================================================
// DATE HELPER FUNCTIONS
// ============================================================================

/**
 * Get a date N days in the past
 */
function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * Get a date N days in the future
 */
function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

/**
 * Get a random date between min and max days ago
 */
function randomPastDate(minDays: number, maxDays: number): Date {
  const days = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
  return daysAgo(days);
}

// ============================================================================
// USER SEEDING
// ============================================================================

async function seedUsers() {
  console.log("👤 Seeding users...");

  // User 1: Power User (Alice) - English, Light Theme
  const alice = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice Johnson",
      emailVerified: new Date(),
      preferences: {
        create: {
          language: "en",
          theme: "light",
        },
      },
    },
  });

  // User 2: German User (Bob) - German, Dark Theme
  const bob = await prisma.user.create({
    data: {
      email: "bob@example.com",
      name: "Bob Schmidt",
      emailVerified: new Date(),
      preferences: {
        create: {
          language: "de",
          theme: "dark",
        },
      },
    },
  });

  // User 3: New User (Charlie) - No name, System Theme
  const charlie = await prisma.user.create({
    data: {
      email: "charlie@example.com",
      name: null,
      emailVerified: new Date(),
      preferences: {
        create: {
          language: "en",
          theme: "system",
        },
      },
    },
  });

  // User 4: Empty State User (Diana) - No goals
  const diana = await prisma.user.create({
    data: {
      email: "diana@example.com",
      name: "Diana Lee",
      emailVerified: new Date(),
      preferences: {
        create: {
          language: "en",
          theme: "system",
        },
      },
    },
  });

  console.log("✅ Created 4 users");
  return { alice, bob, charlie, diana };
}

// ============================================================================
// GOAL SEEDING
// ============================================================================

async function seedGoalsForAlice(userId: string) {
  console.log("📝 Seeding goals for Alice (Power User)...");

  const goals = [];

  // Goal 1: Learn Next.js (with regions and tasks)
  goals.push(
    await prisma.goal.create({
      data: {
        userId,
        title: "Learn Next.js 15",
        description: "Master Next.js 15 with App Router and Server Components",
        createdAt: randomPastDate(30, 60),
      },
    }),
  );

  // Goal 2: Build Goal Tracker (with regions and tasks)
  goals.push(
    await prisma.goal.create({
      data: {
        userId,
        title: "Build Goal Tracker Application",
        description: "Create a full-featured goal tracking app with TDD",
        createdAt: randomPastDate(25, 50),
      },
    }),
  );

  // Goal 3: Improve TypeScript Skills (with regions and tasks)
  goals.push(
    await prisma.goal.create({
      data: {
        userId,
        title: "Master TypeScript",
        description: "Become proficient in advanced TypeScript patterns",
        createdAt: randomPastDate(20, 40),
      },
    }),
  );

  // Goal 4: Learn React 19 (with regions, no tasks - empty state)
  goals.push(
    await prisma.goal.create({
      data: {
        userId,
        title: "Learn React 19 Features",
        description: "Explore new React 19 features like Server Components",
        createdAt: randomPastDate(15, 30),
      },
    }),
  );

  // Goal 5: Build Portfolio Website (no regions - empty state)
  goals.push(
    await prisma.goal.create({
      data: {
        userId,
        title: "Build Portfolio Website",
        description: null,
        createdAt: randomPastDate(10, 20),
      },
    }),
  );

  // Goal 6: Study System Design
  goals.push(
    await prisma.goal.create({
      data: {
        userId,
        title: "Study System Design Patterns",
        description: "Learn scalable architecture and design patterns",
        createdAt: randomPastDate(5, 15),
      },
    }),
  );

  // Goal 7: Very long title for truncation testing
  goals.push(
    await prisma.goal.create({
      data: {
        userId,
        title:
          "This is an extremely long goal title that should test how the UI handles text truncation and wrapping in various components and layouts",
        description:
          "Testing edge cases is important for robust UI development",
        createdAt: randomPastDate(1, 5),
      },
    }),
  );

  console.log(`✅ Created ${goals.length} goals for Alice`);
  return goals;
}

async function seedGoalsForBob(userId: string) {
  console.log("📝 Seeding goals for Bob (German User)...");

  const goals = [];

  // German-themed goals for i18n testing
  goals.push(
    await prisma.goal.create({
      data: {
        userId,
        title: "Deutsch lernen",
        description: "Meine Deutschkenntnisse verbessern",
        createdAt: randomPastDate(20, 40),
      },
    }),
  );

  goals.push(
    await prisma.goal.create({
      data: {
        userId,
        title: "Karriere entwickeln",
        description: "Senior Developer werden",
        createdAt: randomPastDate(10, 25),
      },
    }),
  );

  goals.push(
    await prisma.goal.create({
      data: {
        userId,
        title: "Fitness verbessern",
        description: null,
        createdAt: randomPastDate(5, 15),
      },
    }),
  );

  console.log(`✅ Created ${goals.length} goals for Bob`);
  return goals;
}

async function seedGoalsForCharlie(userId: string) {
  console.log("📝 Seeding goals for Charlie (New User)...");

  const goals = [];

  // Minimal goals for new user
  goals.push(
    await prisma.goal.create({
      data: {
        userId,
        title: "Get Started with Goal Tracking",
        description: "Learn how to use this application effectively",
        createdAt: randomPastDate(1, 7),
      },
    }),
  );

  console.log(`✅ Created ${goals.length} goal for Charlie`);
  return goals;
}

// ============================================================================
// REGION SEEDING
// ============================================================================

async function seedRegionsForGoal(
  goalId: string,
  goalTitle: string,
  count: number,
) {
  const regions = [];

  // Predefined region templates based on goal
  const regionTemplates: Record<
    string,
    Array<{ title: string; description: string | null }>
  > = {
    "Learn Next.js 15": [
      {
        title: "Study Server Components",
        description:
          "Understand the difference between Server and Client Components",
      },
      {
        title: "Learn Server Actions",
        description: "Implement form handling with Server Actions",
      },
      {
        title: "Master App Router",
        description: "Deep dive into Next.js 15 App Router patterns",
      },
    ],
    "Build Goal Tracker Application": [
      {
        title: "Design UI Components",
        description: "Create reusable UI components with shadcn/ui",
      },
      {
        title: "Implement CRUD Operations",
        description:
          "Add create, read, update, and delete functionality for goals",
      },
      {
        title: "Add Testing",
        description: "Implement comprehensive test coverage with TDD",
      },
      { title: "Deploy to Production", description: null },
    ],
    "Master TypeScript": [
      {
        title: "Learn Generics",
        description: "Master TypeScript generics and type constraints",
      },
      {
        title: "Advanced Types",
        description: "Study utility types, conditional types, mapped types",
      },
    ],
    "Learn React 19 Features": [
      { title: "React Server Components", description: "Study RSC patterns" },
      { title: "React Compiler", description: null },
    ],
    "Study System Design Patterns": [
      { title: "Microservices Architecture", description: null },
      {
        title: "Database Design",
        description: "Learn database optimization and scaling",
      },
      {
        title: "Caching Strategies",
        description: "Study Redis, CDN, and application-level caching",
      },
    ],
    "Deutsch lernen": [
      { title: "Vokabeln lernen", description: "Jeden Tag 20 neue Wörter" },
      {
        title: "Grammatik üben",
        description: "Fokus auf Akkusativ und Dativ",
      },
    ],
    "Karriere entwickeln": [
      { title: "Portfolio erstellen", description: null },
      {
        title: "Networking",
        description: "Kontakte in der Branche knüpfen",
      },
    ],
    "Fitness verbessern": [
      { title: "Trainingsplan", description: "3x pro Woche trainieren" },
    ],
    "Get Started with Goal Tracking": [
      { title: "Create first goal", description: null },
    ],
  };

  const templates = regionTemplates[goalTitle] || [];
  const regionsToCreate = templates.slice(0, count);

  for (const template of regionsToCreate) {
    const region = await prisma.region.create({
      data: {
        goalId,
        title: template.title,
        description: template.description,
        createdAt: randomPastDate(1, 30),
      },
    });
    regions.push(region);
  }

  return regions;
}

// ============================================================================
// TASK SEEDING
// ============================================================================

async function seedTasksForRegion(
  regionId: string,
  regionTitle: string,
  count: number,
) {
  const tasks = [];

  // Task templates based on region
  const taskTemplates: Record<
    string,
    Array<{
      title: string;
      description: string | null;
      daysOffset: number;
      status: "active" | "completed" | "incomplete";
    }>
  > = {
    "Study Server Components": [
      {
        title: "Read Next.js documentation on Server Components",
        description: "Complete official docs and examples",
        daysOffset: -5,
        status: "completed",
      },
      {
        title: "Build 3 projects using Server Components",
        description: "Create practical projects to practice Server Components",
        daysOffset: 15,
        status: "active",
      },
      {
        title: "Study RSC rendering lifecycle",
        description: "Deep dive into React Server Components rendering",
        daysOffset: -10,
        status: "incomplete",
      },
    ],
    "Learn Server Actions": [
      {
        title: "Implement form with Server Actions",
        description: "Build a complete form using Server Actions for mutations",
        daysOffset: 7,
        status: "active",
      },
      {
        title: "Add error handling to Server Actions",
        description: null,
        daysOffset: 20,
        status: "active",
      },
    ],
    "Master App Router": [
      {
        title: "Learn route groups and layouts",
        description: "Understand Next.js routing patterns",
        daysOffset: 10,
        status: "active",
      },
      {
        title: "Implement parallel routes",
        description: null,
        daysOffset: 30,
        status: "active",
      },
    ],
    "Design UI Components": [
      {
        title: "Setup shadcn/ui component library",
        description: "Install and configure shadcn/ui in the project",
        daysOffset: -20,
        status: "completed",
      },
      {
        title: "Create custom Button variants",
        description: null,
        daysOffset: -8,
        status: "completed",
      },
      {
        title: "Build Dialog component",
        description: "Implement modal dialogs with proper accessibility",
        daysOffset: 5,
        status: "active",
      },
    ],
    "Implement CRUD Operations": [
      {
        title: "Implement Goal CRUD operations",
        description: "Add create, read, update, delete for goals with TDD",
        daysOffset: -15,
        status: "completed",
      },
      {
        title: "Implement Region CRUD operations",
        description: null,
        daysOffset: -12,
        status: "completed",
      },
      {
        title: "Implement Task CRUD operations",
        description: "Add create, read, update, delete for tasks with TDD",
        daysOffset: -3,
        status: "completed",
      },
    ],
    "Add Testing": [
      {
        title: "Setup Jest and React Testing Library",
        description: null,
        daysOffset: -25,
        status: "completed",
      },
      {
        title: "Write tests for Server Actions",
        description: "Achieve 100% coverage for actions",
        daysOffset: -7,
        status: "completed",
      },
      {
        title: "Write component tests",
        description: "Test all UI components",
        daysOffset: 1,
        status: "active",
      },
      {
        title: "Add E2E tests with Playwright",
        description: "Implement end-to-end testing",
        daysOffset: 14,
        status: "active",
      },
    ],
    "Deploy to Production": [
      {
        title: "Setup Vercel deployment",
        description: null,
        daysOffset: 25,
        status: "active",
      },
    ],
    "Learn Generics": [
      {
        title: "Study generic functions",
        description: null,
        daysOffset: 3,
        status: "active",
      },
      {
        title: "Practice generic constraints",
        description: "Work through advanced examples",
        daysOffset: 12,
        status: "active",
      },
    ],
    "Advanced Types": [
      {
        title: "Learn utility types",
        description: "Master Pick, Omit, Partial, Required, etc.",
        daysOffset: 8,
        status: "active",
      },
      {
        title: "Study conditional types",
        description: null,
        daysOffset: 18,
        status: "active",
      },
    ],
    "React Server Components": [
      {
        title: "Build demo app with RSC",
        description: null,
        daysOffset: 10,
        status: "active",
      },
    ],
    "React Compiler": [
      {
        title: "Read React Compiler documentation",
        description: null,
        daysOffset: 30,
        status: "active",
      },
    ],
    "Microservices Architecture": [
      {
        title: "Study microservices patterns",
        description: null,
        daysOffset: 15,
        status: "active",
      },
    ],
    "Database Design": [
      {
        title: "Learn database normalization",
        description: null,
        daysOffset: 20,
        status: "active",
      },
      {
        title: "Study indexing strategies",
        description: "Optimize query performance",
        daysOffset: -5,
        status: "incomplete",
      },
    ],
    "Caching Strategies": [
      {
        title: "Implement Redis caching",
        description: null,
        daysOffset: 25,
        status: "active",
      },
    ],
    "Vokabeln lernen": [
      {
        title: "100 Verben auswendig lernen",
        description: null,
        daysOffset: 7,
        status: "active",
      },
      {
        title: "Flashcards erstellen",
        description: "Anki verwenden",
        daysOffset: -3,
        status: "completed",
      },
    ],
    "Grammatik üben": [
      {
        title: "Akkusativ-Übungen machen",
        description: null,
        daysOffset: 5,
        status: "active",
      },
      {
        title: "Dativ-Übungen machen",
        description: null,
        daysOffset: 15,
        status: "active",
      },
    ],
    "Portfolio erstellen": [
      {
        title: "Design auswählen",
        description: null,
        daysOffset: 10,
        status: "active",
      },
    ],
    Networking: [
      {
        title: "LinkedIn-Profil aktualisieren",
        description: null,
        daysOffset: -2,
        status: "completed",
      },
      {
        title: "Meetup besuchen",
        description: null,
        daysOffset: 8,
        status: "active",
      },
    ],
    Trainingsplan: [
      {
        title: "Gym anmelden",
        description: null,
        daysOffset: -10,
        status: "completed",
      },
      {
        title: "Personal Trainer buchen",
        description: null,
        daysOffset: 5,
        status: "active",
      },
    ],
    "Create first goal": [
      {
        title: "Explore the application",
        description: null,
        daysOffset: 3,
        status: "active",
      },
    ],
  };

  const templates = taskTemplates[regionTitle] || [];
  const tasksToCreate = templates.slice(0, count);

  for (const template of tasksToCreate) {
    const deadline = daysFromNow(template.daysOffset);
    const createdAt = randomPastDate(1, 20);

    const task = await prisma.task.create({
      data: {
        regionId,
        title: template.title,
        description: template.description,
        deadline,
        status: template.status,
        createdAt,
      },
    });
    tasks.push(task);
  }

  return tasks;
}

// ============================================================================
// MAIN SEED FUNCTION
// ============================================================================

async function main() {
  console.log("🌱 Starting comprehensive database seed...");
  console.log("📅 Current date:", new Date().toISOString().split("T")[0]);
  console.log("");

  // Clear existing data (in reverse order to respect foreign keys)
  console.log("🗑️  Clearing existing data...");
  await prisma.task.deleteMany();
  await prisma.region.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.userPreferences.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log("✅ Database cleared");
  console.log("");

  // Seed users
  const { alice, bob, charlie, diana } = await seedUsers();
  console.log("");

  // Seed goals for each user
  const aliceGoals = await seedGoalsForAlice(alice.id);
  const bobGoals = await seedGoalsForBob(bob.id);
  const charlieGoals = await seedGoalsForCharlie(charlie.id);
  // Diana has no goals (empty state testing)
  console.log("");

  // Seed regions and tasks for Alice's goals
  console.log("🗂️  Seeding regions and tasks for Alice...");
  let aliceRegionCount = 0;
  let aliceTaskCount = 0;

  // Goal 1: Learn Next.js (3 regions with tasks)
  const goal1Regions = await seedRegionsForGoal(
    aliceGoals[0].id,
    aliceGoals[0].title,
    3,
  );
  aliceRegionCount += goal1Regions.length;
  for (const region of goal1Regions) {
    const tasks = await seedTasksForRegion(region.id, region.title, 3);
    aliceTaskCount += tasks.length;
  }

  // Goal 2: Build Goal Tracker (4 regions with tasks)
  const goal2Regions = await seedRegionsForGoal(
    aliceGoals[1].id,
    aliceGoals[1].title,
    4,
  );
  aliceRegionCount += goal2Regions.length;
  for (const region of goal2Regions) {
    const tasks = await seedTasksForRegion(region.id, region.title, 3);
    aliceTaskCount += tasks.length;
  }

  // Goal 3: Master TypeScript (2 regions with tasks)
  const goal3Regions = await seedRegionsForGoal(
    aliceGoals[2].id,
    aliceGoals[2].title,
    2,
  );
  aliceRegionCount += goal3Regions.length;
  for (const region of goal3Regions) {
    const tasks = await seedTasksForRegion(region.id, region.title, 2);
    aliceTaskCount += tasks.length;
  }

  // Goal 4: Learn React 19 (2 regions, NO tasks - empty state)
  const goal4Regions = await seedRegionsForGoal(
    aliceGoals[3].id,
    aliceGoals[3].title,
    2,
  );
  aliceRegionCount += goal4Regions.length;
  // No tasks created for these regions (empty state testing)

  // Goal 5: Portfolio (NO regions - empty state)
  // No regions created (empty state testing)

  // Goal 6: System Design (3 regions with tasks)
  const goal6Regions = await seedRegionsForGoal(
    aliceGoals[5].id,
    aliceGoals[5].title,
    3,
  );
  aliceRegionCount += goal6Regions.length;
  for (const region of goal6Regions) {
    const tasks = await seedTasksForRegion(region.id, region.title, 1);
    aliceTaskCount += tasks.length;
  }

  console.log(`✅ Alice: ${aliceRegionCount} regions, ${aliceTaskCount} tasks`);
  console.log("");

  // Seed regions and tasks for Bob's goals
  console.log("🗂️  Seeding regions and tasks for Bob...");
  let bobRegionCount = 0;
  let bobTaskCount = 0;

  const bobGoal1Regions = await seedRegionsForGoal(
    bobGoals[0].id,
    bobGoals[0].title,
    2,
  );
  bobRegionCount += bobGoal1Regions.length;
  for (const region of bobGoal1Regions) {
    const tasks = await seedTasksForRegion(region.id, region.title, 2);
    bobTaskCount += tasks.length;
  }

  const bobGoal2Regions = await seedRegionsForGoal(
    bobGoals[1].id,
    bobGoals[1].title,
    2,
  );
  bobRegionCount += bobGoal2Regions.length;
  for (const region of bobGoal2Regions) {
    const tasks = await seedTasksForRegion(region.id, region.title, 1);
    bobTaskCount += tasks.length;
  }

  const bobGoal3Regions = await seedRegionsForGoal(
    bobGoals[2].id,
    bobGoals[2].title,
    1,
  );
  bobRegionCount += bobGoal3Regions.length;
  for (const region of bobGoal3Regions) {
    const tasks = await seedTasksForRegion(region.id, region.title, 2);
    bobTaskCount += tasks.length;
  }

  console.log(`✅ Bob: ${bobRegionCount} regions, ${bobTaskCount} tasks`);
  console.log("");

  // Seed regions and tasks for Charlie's goal
  console.log("🗂️  Seeding regions and tasks for Charlie...");
  const charlieRegions = await seedRegionsForGoal(
    charlieGoals[0].id,
    charlieGoals[0].title,
    1,
  );
  const charlieTask = await seedTasksForRegion(
    charlieRegions[0].id,
    charlieRegions[0].title,
    1,
  );
  console.log(
    `✅ Charlie: ${charlieRegions.length} region, ${charlieTask.length} task`,
  );
  console.log("");

  // Final statistics
  console.log("✨ Database seeded successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📊 FINAL STATISTICS:`);
  console.log(`   Users:       ${await prisma.user.count()}`);
  console.log(`   Preferences: ${await prisma.userPreferences.count()}`);
  console.log(`   Goals:       ${await prisma.goal.count()}`);
  console.log(`   Regions:     ${await prisma.region.count()}`);
  console.log(`   Tasks:       ${await prisma.task.count()}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("👥 USER BREAKDOWN:");
  console.log(
    `   Alice (${alice.email}):   ${aliceGoals.length} goals, ${aliceRegionCount} regions, ${aliceTaskCount} tasks`,
  );
  console.log(
    `   Bob (${bob.email}):     ${bobGoals.length} goals, ${bobRegionCount} regions, ${bobTaskCount} tasks`,
  );
  console.log(
    `   Charlie (${charlie.email}): ${charlieGoals.length} goal, ${charlieRegions.length} region, ${charlieTask.length} task`,
  );
  console.log(`   Diana (${diana.email}):   0 goals (empty state)`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("🎯 TASK STATUS BREAKDOWN:");
  const activeCount = await prisma.task.count({ where: { status: "active" } });
  const completedCount = await prisma.task.count({
    where: { status: "completed" },
  });
  const incompleteCount = await prisma.task.count({
    where: { status: "incomplete" },
  });
  console.log(`   Active:     ${activeCount}`);
  console.log(`   Completed:  ${completedCount}`);
  console.log(`   Incomplete: ${incompleteCount}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("🌍 LANGUAGE/THEME PREFERENCES:");
  console.log("   Alice:   English + Light");
  console.log("   Bob:     German + Dark");
  console.log("   Charlie: English + System (no name)");
  console.log("   Diana:   English + System (empty state)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("💡 TEST SCENARIOS COVERED:");
  console.log("   ✅ Power user with many goals");
  console.log("   ✅ German language UI testing");
  console.log("   ✅ User with no name set");
  console.log("   ✅ Empty state (no goals)");
  console.log("   ✅ Empty regions (no tasks)");
  console.log("   ✅ Goals without regions");
  console.log("   ✅ Overdue tasks");
  console.log("   ✅ Completed tasks");
  console.log("   ✅ Upcoming deadlines");
  console.log("   ✅ Long titles (truncation)");
  console.log("   ✅ Null descriptions");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
