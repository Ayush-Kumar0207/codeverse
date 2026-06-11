"use client";

import { useEffect, useMemo, useState } from "react";
import { getToken, removeToken } from "../../utils/auth";
import { useRouter } from "next/navigation";
import { fetchProfile } from "@/services/auth";
import { deleteProject, fetchProjectsByOwner } from "@/services/projects";
import type { SharedUser } from "@shared/types/user";
import type { SharedProject } from "@shared/types/project";
import NewProjectModal from "@/components/NewProjectModal";
import { AnimatePresence } from "framer-motion";
import { getOAuthUrl } from "@/services/oauth";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Code,
  Copy,
  FileText,
  GitBranch,
  FolderOpen,
  Github,
  Layout,
  PackageCheck,
  Plus,
  Search,
  Server,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

const languageLabel = (value?: string) => {
  if (!value) return "Unknown";
  if (value === "cpp") return "C++";
  if (value === "html") return "HTML / CSS / JS";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const slugify = (value?: string) => {
  const slug = (value || "codeverse-workspace")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "codeverse-workspace";
};

const getProjectKey = (project: SharedProject, index: number) =>
  project._id || `${slugify(project.title)}-${project.language}-${index}`;

export default function Dashboard() {
  const [user, setUser] = useState<SharedUser | null>(null);
  const [projects, setProjects] = useState<SharedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const [query, setQuery] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [projectServiceAvailable, setProjectServiceAvailable] = useState(true);
  const [selectedRepoProjectKey, setSelectedRepoProjectKey] = useState("");
  const [repoPrepared, setRepoPrepared] = useState(false);
  const [copiedRepoItem, setCopiedRepoItem] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const initDashboard = async () => {
      try {
        const profileData = await fetchProfile();
        if (!profileData.user) throw new Error("Invalid session");

        setUser(profileData.user);
        try {
          const projectData = await fetchProjectsByOwner(profileData.user.username);
          setProjects(projectData.projects || []);
          setProjectServiceAvailable(true);
        } catch {
          setProjects([]);
          setProjectServiceAvailable(false);
          setActionMessage("Project service unavailable; showing an empty workspace");
        }
      } catch {
        removeToken();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    initDashboard();
  }, [router]);

  useEffect(() => {
    if (projects.length === 0) {
      setSelectedRepoProjectKey("");
      setRepoPrepared(false);
      return;
    }

    const hasSelectedProject = projects.some(
      (project, index) => getProjectKey(project, index) === selectedRepoProjectKey
    );

    if (!hasSelectedProject) {
      setSelectedRepoProjectKey(getProjectKey(projects[0], 0));
      setRepoPrepared(false);
    }
  }, [projects, selectedRepoProjectKey]);

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) =>
        `${project.title} ${project.language}`.toLowerCase().includes(query.toLowerCase())
      ),
    [projects, query]
  );

  const newestProject = useMemo(
    () =>
      [...projects].sort(
        (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      )[0],
    [projects]
  );

  const selectedRepoProject = useMemo(
    () =>
      projects.find((project, index) => getProjectKey(project, index) === selectedRepoProjectKey) ||
      newestProject ||
      projects[0],
    [newestProject, projects, selectedRepoProjectKey]
  );

  const githubConnected = Boolean(user?.githubId);
  const repositoryName = slugify(selectedRepoProject?.title || "codeverse-workspace");
  const repositoryOwner = slugify(user?.username || "codeverse");
  const repositoryFullName = `${repositoryOwner}/${repositoryName}`;
  const selectedProjectTitle = selectedRepoProject?.title || "CodeVerse Workspace";

  const repoSetupCommand = useMemo(
    () =>
      [
        "git init",
        "git branch -M main",
        `git remote add origin https://github.com/${repositoryFullName}.git`,
        "git add .",
        `git commit -m "chore: publish ${selectedProjectTitle}"`,
        "git push -u origin main",
      ].join("\n"),
    [repositoryFullName, selectedProjectTitle]
  );

  const repoFiles = useMemo(
    () => [
      {
        name: "README.md",
        helper: "Project overview and local run notes",
        body: `# ${selectedProjectTitle}\n\nSource-controlled from CodeVerse.\n\n## Stack\n- Language: ${languageLabel(
          selectedRepoProject?.language
        )}\n- Workspace owner: ${user?.username || "CodeVerse"}\n\n## Run\nOpen the project in CodeVerse, review the generated files, then push to GitHub from your local workspace.`,
      },
      {
        name: ".github/workflows/codeverse-preview.yml",
        helper: "Preview deployment workflow starter",
        body: `name: CodeVerse Preview\n\non:\n  pull_request:\n  push:\n    branches: [main]\n\njobs:\n  preview:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Prepare CodeVerse project\n        run: echo "Ready to connect deployment provider for ${repositoryFullName}"`,
      },
      {
        name: "deploy.json",
        helper: "Deployment handoff metadata",
        body: JSON.stringify(
          {
            project: selectedProjectTitle,
            repository: repositoryFullName,
            branch: "main",
            source: "codeverse-dashboard",
            preview: true,
          },
          null,
          2
        ),
      },
    ],
    [repositoryFullName, selectedProjectTitle, selectedRepoProject?.language, user?.username]
  );

  const repoReadiness = useMemo(
    () => [
      {
        label: "GitHub identity linked",
        helper: githubConnected ? "OAuth session is connected" : "Authorize GitHub to continue",
        ready: githubConnected,
        icon: Github,
      },
      {
        label: "Workspace selected",
        helper: selectedRepoProject ? selectedProjectTitle : "Create or load a project first",
        ready: Boolean(selectedRepoProject),
        icon: FolderOpen,
      },
      {
        label: "Deploy handoff generated",
        helper: repoPrepared ? "Repository package is ready" : "Prepare when the repo target looks right",
        ready: repoPrepared,
        icon: UploadCloud,
      },
    ],
    [githubConnected, repoPrepared, selectedProjectTitle, selectedRepoProject]
  );

  const stats = useMemo(
    () => [
      {
        label: "Projects",
        value: projects.length,
        helper: projects.length === 1 ? "active workspace" : "active workspaces",
        icon: Layout,
        tone: "text-sky-300",
      },
      {
        label: "Languages",
        value: new Set(projects.map((project) => project.language)).size,
        helper: "in current library",
        icon: Code,
        tone: "text-emerald-300",
      },
      {
        label: "Recent Saves",
        value: projects.filter((project) => project.updatedAt).length,
        helper: "tracked revisions",
        icon: Clock3,
        tone: "text-amber-300",
      },
    ],
    [projects]
  );

  const activityLogs = useMemo(
    () =>
      [
        newestProject && {
          type: "Updated",
          message: `${newestProject.title} was last saved`,
          time: formatDate(newestProject.updatedAt),
        },
        {
          type: "Sync",
          message: `${projects.length} project${projects.length === 1 ? "" : "s"} loaded`,
          time: "Current session",
        },
        actionMessage && {
          type: "Action",
          message: actionMessage,
          time: "Just now",
        },
      ].filter(Boolean) as { type: string; message: string; time: string }[],
    [actionMessage, newestProject, projects.length]
  );

  const handleDeleteProject = async (project: SharedProject) => {
    if (!project._id) return;

    const ok = window.confirm(`Delete "${project.title}"? This removes it from your project browser.`);
    if (!ok) return;

    try {
      await deleteProject(project._id);
      setProjects((prev) => prev.filter((item) => item._id !== project._id));
      setActionMessage(`Deleted ${project.title}`);
    } catch {
      setActionMessage("Could not delete project");
    }
  };

  const connectGithub = () => {
    window.location.href = getOAuthUrl("github");
  };

  const copyRepoText = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedRepoItem(label);
      setActionMessage(`Copied ${label}`);
      window.setTimeout(() => setCopiedRepoItem(""), 1600);
    } catch {
      setActionMessage(`Could not copy ${label}; select the text manually`);
    }
  };

  const prepareRepository = () => {
    if (!githubConnected) {
      setActionMessage("Authorize GitHub before preparing a repository");
      connectGithub();
      return;
    }

    if (!selectedRepoProject) {
      setActionMessage("Create a project before preparing a repository");
      setShowNewProject(true);
      return;
    }

    setRepoPrepared(true);
    setActionMessage(`${selectedRepoProject.title} is ready for GitHub source control`);
  };

  const openSelectedRepoProject = () => {
    if (selectedRepoProject?._id) {
      router.push(`/editor/${selectedRepoProject._id}`);
      return;
    }

    router.push("/editor/demo-sandbox?mode=demo");
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#070b12] text-slate-100">
        <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 shadow-2xl shadow-black/30">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
          <p className="text-sm font-medium text-slate-300">Loading workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100">
      <main className="mx-auto flex w-full max-w-[1480px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="rounded-md border border-indigo-400/25 bg-indigo-400/10 px-2.5 py-1 text-xs font-semibold text-indigo-200">
                Workspace Dashboard
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Session active
              </span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Welcome back, {user.username}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Create, review, and reopen your coding workspaces from one focused dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => router.push("/editor/demo-sandbox?mode=demo")}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <Code className="h-4 w-4" />
              Open Sandbox
            </button>
            <button
              onClick={() => setShowNewProject(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition hover:bg-indigo-400"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-white/10 bg-[#0b111c] p-5 shadow-xl shadow-black/15"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{stat.helper}</p>
                </div>
                <div className={cn("rounded-lg border border-white/10 bg-white/[0.03] p-2.5", stat.tone)}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-lg border border-white/10 bg-[#0b111c] shadow-xl shadow-black/15">
            <div className="flex flex-col gap-4 border-b border-white/10 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Project Browser</h2>
                <p className="mt-1 text-sm text-slate-400">Open recent work or start something new.</p>
              </div>
              <div className="relative w-full lg:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search projects"
                  className="h-10 w-full rounded-lg border border-white/10 bg-[#070b12] pl-10 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 p-5 lg:grid-cols-2">
                {filteredProjects.map((project) => (
                  <article
                    key={project._id || `${project.title}-${project.language}`}
                    className="group rounded-lg border border-white/10 bg-[#0f1725] p-4 transition hover:border-indigo-400/35 hover:bg-[#121c2d]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="rounded-lg border border-indigo-400/20 bg-indigo-400/10 p-2 text-indigo-200">
                          <FolderOpen className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-white">{project.title}</h3>
                          <p className="mt-1 text-xs text-slate-400">
                            {languageLabel(project.language)} · {formatDate(project.updatedAt)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteProject(project);
                        }}
                        className="rounded-md p-2 text-slate-500 transition hover:bg-red-500/10 hover:text-red-300"
                        aria-label={`Delete ${project.title}`}
                        title={`Delete ${project.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-xs font-medium text-slate-500">
                        {project.isDemo ? "Demo workspace" : "Private workspace"}
                      </span>
                      <button
                        onClick={() => router.push(`/editor/${project._id || "demo"}`)}
                        className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-indigo-100"
                      >
                        Open
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-slate-300">
                  <FolderOpen className="h-8 w-8" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-white">
                  {query ? "No matching projects" : "No projects yet"}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                  {query
                    ? "Try a different search term or clear the search field."
                    : "Create your first workspace to start editing, saving, and deploying code."}
                </p>
                {!query && (
                  <button
                    onClick={() => setShowNewProject(true)}
                    className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 text-sm font-semibold text-white transition hover:bg-indigo-400"
                  >
                    <Plus className="h-4 w-4" />
                    Create Project
                  </button>
                )}
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-6">
            <section className="rounded-lg border border-white/10 bg-[#0b111c] p-5 shadow-xl shadow-black/15">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-white">Activity</h2>
                  <p className="mt-1 text-sm text-slate-400">Latest workspace events</p>
                </div>
                <Activity className="h-5 w-5 text-slate-500" />
              </div>

              <div className="mt-5 space-y-4">
                {activityLogs.map((log) => (
                  <div key={`${log.type}-${log.message}`} className="flex gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-indigo-400" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-200">{log.message}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {log.type} · {log.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-[#0b111c] p-5 shadow-xl shadow-black/15">
              <div className="flex items-center gap-3">
                <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-2 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">Workspace Status</h2>
                  <p className="text-sm text-slate-400">Signed in as {user.username}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-slate-500">Session</p>
                  <p className="mt-1 font-semibold text-emerald-300">Authenticated</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                  <p className="text-slate-500">Projects</p>
                  <p
                    className={cn(
                      "mt-1 font-semibold",
                      projectServiceAvailable ? "text-emerald-300" : "text-amber-300"
                    )}
                  >
                    {projectServiceAvailable ? "Loaded" : "Limited"}
                  </p>
                </div>
              </div>
            </section>

            <section
              className={cn(
                "rounded-lg border p-5 shadow-xl shadow-black/15",
                githubConnected
                  ? "border-teal-300/25 bg-teal-300/[0.06]"
                  : "border-indigo-400/20 bg-indigo-400/[0.06]"
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "rounded-lg border p-2",
                    githubConnected
                      ? "border-teal-300/25 bg-teal-300/10 text-teal-200"
                      : "border-indigo-300/20 bg-indigo-300/10 text-indigo-200"
                  )}
                >
                  <Server className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-white">Connect Repository</h2>
                    <span
                      className={cn(
                        "rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.12em]",
                        githubConnected
                          ? "border-teal-300/25 bg-teal-300/10 text-teal-200"
                          : "border-amber-300/25 bg-amber-300/10 text-amber-200"
                      )}
                    >
                      {githubConnected ? "Linked" : "Not linked"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {githubConnected
                      ? "Prepare a selected workspace for GitHub source control, preview automation, and deployment handoff."
                      : "Authorize GitHub once, then CodeVerse can build a repository-ready package for your workspace."}
                  </p>
                </div>
              </div>

              {githubConnected ? (
                <>
                  <div className="mt-5 rounded-lg border border-white/10 bg-[#071018]/70 p-3">
                    <label
                      htmlFor="repo-project"
                      className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500"
                    >
                      Repository Target
                    </label>
                    {projects.length > 0 ? (
                      <select
                        id="repo-project"
                        value={selectedRepoProjectKey}
                        onChange={(event) => {
                          setSelectedRepoProjectKey(event.target.value);
                          setRepoPrepared(false);
                        }}
                        className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#0b111c] px-3 text-sm font-semibold text-slate-100 outline-none transition focus:border-teal-300/50 focus:ring-2 focus:ring-teal-300/15"
                      >
                        {projects.map((project, index) => (
                          <option key={getProjectKey(project, index)} value={getProjectKey(project, index)}>
                            {project.title} - {languageLabel(project.language)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() => setShowNewProject(true)}
                        className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-slate-100 transition hover:border-teal-300/35 hover:bg-white/[0.07]"
                      >
                        <Plus className="h-4 w-4" />
                        Create Project
                      </button>
                    )}
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Suggested repository:{" "}
                      <span className="font-mono text-teal-200">{repositoryFullName}</span>
                    </p>
                  </div>

                  <div className="mt-4 space-y-2">
                    {repoReadiness.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3"
                      >
                        <div
                          className={cn(
                            "mt-0.5 rounded-md border p-1.5",
                            item.ready
                              ? "border-teal-300/25 bg-teal-300/10 text-teal-200"
                              : "border-slate-500/25 bg-slate-500/10 text-slate-400"
                          )}
                        >
                          <item.icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-100">{item.label}</p>
                          <p className="mt-0.5 text-xs leading-5 text-slate-500">{item.helper}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-lg border border-white/10 bg-[#071018]">
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 px-3 py-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <GitBranch className="h-4 w-4 text-teal-200" />
                        <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                          Push Commands
                        </p>
                      </div>
                      <button
                        onClick={() => copyRepoText("push commands", repoSetupCommand)}
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-white/10 px-2 text-xs font-semibold text-slate-200 transition hover:border-teal-300/35 hover:text-white"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {copiedRepoItem === "push commands" ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <pre className="max-h-40 overflow-auto whitespace-pre-wrap p-3 font-mono text-xs leading-5 text-slate-300">
                      {repoSetupCommand}
                    </pre>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                      Generated Repo Files
                    </p>
                    {repoFiles.map((file) => (
                      <div
                        key={file.name}
                        className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 shrink-0 text-indigo-200" />
                              <p className="truncate text-sm font-semibold text-slate-100">{file.name}</p>
                            </div>
                            <p className="mt-1 text-xs leading-5 text-slate-500">{file.helper}</p>
                          </div>
                          <button
                            onClick={() => copyRepoText(file.name, file.body)}
                            className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md border border-white/10 px-2 text-xs font-semibold text-slate-200 transition hover:border-teal-300/35 hover:text-white"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            {copiedRepoItem === file.name ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {repoPrepared && (
                    <div className="mt-4 rounded-lg border border-teal-300/25 bg-teal-300/10 p-3">
                      <div className="flex items-start gap-3">
                        <div className="rounded-md bg-teal-300/15 p-1.5 text-teal-200">
                          <PackageCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-teal-100">Repository package ready</p>
                          <p className="mt-1 text-xs leading-5 text-teal-100/70">
                            {selectedProjectTitle} now has a branch plan, starter workflow, and deployment metadata.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-5 grid grid-cols-1 gap-2">
                    <button
                      onClick={prepareRepository}
                      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-teal-300 px-4 text-sm font-bold text-slate-950 shadow-lg shadow-teal-950/30 transition hover:bg-teal-200"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      {repoPrepared ? "Refresh Repository Plan" : "Prepare Repository"}
                    </button>
                    <button
                      onClick={openSelectedRepoProject}
                      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/[0.07]"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                      Open Selected Project
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-5 space-y-2">
                    {[
                      "Link your GitHub identity to this CodeVerse account.",
                      "Unlock repository preparation for saved projects.",
                      "Generate source-control files and deployment metadata.",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-300">
                        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-indigo-200" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={connectGithub}
                    className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-indigo-100"
                  >
                    <Github className="h-4 w-4" />
                    Authorize GitHub
                  </button>
                </>
              )}
            </section>
          </aside>
        </section>
      </main>

      <AnimatePresence>
        {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} />}
      </AnimatePresence>
    </div>
  );
}
