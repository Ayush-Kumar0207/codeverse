"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { registerRequest } from "@/services/auth";
import { getOAuthUrl } from "@/services/oauth";
import { Github } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await registerRequest(form);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-gray-900 p-6 rounded-xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-purple-400 text-center">
          Create Account
        </h2>
        {error && (
          <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}

        <input
          className="w-full p-2 bg-gray-800 rounded"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, username: e.target.value }))
          }
          required
        />

        <input
          className="w-full p-2 bg-gray-800 rounded"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
          required
        />

        <input
          type="password"
          className="w-full p-2 bg-gray-800 rounded"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, password: e.target.value }))
          }
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-2 bg-purple-600 hover:bg-purple-700 rounded"
        >
          {isSubmitting ? "Creating..." : "Sign Up"}
        </button>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="h-px flex-1 bg-gray-800" />
          <span>or</span>
          <span className="h-px flex-1 bg-gray-800" />
        </div>

        <a
          href={getOAuthUrl("github")}
          className="flex w-full items-center justify-center gap-2 rounded border border-gray-700 bg-gray-800 p-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700"
        >
          <Github className="h-4 w-4" />
          Continue with GitHub
        </a>

        <a
          href={getOAuthUrl("google")}
          className="flex w-full items-center justify-center gap-2 rounded border border-gray-700 bg-gray-800 p-2 text-sm font-semibold text-gray-200 transition hover:bg-gray-700"
        >
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs font-black text-slate-900">
            G
          </span>
          Continue with Google
        </a>
      </form>
    </div>
  );
}
