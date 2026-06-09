"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  Command,
  FileCode2,
  GitBranch,
  Play,
  Rocket,
  ShieldCheck,
  TerminalSquare,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const demoFiles = {
  "main.cpp": `#include <bits/stdc++.h>
using namespace std;

int main() {
  vector<int> scores = {42, 93, 77, 88};
  int best = *max_element(scores.begin(), scores.end());

  cout << "Best score: " << best << endl;
  return 0;
}`,
  "README.md": `# CodeVerse Demo

This public workspace is a fast preview of the editor surface.

- Files can be opened independently
- Team presence stays visible
- Organizer controls remain private
- Run and deploy actions provide immediate feedback`,
  "team.json": `{
  "organizer": "Ayush",
  "collaboratorsCanEdit": true,
  "activeFile": "main.cpp",
  "snapshot": "stable-demo-state"
}`,
};

const teamRows = [
  { initials: "AY", role: "Organizer", status: "Controls edit access", color: "bg-teal-300 text-black" },
  { initials: "SR", role: "Collaborator", status: "Editing main.cpp", color: "bg-amber-300 text-black" },
  { initials: "MK", role: "Collaborator", status: "Viewing README.md", color: "bg-rose-300 text-black" },
];

export default function DemoPage() {
  const [activeFile, setActiveFile] = useState<keyof typeof demoFiles>("main.cpp");
  const [terminalOutput, setTerminalOutput] = useState("Ready. Select a file or run the demo program.");
  const [deployState, setDeployState] = useState<"idle" | "deployed">("idle");

  const activeCode = demoFiles[activeFile];
  const lineCount = activeCode.split("\n").length;

  const statusText = useMemo(() => {
    if (deployState === "deployed") return "Preview route prepared";
    if (activeFile === "README.md") return "Documentation open";
    if (activeFile === "team.json") return "Organizer policy visible";
    return "Collaborator editing live";
  }, [activeFile, deployState]);

  const handleRun = () => {
    setTerminalOutput("g++ main.cpp -o main && ./main\nBest score: 93\nExecution completed in 0.18s");
  };

  const handleDeploy = () => {
    setDeployState("deployed");
    setTerminalOutput("Deploy preview created at /deployments/codeverse-launch-kit/\nStatic files bundled successfully.");
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

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-bold text-slate-200 transition hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Landing
            </Link>
            <Link
              href="/signup"
              className="hidden h-10 items-center justify-center rounded-md bg-teal-300 px-4 text-sm font-bold text-black transition hover:bg-teal-200 sm:inline-flex"
            >
              Get Started
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-4 pb-6 pt-2 md:px-8">
          <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-md border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-teal-100">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-300" />
                Public demo workspace
              </div>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
                A live-feeling IDE preview without the slow redirect.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                Open files, run the sample, and see how organizer control and team presence fit around the editor.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleRun}
                className="h-11 rounded-md bg-amber-300 px-5 font-bold text-black hover:bg-amber-200"
              >
                <Play className="mr-2 h-4 w-4" />
                Run Demo
              </Button>
              <Button
                onClick={handleDeploy}
                className="h-11 rounded-md bg-teal-300 px-5 font-bold text-black hover:bg-teal-200"
              >
                <Rocket className="mr-2 h-4 w-4" />
                Deploy Preview
              </Button>
            </div>
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
                  {(Object.keys(demoFiles) as Array<keyof typeof demoFiles>).map((file) => (
                    <button
                      key={file}
                      type="button"
                      onClick={() => setActiveFile(file)}
                      className={cn(
                        "flex h-10 w-full items-center gap-2 rounded-md px-3 text-left text-sm transition",
                        activeFile === file
                          ? "bg-teal-300/12 text-teal-100"
                          : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
                      )}
                    >
                      <FileCode2 className="h-4 w-4" />
                      {file}
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-md border border-amber-300/20 bg-amber-300/10 p-3">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold text-amber-100">
                    <ShieldCheck className="h-4 w-4" />
                    Organizer only
                  </div>
                  <p className="text-xs leading-5 text-amber-100/75">
                    Remove collaborators, toggle editing, and jump through history from private controls.
                  </p>
                </div>
              </aside>

              <section className="grid min-w-0 grid-rows-[auto_minmax(0,1fr)_170px]">
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
                  <pre className="whitespace-pre-wrap rounded-md border border-white/10 bg-black/35 p-3 text-xs leading-6 text-teal-100">
                    {terminalOutput}
                  </pre>
                </div>
              </section>

              <aside className="border-t border-white/10 bg-black/30 p-4 lg:border-l lg:border-t-0">
                <div className="mb-4 text-[10px] font-black uppercase tracking-[0.26em] text-slate-500">Team</div>
                <div className="space-y-3">
                  {teamRows.map((row) => (
                    <div key={row.initials} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                      <div className="flex items-center gap-3">
                        <span className={cn("flex h-9 w-9 items-center justify-center rounded-md text-xs font-black", row.color)}>
                          {row.initials}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-white">{row.role}</div>
                          <div className="mt-1 truncate text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            {row.status}
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
                    <div className="text-2xl font-black text-white">{deployState === "deployed" ? "On" : "Off"}</div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Preview</div>
                  </div>
                </div>

                <div className="mt-6 rounded-md border border-teal-300/20 bg-teal-300/10 p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-bold text-teal-100">
                    <Users className="h-4 w-4" />
                    Independent file focus
                  </div>
                  <p className="text-xs leading-6 text-teal-100/75">
                    Collaborators can browse separate files, then see live changes when they open the same one.
                  </p>
                </div>
              </aside>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
