# Testing and release gates

CodeVerse uses layered verification so failures are caught at the smallest useful boundary.

| Layer | Command | Coverage |
| --- | --- | --- |
| Repository hygiene | `npm run audit:repo` | Required files, licenses, generated artifacts, oversized files, credential patterns |
| Server tests | `npm test` | Health API, deployment path safety, HTML escaping, JWT behavior, runtime mapping |
| Client lint | `npm run lint` | Next.js and React lint rules |
| Client types | `npm run typecheck` | TypeScript without emitting build output |
| Production build | `npm run build` | Next.js compilation, route generation, and static optimization |
| Release audits | `npm run audit:release` | Routes, visual contrast, collaboration, 422 algorithms, 3D traces, and 822 C++ builds |
| Dependency security | `npm audit --omit=dev --audit-level=high` | Known high-severity production dependency vulnerabilities |
| Security scanning | GitHub CodeQL | JavaScript and TypeScript data-flow and security analysis |

GitHub Actions runs these gates for every pull request and every push to `main`. Dependabot proposes grouped dependency updates so maintenance remains reviewable.
