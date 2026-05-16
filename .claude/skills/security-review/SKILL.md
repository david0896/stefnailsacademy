---
name: security-review
description: Security-focused code review for authentication, API routes, and data handling. Use when completing a phase of the backoffice, before deploying, or when reviewing auth and payment-related code.
metadata:
  author: trailofbits (adapted)
  version: "1.0.0"
---

# Security Review Skill

## When to Run
- After completing Fase 1 (auth setup)
- After completing Fase 5 (enrollments with payment data)
- Before any production deployment
- When reviewing any `/api/backoffice/*` endpoint

## Six-Phase Review Process

### 1. Authentication & Authorization
- [ ] All `/api/backoffice/*` routes verify NextAuth session
- [ ] Session check happens BEFORE any data query
- [ ] No admin endpoints accessible without valid session
- [ ] Login form has no user enumeration (same error for wrong email/password)

### 2. Input Validation
- [ ] All API route inputs validated with Zod schemas
- [ ] File uploads (comprobantes) validate type and size
- [ ] Query parameters sanitized before Prisma queries
- [ ] No raw SQL queries (use Prisma which parameterizes automatically)

### 3. Sensitive Data Handling
- [ ] Passwords hashed with bcryptjs (min 10 rounds)
- [ ] No passwords logged or returned in API responses
- [ ] Payment reference numbers not exposed in client-side code
- [ ] Environment variables used for all secrets

### 4. Environment & Secrets
- [ ] `.env.local` in `.gitignore`
- [ ] No secrets hardcoded in source files
- [ ] `NEXTAUTH_SECRET` is random and strong
- [ ] Database URL not logged

### 5. API Security
- [ ] HTTP methods restricted per route (GET-only routes reject POST)
- [ ] Error messages don't leak implementation details
- [ ] Prisma errors caught and generic message returned to client

### 6. Dependencies
- [ ] Run `npm audit` before deploy
- [ ] No packages with `^` version prefix (already fixed in this project)
- [ ] Check for supply chain alerts on installed packages

## Output Format
```
CRITICAL: Description — file:line
HIGH: Description — file:line  
MEDIUM: Description — file:line
LOW: Description — file:line
```

## Blast Radius Assessment
For each finding, note:
- What data is exposed/affected
- Who can trigger it (any user / authenticated / admin only)
- How to remediate
