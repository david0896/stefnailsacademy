---
name: authjs
description: NextAuth authentication guidance for the backoffice. Use when working with login, session management, route protection, or middleware in the backoffice.
metadata:
  author: gocallum (adapted)
  version: "1.0.0"
---

# Auth.js (NextAuth) Skills

## Project Context
This project uses NextAuth with Credentials provider (email + password) for backoffice admin access. Pages Router. JavaScript only.

## Configuration File
Main config: `src/pages/api/auth/[...nextauth].js`

## Required Environment Variables
```
NEXTAUTH_SECRET=<generated with openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000  (dev)
NEXTAUTH_URL=https://yourdomain.com (prod)
```

## Credentials Provider Rules
- Always hash passwords with `bcryptjs` — never store plain text
- The `authorize` callback must return `null` on failure (not throw)
- Return user object with at minimum `{ id, email, name }`
- Validate against AdminUser table in Prisma

## Session Strategy
- Use JWT strategy (no database sessions needed for single admin)
- Session includes: `{ user: { id, email, name } }`

## Route Protection — Middleware
- `middleware.js` at project root protects all `/backoffice/*` routes
- Redirect unauthenticated users to `/backoffice/login`
- Never protect `/backoffice/login` itself

## Accessing Session
- API routes: `import { getServerSession } from 'next-auth'`
- Pages: `import { useSession } from 'next-auth/react'`
- Always verify session in every `/api/backoffice/*` endpoint before executing logic

## Security Checklist
- [ ] Password hashed with bcryptjs (min 10 rounds)
- [ ] NEXTAUTH_SECRET set and not committed to git
- [ ] All /api/backoffice/* routes check session
- [ ] Login page has rate limiting consideration
- [ ] Seed script creates admin with hashed password only
