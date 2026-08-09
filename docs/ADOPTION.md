# Adoption and Community Scorecard

CodeVerse will measure reach without turning the repository into a vanity-metric campaign. The purpose of this scorecard is to learn whether people can discover the project, successfully try it, return to it, and contribute to it.

## What we measure

| Signal | Source | Why it matters | Publication cadence |
| --- | --- | --- | --- |
| Production availability | Public status page and scheduled smoke workflow | People cannot evaluate a demo that is unreliable | Continuous |
| Repository visitors and clones | GitHub traffic | Shows whether launch content leads to technical evaluation | Monthly |
| Stars and forks | GitHub | Lightweight discovery and intent signals, not proof of usage | Monthly |
| External contributors | GitHub contributors and merged pull requests | Strongest public signal of a functioning OSS community | Per release |
| Issue response and resolution | GitHub issues | Shows whether maintainership is active | Monthly |
| Releases | GitHub releases | Demonstrates that changes are packaged and explained | Per release |
| Returning product usage | Privacy-respecting hosting analytics | Distinguishes a one-time click from recurring value | Monthly |
| Qualitative feedback | Discussions and user interviews | Explains the numbers and exposes comprehension problems | Monthly summary |

## Baseline

The public baseline begins with the first community-focused release. Until enough observations exist, the project will report a metric as **not yet established** rather than presenting a fabricated zero-to-hero story.

The first monthly update should record:

- unique repository visitors and clones;
- stars, forks, watchers, and unique external contributors;
- opened, closed, and median-first-response issue counts;
- merged community pull requests;
- production-monitor pass rate;
- known cold-start or infrastructure limitations;
- three recurring pieces of user feedback.

## Directional goals, not eligibility claims

For the first 90 days, CodeVerse aims to:

- help at least five people complete the local setup without maintainer intervention;
- merge at least three useful pull requests from contributors outside the original project;
- publish at least two explained releases;
- keep all production contract checks green or document every regression;
- turn repeated feedback into a small, testable issue rather than a new subsystem.

These are project goals, not official thresholds for any external program.

## Integrity rules

- Do not buy stars, followers, traffic, reviews, or contributions.
- Do not describe repository visitors as active users.
- Do not count the maintainer's own pull requests as external contributions.
- Do not hide failed deployments or remove constructive criticism.
- Do not add analytics that captures source code, prompts, personal data, or workspace content.

## Monthly update template

```markdown
## CodeVerse community update — YYYY-MM

What shipped:
- …

Community:
- Unique external contributors: …
- Community PRs merged: …
- Issues opened / resolved: … / …

Reach:
- GitHub visitors / clones: … / …
- Stars / forks: … / …

Reliability:
- Hosted contract result: …
- Known limitations: …

What we learned:
- …

Next month:
- …
```
