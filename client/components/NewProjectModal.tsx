"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useProjectCreation } from "@/hooks/useProjectCreation";
import type { SupportedLanguage } from "@shared/types/language";
import { Button } from "@/components/ui/button";

interface Props {
  onClose: () => void;
}

const NewProjectModal: React.FC<Props> = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState<SupportedLanguage>("javascript");
  const { handleCreate, isAuthenticated } = useProjectCreation();

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      alert("Please login to create a project.");
      return;
    }

    try {
      await handleCreate(title, language);
      onClose();
    } catch (err) {
      console.error("Failed to create project:", err);
      alert("Failed to create project.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-effect text-foreground p-8 rounded-2xl shadow-2xl w-full max-w-md border border-primary/20 bg-card/90"
      >
        <h2 className="text-2xl font-black mb-6 text-center font-outfit tracking-tight">
          <span className="text-gradient uppercase">New Project</span>
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Project Title</label>
            <input
              type="text"
              placeholder="e.g. MetaVerse Optimizer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 mt-1 bg-black/40 border border-white/5 rounded-xl text-foreground focus:border-primary/50 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pl-1">Language</label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="w-full p-3 mt-1 bg-black/40 border border-white/5 rounded-xl text-foreground focus:border-primary/50 outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button
            variant="ghost"
            onClick={onClose}
            className="px-6 hover:bg-white/5 h-12"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-8 bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20"
          >
            Create Engine
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NewProjectModal;
