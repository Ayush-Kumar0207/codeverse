"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  Command,
  Github,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  TerminalSquare,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { loginRequest } from "@/services/auth";
import { getOAuthUrl } from "@/services/oauth";
import { cn } from "@/lib/utils";

const previewFiles = ["main.cpp", "team.json", "README.md"];

function WorkspacePreview() {
  return (
    <div className="hidden min-h-[38rem] overflow-hidden rounded-lg border border-white/10 bg-[#071013]/90 shadow-2xl shadow-black/40 lg:block">
      <div className="flex h-11 items-center gap-3 border-b border-white/10 bg-black/35 px-4">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-teal-300" />
        </div>
        <div className="flex-1 text-center text-[10px] font-black uppercase tracking-[0.26em] text-slate-500">
          secure workspace
        </div>
      </div>

      <div className="grid h-[calc(38rem-2.75rem)] grid-cols-[180px_minmax(0,1fr)]">
        <aside className="border-r border-white/10 bg-black/30 p-4">
          <div className="mb-4 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Explorer</div>
          {previewFiles.map((file, index) => (
            <div
              key={file}
              className={cn(
                "mb-2 flex h-10 items-center gap-2 rounded-md px-3 text-sm",
                index === 0 ? "bg-teal-300/10 text-teal-100" : "text-slate-500"
              )}
            >
              <Code2 className="h-4 w-4" />
              {file}
            </div>
          ))}

          <div className="mt-8 rounded-md border border-amber-300/20 bg-amber-300/10 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold text-amber-100">
              <ShieldCheck className="h-4 w-4" />
              Organizer Access
            </div>
            <p className="text-xs leading-5 text-amber-100/75">
              Sign in to manage collaborators, snapshots, and deployments.
            </p>
          </div>
        </aside>

        <section className="grid min-w-0 grid-rows-[1fr_160px] bg-[#071519]">
          <div className="p-6 font-mono text-sm">
            <div className="mb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
              <LockKeyhole className="h-4 w-4 text-teal-300" />
              authenticated session
            </div>
            {[
              "const user = await CodeVerse.signIn();",
              "workspace.permissions.load(user.role);",
              "timeline.resume('latest-good-state');",
              "deployments.enableFor(user.team);",
            ].map((line, index) => (
              <div key={line} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 leading-8">
                <span className="text-right text-slate-600">{index + 1}</span>
                <span className="text-slate-200">{line}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 bg-black/45 p-4">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
              <TerminalSquare className="h-4 w-4 text-amber-300" />
              Session
            </div>
            <div className="rounded-md border border-white/10 bg-black/35 p-3 text-xs leading-6 text-teal-100">
              Ready for GitHub, Google, or password sign-in.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("oauth_error");
    if (oauthError) setError(oauthError);
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = await loginRequest({ username, password });
      login(data.user, data.token);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#061012] text-slate-100">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(94,234,212,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(245,196,81,0.1)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(20,184,166,0.2),transparent_30%,rgba(244,63,94,0.1)_62%,transparent_82%),linear-gradient(180deg,rgba(0,0,0,0.05),#061012_86%)]" />
      </div>

      <div className="relative z-10">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-teal-300 text-black shadow-lg shadow-teal-300/20">
              <Command className="h-6 w-6" />
            </span>
            <span className="text-xl font-black tracking-tight text-white">CodeVerse</span>
          </Link>

          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-bold text-slate-200 transition hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </header>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-4 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <WorkspacePreview />

          <div className="mx-auto w-full max-w-lg rounded-lg border border-white/10 bg-[#081113]/92 p-6 shadow-2xl shadow-black/40 backdrop-blur md:p-8">
            <div className="mb-7">
              <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-teal-300/20 bg-teal-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-teal-100">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-300" />
                Secure sign in
              </div>
              <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">Welcome back.</h1>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Open your workspace, continue collaboration, and keep organizer controls in reach.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="text-sm font-bold text-slate-200">Username</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  disabled={isSubmitting}
                  className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-teal-300/60 focus:ring-2 focus:ring-teal-300/15"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-200">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={isSubmitting}
                  className="mt-2 h-12 w-full rounded-md border border-white/10 bg-black/35 px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-teal-300/60 focus:ring-2 focus:ring-teal-300/15"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center rounded-md bg-teal-300 px-5 text-sm font-black text-black shadow-xl shadow-teal-300/15 transition hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
              <span className="h-px flex-1 bg-white/10" />
              or
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="space-y-3">
              <a
                href={getOAuthUrl("github")}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-slate-100 transition hover:border-teal-300/40 hover:bg-teal-300/10"
              >
                <Github className="h-5 w-5" />
                Continue with GitHub
              </a>

              <a
                href={getOAuthUrl("google")}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm font-bold text-slate-100 transition hover:border-amber-300/40 hover:bg-amber-300/10"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-black text-slate-900">
                  G
                </span>
                Continue with Google
              </a>
            </div>

            <div className="mt-6 grid gap-3 rounded-md border border-white/10 bg-black/25 p-4 text-sm text-slate-400 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-teal-300" />
                Team access
              </div>
              <div className="flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-amber-300" />
                Private sessions
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-bold text-teal-200 underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
