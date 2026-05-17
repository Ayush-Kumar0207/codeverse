"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useProjectCreation } from "@/hooks/useProjectCreation";
import type { SupportedLanguage } from "@shared/types/language";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
}

const NewProjectModal: React.FC<Props> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { handleCreate, isAuthenticated } = useProjectCreation();

  const canCreate = title.trim().length > 0 && !isCreating;

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setError("Please login to create a project.");
      return;
    }

    if (!title.trim()) {
      setError("Project title cannot be empty.");
      return;
    }

    try {
      setError("");
      setIsCreating(true);
      await handleCreate(title, language);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create project.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 12 }}
        className="w-full max-w-md rounded-lg border border-white/10 bg-[#0b111c] p-5 text-slate-100 shadow-2xl shadow-black/40"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">New Project</h2>
            <p className="mt-1 text-sm text-slate-400">Choose a name and language for your workspace.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-2 text-slate-500 transition hover:bg-white/5 hover:text-slate-200"
            aria-label="Close new project dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (canCreate) void handleSubmit();
          }}
        >
          <div>
            <label className="text-sm font-medium text-slate-200">Project Title</label>
            <input
              type="text"
              placeholder="e.g. Portfolio API"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isCreating}
              className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-[#070b12] px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-200">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
              disabled={isCreating}
              className="mt-2 h-10 w-full cursor-pointer rounded-lg border border-white/10 bg-[#070b12] px-3 text-sm text-slate-100 outline-none transition focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="html">HTML / CSS / JS</option>
            </select>
          </div>
        </form>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 px-4 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canCreate}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-500 px-4 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreating ? "Creating..." : "Create Project"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NewProjectModal;
