import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLocalStorage } from "./useLocalStorage";
import { createProject } from "@/services/projects";
import type { SupportedLanguage } from "@shared/types/language";

interface User {
  _id: string;
  username: string;
  email: string;
}

export function useProjectCreation() {
  const router = useRouter();
  const { user: authUser } = useAuth();

  const handleCreate = useCallback(
    async (title: string, language: SupportedLanguage) => {
      const owner = authUser?.username;

      if (!owner) {
        throw new Error("No authenticated user found for project creation");
      }

      if (!title.trim()) {
        throw new Error("Project title cannot be empty");
      }

      const response = await createProject({
        title,
        language,
        owner,
      });

      if (response.project?._id) {
        router.push(`/editor/${response.project._id}`);
      }
    },
    [authUser, router]
  );

  return {
    handleCreate,
    isAuthenticated: !!authUser,
  };
}
