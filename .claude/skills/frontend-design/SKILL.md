---
name: frontend-design
description: Guidance for creating distinctive, professional frontend interfaces. Use when designing or reviewing UI for the public site or backoffice to avoid generic aesthetics.
metadata:
  author: secondsky (adapted)
  version: "1.0.0"
---

# Frontend Design Skill

## Core Philosophy
Commit to a clear aesthetic direction and execute it with precision. Avoid generic "AI slop" interfaces.

## Typography
- Use `next/font` for all fonts (already configured: Montserrat, Nunito, Geist)
- Pair a distinctive display font with a refined body font
- Establish clear typographic hierarchy: display → heading → body → caption
- Never use system fonts or generic fallbacks as primary fonts

## Color
- Use CSS variables for all colors (already configured in globals.css)
- Establish a dominant brand color with 1-2 sharp accents
- Avoid clichéd gradients (purple on white, rainbow gradients)
- Nail academy brand: feminine, professional, elegant

## Public Site Design Principles
- Bold hero with clear value proposition
- Course cards with strong visual hierarchy: image → name → price → CTA
- Testimonials feel authentic, not corporate
- Exchange rate ticker: subtle but visible, updated feel

## Backoffice Design Principles
- Clean, functional — not flashy
- Data density without clutter
- Status colors consistent throughout: green=confirmed, yellow=pending, red=cancelled
- Sidebar navigation clear and minimal
- Dashboard cards show one metric each, prominently

## Motion
- Use purposeful animations only (page transitions, confirmation feedback)
- Respect `prefers-reduced-motion`
- No decorative animations that slow perception of data

## Quality Checklist
- [ ] WCAG AA contrast on all text
- [ ] Responsive at 320px, 768px, 1024px, 1440px
- [ ] No placeholder lorem ipsum in production
- [ ] Loading states on all async actions
- [ ] Error states with actionable messages
