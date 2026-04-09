import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetchProfile } from "@/services/auth";
import type { SharedUser } from "@shared/types/user";

export function useAuthGuard() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [profile, setProfile] = useState<SharedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect if not authenticated
    if (!token) {
      router.push("/login");
      return;
    }

    // Load user profile if available
    const loadProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchProfile();
        setProfile(res.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, router]);

  return {
    profile,
    loading,
    error,
    isAuthenticated: !!token && !!user,
  };
}
