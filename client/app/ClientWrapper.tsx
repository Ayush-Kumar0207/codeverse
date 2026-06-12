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
  const isIndependentScrollRoute = isEditorRoute || pathname === "/encyclopedia";
  const canPaintBeforeAuth =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/demo" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/source" ||
    pathname === "/oauth-success" ||
    pathname === "/github-success" ||
    pathname === "/google-success" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/encyclopedia";
  
  if (loading && !canPaintBeforeAuth) return null;

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
