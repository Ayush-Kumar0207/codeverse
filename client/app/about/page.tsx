"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Code2,
  Command,
  GitBranch,
  Layers3,
  MessageSquareText,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Mission", href: "#mission" },
  { label: "Build Loop", href: "#build-loop" },
  { label: "Creator", href: "#creator" },
];

const productPillars = [
  {
    icon: BrainCircuit,
    title: "Context-Aware AI",
    body: "Editor assistance, algorithm tracing, and review prompts stay beside the work they reference.",
    accent: "text-cyan-300",
  },
  {
    icon: Users,
    title: "Shared Workspaces",
    body: "Projects, presence, chat, and execution history stay connected so teams keep momentum.",
    accent: "text-emerald-300",
  },
  {
    icon: GitBranch,
    title: "Launch Path",
    body: "The path from sandbox to saved project to deployment is short enough to keep ideas moving.",
    accent: "text-amber-300",
  },
];

const capabilities = [
  "Browser-ready coding sandboxes",
  "Real-time collaboration surfaces",
  "Integrated project and save history",
  "Algorithm learning with visual traces",
  "AI chat scoped to the active workspace",
  "Deployment-oriented project flow",
];

const workflow = [
  {
    icon: Code2,
    label: "Create",
    text: "Start from a blank project, a demo sandbox, or an algorithm learning flow.",
  },
  {
    icon: MessageSquareText,
    label: "Collaborate",
    text: "Discuss, edit, run, and review without scattering the work across tabs.",
  },
  {
    icon: Rocket,
    label: "Ship",
    text: "Save the project history and move the build toward a deployable state.",
  },
];

const previewFiles = ["app.tsx", "api/run.ts", "trace.json"];

function WorkspacePreview() {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden rounded-sm border border-white/10 bg-[#050914] shadow-2xl shadow-black/40"
    >
      <div className="flex h-10 items-center justify-between border-b border-white/10 bg-white/[0.03] px-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
        </div>
        <div className="font-mono text-xs text-slate-500">codeverse.workspace</div>
      </div>

      <div className="grid min-h-[28rem] grid-cols-[4.5rem_1fr] sm:grid-cols-[10rem_1fr]">
        <div className="border-r border-white/10 bg-black/20 p-3">
          <div className="mb-5 flex h-8 items-center justify-center rounded bg-indigo-500/15 text-indigo-200 sm:justify-start sm:px-3">
            <Layers3 className="h-4 w-4" />
            <span className="ml-2 hidden text-xs font-semibold sm:inline">Project</span>
          </div>
          <div className="space-y-2">
            {previewFiles.map((file, index) => (
              <div
                key={file}
                className={`h-8 rounded px-2 py-2 font-mono text-[11px] ${
                  index === 0 ? "bg-white/10 text-slate-100" : "text-slate-500"
                }`}
              >
                <span className="hidden sm:inline">{file}</span>
                <span className="sm:hidden">{index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-rows-[1fr_auto]">
          <div className="relative p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <div className="text-sm font-semibold text-white">Realtime editor</div>
                <div className="text-xs text-slate-500">Team presence active</div>
              </div>
              <div className="flex -space-x-2">
                {["A", "S", "J"].map((name, index) => (
                  <span
                    key={name}
                    className={`flex h-7 w-7 items-center justify-center rounded-full border border-[#050914] text-[10px] font-bold text-white ${
                      index === 0 ? "bg-indigo-500" : index === 1 ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs sm:text-sm">
              <div className="grid grid-cols-[2rem_1fr] text-slate-500">
                <span>01</span>
                <span>
                  <span className="text-cyan-300">const</span>{" "}
                  <span className="text-slate-100">workspace</span>{" "}
                  <span className="text-slate-400">=</span>{" "}
                  <span className="text-emerald-300">await</span>{" "}
                  <span className="text-indigo-300">CodeVerse.open</span>
                  <span className="text-slate-100">();</span>
                </span>
              </div>
              <div className="grid grid-cols-[2rem_1fr] text-slate-500">
                <span>02</span>
                <span>
                  <span className="text-slate-100">workspace</span>
                  <span className="text-slate-400">.</span>
                  <span className="text-amber-300">sync</span>
                  <span className="text-slate-100">(team);</span>
                </span>
              </div>
              <div className="grid grid-cols-[2rem_1fr] text-slate-500">
                <span>03</span>
                <span>
                  <span className="text-slate-100">workspace</span>
                  <span className="text-slate-400">.</span>
                  <span className="text-rose-300">ship</span>
                  <span className="text-slate-100">(idea);</span>
                </span>
              </div>
            </div>

            <div className="absolute bottom-5 right-4 hidden w-56 rounded border border-indigo-400/20 bg-[#0a1020]/95 p-3 shadow-xl shadow-black/30 sm:block">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-indigo-200">
                <Sparkles className="h-3.5 w-3.5" />
                AI context
              </div>
              <p className="text-xs leading-5 text-slate-400">
                Review compares the active file, recent runs, and team notes before suggesting a fix.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 border-t border-white/10 bg-white/[0.03]">
            {["Run", "Trace", "Deploy"].map((label) => (
              <div key={label} className="border-r border-white/10 px-3 py-3 last:border-r-0">
                <div className="text-xs font-semibold text-slate-200">{label}</div>
                <div className="mt-1 h-1.5 rounded bg-white/10">
                  <div className="h-1.5 w-2/3 rounded bg-indigo-400" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  const { user } = useAuth();
  const primaryHref = user ? "/dashboard" : "/login";
  const primaryLabel = user ? "Dashboard" : "Sign In";

  return (
    <main className="min-h-screen overflow-hidden bg-[#060910] text-slate-100">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 noise-bg" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
        <div className="absolute inset-x-0 top-0 h-96 bg-[linear-gradient(180deg,rgba(99,102,241,0.18),transparent)]" />
      </div>

      <div className="relative z-10">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <Link href="/" className="flex items-center gap-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded bg-indigo-500 shadow-lg shadow-indigo-950/40">
              <Command className="h-5 w-5" />
            </span>
            <span className="text-lg font-black">CodeVerse</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-slate-400 lg:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/demo" className="hidden text-sm font-semibold text-slate-300 transition-colors hover:text-white sm:inline">
              Try Demo
            </Link>
            <Link
              href={primaryHref}
              className="inline-flex h-10 items-center justify-center rounded bg-white px-4 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-200"
            >
              {primaryLabel}
            </Link>
          </div>
        </header>

        <section id="product" className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-8 md:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:pb-20 lg:pt-16">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="inline-flex items-center gap-2 rounded border border-indigo-400/25 bg-indigo-400/10 px-3 py-1 text-xs font-semibold uppercase text-indigo-200">
              <Sparkles className="h-3.5 w-3.5" />
              About CodeVerse
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] text-white md:text-6xl">
              The coding workspace where ideas stay connected.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              CodeVerse brings the editor, AI assistance, project history, collaboration, algorithm learning,
              and deployment flow into one focused product surface.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={primaryHref}
                className="inline-flex h-11 items-center gap-2 rounded bg-indigo-500 px-5 text-sm font-semibold text-white transition-colors hover:bg-indigo-400"
              >
                {user ? "Open Dashboard" : "Start Building"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex h-11 items-center justify-center rounded border border-white/10 px-5 text-sm font-semibold text-slate-200 transition-colors hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:text-white"
              >
                Launch Demo
              </Link>
            </div>
          </motion.div>

          <WorkspacePreview />
        </section>

        <section id="mission" className="mx-auto max-w-7xl px-6 py-16 md:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <div className="text-xs font-semibold uppercase text-cyan-300">Mission</div>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">Remove the setup drag.</h2>
            </div>
            <div className="grid gap-6 text-base leading-8 text-slate-400 md:grid-cols-2">
              <p>
                CodeVerse exists to make real-time coding, collaboration, and learning accessible without asking
                developers to stitch together several tools before the first meaningful commit.
              </p>
              <p>
                The vision is a workspace where students, solo builders, and small teams can prototype, explain,
                discuss, execute, and prepare work for launch from the same environment.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#080d18]">
          <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <div className="text-xs font-semibold uppercase text-slate-500">What makes it different</div>
                <h2 className="mt-3 max-w-3xl text-3xl font-semibold leading-tight text-white">
                  Built around the work, not around tab hopping.
                </h2>
              </div>
              <Link
                href="/demo"
                className="inline-flex h-10 items-center gap-2 self-start rounded bg-indigo-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-400 md:self-auto"
              >
                Open Sandbox
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {productPillars.map(({ icon: Icon, title, body, accent }) => (
                <article key={title} className="rounded border border-white/10 bg-black/20 p-6">
                  <Icon className={`h-5 w-5 ${accent}`} />
                  <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="build-loop" className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:px-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="text-xs font-semibold uppercase text-slate-500">Product Surface</div>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">Everything needed for a compact coding loop.</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <div key={capability} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                  <span>{capability}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded border border-white/10 bg-[#080d18] p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-indigo-300" />
              <div>
                <div className="text-sm font-semibold text-white">Designed for focus</div>
                <div className="text-xs text-slate-500">Quiet hierarchy, fast feedback, fewer context switches.</div>
              </div>
            </div>

            <div className="mt-8 grid gap-4">
              {workflow.map(({ icon: Icon, label, text }, index) => (
                <div key={label} className="grid grid-cols-[2rem_1fr] gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded border border-white/10 bg-black/30 text-slate-300">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-500">0{index + 1}</span>
                      <h3 className="text-base font-semibold text-white">{label}</h3>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="creator" className="border-t border-white/10 bg-[#080d18]">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <div className="text-xs font-semibold uppercase text-amber-300">Creator</div>
              <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">Crafted by Ayush Kumar.</h2>
            </div>
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <p className="max-w-2xl text-base leading-8 text-slate-400">
                CodeVerse is an open-source project shaped around fast prototyping, collaborative learning,
                and a cleaner developer workflow.
              </p>
              <Link
                href="https://github.com/ayush-coder"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center justify-center rounded border border-white/10 px-4 text-sm font-semibold text-slate-200 transition-colors hover:border-indigo-400/60 hover:bg-indigo-500/10 hover:text-white"
              >
                GitHub Profile
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-center md:px-10">
          <div>
            <h2 className="text-2xl font-semibold text-white">Ready to open the workspace?</h2>
            <p className="mt-2 text-sm text-slate-500">Start from the dashboard or jump straight into the demo sandbox.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={primaryHref}
              className="inline-flex h-10 items-center justify-center rounded bg-white px-4 text-sm font-semibold text-slate-950 transition-colors hover:bg-slate-200"
            >
              {user ? "Go to Dashboard" : "Create Account"}
            </Link>
            <Link
              href="/demo"
              className="inline-flex h-10 items-center justify-center rounded border border-white/10 px-4 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
            >
              Try Demo
            </Link>
          </div>
        </section>

        <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-slate-600 md:px-10">
          Copyright {new Date().getFullYear()} CodeVerse. Built for developers who want fewer moving parts.
        </footer>
      </div>
    </main>
  );
}
