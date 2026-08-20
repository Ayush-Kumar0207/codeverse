import Link from "next/link";

export default function DemoVideoPage() {
  return (
    <main className="min-h-screen bg-[#061012] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-8 sm:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-300">CodeVerse product tour</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Watch the narrated 76-second demo</h1>
          </div>
          <Link
            href="/demo"
            className="rounded-xl border border-teal-300/30 bg-teal-300/10 px-4 py-2 text-sm font-semibold text-teal-100 transition hover:bg-teal-300/15"
          >
            Try the interactive demo
          </Link>
        </div>

        <video
          className="w-full rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/40"
          controls
          playsInline
          preload="metadata"
          poster="/media/codeverse-demo-poster.jpg"
          aria-label="CodeVerse narrated product tour"
        >
          <source src="/media/codeverse-demo.mp4" type="video/mp4" />
          <track
            kind="captions"
            src="/media/codeverse-demo.vtt"
            srcLang="en"
            label="English"
          />
          Your browser does not support HTML5 video.
        </video>

        <p className="mt-4 text-sm leading-6 text-slate-400">
          Narration and background music are included in the published video. English captions are optional and remain off until you enable them from the player controls.
        </p>
      </div>
    </main>
  );
}
