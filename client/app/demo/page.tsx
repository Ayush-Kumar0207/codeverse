"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    const launchDemo = async () => {
      try {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects/create`, {
          title: "Demo Project",
          language: "javascript",
          owner: null, // No login required
          isDemo: true, // Optional: mark as demo in backend
        });

        const project = res.data.project;
        if (project && project._id) {
          router.push(`/editor/${project._id}`);
        } else {
          throw new Error("Invalid response");
        }
      } catch (err) {
        console.error("Demo project creation failed", err);
        alert("⚠️ Unable to launch demo at the moment.");
        router.push("/"); // fallback
      }
    };

    launchDemo();
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Demo</h1>
      <p className="text-gray-500 max-w-xl mb-8">
        This is a sandbox environment to explore CodeVerse without signing in. Some features may be limited.
      </p>
      <button
        onClick={() => router.push("/editor?demo=true")}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md text-white font-semibold"
      >
        Launch Demo Editor
      </button>
    </main>
  );
}
