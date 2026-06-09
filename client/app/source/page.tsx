import Link from "next/link";
import { ArrowLeft, Code2, Command, GitBranch } from "lucide-react";

const sourceEntries = [
  "client/app/page.tsx",
  "client/app/demo/page.tsx",
  "client/app/editor/[id]/page.tsx",
  "server/src/controllers/auth.controller.js",
  "server/src/sockets/index.js",
];

export default function SourcePage() {
  return (
    <main className="min-h-screen bg-[#061012] px-4 py-6 text-slate-100">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-300 text-black">
              <Command className="h-6 w-6" />
            </span>
            <span className="text-xl font-black">CodeVerse</span>
          </Link>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-bold text-slate-200 transition hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </header>

        <section className="rounded-lg border border-white/10 bg-[#081113] p-6 md:p-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-rose-300/20 bg-rose-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-rose-100">
            <GitBranch className="h-3.5 w-3.5" />
            Source
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">CodeVerse source workspace.</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
            This route keeps the footer link inside the app instead of sending visitors to a generic external page.
          </p>

          <div className="mt-8 rounded-md border border-white/10 bg-black/30 p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
              <Code2 className="h-4 w-4 text-teal-300" />
              Repository entry points
            </div>
            <div className="grid gap-2 font-mono text-sm text-teal-100">
              {sourceEntries.map((entry) => (
                <span key={entry} className="rounded-md border border-white/10 bg-[#05090b] px-3 py-2">
                  {entry}
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              These are the main public, editor, auth, collaboration, and socket files behind the app experience.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
