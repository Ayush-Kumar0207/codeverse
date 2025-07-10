"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);

      if (data.token && data.user) {
        login(data.user, data.token);

        setTimeout(() => {
          router.push("/dashboard");
        }, 50);
      }
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 text-[var(--foreground)] transition-colors duration-300">
      <div className="w-full max-w-md bg-[var(--card-bg,#1e1e2f)] p-8 rounded-lg shadow-lg border border-[var(--border-color,#2a2a40)]">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-500">CodeVerse</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Welcome back, developer! 👋</p>
        </div>

        {/* Login Form */}
        <div>
          <label className="block text-sm mb-1 text-[var(--muted)]">Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-4 bg-[var(--input-bg,#292940)] text-[var(--foreground)] rounded-md border border-[var(--border-color,#3b3b5a)] focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <label className="block text-sm mb-1 text-[var(--muted)]">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 bg-[var(--input-bg,#292940)] text-[var(--foreground)] rounded-md border border-[var(--border-color,#3b3b5a)] focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-purple-600 hover:bg-purple-700 transition p-3 rounded-md font-semibold"
          >
            Login
          </button>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center justify-center text-[var(--muted)] text-sm">
          <span className="border-t border-[var(--border-color,#3b3b5a)] flex-1"></span>
          <span className="mx-3">or</span>
          <span className="border-t border-[var(--border-color,#3b3b5a)] flex-1"></span>
        </div>

        {/* GitHub Login */}
        <button
          onClick={() => (window.location.href = "http://localhost:5000/api/auth/github")}
          className="w-full bg-[var(--input-bg,#2f2f42)] hover:bg-[var(--hover-bg,#3a3a55)] p-3 rounded-md flex items-center justify-center gap-2 border border-[var(--border-color,#46466a)] text-sm text-[var(--muted)] font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.1 3.29 9.42 7.84 10.96.57.1.78-.25.78-.56 0-.28-.01-1.02-.02-2-3.19.7-3.87-1.54-3.87-1.54-.52-1.31-1.27-1.65-1.27-1.65-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.68 1.25 3.33.96.1-.74.4-1.26.72-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.45.11-3.03 0 0 .96-.31 3.14 1.17a10.92 10.92 0 012.86-.39c.97 0 1.95.13 2.86.39 2.18-1.48 3.14-1.17 3.14-1.17.63 1.58.24 2.74.12 3.03.74.8 1.18 1.82 1.18 3.08 0 4.43-2.7 5.41-5.27 5.69.42.36.77 1.07.77 2.15 0 1.56-.01 2.81-.01 3.19 0 .31.2.67.8.56A10.51 10.51 0 0023.5 12C23.5 5.73 18.27.5 12 .5z" />
          </svg>
          Continue with GitHub
        </button>

        {/* Sign up Link */}
        <p className="text-sm text-[var(--muted)] text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-purple-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
