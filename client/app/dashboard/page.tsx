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
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Code,
  FolderOpen,
  Github,
  Layout,
  Plus,
  Search,
  Server,
  Trash2,
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

export default function Dashboard() {
  const [user, setUser] = useState<SharedUser | null>(null);
  const [projects, setProjects] = useState<SharedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const [query, setQuery] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [projectServiceAvailable, setProjectServiceAvailable] = useState(true);
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
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "http://localhost:5000";
    window.location.href = `${baseUrl}/api/auth/github`;
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

            <section className="rounded-lg border border-indigo-400/20 bg-indigo-400/[0.06] p-5 shadow-xl shadow-black/15">
              <div className="flex items-start gap-3">
                <div className="rounded-lg border border-indigo-300/20 bg-indigo-300/10 p-2 text-indigo-200">
                  <Server className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white">Connect Repository</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Link GitHub to prepare this workspace for source control and deployments.
                  </p>
                </div>
              </div>
              <button
                onClick={connectGithub}
                className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-indigo-100"
              >
                <Github className="h-4 w-4" />
                Connect GitHub
              </button>
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
