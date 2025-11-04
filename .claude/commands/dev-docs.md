---
description: Create a comprehensive strategic plan with structured task breakdown
argument-hint: Describe what you need planned (e.g., "refactor authentication system", "implement microservices")
---

You are an elite strategic planning specialist. Create a comprehensive, actionable plan for: $ARGUMENTS

## Instructions

1. **Analyze the request** and determine the scope of planning needed
2. **Examine relevant files** in the codebase to understand current state
3. **Create a structured plan** with:
   - Executive Summary
   - Current State Analysis
   - Proposed Future State
   - Implementation Phases (broken into sections)
   - Detailed Tasks (actionable items with clear acceptance criteria)
   - Risk Assessment and Mitigation Strategies
   - Success Metrics
   - Required Resources and Dependencies
   - Timeline Estimates

4. **Task Breakdown Structure**: 
   - Each major section represents a phase or component
   - Number and prioritize tasks within sections
   - Include clear acceptance criteria for each task
   - Specify dependencies between tasks
   - Estimate effort levels (S/M/L/XL)

5. **Create task management structure**:
   - Create directory: `dev/active/[task-name]/` (relative to project root)
   - Generate three files:
     - `[task-name]-plan.md` - The comprehensive plan
     - `[task-name]-context.md` - Key files, decisions, dependencies
     - `[task-name]-tasks.md` - Checklist format for tracking progress
   - Include "Last Updated: YYYY-MM-DD" in each file

## Quality Standards
- Plans must be self-contained with all necessary context
- Use clear, actionable language
- Include specific technical details where relevant
- Consider both technical and business perspectives
- Account for potential risks and edge cases

## Context References
- Check `CLAUDE.md` for architecture overview and project setup
- Consult `BEST_PRACTICES.md` for coding standards and patterns
- Reference `TROUBLESHOOTING.md` for common issues to avoid
- Use `dev/README.md` for task management guidelines
- Review `TODOs.md` for project roadmap

## Project Context
This is a **Next.js 15 + Prisma + NextAuth.js** goal-tracking application:
- **Architecture:** Component → Server Action → Service → Prisma
- **Testing:** TDD required (Jest + React Testing Library)
- **Package Manager:** pnpm
- **Database:** PostgreSQL with UUID primary keys
- **i18n:** next-intl (English, German)

When creating plans:
- Follow TDD workflow (🔴 RED → 🟢 GREEN → ♻️ REFACTOR)
- Include database schema changes if needed (Prisma models)
- Separate server actions and service layer
- Consider test coverage requirements (100% for actions/services)
- Include i18n for both English and German

**Note**: This command is ideal to use AFTER exiting plan mode when you have a clear vision of what needs to be done. It will create the persistent task structure that survives context resets.