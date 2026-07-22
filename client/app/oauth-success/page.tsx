"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { fetchProfile } from "@/services/auth";

type OAuthStatus = {
  provider: string;
  error: string;
};

export default function OAuthSuccessPage() {
  const [status, setStatus] = useState<OAuthStatus>({ provider: "OAuth", error: "" });

  useEffect(() => {
    const provider = new URLSearchParams(window.location.search).get("provider") || "OAuth";
    setStatus({ provider, error: "" });

    fetchProfile()
      .then(() => window.location.replace("/dashboard"))
      .catch((error) => {
        setStatus({
          provider,
          error: error instanceof Error ? error.message : "Unable to finish sign-in.",
        });
      });
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
            <a href="/login" className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-teal-300 px-4 text-sm font-bold text-black transition hover:bg-teal-200">
              Back to Login
            </a>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-teal-300/10 text-teal-200">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            <h1 className="text-xl font-black">Finishing {status.provider} sign-in</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">CodeVerse is verifying your secure session and opening the dashboard.</p>
            <CheckCircle2 className="mx-auto mt-5 h-5 w-5 text-teal-300" />
          </>
        )}
      </div>
    </main>
  );
}
