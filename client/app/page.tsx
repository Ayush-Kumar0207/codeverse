"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Clock3,
  Code2,
  Command,
  GitBranch,
  Globe2,
  History,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import NewProjectModal from "@/components/NewProjectModal";
import DeploymentModal from "@/components/DeploymentModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { deployProject } from "@/services/deployment";

const launchDeploymentFiles = {
  "index.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CodeVerse Launch Kit</title>
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    <main class="shell">
      <section class="hero">
        <p class="eyebrow">Live CodeVerse Deployment</p>
        <h1>Your one-click launch is online.</h1>
        <p>This page was generated from the public landing page and served by the CodeVerse deployment engine.</p>
      </section>
      <section class="grid" aria-label="Deployment checks">
        <article><span>Route</span><strong>Published</strong></article>
        <article><span>Assets</span><strong>Bundled</strong></article>
        <article><span>Status</span><strong id="status">Checking</strong></article>
      </section>
    </main>
    <script src="./script.js"></script>
  </body>
</html>`,
  "style.css": `:root {
  color-scheme: dark;
  --bg: #061012;
  --panel: rgba(10, 27, 28, 0.86);
  --line: rgba(129, 230, 217, 0.22);
  --text: #f7fbff;
  --muted: #9db4bd;
  --teal: #42e8c4;
  --amber: #f5c451;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  background:
    linear-gradient(135deg, rgba(66, 232, 196, 0.12), transparent 34%),
    linear-gradient(315deg, rgba(245, 196, 81, 0.1), transparent 35%),
    #061012;
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
.shell {
  width: min(1080px, calc(100vw - 40px));
  margin: 0 auto;
  padding: 72px 0;
}
.hero { margin-bottom: 32px; }
.eyebrow {
  color: var(--teal);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
h1 {
  max-width: 820px;
  margin: 0;
  font-size: clamp(44px, 8vw, 92px);
  line-height: 0.95;
}
p {
  max-width: 680px;
  color: var(--muted);
  font-size: 20px;
  line-height: 1.6;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
article {
  min-height: 180px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--panel);
  padding: 24px;
}
span {
  color: var(--muted);
  display: block;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
strong {
  display: block;
  margin-top: 32px;
  font-size: clamp(30px, 5vw, 54px);
}
@media (max-width: 760px) {
  .grid { grid-template-columns: 1fr; }
}`,
  "script.js": `const status = document.querySelector("#status");
status.textContent = "Live";
console.log("CodeVerse deployment is live.");`,
  "README.md": `# CodeVerse Launch Kit

This starter project is deployed directly from the landing page CTA.`,
};

const navLinks = [
  { label: "Technology", href: "#technology" },
  { label: "Features", href: "#features" },
  { label: "Collaboration", href: "#collaboration" },
];

const featureRows = [
  {
    title: "Shared IDE",
    desc: "Live file updates, local file focus, collaborator permissions, and readable presence in one workspace.",
    icon: Users,
    accent: "text-teal-300",
    bg: "bg-teal-300/10",
  },
  {
    title: "Deploy Loop",
    desc: "Ship a static project route from the workspace, inspect the result, and keep iterating without leaving the app.",
    icon: Rocket,
    accent: "text-amber-300",
    bg: "bg-amber-300/10",
  },
  {
    title: "Time Travel",
    desc: "Organizer snapshots let a team step back, compare state, and return to the newest working version.",
    icon: History,
    accent: "text-rose-300",
    bg: "bg-rose-300/10",
  },
  {
    title: "Run Anywhere",
    desc: "Execute code, preview web files, and keep outputs scoped to each contributor's workflow.",
    icon: Play,
    accent: "text-cyan-300",
    bg: "bg-cyan-300/10",
  },
];

function Atmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#06090d]">
      <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(94,234,212,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.12)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(20,184,166,0.18),transparent_28%,rgba(244,63,94,0.11)_57%,transparent_76%),linear-gradient(180deg,rgba(0,0,0,0.15),#06090d_82%)]" />
      <div className="absolute left-0 right-0 top-0 h-28 bg-gradient-to-b from-black/80 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/85 to-transparent" />
    </div>
  );
}

function ProductStage() {
  const codeLines = [
    "const room = await CodeVerse.join('launch-team');",
    "room.permissions.set('collaborators', 'edit');",
    "room.deploy({ route: '/deployments/launch-kit' });",
    "timeline.snapshot('stable-auth-flow');",
  ];

  return (
    <div className="pointer-events-none absolute inset-x-4 top-8 z-0 mx-auto h-[min(58vh,520px)] max-w-6xl overflow-hidden rounded-lg border border-white/10 bg-[#071013]/80 opacity-60 shadow-[0_30px_120px_rgba(0,0,0,0.5)]">
      <div className="flex h-10 items-center gap-3 border-b border-white/10 bg-black/35 px-4">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-teal-300" />
        </div>
        <div className="min-w-0 flex-1 text-center text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
          codeverse.live/session
        </div>
      </div>

      <div className="grid h-[calc(100%-2.5rem)] grid-cols-[180px_minmax(0,1fr)_240px] max-md:grid-cols-1">
        <aside className="border-r border-white/10 bg-black/30 p-4 max-md:hidden">
          <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Explorer</div>
          {["main.cpp", "layout.tsx", "deploy.json", "README.md"].map((file, index) => (
            <div
              key={file}
              className={cn(
                "mb-2 flex h-9 items-center gap-2 rounded px-2 text-xs",
                index === 0 ? "bg-teal-300/10 text-teal-100" : "text-slate-500"
              )}
            >
              <Code2 className="h-3.5 w-3.5" />
              {file}
            </div>
          ))}
        </aside>

        <section className="relative min-w-0 bg-[#071519] p-5 font-mono text-sm text-slate-400">
          <div className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-slate-500">
            <GitBranch className="h-3.5 w-3.5 text-amber-300" />
            production-ready
          </div>
          <div className="space-y-4">
            {codeLines.map((line, index) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.18 }}
                className="flex gap-4"
              >
                <span className="w-5 text-right text-slate-600">{index + 1}</span>
                <span className="text-slate-200">
                  {line.split("CodeVerse").map((part, partIndex) => (
                    <span key={`${line}-${partIndex}`}>
                      {part}
                      {partIndex === 0 && line.includes("CodeVerse") && (
                        <span className="text-teal-300">CodeVerse</span>
                      )}
                    </span>
                  ))}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            animate={{ x: [0, 90, 48, 0], y: [0, 24, 74, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-32 top-32 flex items-center gap-2"
          >
            <span className="h-4 w-0.5 bg-teal-300 shadow-[0_0_16px_rgba(94,234,212,0.8)]" />
            <span className="rounded bg-teal-400 px-2 py-0.5 text-[10px] font-bold text-black">Organizer</span>
          </motion.div>

          <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-black/40 p-4">
            <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
              <TerminalSquare className="h-3.5 w-3.5 text-amber-300" />
              Terminal
            </div>
            <div className="font-mono text-xs text-teal-200">deployments/codeverse-launch-kit published</div>
          </div>
        </section>

        <aside className="border-l border-white/10 bg-black/30 p-4 max-md:hidden">
          <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Team</div>
          {[
            ["AY", "Organizer", "Edit"],
            ["SR", "Collaborator", "Edit"],
            ["MK", "Collaborator", "View"],
          ].map(([initials, role, status]) => (
            <div key={initials} className="mb-3 flex items-center gap-3 rounded border border-white/10 bg-white/[0.03] p-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-800 text-[10px] font-bold text-white">
                {initials}
              </div>
              <div className="min-w-0">
                <div className="text-xs text-slate-200">{role}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500">{status}</div>
              </div>
            </div>
          ))}
          <div className="mt-5 rounded border border-amber-300/20 bg-amber-300/10 p-3 text-xs text-amber-100">
            Organizer controls are private and enforced by the socket server.
          </div>
        </aside>
      </div>
    </div>
  );
}

function createBrowserDeploymentUrl(files: Record<string, string>) {
  const html = files["index.html"] || "<!doctype html><html><body><main id=\"app\"></main></body></html>";
  const css = files["style.css"] || "";
  const js = files["script.js"] || "";
  const inlined = html
    .replace(/<link\s+rel=["']stylesheet["']\s+href=["']\.\/style\.css["']\s*\/?>/i, `<style>${css}</style>`)
    .replace(/<script\s+src=["']\.\/script\.js["']><\/script>/i, `<script>${js}</script>`);

  return URL.createObjectURL(new Blob([inlined], { type: "text/html" }));
}

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showDeploymentModal, setShowDeploymentModal] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | undefined>();
  const [deploymentError, setDeploymentError] = useState<string | undefined>();
  const [deploymentNote, setDeploymentNote] = useState<string | undefined>();
  const [deploymentStatus, setDeploymentStatus] = useState<string | undefined>();
  const [deploying, setDeploying] = useState(false);
  const fallbackUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (fallbackUrlRef.current) URL.revokeObjectURL(fallbackUrlRef.current);
    };
  }, []);

  const handleSignedInStart = () => setShowModal(true);

  const handleLandingDeploy = async () => {
    setShowDeploymentModal(true);
    setDeploymentUrl(undefined);
    setDeploymentError(undefined);
    setDeploymentNote(undefined);
    setDeploymentStatus("Preparing the sample deployment...");
    setDeploying(true);

    if (fallbackUrlRef.current) {
      URL.revokeObjectURL(fallbackUrlRef.current);
      fallbackUrlRef.current = null;
    }

    try {
      const result = await deployProject({
        projectId: "codeverse-launch-kit",
        files: launchDeploymentFiles,
      }, {
        timeoutMs: 7000,
      });
      setDeploymentUrl(result.publicUrl || result.url);
      setDeploymentNote(
        result.publicUrl
          ? `Public tunnel active. Local route: ${result.url}`
          : result.bridgeUrl
            ? `Served locally. Static bridge: ${result.bridgeUrl}`
            : undefined
      );
      setDeploymentStatus("Deployment is ready. Open it from the dialog or the link below.");
    } catch (error) {
      const fallbackUrl = createBrowserDeploymentUrl(launchDeploymentFiles);
      fallbackUrlRef.current = fallbackUrl;
      setDeploymentUrl(fallbackUrl);
      setDeploymentStatus("Backend deploy was slow or unavailable, so a browser preview is ready now.");
      setDeploymentNote(
        error instanceof Error
          ? `Backend deployment was unavailable, so CodeVerse opened a browser preview instead. ${error.message}`
          : "Backend deployment was unavailable, so CodeVerse opened a browser preview instead."
      );
    } finally {
      setDeploying(false);
    }
  };

  const startCta = user ? (
    <button
      type="button"
      onClick={handleSignedInStart}
      disabled={authLoading}
      className="inline-flex h-10 items-center justify-center rounded-md bg-teal-300 px-4 text-sm font-bold text-black shadow-lg shadow-teal-300/20 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-70 sm:px-5"
    >
      New Project
    </button>
  ) : (
    <Link
      href="/signup"
      className="inline-flex h-10 items-center justify-center rounded-md bg-teal-300 px-4 text-sm font-bold text-black shadow-lg shadow-teal-300/20 transition hover:bg-teal-200 sm:px-5"
    >
      Get Started
    </Link>
  );

  const heroStartCta = user ? (
    <Button
      size="lg"
      onClick={handleSignedInStart}
      disabled={authLoading}
      className="h-12 rounded-md bg-teal-300 px-7 font-bold text-black shadow-xl shadow-teal-300/20 hover:bg-teal-200 disabled:opacity-70"
    >
      New Project
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  ) : (
    <Link
      href="/signup"
      className="inline-flex h-12 items-center justify-center rounded-md bg-teal-300 px-7 text-sm font-bold text-black shadow-xl shadow-teal-300/20 transition hover:bg-teal-200"
    >
      Start Building
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  );

  return (
    <TooltipProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-[#06090d] font-sans text-white selection:bg-teal-300/30">
        <Atmosphere />

        <header className="sticky top-0 z-50 px-4 py-4">
          <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#06090d]/82 px-4 py-3 shadow-2xl shadow-black/25 backdrop-blur-xl md:px-6">
            <Link href="/" className="flex shrink-0 items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-300 text-black shadow-lg shadow-teal-300/20">
                <Command className="h-6 w-6" />
              </div>
              <span className="text-xl font-black tracking-tight">CodeVerse</span>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400 transition hover:text-teal-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href={user ? "/dashboard" : "/login"}
                className="inline-flex h-10 items-center justify-center rounded-md px-3 text-sm font-semibold text-white transition hover:bg-white/5 sm:px-4"
              >
                {user ? "Dashboard" : "Sign In"}
              </Link>
              {startCta}
            </div>
          </nav>
        </header>

        <main className="relative z-10">
          <section className="relative flex min-h-[calc(100vh-12rem)] items-center justify-center overflow-hidden px-4 pb-16 pt-12">
            <ProductStage />
            <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(6,9,13,0.95)_0%,rgba(6,9,13,0.88)_34%,rgba(6,9,13,0.56)_62%,#06090d_100%)]" />

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75 }}
              className="relative z-10 mx-auto max-w-4xl text-center"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-teal-100">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                Live collaborative coding
              </div>
              <h1 className="text-5xl font-black leading-none tracking-tight text-white drop-shadow-[0_18px_44px_rgba(0,0,0,0.9)] sm:text-7xl md:text-8xl">
                CodeVerse
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
                A multiplayer IDE where teams code together, keep organizer control, run files independently,
                and recover clean workspace states when work gets messy.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {heroStartCta}
                <Button
                  size="lg"
                  onClick={handleLandingDeploy}
                  disabled={deploying}
                  className="h-12 rounded-md bg-amber-300 px-7 font-bold text-black shadow-xl shadow-amber-300/15 hover:bg-amber-200 disabled:opacity-70"
                >
                  <Rocket className="mr-2 h-4 w-4" />
                  {deploying ? "Deploying" : "Deploy Sample"}
                </Button>
              </div>

              {deploymentStatus && (
                <div
                  aria-live="polite"
                  className="mx-auto mt-4 max-w-xl rounded-md border border-amber-300/20 bg-black/45 px-4 py-3 text-sm text-amber-100"
                >
                  {deploymentStatus}
                  {deploymentUrl && (
                    <a
                      href={deploymentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="ml-2 font-bold text-teal-200 underline-offset-4 hover:underline"
                    >
                      Visit deployment
                    </a>
                  )}
                </div>
              )}

            </motion.div>
          </section>

          <section id="technology" className="scroll-mt-28 border-y border-white/10 bg-[#081113] px-4 py-20">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="mb-4 text-xs font-black uppercase tracking-[0.32em] text-amber-300">Technology</div>
                <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
                  Built around the editor, not around a landing page.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-slate-400">
                  Public visitors see the same core idea your team uses after sign-in: files, terminal output,
                  presence, deploy state, and recovery history all living in one focused workspace.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: TerminalSquare, label: "Run", text: "Output stays local to the collaborator running it." },
                  { icon: ShieldCheck, label: "Control", text: "Organizer-only access switches and removal." },
                  { icon: Clock3, label: "Recover", text: "Workspace snapshots move backward and forward." },
                  { icon: Globe2, label: "Publish", text: "Deploy routes are generated from real workspace files." },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-white/10 bg-black/30 p-5">
                    <item.icon className="mb-4 h-5 w-5 text-teal-300" />
                    <h3 className="text-lg font-bold">{item.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="features" className="scroll-mt-28 px-4 py-20">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <div className="mb-4 text-xs font-black uppercase tracking-[0.32em] text-teal-300">Features</div>
                  <h2 className="max-w-2xl text-4xl font-black tracking-tight md:text-5xl">
                    A sharper first impression for the real product underneath.
                  </h2>
                </div>
                <Link
                  href={user ? "/dashboard" : "/demo"}
                  className="text-sm font-bold text-amber-200 hover:text-amber-100"
                >
                  {user ? "Open dashboard" : "Try demo workspace"} <ArrowRight className="ml-1 inline h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {featureRows.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ delay: index * 0.06 }}
                    className="rounded-lg border border-white/10 bg-[#081113]/80 p-6 shadow-xl shadow-black/20"
                  >
                    <div className={cn("mb-5 flex h-10 w-10 items-center justify-center rounded-md", feature.bg)}>
                      <feature.icon className={cn("h-5 w-5", feature.accent)} />
                    </div>
                    <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <section id="collaboration" className="scroll-mt-28 bg-[#0b0f10] px-4 py-20">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8 max-w-2xl">
                <div className="mb-4 text-xs font-black uppercase tracking-[0.32em] text-rose-300">Collaboration</div>
                <h2 className="text-4xl font-black tracking-tight md:text-5xl">Independent work, shared truth.</h2>
                <p className="mt-5 text-base leading-8 text-slate-400">
                  Each collaborator can open a different file, but anyone who joins the same file sees live edits.
                  The organizer stays in control of edit access and team membership.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  {
                    title: "Organizer Control",
                    detail: "Invite, remove, and change edit access from private controls.",
                    icon: ShieldCheck,
                    color: "text-teal-300",
                  },
                  {
                    title: "File-Level Presence",
                    detail: "Collaborators choose files independently and sync only where work overlaps.",
                    icon: Code2,
                    color: "text-amber-300",
                  },
                  {
                    title: "Independent Runs",
                    detail: "Execution and output stay scoped to the contributor who starts the run.",
                    icon: TerminalSquare,
                    color: "text-rose-300",
                  },
                ].map(({ title, detail, icon: ItemIcon, color }) => {
                  return (
                    <div key={title} className="rounded-lg border border-white/10 bg-black/30 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm font-bold text-white">{title}</div>
                          <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
                        </div>
                        <ItemIcon className={cn("h-5 w-5 shrink-0", color)} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>

        <footer className="relative z-10 border-t border-white/10 bg-black/40 px-4 py-10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <Command className="h-6 w-6 text-teal-300" />
              <span className="text-lg font-black uppercase tracking-tight">CodeVerse</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              <Link href="/privacy" className="hover:text-teal-200">Privacy</Link>
              <Link href="/terms" className="hover:text-teal-200">Terms</Link>
              <Link href="/source" className="hover:text-teal-200">Source</Link>
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-600">
              {new Date().getFullYear()} CodeVerse
            </div>
          </div>
        </footer>

        <AnimatePresence>
          {showModal && <NewProjectModal onClose={() => setShowModal(false)} />}
          {showDeploymentModal && (
            <DeploymentModal
              isOpen={showDeploymentModal}
              onClose={() => setShowDeploymentModal(false)}
              deploymentUrl={deploymentUrl}
              error={deploymentError}
              projectName="CodeVerse Launch Kit"
              note={deploymentNote}
            />
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
