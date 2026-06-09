import Link from "next/link";
import { ArrowLeft, Command, FileText } from "lucide-react";

const terms = [
  "Use CodeVerse workspaces for projects you are allowed to create, edit, execute, and deploy.",
  "Organizer controls decide who can edit, who can remain in a workspace, and when a project state is restored.",
  "Deployment previews are development previews and should be reviewed before sharing externally.",
  "Team members are responsible for checking code changes, execution results, and restored versions before continuing work.",
];

export default function TermsPage() {
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
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-100">
            <FileText className="h-3.5 w-3.5" />
            Terms
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">Terms for using CodeVerse.</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
            These terms are written for the local development build shown on this machine.
          </p>

          <div className="mt-8 grid gap-3">
            {terms.map((term, index) => (
              <div key={term} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 rounded-md border border-white/10 bg-black/25 p-4">
                <span className="font-mono text-sm font-bold text-amber-200">{String(index + 1).padStart(2, "0")}</span>
                <p className="text-sm leading-7 text-slate-400">{term}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
