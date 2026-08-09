# Contributing to CodeVerse

CodeVerse is feature-complete enough to be useful, but there is plenty of work that can make it clearer, faster, safer, and easier to maintain. You do not need to understand the entire platform before contributing.

## Pick a path

| If you enjoy… | A good place to start |
| --- | --- |
| Product and UX | Empty states, onboarding, accessibility, responsive behavior, and plain-language copy |
| Frontend engineering | Workspace panels, Monaco integrations, presence cursors, and visualizers |
| Backend engineering | Collaboration state, authorization, execution boundaries, and status telemetry |
| Testing | Browser contracts, reconnect cases, accessibility checks, and failure-path coverage |
| Documentation | Setup guides, diagrams, examples, and troubleshooting notes |

Look for issues labelled [`good first issue`](https://github.com/Ayush-Kumar0207/codeverse/labels/good%20first%20issue) or [`help wanted`](https://github.com/Ayush-Kumar0207/codeverse/labels/help%20wanted). If an issue is unclear, leave a comment before investing time; a maintainer will help narrow the acceptance criteria.

Maintainers can use [the starter issue set](docs/STARTER_ISSUES.md) when preparing well-scoped work for new contributors. It records the evidence, likely files, and acceptance criteria behind each issue so the public tracker stays useful.

## A small first contribution

The easiest way to learn the repository is to fix one observable problem:

1. Reproduce it in the [live app](https://codeverse-rho.vercel.app) or locally.
2. Find the smallest component, service, test, or document that owns it.
3. Add a focused change and the nearest useful test.
4. Run the checks for the area you touched.
5. Open a pull request that explains the user-facing difference.

Small, complete pull requests are easier to review than broad rewrites. You never need to add an unrelated feature to make a contribution feel substantial.

## Development setup

### Requirements

- Node.js 22 or newer
- npm 10 or newer
- Git
- Docker only when working on Redis, container isolation, or the full infrastructure path

### Run locally

```bash
git clone https://github.com/Ayush-Kumar0207/codeverse.git
cd codeverse
npm run install:all
```

Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env.local`, then start both applications:

```bash
# Terminal 1
npm run dev --prefix server

# Terminal 2
npm run dev --prefix client
```

The core IDE works without cloud credentials. Supabase, OAuth, hosted AI, remote execution, and public tunnels are optional integrations. Never commit populated environment files, tokens, or private workspace data.

## Repository map

| Area | Location | Notes |
| --- | --- | --- |
| Next.js application | `client/app/` | Routes, public pages, dashboard, and editor entry points |
| Workspace experience | `client/features/workspace/` | Editor shell, collaboration UI, EvidenceOS views, and workspace state |
| Reusable UI | `client/components/` | Shared product components and primitives |
| Browser and unit tests | `client/tests/` | Vitest components plus Playwright user journeys |
| API and realtime server | `server/src/` | Routes, services, security middleware, sockets, and persistence |
| Server tests | `server/tests/` | Node test runner suites for contracts and failure paths |
| Shared contracts | `shared/` | Cross-package event names and type declarations |
| Deployment infrastructure | `docker-compose.yml`, `infra/` | Local Redis and Kubernetes examples |

The server remains authoritative for roles, permissions, proof verification, and durable collaboration state. The browser may preview unverified evidence, but it must not claim that a server-only operation succeeded.

## Quality gates

Run the narrowest relevant checks while developing, then the complete local gate before a substantial pull request:

```bash
npm run audit:repo
npm run test
npm run lint
npm run typecheck
npm run build
```

Changes to application routes, visual systems, collaboration contracts, algorithm data, or cinematic visualizers should also run:

```bash
npm run audit:release
```

Use `npm run verify` for the standard release gate and `npm run verify:full` when your environment supports the Playwright browser suite.

## Pull requests

- Keep the change focused and explain the problem before the implementation.
- Include screenshots or a short recording for visible changes.
- Add or update tests for behavior changes.
- Document new environment variables, migrations, and rollout steps.
- Call out security implications for authentication, execution, collaboration, AI, or deployment changes.
- Never commit generated deployments, compiler output, temporary execution files, logs, diagnostic dumps, secrets, or personal data.
- Be explicit about what you did not test.

Maintainers may ask for a smaller scope when a proposal mixes independent concerns. That is a reviewability decision, not a rejection of the idea.

## Proposing larger work

Open a [GitHub Discussion](https://github.com/Ayush-Kumar0207/codeverse/discussions) before starting a new subsystem or changing a public contract. Explain:

- the user problem;
- why the current workflow is insufficient;
- the smallest viable change;
- compatibility and security risks;
- how success can be tested.

CodeVerse is currently under a feature freeze. Reliability, accessibility, documentation, security, performance, and contributor-experience improvements are welcome. Large convenience features need unusually strong evidence that they strengthen the core workflow.

## Community standards

Participation is governed by the [Code of Conduct](CODE_OF_CONDUCT.md). Security findings belong in [private vulnerability reporting](https://github.com/Ayush-Kumar0207/codeverse/security/advisories/new), not public issues.

By contributing, you agree that your contribution is licensed under the repository's [MIT License](LICENSE.txt).
