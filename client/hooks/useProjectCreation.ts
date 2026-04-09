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
  const [storedUser] = useLocalStorage<User | null>("user", null);
  const [storedToken] = useLocalStorage<string | null>("token", null);
  const { user: authUser } = useAuth();

  const handleCreate = useCallback(
    async (title: string, language: SupportedLanguage) => {
      try {
        // Determine owner (prefer auth context, fallback to localStorage)
        const owner = authUser?.username || storedUser?.username;

        if (!owner) {
          console.error("No authenticated user found for project creation");
          return;
        }

        if (!title.trim()) {
          console.error("Project title cannot be empty");
          return;
        }

        // Create project via service
        const response = await createProject({
          title,
          language,
          owner,
        });

        if (response.project?._id) {
          router.push(`/editor/${response.project._id}`);
        }
      } catch (err) {
        console.error("Error creating project:", err);
        throw err;
      }
    },
    [authUser, storedUser, router]
  );

  return {
    handleCreate,
    isAuthenticated: !!authUser || !!storedUser,
  };
}
