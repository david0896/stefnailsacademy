# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run cypress:open # Open Cypress E2E test runner
```

No unit test runner is configured. E2E tests only via Cypress.

## 🚦 Workflow obligatorio: local → visto bueno → producción

**Toda fase / sub-fase / fix se valida en localhost ANTES de tocar producción.** Sin excepciones.

Flujo estándar para cualquier cambio:

1. **Implementar y commitear** en la rama de la fase actual.
2. **Probar en local** (`npm run dev`, `http://localhost:3000`): el cliente recorre los flujos afectados y confirma que funciona.
3. **Esperar el visto bueno explícito** del cliente (ej. "todo bien en local", "ok dale", etc.).
4. **Solo entonces**: `git push`, abrir PR, mergear a `main`, verificar deploy en Vercel.

**Nunca hacer push/merge/deploy "para adelantar" sin confirmación.** Si una fase tiene varias sub-fases acumuladas, probar al final de cada sub-fase visible (UI/flujo) y al cierre de la fase. Sub-fases puramente backend (schema, refactor) pueden agruparse, pero la última sub-fase de cada PR siempre exige smoke test.

Smoke test mínimo antes de marcar una fase como "lista para deploy":
- `npm run build` pasa sin errores.
- El flujo nuevo se recorre en el navegador local sin romper flujos existentes.
- Si hay envío de emails, llega al menos uno al inbox de testing (no spam).
- Si hay cambios de schema, verificar que no rompe inscripciones/cursos existentes.

Si algo falla en local, se itera en la misma rama hasta arreglar — no se "promete arreglar en prod".

## Architecture

### Current Stack
- **Next.js 15.1.4 — Pages Router** (not App Router). All routes live in `src/pages/`.
- **JavaScript only** — no TypeScript. Path alias `@/*` maps to `src/*` via `jsconfig.json`.
- **Styling**: Tailwind CSS 3.4.17 + CSS Modules per component. No Tailwind v4.
- **All dependency versions are pinned** (no `^`) — do not add `^` when installing packages.

### Data Flow — Public Site
Courses are sourced from **Prisma/Supabase** (single source of truth — Google Sheets retired in Fase 9). Whatever is created/edited in the BO is what the public site renders, and vice-versa:
```
Public page (SSR) → application use case → Prisma repository → Supabase
```
Exchange rates (BCV) are still fetched from `api.dolarvzla.com` via `/api/tasaCambiaria/bcv` and `/api/tasaCambiaria/bcvEuro` and used to convert EUR → Bs at display time.

The legacy `/api/sheets/infoCursos` endpoint and the `useCursos` hook may still exist in the repo as historical artifacts — do not re-introduce them as the source of truth for courses.

### Email
`src/utils/emailConfig.js` creates a Nodemailer transporter using **Gmail OAuth2** (not SMTP password). It calls `google.auth.OAuth2` with `CLIENT_ID`, `CLIENT_SECRET`, `REDIRECT_URI`, `REFRESH_TOKEN` env vars and fetches a fresh access token per send.

### Global Layout
`src/pages/_app.js` wraps everything in `QueryClientProvider` (TanStack Query) + `Layout`. The `Layout` component (`src/pages/layout.js`) injects Montserrat, Nunito, and Geist as CSS variables and renders Navbar + Footer around every page.

### SVGs
`.svg` files are imported as React components via `@svgr/webpack` (configured in `next.config.mjs`).

---

## Backoffice (BO) — In Progress

The backoffice is being built following **Onion Architecture**. Do not mix layers.

### Layer Rules
```
pages/api/backoffice/*  → Controllers: validate with Zod, check NextAuth session, call use case, return response. No business logic.
src/application/*       → Use Cases: orchestrate business rules, call repositories. No HTTP, no Prisma directly.
src/domain/*            → Entities + Repository interfaces (contracts). Zero external dependencies.
src/infrastructure/*    → Prisma repositories + external services. Only place that touches Prisma or external APIs.
src/lib/prisma.js       → Prisma singleton. Only import from here, never instantiate PrismaClient elsewhere.
```

### Auth
NextAuth with Credentials provider (email + password). Config at `src/pages/api/auth/[...nextauth].js`. All `/api/backoffice/*` routes must call `getServerSession()` and return 401 before any query. All `/backoffice/*` pages are protected by `middleware.js` at project root.

### Database
- **Local dev**: PostgreSQL via pgAdmin (PostgreSQL 16), connection via `DATABASE_URL` in `.env.local`
- **Production**: Supabase (free tier) — same `DATABASE_URL` format
- **Migrations**: `npx prisma migrate dev` (local), `npx prisma migrate deploy` (prod)
- **Anti-pause**: Vercel Cron pings `/api/health` every 5 days to prevent Supabase free tier hibernation

### ⚠️ DATABASE SAFETY RULE (NON-NEGOTIABLE)
**NEVER execute any command that deletes or destroys data in the database.** This applies to
local dev AND production, and to every tool (Supabase MCP `execute_sql`, `psql`, Prisma, raw SQL, etc.).
- Forbidden: `DELETE`, `DROP TABLE`, `DROP COLUMN`, `TRUNCATE`, `DROP DATABASE`, hard deletes of any kind.
- Destructive schema changes in migrations (dropping columns/tables) require **explicit human approval first**.
- All record removal in the app is **soft delete only** (`deletedAt` timestamp). The "Eliminar" buttons in the BO
  set `deletedAt`; they never remove rows. Records are recoverable from the **Papelera** section.
- Reads, `INSERT`, non-destructive `UPDATE` (incl. setting/clearing `deletedAt`), and additive migrations are allowed.

### Supabase health monitoring
- Production project: **"mestefanie77@gmail.com Project"** (`ppyrwjszatjnhtsxlxpj`), `ACTIVE_HEALTHY`.
- Health is checked **on-demand every ~5 days via command** (Supabase MCP `get_project` / a `SELECT 1` health query),
  not by email. Supabase billing/pause emails go to `mestefanie77@gmail.com` (not the dev's inbox).

### Business Rules
- Prices stored in **EUR** in DB; converted to **Bs** at display time using live BCV Euro rate
- Enrollment status flow: `PENDING → CONFIRMED | CANCELLED`
- Only `CONFIRMED` enrollments grant access to course content
- Courses are either `PRESENCIAL` (with date, maxSpots) or `ONLINE` (no date, unlimited)

---

## Environment Variables

```bash
# Public site
SPREADSHEET_ID=
GOOGLE_API_KEY=
CLIENT_ID=           # Gmail OAuth2
CLIENT_SECRET=
REDIRECT_URI=
REFRESH_TOKEN=
EMAIL_USER=
EMAIL_RECIPIENT=
BASE_URL=            # e.g. http://localhost:3000

# Backoffice (add when starting Fase 0)
DATABASE_URL=        # postgresql://user:pass@localhost:5432/stefnails_bo
NEXTAUTH_SECRET=     # openssl rand -base64 32
NEXTAUTH_URL=        # http://localhost:3000
```

---

## Installed Skills (`.claude/skills/`)

| Skill | When to invoke |
|-------|---------------|
| `/prisma-orm` | Schema design, migrations, repository implementation |
| `/shadcn-ui` | Building BO UI components (tables, forms, dialogs) |
| `/authjs` | NextAuth config, session handling, middleware |
| `/react-best-practices` | Writing or reviewing React components |
| `/composition-patterns` | Designing reusable components |
| `/web-design-guidelines` | UI/accessibility audit |
| `/frontend-design` | Public site or BO visual design decisions |
| `/security-review` | Before each deploy, after auth or payment changes |

Built-in skills also active: `/review`, `/security-review`, `/simplify`, `/agent-browser`.

---

## Backoffice Implementation Roadmap

| Fase | Scope | Status |
|------|-------|--------|
| 0 | Prisma setup, schema, first migration | ✅ Done |
| 1 | NextAuth login, middleware, route protection | ✅ Done |
| 2 | Clean architecture folder structure | ✅ Done |
| 3 | Courses CRUD (API + BO UI) | ✅ Done |
| 4 | Students module | ✅ Done |
| 5 | Enrollments + payment confirmation + (basic) emails | ✅ Done |
| 6 | Content management (BO side) | ✅ Done |
| 7 | Dashboard metrics | ✅ Done |
| 8 | Supabase migration + Vercel deploy + anti-pause cron | ✅ Done |
| 9 | Public site consumes BO data (Google Sheets retired) | ✅ Done |
| 9.5 | Responsive polish (public + BO mobile) | ✅ Done |
| 10 | Image storage + WebP responsive variants | ✅ Done |
| 11 | Soft delete (Papelera) for cursos, alumnos, inscripciones | ✅ Done |
| 12 | Email notifications for every site/BO action + payment proof upload (optimized image) | 🚧 In progress |
| — | Password recovery (real token flow) | ⏳ Pending |
| — | Student-side content area (CONFIRMED enrollments see course content) | ⏳ Pending |

Each fase = one PR to GitHub main branch.
