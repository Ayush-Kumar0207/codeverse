# CodeVerse Roadmap

CodeVerse has reached a feature-complete reliability milestone. The roadmap is no longer a promise to add every plausible editor feature; it is a commitment to make the existing product dependable, understandable, and useful to a real community.

## Current focus

### 1. Reliability in public

- Keep hosted API, authentication, Socket.IO, and deployment contracts green.
- Publish regressions and operational limitations instead of hiding them.
- Extend reconnect, multi-instance, and failure-path testing as real incidents reveal gaps.
- Repeat collaboration benchmarks when infrastructure or protocol behavior changes.

### 2. A contributor-friendly codebase

- Maintain genuinely scoped `good first issue` and `help wanted` work.
- Improve architecture notes and setup diagnostics around common contributor failures.
- Reduce large components when a real change demonstrates a useful boundary.
- Make security, migrations, rollout, and recovery explicit in pull requests.

### 3. Accessibility and comprehension

- Test keyboard navigation and focus order across the workspace.
- Replace specialist language with progressive disclosure where it blocks normal users.
- Improve reduced-motion, contrast, screen-reader names, and mobile fallbacks.
- Validate onboarding with people who did not build the product.

### 4. Evidence-backed adoption

- Publish honest usage, contributor, reliability, and release signals.
- Collect qualitative feedback from developers, students, and reviewers.
- Prioritize problems observed in real use over speculative product breadth.

## Good contribution areas

- Reproducible bugs and missing failure states
- Accessibility improvements with before-and-after evidence
- Documentation, diagrams, setup checks, and troubleshooting
- Tests for reconnects, permissions, migrations, and recovery
- Performance measurements with a reproducible method
- Security hardening with a clear threat model
- Small UX changes that make an existing capability easier to discover or understand

## Not scheduled

- A general plugin or extension marketplace
- A broad workspace-template gallery
- New AI reviewer personas without evidence that the existing review flow needs them
- Large visual rewrites that do not improve comprehension or accessibility

These ideas are not permanently forbidden. They simply require evidence that they solve a real problem without weakening reliability or maintainability.

## How priorities change

Priorities are discussed in public GitHub Discussions and translated into small, testable issues. Security fixes and production regressions take precedence. The primary maintainer makes the final sequencing decision and records the reason when it is not obvious from the issue.
