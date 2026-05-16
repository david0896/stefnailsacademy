---
name: composition-patterns
description: React component architecture patterns to avoid boolean prop proliferation. Use when building reusable components for the backoffice or public site.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# React Composition Patterns

## Core Rule
Avoid boolean props to customize behavior. Use composition instead.

## When to Use Each Pattern

### Compound Components
For related UI that shares state (tabs, accordion, form sections):
```js
// Bad
<Table striped bordered hoverable />

// Good  
<Table>
  <Table.Header>...</Table.Header>
  <Table.Body>...</Table.Body>
</Table>
```

### Explicit Variants
For components with distinct visual states:
```js
// Bad
<Badge success warning error />

// Good
<Badge variant="confirmed" />  // maps to green
<Badge variant="pending" />    // maps to yellow
<Badge variant="cancelled" />  // maps to red
```

### Children-Based Composition
Pass JSX as children for flexible layouts:
```js
// Bad
<Card title="Cursos" icon="book" actionLabel="Ver todos" />

// Good
<Card>
  <Card.Title>Cursos</Card.Title>
  <Card.Action>Ver todos</Card.Action>
</Card>
```

## Rules for This Project
- Backoffice layout uses compound components: `<BOLayout>`, `<BOLayout.Sidebar>`, `<BOLayout.Content>`
- Status badges always use `variant` prop, never boolean flags
- Form components follow shadcn/ui composition pattern
- Dashboard cards use children composition
