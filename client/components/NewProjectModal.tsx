"use client";

import { useState } from "react";
import { useProjectCreation } from "@/hooks/useProjectCreation";
import type { SupportedLanguage } from "@shared/types/language";

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#1e1e2e] text-black dark:text-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">🆕 New Project</h2>

        <input
          type="text"
          placeholder="Enter project title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded mb-4 bg-transparent text-black dark:text-white"
        />

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
          className="w-full p-2 border border-gray-400 rounded mb-4 bg-transparent text-black dark:text-white"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProjectModal;
