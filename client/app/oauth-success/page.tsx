"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { setToken } from "@/utils/auth";
import type { SharedUser } from "@shared/types/user";

type OAuthStatus = {
  provider: string;
  error: string;
};

function decodeOAuthUser(value: string | null): SharedUser | null {
  if (!value) return null;

  return decodeBase64UrlJson<SharedUser>(value);
}

function decodeBase64UrlJson<T>(value: string | null): T | null {
  if (!value) return null;

  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return JSON.parse(window.atob(padded)) as T;
  } catch {
    return null;
  }
}

function decodeUserFromToken(token: string): SharedUser | null {
  const payload = decodeBase64UrlJson<{ _id?: string; username?: string; email?: string }>(
    token.split(".")[1] || null
  );

  if (!payload?.username) return null;

  return {
    _id: payload._id,
    username: payload.username,
    email: payload.email,
  };
}

function persistOAuthSession(token: string, user: SharedUser | null) {
  setToken(token);

  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export default function OAuthSuccessPage() {
  const [status, setStatus] = useState<OAuthStatus>({
    provider: "OAuth",
    error: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get("provider") || "OAuth";
    const oauthToken = params.get("token");
    const userFromRedirect = params.get("user");

    setStatus((current) => ({ ...current, provider }));

    if (!oauthToken) {
      setStatus({ provider, error: "No sign-in token was returned." });
      return;
    }

    const oauthUser = decodeOAuthUser(userFromRedirect) || decodeUserFromToken(oauthToken);

    try {
      persistOAuthSession(oauthToken, oauthUser);
      window.location.replace("/dashboard");
    } catch (err) {
      setStatus({
        provider,
        error: err instanceof Error ? err.message : "Unable to finish sign-in.",
      });
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#061012] px-4 text-white">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#081113] p-6 text-center shadow-2xl shadow-black/30">
        {status.error ? (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-red-500/10 text-red-300">
              <XCircle className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-black">Sign-in failed</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">{status.error}</p>
            <a
              href="/login"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-teal-300 px-4 text-sm font-bold text-black transition hover:bg-teal-200"
            >
              Back to Login
            </a>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-teal-300/10 text-teal-200">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            <h1 className="text-xl font-black">Finishing {status.provider} sign-in</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              CodeVerse is creating your session and opening the dashboard.
            </p>
            <CheckCircle2 className="mx-auto mt-5 h-5 w-5 text-teal-300" />
            <a
              href="/dashboard"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-md border border-teal-300/40 px-4 text-sm font-bold text-teal-100 transition hover:border-teal-200 hover:text-white"
            >
              Continue to Dashboard
            </a>
          </>
        )}
      </div>
    </main>
  );
}
