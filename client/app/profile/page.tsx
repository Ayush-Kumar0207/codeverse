"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetchSavedCodes } from "@/services/code";
import { fetchProjectsByOwner } from "@/services/projects";
import type { SharedProject } from "@shared/types/project";
import type { SharedVersion } from "@shared/types/version";
import {
  CheckCircle2,
  Clipboard,
  Code2,
  FileCode,
  FolderOpen,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Settings,
  ShieldCheck,
} from "lucide-react";

const formatDate = (value?: string) => {
  if (!value) return "Not saved yet";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not saved yet";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getInitials = (value?: string) =>
  (value || "U")
    .split(/\s|_/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

const getLanguageFromFile = (fileName?: string) => {
  const extension = fileName?.split(".").pop()?.toLowerCase();
  const labels: Record<string, string> = {
    c: "C",
    cpp: "C++",
    css: "CSS",
    html: "HTML",
    java: "Java",
    js: "JavaScript",
    json: "JSON",
    jsx: "React",
    md: "Markdown",
    py: "Python",
    ts: "TypeScript",
    tsx: "React TS",
  };

  return extension ? labels[extension] || extension.toUpperCase() : "Code";
};

export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [savedCodes, setSavedCodes] = useState<SharedVersion[]>([]);
  const [projects, setProjects] = useState<SharedProject[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
      return;
    }

    const loadProfileData = async () => {
      setLoading(true);
      setNotice("");

      const [codesResult, projectsResult] = await Promise.allSettled([
        fetchSavedCodes(user._id || ""),
        fetchProjectsByOwner(user.username),
      ]);

      if (codesResult.status === "fulfilled") {
        setSavedCodes(codesResult.value.codes || []);
      } else {
        setSavedCodes([]);
        setNotice("Saved artifacts are unavailable right now.");
      }

      if (projectsResult.status === "fulfilled") {
        setProjects(projectsResult.value.projects || []);
      } else {
        setProjects([]);
        setNotice((current) => current || "Projects are unavailable right now.");
      }

      setLoading(false);
    };

    loadProfileData();
  }, [user, token, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const copyUserId = async () => {
    if (!user?._id) return;
    await navigator.clipboard?.writeText(user._id);
    setNotice("User ID copied.");
  };

  const languageCount = useMemo(
    () => new Set(projects.map((project) => project.language).filter(Boolean)).size,
    [projects]
  );

  const latestArtifact = savedCodes[0];
  const stats = [
    {
      label: "Projects",
      value: projects.length,
      helper: projects.length === 1 ? "workspace" : "workspaces",
      icon: FolderOpen,
      tone: "text-sky-300",
    },
    {
      label: "Artifacts",
      value: savedCodes.length,
      helper: "saved versions",
      icon: FileCode,
      tone: "text-indigo-300",
    },
    {
      label: "Languages",
      value: languageCount,
      helper: "in workspace",
      icon: Code2,
      tone: "text-emerald-300",
    },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100">
      <main className="mx-auto flex w-full max-w-[1480px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="rounded-md border border-indigo-400/25 bg-indigo-400/10 px-2.5 py-1 text-xs font-semibold text-indigo-200">
                Account Profile
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Signed in
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Profile and workspace identity
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Review your account details, workspace usage, and saved code artifacts.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </button>
            <button
              onClick={() => router.push("/settings")}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-400"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-6">
            <section className="rounded-lg border border-white/10 bg-[#0b111c] p-5 shadow-xl shadow-black/15">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-indigo-400/25 bg-indigo-400/10 text-xl font-semibold text-indigo-100">
                  {user.avatar ? (
                    <div
                      className="h-full w-full rounded-lg bg-cover bg-center"
                      role="img"
                      aria-label={user.username}
                      style={{ backgroundImage: `url(${user.avatar})` }}
                    />
                  ) : (
                    getInitials(user.username)
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold text-white">{user.username}</h2>
                  <div className="mt-2 flex min-w-0 items-center gap-2 text-sm text-slate-400">
                    <Mail className="h-4 w-4 shrink-0 text-slate-500" />
                    <span className="truncate">{user.email || "No email connected"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-white/10 bg-[#070b12] p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                      User ID
                    </p>
                    <p className="mt-2 truncate font-mono text-xs text-slate-300">{user._id}</p>
                  </div>
                  <button
                    onClick={copyUserId}
                    className="rounded-md p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-200"
                    aria-label="Copy user ID"
                    title="Copy user ID"
                  >
                    <Clipboard className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                <div>
                  <p className="text-sm font-semibold text-white">Session secured</p>
                  <p className="text-xs text-slate-400">Token-based authentication is active.</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-red-400/25 bg-red-500/10 px-4 text-sm font-semibold text-red-200 transition hover:bg-red-500/15"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </section>

            <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-white/10 bg-[#0b111c] p-3 shadow-xl shadow-black/15"
                >
                  <div className="flex flex-col gap-3">
                    <div className={`w-fit rounded-md border border-white/10 bg-white/[0.03] p-2 ${stat.tone}`}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                      <p className="mt-1 text-xs text-slate-400">{stat.helper}</p>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </aside>

          <section className="rounded-lg border border-white/10 bg-[#0b111c] shadow-xl shadow-black/15">
            <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Saved Artifacts</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Recent code versions saved from your editor sessions.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                {latestArtifact ? `Last saved ${formatDate(latestArtifact.createdAt)}` : "No artifacts yet"}
              </div>
            </div>

            {notice && (
              <div className="mx-5 mt-5 rounded-lg border border-indigo-400/20 bg-indigo-400/10 px-3 py-2 text-sm text-indigo-100">
                {notice}
              </div>
            )}

            {loading ? (
              <div className="flex min-h-[480px] items-center justify-center">
                <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-300" />
                  <span className="text-sm text-slate-300">Loading saved artifacts</span>
                </div>
              </div>
            ) : savedCodes.length === 0 ? (
              <div className="flex min-h-[480px] flex-col items-center justify-center p-8 text-center">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-slate-300">
                  <FileCode className="h-8 w-8" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">No saved artifacts yet</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                  Save code from the editor to build a version history here.
                </p>
                <button
                  onClick={() => router.push("/editor/demo-sandbox?mode=demo")}
                  className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  <Code2 className="h-4 w-4" />
                  Open Sandbox
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 p-5 xl:grid-cols-2">
                {savedCodes.map((artifact, index) => (
                  <article
                    key={artifact._id || `${artifact.fileName}-${artifact.createdAt}-${index}`}
                    className="rounded-lg border border-white/10 bg-[#0f1725] p-4 transition hover:border-indigo-400/35 hover:bg-[#121c2d]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="rounded-lg border border-indigo-400/20 bg-indigo-400/10 p-2 text-indigo-200">
                          <FileCode className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-white">
                            {artifact.fileName || "Untitled file"}
                          </h3>
                          <p className="mt-1 text-xs text-slate-400">
                            {artifact.language || getLanguageFromFile(artifact.fileName)} · {formatDate(artifact.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <pre className="mt-4 max-h-40 overflow-hidden rounded-lg border border-white/10 bg-[#070b12] p-3 text-xs leading-5 text-slate-300">
                      <code>{artifact.code?.slice(0, 420) || "// No code content"}</code>
                    </pre>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}
