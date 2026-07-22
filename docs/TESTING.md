# Testing and release gates

CodeVerse uses layered verification so failures are caught at the smallest useful boundary.

| Layer | Command | Coverage |
| --- | --- | --- |
| Repository hygiene | `npm run audit:repo` | Required files, licenses, generated artifacts, oversized files, credential patterns |
| Server tests | `npm run test:server` | 17 API, security, runtime, deployment, and live Socket.IO integration tests |
| Client unit/component tests | `npm run test:client` | Vitest + React Testing Library with 80% line/function/statement and 70% branch minimums |
| Browser workflows | `npm run test:e2e` | Playwright Chromium coverage for editor surfaces, lazy-loaded 3D presentation/navigation, and two-browser realtime permission synchronization |
| Client lint | `npm run lint` | Next.js and React lint rules |
| Client types | `npm run typecheck` | Strict TypeScript without emitting build output |
| Production build | `npm run build` | Next.js compilation, route generation, and static optimization |
| Release audits | `npm run audit:release` | Routes, visual contrast, collaboration, 422 algorithms, 3D traces, and 822 C++ implementations |
| Dependency security | `npm audit --omit=dev --audit-level=high` | Known high-severity production dependency vulnerabilities |
| Security scanning | GitHub CodeQL | JavaScript and TypeScript data-flow and security analysis |

`npm run verify` executes the deterministic repository, server, client-unit, lint, type, catalog, and production-build gates. `npm run verify:full` adds the Chromium E2E suite.

GitHub Actions runs every layer for pull requests and pushes to `main`. Failed browser runs retain Playwright traces, screenshots, and videos for diagnosis. Dependabot proposes grouped dependency updates so maintenance remains reviewable.