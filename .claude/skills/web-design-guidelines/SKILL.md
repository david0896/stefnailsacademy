---
name: web-design-guidelines
description: Review UI code for accessibility, UX, and design best practices. Use when asked to review UI, check accessibility, audit design, or review any page against best practices.
metadata:
  author: vercel
  version: "1.0.0"
---

# Web Interface Guidelines

## How to Use
When reviewing UI files:
1. Fetch latest guidelines from source URL below
2. Read the specified files
3. Check against all rules in the fetched guidelines
4. Output findings in `file:line` format

## Guidelines Source
Fetch fresh guidelines before each review:
```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

## Key Areas to Check

### Accessibility
- All images have `alt` attributes
- Form inputs have associated `<label>` elements
- Buttons have descriptive text (not just "Click here")
- Color contrast meets WCAG AA minimum (4.5:1 for text)
- Keyboard navigation works for all interactive elements

### Backoffice Specific
- Tables have `<thead>` with `<th scope="col">` headers
- Status badges are not color-only (include text label)
- Confirmation dialogs explain consequences of actions
- Empty states explain what to do (not just "No data")
- Loading states prevent double-submit

### Public Site Specific  
- Hero has clear primary CTA
- Course cards have sufficient info without clicking
- Forms show validation errors inline, not just on submit
- Mobile-first responsive layout

## Output Format
```
file:line - Rule violated - Suggestion
src/pages/backoffice/cursos/index.js:45 - Missing alt on course image - Add descriptive alt text
```
