# Goal Tracker

A hierarchical goal management application built with Next.js 15, helping you break down and track progress toward your goals.

## About This Project

After watching [This Video](https://www.youtube.com/watch?v=QGB_jCIk8IA) from [SpoonFedStudy](https://www.youtube.com/@spoonfedstudy), I was inspired to take a more structured approach to tracking my goals.
As both an exercise in building with modern web technologies and a way to document my journey, I decided to create this goal-tracking tool.

This project serves a dual purpose: it's a practical application to help me stay accountable to my goals, and it's also a learning experience where I'm documenting my development process and progress.

## Current Status

This is a full-stack application with:
- ✅ **Complete CRUD operations** for Goals, Regions, and Tasks
- ✅ **PostgreSQL database** with Prisma ORM
- ✅ **Comprehensive test coverage** (156 tests, 100% API coverage)
- ✅ **Modern UI** with shadcn/ui components
- ⏳ **Weekly Tasks and Progress Tracking** (planned)

## Features

### Implemented
- **Goals** - High-level objectives (no deadlines)
- **Regions** - Specific areas within goals to focus on
- **Tasks** - Concrete tasks with deadlines and status tracking
- Full create, read, update, delete functionality
- Responsive UI with modern design
- Database persistence with Prisma + PostgreSQL

### Planned
- **Weekly Tasks** - 3 prioritized tasks per week
- **Progress Entries** - Daily progress tracking with completion percentages
- **Weekly Review** - Review and recreate weekly tasks
- **Archive System** - Historical progress tracking

## Prerequisites

- **Node.js** 20+
- **pnpm** (package manager)
- **PostgreSQL** database (local or remote)
- **Docker** (optional, for local PostgreSQL)

## Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd goal-tracker
pnpm install
```

### 2. Set Up Database

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL with docker-compose
docker-compose up -d
```

The database will be available at `localhost:5432`.

#### Option B: Using Existing PostgreSQL

Ensure you have a PostgreSQL instance running and note your connection details.

### 3. Configure Environment

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/goal-tracker-db"
```

Replace `username` and `password` with your PostgreSQL credentials.

### 4. Set Up Database Schema

```bash
# Push schema to database
pnpm prisma db push

# Generate Prisma Client
pnpm prisma generate

# Seed database with sample data (optional)
pnpm prisma db seed
```

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Commands

### Development

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Database

```bash
pnpm prisma generate     # Generate Prisma Client
pnpm prisma db push      # Push schema changes to database
pnpm prisma db seed      # Seed database with sample data
pnpm prisma studio       # Open Prisma Studio (database GUI)
```

### Testing

```bash
pnpm test              # Run all tests
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage report
```

**Current Test Status:**
- 156 tests passing
- 100% API route coverage
- 93-100% component coverage

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library
- **Lucide React** - Icons

### Backend
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Relational database
- **Next.js API Routes** - RESTful API

### Development
- **Turbopack** - Fast bundler
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting
- **pnpm** - Package manager

## Project Structure

```
goal-tracker/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes (Goals, Regions, Tasks)
│   ├── goals/                # Goals pages
│   └── progress/             # Progress tracking page
├── components/               # React components
│   ├── goals/                # Goal-related components
│   ├── regions/              # Region-related components
│   ├── tasks/                # Task-related components
│   └── ui/                   # shadcn/ui components
├── lib/                      # Utilities and helpers
│   ├── prisma.ts             # Prisma client
│   └── types.ts              # TypeScript types
├── prisma/                   # Prisma configuration
│   ├── schema.prisma         # Database schema
│   └── seed.ts               # Database seeder
└── tests/                    # Test files (co-located)
```

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Comprehensive project documentation and architecture
- **[TESTING.md](./TESTING.md)** - Testing guide and best practices
- **[TODOs.md](./TODOs.md)** - Implementation roadmap

## Database Schema

The application uses a hierarchical structure:

```
Goal (UUID) ──> Region (UUID) ──> Task (UUID)
                                       ↓
                              Weekly Task (planned)
                                       ↓
                              Progress Entry (planned)
```

All entities use UUID primary keys for better scalability and security.

## Contributing

This is a personal learning project, but suggestions and feedback are welcome! Feel free to open an issue if you spot any bugs or have ideas for improvements.

## License

This project is open source and available under the MIT License.
