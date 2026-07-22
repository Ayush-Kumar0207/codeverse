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
npm run build
npm run release:audit
```

Generated catalog reports are validated by the release audits. Do not commit local build output, diagnostic dumps, or runtime-generated deployments.
