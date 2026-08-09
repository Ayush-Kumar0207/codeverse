# Starter issue set

These are maintainer-ready issue drafts based on gaps observed in the current repository. They are deliberately small enough to review well and useful enough to improve the product. Publish only the issues that are still valid when the tracker is seeded.

## 1. Give the new-project modal complete keyboard dialog behavior

**Suggested labels:** `good first issue`, `accessibility`, `frontend`

`client/components/NewProjectModal.tsx` visually behaves like a modal, but it does not yet expose dialog semantics, move focus into the dialog, restore focus on close, or close on Escape.

Acceptance criteria:

- expose an accessible dialog name with `role="dialog"` and `aria-modal="true"`, or migrate to the existing Radix dialog primitive;
- focus the project-title field when the modal opens;
- keep keyboard focus inside the modal while it is open;
- close on Escape and return focus to the control that opened it;
- add a focused component test covering keyboard open, tab order, Escape, and focus restoration;
- preserve the existing visual design and project-creation behavior.

Likely files: `client/components/NewProjectModal.tsx`, the component that opens it, and a new test under `client/tests/unit/`.

## 2. Add a contributor environment preflight command

**Suggested labels:** `good first issue`, `developer experience`, `tooling`

The setup guide lists the requirements, but contributors currently discover incompatible Node/npm versions or occupied ports after installation has already started.

Acceptance criteria:

- add a cross-platform Node script that checks Node 22+, npm 10+, required workspace directories, and whether the documented client/server ports are already occupied;
- print plain-language fixes and return a non-zero exit code only for blocking checks;
- add a root `npm run doctor` command;
- document the command in `CONTRIBUTING.md`;
- add small tests for version parsing and result formatting without making network requests.

Likely files: a new file under `scripts/`, `package.json`, `CONTRIBUTING.md`, and tests beside the script.

## 3. Cover unreachable and degraded public-status states in the browser suite

**Suggested labels:** `good first issue`, `testing`, `reliability`

`client/tests/e2e/production-contracts.spec.ts` verifies a successful status response. The UI also contains intentional degraded and unreachable states that should remain understandable during an incident.

Acceptance criteria:

- use Playwright request routing to cover a `503` degraded response and a network failure;
- verify the correct plain-language status heading and local-work safety message;
- verify the refresh control can recover after the route begins returning a healthy response;
- keep the test deterministic and independent of the production API;
- do not weaken the existing hosted contract checks.

Likely files: `client/tests/e2e/production-contracts.spec.ts` and, only if a genuine accessibility problem is exposed, `client/app/status/page.tsx`.

## 4. Document a two-instance collaboration debugging session

**Suggested labels:** `documentation`, `collaboration`, `help wanted`

The benchmark proves that two Socket.IO instances can share Redis-backed room state, but contributors do not yet have a short debugging walkthrough for running that topology and observing reconnect behavior.

Acceptance criteria:

- document the smallest reproducible two-server setup using the existing Docker/Redis tooling;
- include the expected join, edit propagation, reconnect, and permission-rejection signals;
- include cleanup commands and a troubleshooting section for ports, Redis, and stale sessions;
- link to the relevant server modules rather than copying implementation details;
- validate every command on a clean local checkout.

Likely files: a new page under `docs/` plus links from `CONTRIBUTING.md` and `docs/COLLABORATION_BENCHMARKS.md`.

## 5. Add a small-screen panel navigation contract

**Suggested labels:** `testing`, `frontend`, `responsive`, `help wanted`

The editor adapts several dense panels for smaller screens, but the main Playwright workspace journey currently exercises desktop dimensions only.

Acceptance criteria:

- add one mobile-sized Playwright scenario for opening the editor and moving between the explorer, editor, output, Assistant, Team, Proof, and Trace surfaces;
- assert that the active panel is visible and the previous panel does not trap focus off-screen;
- use role/name selectors instead of implementation-specific class selectors;
- avoid screenshot-only assertions;
- document any intentionally desktop-only feature discovered during the work.

Likely files: `client/tests/e2e/workspace.spec.ts` and any component where the test exposes a real navigation defect.

## 6. Make benchmark results easy to compare without changing the benchmark

**Suggested labels:** `performance`, `tooling`, `help wanted`

`server/scripts/benchmark-collaboration.js` already emits structured JSON to stdout. A small comparison utility would make regressions visible without adding another load generator.

Acceptance criteria:

- accept two saved benchmark JSON files and compare p50/p95/p99 connection, join, acknowledgement, propagation, and reconnect latency;
- report absolute and percentage changes with clear `improved`, `regressed`, or `unchanged` wording;
- allow configurable regression thresholds and return a non-zero exit code when a threshold is exceeded;
- include fixture-based unit tests;
- document the hardware/topology caveat so results from unlike machines are not presented as equivalent.

Likely files: a new script and tests under `server/scripts/`, `server/package.json`, and `docs/COLLABORATION_BENCHMARKS.md`.

## Not starter issues

Changes to the room protocol, Redis consistency model, authorization boundaries, CRDT persistence, container isolation, or EvidenceOS sealing should not be labelled `good first issue`. They need a design discussion and maintainer guidance before implementation.
