# Testing and release gates

CodeVerse uses layered verification so failures are caught at the smallest useful boundary.

| Layer | Command | Coverage |
| --- | --- | --- |
| Repository hygiene | `npm run audit:repo` | Required files, licenses, generated artifacts, oversized files, credential patterns |
| Server tests | `npm run test:server` | API, security, runtime, multilingual AST/compiler, EvidenceOS, deployment, Yjs convergence, reconnect, idempotency, and live Socket.IO tests |
| Distributed integration | `TEST_REDIS_URL=redis://127.0.0.1:6379 npm run test:server` | Two Socket.IO instances sharing Redis presence, room revision, pub/sub, and CRDT delivery; Redis is mandatory in CI |
| Collaboration load | `npm run benchmark:collaboration --prefix server` | Reproducible 100/500-client p50/p95/p99, cross-instance fan-out, and reconnect evidence |
| Client unit/component tests | `npm run test:client` | Vitest + React Testing Library with 80% line/function/statement and 70% branch minimums |
| Browser workflows | `npm run test:e2e` | Playwright coverage for editor surfaces, lazy-loaded 3D, two-browser realtime permissions, public status, OAuth callback safety, and deployment authentication |
| Client lint | `npm run lint` | Next.js and React lint rules |
| Client types | `npm run typecheck` | Strict TypeScript without emitting build output |
| Production build | `npm run build` | Next.js compilation, route generation, and static optimization |
| Release audits | `npm run audit:release` | Routes, visual contrast, collaboration, 422 algorithms, 3D traces, and 822 C++ implementations |
| Dependency security | `npm audit --omit=dev --audit-level=high` | Known high-severity production dependency vulnerabilities |
| Security scanning | GitHub CodeQL | JavaScript and TypeScript data-flow and security analysis |
| Hosted contracts | `production-smoke.yml` every 15 minutes | Vercel page/status, Render API/status, Socket.IO handshake, OAuth redirects, and deployment authorization |

`npm run verify` executes the deterministic repository, server, client-unit, lint, type, catalog, and production-build gates. `npm run verify:full` adds the Chromium E2E suite.

GitHub Actions runs every layer for pull requests and pushes to `main`, provides a real Redis service for the multi-instance test, requires all six native language toolchains, and separately executes the digest-pinned production EvidenceOS Docker path. Scheduled hosted probes expose their result through the production uptime badge. Failed browser runs retain Playwright traces, screenshots, and videos for diagnosis.
