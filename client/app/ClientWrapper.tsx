"use client";

import { SettingsProvider } from "@/context/SettingsContext";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ActivityBar } from "@/components/ActivityBar";
import { CommandPalette } from "@/components/CommandPalette";
import { cn } from "@/lib/utils";

function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isEditorRoute = pathname?.startsWith("/editor/");
  const isDemoEditorRoute = pathname === "/editor/demo-sandbox";
  const isIndependentScrollRoute = isEditorRoute || pathname === "/encyclopedia";
  const canPaintBeforeAuth =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/demo" ||
    isDemoEditorRoute ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/source" ||
    pathname === "/oauth-success" ||
    pathname === "/github-success" ||
    pathname === "/google-success" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/encyclopedia";
  
  if (loading && !canPaintBeforeAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b12] px-6 text-slate-100" role="status" aria-live="polite">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/30">
          <div className="mb-4 h-2 w-28 animate-pulse rounded-full bg-indigo-400/40" />
          <div className="space-y-3">
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-white/10" />
            <div className="h-3 w-3/5 animate-pulse rounded-full bg-white/[0.07]" />
          </div>
          <p className="mt-5 text-xs font-medium text-slate-400">Restoring your secure workspace…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn("bg-background text-foreground", isIndependentScrollRoute ? "h-screen overflow-hidden" : "min-h-screen")}>
        {children}
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen overflow-hidden bg-background">
      <ActivityBar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className={cn(
          "relative min-h-0 flex-grow",
          isIndependentScrollRoute ? "overflow-hidden" : "overflow-y-auto"
        )}>
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AuthenticatedShell>{children}</AuthenticatedShell>
      </SettingsProvider>
    </AuthProvider>
  );
}
