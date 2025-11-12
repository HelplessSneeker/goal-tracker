# Goal Tracker

A hierarchical goal management application built with Next.js 15, helping you break down and track progress toward your goals.

## About This Project

After watching [This Video](https://www.youtube.com/watch?v=QGB_jCIk8IA) from [SpoonFedStudy](https://www.youtube.com/@spoonfedstudy), I was inspired to take a more structured approach to tracking my goals.
As both an exercise in building with modern web technologies and a way to document my journey, I decided to create this goal-tracking tool.

This project serves a dual purpose: it's a practical application to help me stay accountable to my goals, and it's also a learning experience where I'm documenting my development process and progress.

## Current Status

This is a full-stack application with:
- ✅ **Complete CRUD operations** for Goals, Regions, and Tasks
- ✅ **Server Actions + Service Layer** architecture (migrated from API routes)
- ✅ **PostgreSQL database** with Prisma ORM
- ✅ **Authentication** with NextAuth.js (email/magic link)
- ✅ **User avatar and menu** with sign-out functionality
- ✅ **User Settings Page** - profile editing, language switching, theme preferences
- ✅ **Dynamic i18n** - English/German with cookie-based switching
- ✅ **Comprehensive test coverage** (321/321 tests, 100% service coverage)
- ✅ **Modern UI** with shadcn/ui components and responsive design
- ✅ **Type-safe action responses** with proper error handling
- ⏳ **Database Seeding** (next priority - before theme implementation)
- ⏳ **Theme Implementation** (Light/Dark mode)
- ⏳ **Weekly Tasks and Progress Tracking** (planned)

## Features

### Implemented
- **Authentication** - Email-based magic link authentication with NextAuth.js
- **User Interface** - Avatar with dropdown menu, sign-out, settings link
- **User Settings** - Profile editing, name updates, language & theme preferences
- **Internationalization** - English/German with dynamic switching (cookie-based)
- **Goals** - High-level objectives (no deadlines)
- **Regions** - Specific areas within goals to focus on
- **Tasks** - Concrete tasks with deadlines and status tracking
- **Full CRUD** - Create, read, update, delete functionality for all entities
- **Responsive Design** - Modern UI with shadcn/ui components
- **Database** - PostgreSQL with Prisma ORM (UUID primary keys)
- **Testing** - Comprehensive test suite (321 tests, 100% coverage)
- **Type Safety** - ActionResponse types with proper error handling

### In Progress
- **Database Seeding** - Comprehensive test data for development
- **Theme Implementation** - Light/Dark mode based on user preference

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
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/goal-tracker-db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# Email (SMTP)
EMAIL_SERVER_HOST="localhost"
EMAIL_SERVER_PORT="1025"
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM="noreply@goal-tracker.local"
```

**Important Notes:**
- Replace `username` and `password` in DATABASE_URL with your PostgreSQL credentials
- Generate a secure NEXTAUTH_SECRET using: `openssl rand -base64 32`
- For development, use Mailpit (see Email Setup below) for testing magic link emails

### 4. Set Up Database Schema

```bash
# Push schema to database
pnpm prisma db push

# Generate Prisma Client
pnpm prisma generate

# Seed database with sample data (optional)
pnpm prisma db seed
```

### 5. Set Up Email (Development)

For development, use **Mailpit** to test magic link emails without sending real emails:

#### Install Mailpit

**macOS (Homebrew):**
```bash
brew install mailpit
mailpit
```

**Linux/Windows:**
Download from [https://github.com/axllent/mailpit/releases](https://github.com/axllent/mailpit/releases)

#### Using Mailpit

1. Start Mailpit (runs on port 1025 for SMTP, 8025 for web UI)
2. Access web interface at [http://localhost:8025](http://localhost:8025)
3. All magic link emails will appear in the Mailpit inbox
4. Click the link in the email to complete sign-in

**Alternative (Docker):**
```bash
docker run -d --name mailpit -p 8025:8025 -p 1025:1025 axllent/mailpit
```

### 6. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**First Time Setup:**
1. Navigate to `/auth/signin`
2. Enter your email address
3. Check Mailpit inbox at [http://localhost:8025](http://localhost:8025)
4. Click the magic link in the email to sign in

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
- 321/321 tests passing (~7.9s)
- 100% server action coverage (102 tests)
- 100% service layer coverage (60 tests)
- 93-100% component coverage (147 tests, includes 15 UserMenu + 31 UserSettings tests)
- 100% authentication coverage (12 tests)

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - Component library
- **Lucide React** - Icons

### Backend
- **Next.js Server Actions** - Type-safe server mutations
- **Service Layer** - Business logic and data access
- **NextAuth.js** - Authentication (email/magic link, JWT sessions)
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Relational database

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
│   ├── actions/              # Server Actions (goals, regions, tasks)
│   ├── api/auth/             # NextAuth API route only
│   ├── auth/                 # Authentication pages (signin, verify-request)
│   ├── goals/                # Goals pages
│   └── progress/             # Progress tracking page
├── components/               # React components
│   ├── goals/                # Goal-related components
│   ├── regions/              # Region-related components
│   ├── tasks/                # Task-related components
│   └── ui/                   # shadcn/ui components
├── lib/                      # Utilities and helpers
│   ├── services/             # Service Layer (business logic + Prisma)
│   ├── auth.ts               # NextAuth configuration
│   ├── prisma.ts             # Prisma client
│   └── types.ts              # TypeScript types
├── prisma/                   # Prisma configuration
│   ├── schema.prisma         # Database schema (includes NextAuth models)
│   └── seed.ts               # Database seeder
├── middleware.ts             # Route protection middleware
└── tests/                    # Test files (co-located with source)
```

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Comprehensive project documentation and architecture
- **[BEST_PRACTICES.md](./BEST_PRACTICES.md)** - Coding standards, patterns, and conventions
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[TODOs.md](./TODOs.md)** - Implementation roadmap
- **`/tdd` skill** - Test-Driven Development workflow and patterns (use in Claude Code)

## Database Schema

The application uses a hierarchical structure:

```
User (NextAuth)
    ↓
Goal (UUID) ──> Region (UUID) ──> Task (UUID)
                                       ↓
                              Weekly Task (planned)
                                       ↓
                              Progress Entry (planned)
```

**Current Models:**
- `User`, `Account`, `Session`, `VerificationToken` (NextAuth adapter models)
- `Goal`, `Region`, `Task` (with userId foreign keys)
- `UserPreferences` (language, theme settings with auto-creation)

All entities use UUID primary keys for better scalability and security.

## Contributing

This is a personal learning project, but suggestions and feedback are welcome! Feel free to open an issue if you spot any bugs or have ideas for improvements.

## License

This project is open source and available under the MIT License.
