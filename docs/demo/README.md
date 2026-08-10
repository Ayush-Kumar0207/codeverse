# Product demo

The canonical CodeVerse launch demo is recorded from the real local application with Playwright. It does not use a personal browser profile, cloud credentials, simulated product output, or unrelated desktop content.

## Rebuild

From the repository root:

```bash
npm run demo:build
```

The recorder starts the existing test servers, follows the anonymous product journey, and writes its raw browser video under the ignored `docs/demo/raw/` directory. The packaging step then uses FFmpeg to create the checked-in H.264 MP4, burn in the reviewed captions from `codeverse-demo.srt`, add a short closing hold, and generate the poster frame. It fails when the result falls outside the maintained 75–90 second launch window.

Use `npm run demo:record` or `npm run demo:package` separately while iterating on only one half of the workflow. FFmpeg must be available on `PATH` for packaging; the duration gate reads the generated MP4 movie header directly so it also works in restricted CI and Windows shells.

The maintained storyboard and narration guidance live in [`../DEMO_SCRIPT.md`](../DEMO_SCRIPT.md). Review the final asset for readable UI, accurate captions, absence of personal information, and a duration between 75 and 90 seconds before publishing it.
