# CodeVerse V5 — Three-Minute Cinematic Product Showcase

> **Video edition:** V5. This is a showcase release, not an application version or a claim of a new deployment.

**Title for GitHub Releases:** CodeVerse V5 — Build Together. Prove Every Change.

**Tag:** `showcase-v5`

**Asset:** `CodeVerse_V5_Release_Locked_Compact_AV1_180s_1080p.mp4`

## Experience the workflow

CodeVerse is an open-source collaborative browser IDE that brings code, execution, review, replay, and engineering evidence together in one workspace.

This **three-minute film** follows a specific change through its complete demonstrated lifecycle:

- **00:00–00:25** — CodeVerse workspace and collaboration.
- **00:25–00:40** — Reproduce the empty-array boundary bug (`bestScore([])` returns `-Infinity` instead of `0`).
- **00:40–01:00** — Apply the guard and verify the tests (`[] → 0`, `[72, 94, 81] → 94`, `[-5, -2] → -2`).
- **01:00–01:30** — Explain the change; independent review catches and resolves a separate browser input-type issue.
- **01:30–02:00** — Understanding verification and cross-file impact.
- **02:00–02:30** — Recorded workspace replay and local deployment.
- **02:30–03:00** — Recorded ScoreLens checks, verification evidence, and final identity.

## Authenticity and production notes

- Application screens, code, tests, review outcomes, and workspace interactions shown in the film are based on **recorded local CodeVerse project workflows**.
- Cinematic 3D glass, motion graphics, explanatory captions, and effects are **editorial representations**, not additional recorded application features.
- The instrumental score, **“The Geometry of Victory,”** was generated with Google's music-generation tools and subsequently integrated and mixed with sound-design effects.
- Local development/deployment footage is not a representation of a publicly hosted instance of the particular demo project. The live CodeVerse application itself is available at [codeverse-rho.vercel.app](https://codeverse-rho.vercel.app).
- **V5 is the video edition**, separate from the CodeVerse application version and its product releases.

## Technical delivery

| Property | Value |
| --- | --- |
| Runtime | 180 seconds |
| Resolution | 1920 × 1080 |
| Frame rate | 30 fps |
| Video codec | 10-bit AV1 |
| Audio codec | AAC stereo, 48 kHz |
| File size | 21,916,573 bytes |
| SHA-256 | `c2f90b3c0a6ae312dac72301a9b74cfadfe34c186faf1e7a2cf67b8746be9e21` |

## Links

- [Source code](https://github.com/Ayush-Kumar0207/codeverse)
- [Live CodeVerse application](https://codeverse-rho.vercel.app)
- [CodeVerse interactive demonstration](https://codeverse-rho.vercel.app/demo)
- [Previous V4 showcase](https://github.com/Ayush-Kumar0207/codeverse/releases/tag/showcase-v4-preview)

## Publisher checklist

This file is also the prepared description for the `showcase-v5` GitHub Release.

1. Create **a new GitHub Release**, tagged `showcase-v5` on `main`; mark it as the latest showcase when appropriate, without altering application version tags.
2. Attach the exact **V5 MP4** listed above. Ensure the upload completes and the release download works.
3. Compare the downloaded asset's SHA-256 to the verified checksum above.
4. Once the release and asset are public, merge the README promotion PR.
5. Keep the existing `showcase-v4-preview` release and its assets as an archive.
6. If a YouTube version is published later, add its actual public URL to the README; do not invent a video ID.

Do not merge the prepared README update **before** its GitHub Release asset is online; that would produce a temporary broken featured video link.
