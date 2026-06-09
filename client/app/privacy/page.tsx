import Link from "next/link";
import { ArrowLeft, Command, ShieldCheck } from "lucide-react";

const privacyItems = [
  {
    title: "Workspace Data",
    body: "CodeVerse stores project files, execution output, deployment routes, and collaboration state only to provide the workspace experience.",
  },
  {
    title: "Account Data",
    body: "Sign-in details are used for authentication, project ownership, collaborator permissions, and organizer-only controls.",
  },
  {
    title: "Local Development",
    body: "In this local build, API and deployment requests are served by the configured local backend instead of a third-party production service.",
  },
];

export default function PrivacyPage() {
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
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-teal-100">
            <ShieldCheck className="h-3.5 w-3.5" />
            Privacy
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">Privacy for CodeVerse users.</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
            This page explains what the app needs to remember so teams can collaborate, deploy, and recover workspace state.
          </p>

          <div className="mt-8 grid gap-4">
            {privacyItems.map((item) => (
              <article key={item.title} className="rounded-md border border-white/10 bg-black/25 p-5">
                <h2 className="text-lg font-bold text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-7 text-slate-400">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
