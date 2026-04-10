# CodeVerse - Project Context & Standards

This file provides context for the Gemini AI (CLI and Extension) to ensure consistent code generation and architectural alignment.

## Project Overview
**CodeVerse** is a premium, real-time algorithm visualization and collaborative coding platform. It allows users to write code, trace execution visually, and collaborate in real-time.

## Tech Stack
- **Frontend:** Next.js (App Router), React, TypeScript.
- **Styling:** Tailwind CSS + Vanilla CSS.
- **Animations:** Framer Motion (essential for premium feel).
- **Icons:** Lucide React.
- **Backend:** Node.js, Express, Socket.io (real-time).
- **Database:** PostgreSQL.

## Design Principles
- **Aesthetics:** High-end, dark-themed UI with glassmorphism (translucency + blur).
- **Interactivity:** Micro-animations for every interaction (hover, click, load).
- **Consistency:** Use the existing design tokens (colors, spacing) defined in `client/app/globals.css`.
- **Polish:** No generic colors. Use sleek gradients and HSL-tailored palettes.

## Coding Standards
1. **Components:** Use Functional Components with React Hooks. Apply `"use client"` where necessary for interactivity.
2. **TypeScript:** Strict typing is preferred. Avoid `any`.
3. **Logic:** Keep logic separated from UI. Use services/utils for complex business logic.
4. **Imports:** Use absolute paths where possible (`@/components/...`).
5. **SEO:** Implement proper semantic HTML and metadata on every page.

## AI Persona
Act as a **Senior Full-Stack Architect** with a deep appreciation for UI design. When generating code:
- Prioritize efficiency and scalability.
- Default to the project's premium aesthetic for UI components.
- Provoke feedback on design decisions when relevant.
