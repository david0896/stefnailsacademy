---
name: react-best-practices
description: React and Next.js performance optimization rules. Use when writing, reviewing, or refactoring React components, data fetching, or API routes in this project.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# Vercel React Best Practices

## When to Apply
- Writing new React components or Next.js pages
- Implementing data fetching with TanStack Query
- Reviewing code for performance issues
- Optimizing bundle size or load times

## Critical Rules for This Project

### Eliminating Waterfalls
- Use `Promise.all()` for independent async operations (e.g. fetch course + exchange rate in parallel)
- Start promises early, await late in API routes
- Use TanStack Query (already installed) for client-side data fetching with deduplication

### Bundle Size
- Import directly, avoid barrel files — use `import { x } from 'lib/x'` not `import { x } from 'lib'`
- Use `next/dynamic` for heavy components not needed on first render
- Load analytics after hydration

### Re-render Optimization
- Don't define components inside other components
- Use functional setState for stable callbacks
- Derive state during render, not in effects when possible
- Use primitive dependencies in useEffect

### Data Fetching Patterns
- TanStack Query (already in project) handles caching, deduplication, background refetch
- API routes: authenticate first, then fetch data
- Parallel fetch when data is independent

### Pages Router Specifics
- Use `getServerSideProps` for dynamic data that changes per request
- Use `getStaticProps` for mostly static content
- Backoffice pages use client-side fetching via TanStack Query

## Code Quality
- Early returns to reduce nesting
- One responsibility per function/component
- Name booleans positively: `isLoading` not `notLoaded`
