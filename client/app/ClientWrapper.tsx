"use client";

import { ThemeProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ActivityBar } from "@/components/ActivityBar";
import { CommandPalette } from "@/components/CommandPalette";
import { cn } from "@/lib/utils";

function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const isEditorRoute = pathname?.startsWith("/editor/");
  
  if (loading) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen overflow-hidden bg-background">
      <ActivityBar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className={cn(
          "flex-grow relative",
          isEditorRoute ? "overflow-hidden" : "overflow-y-auto"
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
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>
        <AuthenticatedShell>{children}</AuthenticatedShell>
      </AuthProvider>
    </ThemeProvider>
  );
}
