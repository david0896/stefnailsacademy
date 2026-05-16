---
name: shadcn-ui
description: shadcn/ui component guidance for building the backoffice UI. Use when creating tables, forms, modals, buttons, cards, or any UI component in the backoffice (/backoffice pages).
metadata:
  author: gocallum (adapted for Pages Router)
  version: "1.0.0"
---

# shadcn/ui Skills

## Project Context
This project uses Next.js 15 with **Pages Router** (not App Router) and Tailwind CSS v3. JavaScript only — no TypeScript. shadcn/ui components are used for the backoffice UI.

## Installation
```bash
npx shadcn@latest init
npx shadcn@latest add <component>
```

## Pages Router Adaptations
- No `"use client"` directive needed — Pages Router components are client by default
- Use `_app.js` for providers instead of `layout.tsx`
- Import components from `@/components/ui/<component>`

## Components for Backoffice
Priority components to add:
- `button` — actions (confirmar, cancelar, crear)
- `table` — listados de cursos, inscripciones, alumnos
- `form` + `input` + `label` — formularios de creación/edición
- `dialog` — confirmaciones y modales
- `badge` — estados (PENDING, CONFIRMED, CANCELLED)
- `card` — dashboard metrics
- `select` — filtros y dropdowns
- `toast` (sonner) — notificaciones de acciones

## Forms Integration
shadcn/ui forms + React Hook Form + Zod (already in project):
- Use `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`
- Define Zod schema first, then build the form around it
- Project already has `@hookform/resolvers` and `zod` installed

## Styling Rules
- Use CSS variables from shadcn init — never hardcode colors
- Keep backoffice components in `src/components/backoffice/`
- Keep shadcn primitives in `src/components/ui/`
- Use `clsx` (already installed) for conditional classes

## Badge Colors for Status
- PENDING → yellow/warning
- CONFIRMED → green/success  
- CANCELLED → red/destructive
- COMPLETED → blue/info
