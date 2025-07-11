// pages/github-success.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function GitHubSuccess() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = router.query.token as string;

    if (!token) {
      console.error("❌ No token received in URL");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.user) {
          login(data.user, token);
          router.push("/dashboard");
        } else {
          console.error("❌ Failed to fetch user:", data.error);
        }
      } catch (err) {
        console.error("❌ GitHub login failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [login, router]);

  return (
    <main className="flex items-center justify-center min-h-screen text-white bg-[var(--background)]">
      {loading ? (
        <p className="text-lg">Logging in via GitHub...</p>
      ) : (
        <p className="text-red-400 text-lg">GitHub login failed. Please try again.</p>
      )}
    </main>
  );
}
