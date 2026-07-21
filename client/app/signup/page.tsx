"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  Command,
  Github,
  Loader2,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Users,
} from "lucide-react";
import { registerRequest } from "@/services/auth";
import { getOAuthUrl } from "@/services/oauth";
import { cn } from "@/lib/utils";

const launchModes = [
  {
    id: "team",
    title: "Team workspace",
    summary: "Start with organizer controls, collaborators, and shared files ready.",
    badge: "recommended",
    icon: Users,
    accent: "text-teal-200",
    panel: "border-teal-300/35 bg-teal-300/10",
    files: ["main.cpp", "team.json", "permissions.ts", "README.md"],
    checks: ["Organizer access", "Live collaboration", "Snapshot recovery"],
  },
  {
    id: "solo",
    title: "Solo prototype",
    summary: "Open a focused coding room for experiments, runs, and quick deployment.",
    badge: "fast start",
    icon: TerminalSquare,
    accent: "text-amber-200",
    panel: "border-amber-300/35 bg-amber-300/10",
    files: ["app.tsx", "runner.json", "deploy.json", "notes.md"],
    checks: ["Private workspace", "Run output", "Deploy-ready files"],
  },
  {
    id: "demo",
    title: "Explore first",
    summary: "Try the workspace experience before creating credentials.",
    badge: "no account",
    icon: Play,
    accent: "text-rose-200",
    panel: "border-rose-300/35 bg-rose-300/10",
    files: ["demo.cpp", "layout.tsx", "timeline.json", "guide.md"],
    checks: ["Guided tour", "Sample files", "No setup needed"],
  },
] as const;

type LaunchModeId = (typeof launchModes)[number]["id"];

export default function SignUpPage() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<LaunchModeId>("team");
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeMode = useMemo(
    () => launchModes.find((mode) => mode.id === selectedMode) || launchModes[0],
    [selectedMode]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await registerRequest(form);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#06090d] text-slate-100">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(94,234,212,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(245,196,81,0.1)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(20,184,166,0.2),transparent_30%,rgba(244,63,94,0.1)_62%,transparent_82%),linear-gradient(180deg,rgba(0,0,0,0.05),#06090d_86%)]" />
      </div>

      <div className="relative z-10">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-300 text-black shadow-lg shadow-teal-300/20">
              <Command className="h-6 w-6" />
            </span>
            <span className="text-xl font-black text-white">CodeVerse</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 px-3 text-sm font-bold text-slate-200 transition hover:bg-white/10 sm:px-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-md bg-white/[0.06] px-3 text-sm font-bold text-white transition hover:bg-white/10 sm:px-4"
            >
              Sign In
            </Link>
          </div>
        </header>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-12 pt-4 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="space-y-5">
            <div className="rounded-lg border border-white/10 bg-[#081113]/92 p-6 shadow-2xl shadow-black/35 backdrop-blur md:p-8">
              <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-black uppercase text-teal-100">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Workspace setup
              </div>
              <h1 className="max-w-3xl text-4xl font-black text-white md:text-6xl">
                Choose how CodeVerse should open for you.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                Get Started now prepares a first workspace path. Sign In stays for returning users.
              </p>

              <div className="mt-7 grid gap-3">
                {launchModes.map((mode) => {
                  const Icon = mode.icon;
                  const isActive = mode.id === selectedMode;

                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSelectedMode(mode.id)}
                      className={cn(
                        "group flex min-h-24 w-full items-start gap-4 rounded-lg border p-4 text-left transition",
                        isActive
                          ? mode.panel
                          : "border-white/10 bg-black/25 hover:border-white/20 hover:bg-white/[0.04]"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/10 bg-black/30",
                          mode.accent
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-black text-white">{mode.title}</span>
                          <span className="rounded border border-white/10 px-2 py-0.5 text-[11px] font-bold uppercase text-slate-400">
                            {mode.badge}
                          </span>
                        </span>
                        <span className="mt-2 block text-sm leading-6 text-slate-400">{mode.summary}</span>
                      </span>
                      {isActive && <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-teal-200" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {activeMode.checks.map((check) => (
                <div key={check} className="rounded-lg border border-white/10 bg-black/30 p-4">
                  <CheckCircle2 className="mb-3 h-5 w-5 text-teal-300" />
                  <div className="text-sm font-bold text-slate-100">{check}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="overflow-hidden rounded-lg border border-white/10 bg-[#081113]/92 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="flex h-11 items-center gap-3 border-b border-white/10 bg-black/35 px-4">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-teal-300" />
                </div>
                <div className="min-w-0 flex-1 text-center text-[10px] font-black uppercase text-slate-500">
                  launch preview
                </div>
              </div>

              <div className="grid min-h-[26rem] grid-cols-[150px_minmax(0,1fr)]">
                <aside className="border-r border-white/10 bg-black/30 p-4">
                  <div className="mb-4 text-[10px] font-black uppercase text-slate-500">Files</div>
                  {activeMode.files.map((file, index) => (
                    <div
                      key={file}
                      className={cn(
                        "mb-2 flex h-10 items-center gap-2 rounded-md px-3 text-sm",
                        index === 0 ? "bg-teal-300/10 text-teal-100" : "text-slate-500"
                      )}
                    >
                      <Code2 className="h-4 w-4" />
                      <span className="truncate">{file}</span>
                    </div>
                  ))}
                </aside>

                <section className="grid min-w-0 grid-rows-[1fr_110px] bg-[#071519]">
                  <div className="p-5 font-mono text-sm">
                    <div className="mb-5 flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
                      <ShieldCheck className="h-4 w-4 text-teal-300" />
                      {activeMode.title}
                    </div>
                    {[
                      "const room = await CodeVerse.prepare();",
                      `room.mode = '${activeMode.id}';`,
                      "workspace.permissions.load();",
                      "timeline.snapshot('first-clean-state');",
                    ].map((line, index) => (
                      <div key={line} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 leading-8">
                        <span className="text-right text-slate-600">{index + 1}</span>
                        <span className="break-words text-slate-200">{line}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 bg-black/45 p-4">
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase text-slate-500">
                      <TerminalSquare className="h-4 w-4 text-amber-300" />
                      Next action
                    </div>
                    <div className="rounded-md border border-white/10 bg-black/35 p-3 text-xs leading-5 text-teal-100">
                      {selectedMode === "demo"
                        ? "Open the demo workspace without creating an account."
                        : "Create an organizer profile, then open your first workspace."}
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#081113]/92 p-6 shadow-2xl shadow-black/40 backdrop-blur">
              {selectedMode === "demo" ? (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-black text-white">Explore before signing up.</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      Open the demo workspace now, then create an account when you are ready to keep projects.
                    </p>
                  </div>
                  <Link
                    href="/demo"
                    className="inline-flex h-12 w-full items-center justify-center rounded-md bg-teal-300 px-5 text-sm font-black text-black shadow-xl shadow-teal-300/15 transition hover:bg-teal-200"
                  >
                    Try Demo Workspace
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedMode("team")}
                    className="inline-flex h-11 w-full items-center justify-center rounded-md border border-white/10 px-5 text-sm font-bold text-slate-200 transition hover:bg-white/10"
                  >
                    Create account instead
                  </button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <h2 className="text-2xl font-black text-white">Create your organizer profile.</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      This creates the account. Your selected workspace path opens after sign in.
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="signup-username" className="text-sm font-bold text-slate-200">Username</label>
                    <input
                      id="signup-username"
                      name="username"
                      autoComplete="username"
                      className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-teal-300/60 focus:ring-2 focus:ring-teal-300/15"
                      placeholder="Choose a username"
                      value={form.username}
                      onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="signup-email" className="text-sm font-bold text-slate-200">Email</label>
                    <input
                      id="signup-email"
                      name="email"
                      autoComplete="email"
                      className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-teal-300/60 focus:ring-2 focus:ring-teal-300/15"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="signup-password" className="text-sm font-bold text-slate-200">Password</label>
                    <input
                      id="signup-password"
                      name="password"
                      autoComplete="new-password"
                      type="password"
                      className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-teal-300/60 focus:ring-2 focus:ring-teal-300/15"
                      placeholder="Create a password"
                      value={form.password}
                      onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 w-full items-center justify-center rounded-md bg-teal-300 px-5 text-sm font-black text-black shadow-xl shadow-teal-300/15 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating profile
                      </>
                    ) : (
                      <>
                        Prepare Workspace
                        <Rocket className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>

                  <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase text-slate-500">
                    <span className="h-px flex-1 bg-white/10" />
                    or
                    <span className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <a
                      href={getOAuthUrl("github")}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-slate-100 transition hover:border-teal-300/40 hover:bg-teal-300/10"
                    >
                      <Github className="h-5 w-5" />
                      GitHub
                    </a>

                    <a
                      href={getOAuthUrl("google")}
                      className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-slate-100 transition hover:border-amber-300/40 hover:bg-amber-300/10"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-black text-slate-900">
                        G
                      </span>
                      Google
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
