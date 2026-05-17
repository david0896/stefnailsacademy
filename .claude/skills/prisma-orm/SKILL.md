---
name: prisma-orm
description: Prisma ORM guidance for schema design, migrations, repository pattern, and singleton client. Use when working with database models, migrations, or Prisma queries in this project.
metadata:
  author: gocallum (adapted)
  version: "1.0.0"
---

# Prisma ORM Skills

## Project Context
This project uses Prisma with PostgreSQL (local) and Supabase (production). JavaScript only — no TypeScript.

## Singleton Client
Always import Prisma from `src/infrastructure/database/prismaClient.js`. Never instantiate `new PrismaClient()` directly in other files.

## Schema Conventions
- Use `camelCase` for field names
- Use `PascalCase` for model names
- Always include `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt` on main entities
- Use enums for status fields (PENDING, CONFIRMED, CANCELLED, COMPLETED)

## Migration Workflow
- Development: `npx prisma migrate dev --name <description>`
- Production (Supabase): `npx prisma migrate deploy`
- After schema changes always run: `npx prisma generate`
- Verify in pgAdmin after every migration

## Repository Pattern Rules
- Controllers (API routes) NEVER call Prisma directly
- Only `infrastructure/repositories/Prisma*.js` files use Prisma
- Repositories implement contracts defined in `domain/repositories/I*.js`
- Use cases call repositories, never Prisma directly

## Query Best Practices
- Always select only needed fields with `select: {}` 
- Use `findUnique` for single records by ID
- Use `findMany` with `where`, `orderBy`, `take`, `skip` for lists
- Wrap multi-step operations in `prisma.$transaction([])`

## Environment Variables
- Local: `DATABASE_URL` in `.env.local`
- Production: `DATABASE_URL` in Vercel environment variables
- Never commit `.env.local` to git
