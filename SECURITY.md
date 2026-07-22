# Security Policy

## Supported version

Security fixes target the latest commit on `main`. The project is under active development and does not currently maintain multiple release branches.

## Reporting a vulnerability

Use [GitHub private vulnerability reporting](https://github.com/Ayush-Kumar0207/codeverse/security/advisories/new). Do not disclose exploitable details in a public issue, pull request, discussion, screenshot, or log.

Include the affected route or component, reproduction conditions, impact, and a minimal proof of concept. Remove credentials, tokens, personal data, and unrelated workspace content.

## Security boundaries

- Local code execution is intended for trusted development environments. Public multi-tenant execution must use an isolated remote or containerized runtime.
- Production deployments must configure independent `SESSION_SECRET` and `JWT_SECRET` values of at least 32 characters.
- OAuth callback URLs and CORS origins must be restricted to controlled domains.
- Supabase service-role credentials must never be exposed to the browser.
- AI, execution, and deployment endpoints should be rate-limited at the hosting or gateway layer.

Reports will be acknowledged as soon as practical. Valid fixes are coordinated privately before public disclosure.
