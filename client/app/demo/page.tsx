"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  Command,
  FileCode2,
  GitBranch,
  Loader2,
  Play,
  RefreshCw,
  Rocket,
  ShieldCheck,
  TerminalSquare,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const demoFiles = {
  "main.cpp": `#include <bits/stdc++.h>
using namespace std;

int main() {
  vector<int> scores = {42, 93, 77, 88};
  int total = accumulate(scores.begin(), scores.end(), 0);
  int best = *max_element(scores.begin(), scores.end());

  cout << "Best score: " << best << endl;
  cout << "Average score: " << total / scores.size() << endl;
  return 0;
}`,
  "README.md": `# CodeVerse Demo

This public workspace is a working preview of the editor surface.

- Open files from the explorer
- Run the included C++ sample
- Build a browser deploy preview
- Continue into setup when you want to keep a workspace`,
  "team.json": `{
  "organizer": "Ayush",
  "collaboratorsCanEdit": true,
  "activeFile": "main.cpp",
  "previewRoute": "/deployments/codeverse-public-demo",
  "snapshot": "stable-demo-state"
  }`,
};

const teamRows = [
  { initials: "AY", role: "Organizer", status: "Controls edit access", color: "bg-teal-300 text-black" },
  { initials: "SR", role: "Collaborator", status: "Editing main.cpp", color: "bg-amber-300 text-black" },
  { initials: "MK", role: "Collaborator", status: "Viewing README.md", color: "bg-rose-300 text-black" },
];

type DemoFile = keyof typeof demoFiles;
type RunState = "idle" | "running" | "success";
type DeployState = "idle" | "building" | "deployed";

function summarizeScores(value: string) {
  const scores = (value.match(/-?\d+(?:\.\d+)?/g) || [])
    .map(Number)
    .filter(Number.isFinite);

  if (scores.length === 0) {
    return { best: "-", average: "-", count: "0" };
  }

  const total = scores.reduce((sum, score) => sum + score, 0);
  return {
    best: String(Math.max(...scores)),
    average: String(Number((total / scores.length).toFixed(2))),
    count: String(scores.length),
  };
}

export default function DemoPage() {
  const [activeFile, setActiveFile] = useState<DemoFile>("main.cpp");
  const [terminalOutput, setTerminalOutput] = useState([
    "$ workspace status",
    "Public demo ready. Open files, run the sample, or build a preview.",
  ]);
  const [activity, setActivity] = useState("Workspace ready");
  const [runState, setRunState] = useState<RunState>("idle");
  const [deployState, setDeployState] = useState<DeployState>("idle");
  const [previewInput, setPreviewInput] = useState("42, 93, 77, 88");
  const [previewSummary, setPreviewSummary] = useState(() => summarizeScores("42, 93, 77, 88"));
  const [previewMessage, setPreviewMessage] = useState("Preview is waiting for deployment.");
  const runTimerRef = useRef<number | null>(null);
  const deployTimerRef = useRef<number | null>(null);
  const previewPanelRef = useRef<HTMLElement | null>(null);

  const activeCode = demoFiles[activeFile];
  const lineCount = activeCode.split("\n").length;

  const statusText = useMemo(() => {
    if (deployState === "building") return "Building preview";
    if (deployState === "deployed") return "Preview live";
    if (runState === "running") return "Running sample";
    if (runState === "success") return "Run completed";
    if (activeFile === "README.md") return "Documentation open";
    if (activeFile === "team.json") return "Organizer policy visible";
    return "Collaborator editing live";
  }, [activeFile, deployState, runState]);

  useEffect(() => {
    return () => {
      if (runTimerRef.current) window.clearTimeout(runTimerRef.current);
      if (deployTimerRef.current) window.clearTimeout(deployTimerRef.current);
    };
  }, []);

  const clearRunTimer = () => {
    if (runTimerRef.current) {
      window.clearTimeout(runTimerRef.current);
      runTimerRef.current = null;
    }
  };

  const clearDeployTimer = () => {
    if (deployTimerRef.current) {
      window.clearTimeout(deployTimerRef.current);
      deployTimerRef.current = null;
    }
  };

  const handleFileSelect = (file: DemoFile) => {
    setActiveFile(file);
    setActivity(`${file} opened`);
    setTerminalOutput([
      `$ open ${file}`,
      file === "main.cpp"
        ? "Runnable C++ sample loaded. Press Run Demo to execute it."
        : `${file} loaded in read-only public demo mode.`,
    ]);
  };

  const handleRun = () => {
    clearRunTimer();
    setActiveFile("main.cpp");
    setRunState("running");
    setActivity("Compiling main.cpp");
    setTerminalOutput([
      "$ g++ main.cpp -o main",
      "Compiling sample program...",
      "Running executable...",
    ]);

    runTimerRef.current = window.setTimeout(() => {
      setRunState("success");
      setActivity("Run finished successfully");
      setTerminalOutput([
        "$ g++ main.cpp -o main && ./main",
        "Best score: 93",
        "Average score: 75",
        "Execution completed in 0.18s",
      ]);
      runTimerRef.current = null;
    }, 650);
  };

  const handleDeploy = () => {
    clearDeployTimer();
    setDeployState("building");
    setActivity("Bundling browser preview");
    setPreviewMessage("Bundling preview assets...");
    setTerminalOutput([
      "$ codeverse deploy --preview",
      "Bundling index.html, style.css, and script.js...",
      "Preparing anonymous preview route...",
    ]);

    deployTimerRef.current = window.setTimeout(() => {
      setDeployState("deployed");
      setActivity("Preview route is live");
      setPreviewMessage("Preview ready. Edit scores below and recalculate.");
      setTerminalOutput([
        "$ codeverse deploy --preview",
        "Preview route prepared: /deployments/codeverse-public-demo",
        "Interactive preview is live below.",
      ]);
      deployTimerRef.current = null;
    }, 750);
  };

  const handleReset = () => {
    clearRunTimer();
    clearDeployTimer();
    setActiveFile("main.cpp");
    setTerminalOutput([
      "$ workspace reset",
      "Public demo restored to the initial clean state.",
    ]);
    setActivity("Workspace reset");
    setRunState("idle");
    setDeployState("idle");
    setPreviewInput("42, 93, 77, 88");
    setPreviewSummary(summarizeScores("42, 93, 77, 88"));
    setPreviewMessage("Preview is waiting for deployment.");
  };

  const handleJumpToPreview = () => {
    previewPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handlePreviewSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPreviewSummary(summarizeScores(previewInput));
    setPreviewMessage("Preview recalculated from the current scores.");
    setActivity("Preview recalculated");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#061012] text-slate-100">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(94,234,212,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(245,196,81,0.1)_1px,transparent_1px)] [background-size:68px_68px]" />
        <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(20,184,166,0.18),transparent_32%,rgba(244,63,94,0.1)_62%,transparent_82%)]" />
      </div>

      <div className="relative z-10">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-300 text-black">
              <Command className="h-6 w-6" />
            </span>
            <span className="text-xl font-black">CodeVerse Demo</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 px-3 text-sm font-bold text-slate-200 transition hover:bg-white/10 sm:px-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Landing
            </Link>
            <Link
              href="/signup"
              className="hidden h-10 items-center justify-center rounded-md border border-teal-300/30 bg-teal-300/10 px-4 text-sm font-bold text-teal-100 transition hover:bg-teal-300/15 sm:inline-flex"
            >
              Choose Setup
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              className="hidden h-10 items-center justify-center rounded-md bg-teal-300 px-4 text-sm font-bold text-black transition hover:bg-teal-200 sm:inline-flex"
            >
              Get Started
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-4 pb-10 pt-2 md:px-8">
          <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-teal-100">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-300" />
                Public working demo
              </div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
                Try the workspace before signing in.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                This page runs local demo state in your browser: open files, execute the sample, build a preview,
                then continue into setup when you want to keep a workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleRun}
                disabled={runState === "running"}
                className="inline-flex h-11 items-center justify-center rounded-md bg-amber-300 px-5 text-sm font-black text-black shadow-lg shadow-amber-300/15 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {runState === "running" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                {runState === "running" ? "Running" : "Run Demo"}
              </button>
              <button
                type="button"
                onClick={handleDeploy}
                disabled={deployState === "building"}
                className="inline-flex h-11 items-center justify-center rounded-md bg-teal-300 px-5 text-sm font-black text-black shadow-lg shadow-teal-300/15 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deployState === "building" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Rocket className="mr-2 h-4 w-4" />
                )}
                {deployState === "building"
                  ? "Building"
                  : deployState === "deployed"
                    ? "Rebuild Preview"
                    : "Deploy Preview"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] px-5 text-sm font-bold text-slate-100 transition hover:bg-white/10"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-3 rounded-lg border border-white/10 bg-black/35 p-4 text-sm text-slate-300 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={cn(
                  "h-2.5 w-2.5 shrink-0 rounded-full",
                  deployState === "building"
                    ? "animate-pulse bg-amber-300"
                    : deployState === "deployed"
                      ? "bg-teal-300"
                      : runState === "running"
                        ? "animate-pulse bg-amber-300"
                        : "bg-slate-500"
                )}
              />
              <span className="truncate">{activity}</span>
            </div>
            {deployState === "deployed" && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleJumpToPreview}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-teal-300 px-3 text-xs font-black text-black transition hover:bg-teal-200"
                >
                  <ArrowRight className="mr-2 h-3.5 w-3.5" />
                  View Preview
                </button>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="overflow-hidden rounded-lg border border-white/10 bg-[#071013]/90 shadow-2xl shadow-black/40"
          >
            <div className="grid min-h-[610px] grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_290px]">
              <aside className="border-b border-white/10 bg-black/30 p-4 lg:border-b-0 lg:border-r">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-[10px] font-black uppercase tracking-[0.26em] text-slate-500">Explorer</div>
                  <GitBranch className="h-4 w-4 text-amber-300" />
                </div>
                <div className="space-y-2">
                  {(Object.keys(demoFiles) as DemoFile[]).map((file) => (
                    <button
                      key={file}
                      type="button"
                      onClick={() => handleFileSelect(file)}
                      className={cn(
                        "flex h-10 w-full items-center gap-2 rounded-md px-3 text-left text-sm transition",
                        activeFile === file
                          ? "bg-teal-300/12 text-teal-100"
                          : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
                      )}
                    >
                      <FileCode2 className="h-4 w-4" />
                      <span className="truncate">{file}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-md border border-amber-300/20 bg-amber-300/10 p-3">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold text-amber-100">
                    <ShieldCheck className="h-4 w-4" />
                    Organizer only
                  </div>
                  <p className="text-xs leading-5 text-amber-100/75">
                    Public visitors can try the flow. Private collaborator controls unlock after sign-in.
                  </p>
                </div>

                <Link
                  href="/signup"
                  className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-md border border-teal-300/25 bg-teal-300/10 text-sm font-bold text-teal-100 transition hover:bg-teal-300/15"
                >
                  Choose Setup
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </aside>

              <section className="grid min-w-0 grid-rows-[auto_minmax(0,1fr)_180px]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/20 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-teal-300" />
                    <span className="font-mono text-sm text-slate-200">{activeFile}</span>
                  </div>
                  <div className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    {statusText}
                  </div>
                </div>

                <div className="overflow-auto bg-[#071519] p-5 font-mono text-sm">
                  {activeCode.split("\n").map((line, index) => (
                    <div key={`${activeFile}-${index}`} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 leading-7">
                      <span className="select-none text-right text-slate-600">{index + 1}</span>
                      <span className="whitespace-pre-wrap break-words text-slate-200">{line || " "}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 bg-black/45 p-4">
                  <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    <TerminalSquare className="h-4 w-4 text-amber-300" />
                    Terminal
                  </div>
                  <pre className="h-28 overflow-auto whitespace-pre-wrap rounded-md border border-white/10 bg-black/35 p-3 text-xs leading-6 text-teal-100">
                    {terminalOutput.join("\n")}
                  </pre>
                </div>
              </section>

              <aside className="border-t border-white/10 bg-black/30 p-4 lg:border-l lg:border-t-0">
                <div className="mb-4 text-[10px] font-black uppercase tracking-[0.26em] text-slate-500">Team</div>
                <div className="space-y-3">
                  {teamRows.map((row, index) => (
                    <div key={row.initials} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                      <div className="flex items-center gap-3">
                        <span className={cn("flex h-9 w-9 items-center justify-center rounded-md text-xs font-black", row.color)}>
                          {row.initials}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white">{row.role}</div>
                          <div className="mt-1 truncate text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            {index === 1 && runState === "running" ? "Running sample" : row.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-md border border-white/10 bg-[#071519] p-3">
                    <div className="text-2xl font-black text-white">{lineCount}</div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Lines</div>
                  </div>
                  <div className="rounded-md border border-white/10 bg-[#071519] p-3">
                    <div className="text-2xl font-black text-white">
                      {deployState === "building" ? "..." : deployState === "deployed" ? "Live" : "Off"}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Preview</div>
                  </div>
                </div>

                <div className="mt-6 rounded-md border border-teal-300/20 bg-teal-300/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-teal-100">
                    <Users className="h-4 w-4" />
                    Anonymous mode
                  </div>
                  <p className="text-xs leading-6 text-teal-100/75">
                    Demo state lives in this browser tab. Nothing here requires GitHub, Google, or a password.
                  </p>
                </div>
              </aside>
            </div>
          </motion.div>

          <AnimatePresence>
            {deployState !== "idle" && (
              <motion.section
                id="deploy-preview"
                ref={previewPanelRef}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                className="mt-5 overflow-hidden rounded-lg border border-white/10 bg-[#071013]/90 shadow-2xl shadow-black/35"
              >
                <div className="flex flex-col gap-3 border-b border-white/10 bg-black/35 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Deploy preview</div>
                    <div className="mt-1 font-bold text-white">
                      {deployState === "building" ? "Building ScoreLens preview" : "ScoreLens preview is interactive"}
                    </div>
                  </div>
                  {deployState === "deployed" && (
                    <span className="inline-flex h-10 items-center rounded-md border border-teal-300/20 bg-teal-300/10 px-4 text-sm font-bold text-teal-100">
                      /deployments/codeverse-public-demo
                    </span>
                  )}
                </div>
                <div className="bg-[#081113] p-4">
                  {deployState === "building" ? (
                    <div className="flex min-h-72 items-center justify-center rounded-md border border-dashed border-amber-300/25 bg-black/30 text-sm font-bold text-amber-100">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Bundling preview assets
                    </div>
                  ) : (
                    <div className="rounded-lg border border-teal-300/20 bg-[#061012] p-5 md:p-6">
                      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                        <div>
                          <div className="mb-3 text-[10px] font-black uppercase tracking-[0.24em] text-teal-300">
                            /deployments/codeverse-public-demo
                          </div>
                          <h2 className="text-3xl font-black text-white md:text-5xl">ScoreLens is live.</h2>
                          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400 md:text-base">
                            This is the generated preview running inside the public demo. Change scores, recalculate,
                            and confirm the deployed app updates without signing in.
                          </p>
                          <div className="mt-4 rounded-md border border-white/10 bg-black/35 px-3 py-2 text-sm text-teal-100">
                            {previewMessage}
                          </div>
                        </div>

                        <form onSubmit={handlePreviewSubmit} className="rounded-lg border border-white/10 bg-black/30 p-4">
                          <label htmlFor="preview-scores" className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                            Scores
                          </label>
                          <textarea
                            id="preview-scores"
                            rows={5}
                            value={previewInput}
                            onChange={(event) => setPreviewInput(event.target.value)}
                            className="mt-3 w-full resize-y rounded-md border border-white/10 bg-black/40 p-3 font-mono text-sm leading-6 text-slate-100 outline-none transition focus:border-teal-300/60 focus:ring-2 focus:ring-teal-300/15"
                          />
                          <button
                            type="submit"
                            className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-md bg-teal-300 px-4 text-sm font-black text-black transition hover:bg-teal-200"
                          >
                            Recalculate Preview
                          </button>
                        </form>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        {[
                          ["Best", previewSummary.best],
                          ["Average", previewSummary.average],
                          ["Count", previewSummary.count],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-md border border-white/10 bg-black/30 p-4">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{label}</div>
                            <div className="mt-4 text-4xl font-black text-white">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </section>
      </div>
    </main>
  );
}
