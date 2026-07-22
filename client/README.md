# CodeVerse client

This directory contains the Next.js 15 and React 19 client for CodeVerse. It provides the public experience, authenticated dashboard, Monaco workspace, collaboration panels, algorithm encyclopedia, narration, and 2D/3D AlgoTrace renderers.

Use the [root README](../README.md) for complete setup, architecture, environment variables, API documentation, and deployment guidance.

## Commands

```bash
cp .env.example .env.local
npm ci
npm run dev
npm run lint
npm run typecheck
npm run test:unit
npm run test:e2e
npm run build
npm run release:audit
```

Generated catalog reports are validated by the release audits. Do not commit local build output, diagnostic dumps, or runtime-generated deployments.

## Workspace architecture

The editor route is a thin entry point. Workspace behavior lives under `features/workspace/`, separated into project fixtures, collaboration, execution, deployment, layout, timeline, editor, explorer, team, preview, and dialog modules. This keeps realtime and recovery logic independently testable while the route only selects the feature shell.

## Automated tests

- `npm run test:unit` runs Vitest and React Testing Library with enforced coverage thresholds.
- `npm run test:e2e` starts the local client and backend, then runs Playwright in Chromium.
- Browser coverage verifies the editor shell, lazy-loaded cinematic 3D presentation controls, and two isolated sessions synchronizing presence plus organizer edit permissions through the real Socket.IO server.