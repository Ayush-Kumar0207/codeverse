"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ArrowRight, FolderOpen, LayoutDashboard, Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import NewProjectModal from "@/components/NewProjectModal";
import { fetchProjectsByOwner } from "@/services/projects";
import { getLastOpenedProjectId } from "@/services/project-library";

export default function EditorEntryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [showNewProject, setShowNewProject] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Finding your last workspace…");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    let active = true;
    void fetchProjectsByOwner(user.username)
      .then(({ projects, cloudAvailable }) => {
        if (!active) return;
        const lastProjectId = getLastOpenedProjectId(user.username);
        const target = projects.find((project) => project._id === lastProjectId) || projects[0];
        if (target?._id) {
          router.replace(`/editor/${target._id}`);
          return;
        }
        setMessage(
          cloudAvailable
            ? "Create a workspace, then the Editor button will always reopen your latest one."
            : "Cloud projects are unavailable and no workspace is saved on this device yet."
        );
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setMessage("Projects could not be loaded. Your device drafts will appear here when available.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, router, user]);

  if (loading || authLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-[#070b12] text-slate-100" role="status">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-300 border-t-transparent" />
          <span className="text-sm font-medium text-slate-300">{message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center overflow-y-auto bg-[#070b12] p-6 text-slate-100">
      <section className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0b111c] p-6 shadow-2xl shadow-black/30 sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/25 bg-indigo-400/10 text-indigo-200">
          <FolderOpen className="h-6 w-6" />
        </div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200">Editor</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Choose what to build next</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">{message}</p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setShowNewProject(true)}
            className="group flex min-h-24 items-center justify-between rounded-2xl bg-indigo-500 p-4 text-left text-white transition hover:bg-indigo-400"
          >
            <span>
              <span className="block text-sm font-semibold">New project</span>
              <span className="mt-1 block text-xs text-indigo-100">Start a persistent workspace</span>
            </span>
            <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="group flex min-h-24 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-white/20 hover:bg-white/[0.06]"
          >
            <span>
              <span className="flex items-center gap-2 text-sm font-semibold text-white">
                <LayoutDashboard className="h-4 w-4 text-slate-400" /> Project browser
              </span>
              <span className="mt-1 block text-xs text-slate-400">Review every saved workspace</span>
            </span>
            <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      <AnimatePresence>
        {showNewProject && <NewProjectModal onClose={() => setShowNewProject(false)} />}
      </AnimatePresence>
    </div>
  );
}
