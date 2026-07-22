# Contributing to CodeVerse

Thank you for improving CodeVerse. Contributions should preserve its core promise: a focused, accessible, collaborative development and algorithm-learning environment.

## Development setup

1. Install Node.js 20+ and npm 10+.
2. Copy `server/.env.example` to `server/.env`.
3. Copy `client/.env.example` to `client/.env.local`.
4. Run `npm run install:all` from the repository root.
5. Start the backend with `npm run dev --prefix server` and the frontend with `npm run dev --prefix client`.

Cloud persistence, OAuth, AI providers, remote execution, and public tunnels are optional. Never commit populated environment files or credentials.

## Quality gates

Before opening a pull request, run the checks relevant to your change:

```bash
npm run audit:repo
npm run test
npm run lint
npm run typecheck
npm run build
```

Changes to the algorithm catalog should also run:

```bash
npm run audit:release
```

## Pull requests

- Keep changes focused and explain the user-facing outcome.
- Include screenshots or recordings for visible UI changes.
- Add or update tests for behavior changes.
- Document new environment variables and migrations.
- Describe security implications for authentication, execution, collaboration, AI, or deployment changes.
- Do not commit generated deployments, compiler output, temporary execution files, logs, or diagnostic dumps.

By contributing, you agree that your contribution is licensed under the repository's MIT License.
