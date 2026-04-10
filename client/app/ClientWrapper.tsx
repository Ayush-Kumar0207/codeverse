"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import NavBarPublic from "@/components/NavBarPublic";
import { ActivityBar } from "@/components/ActivityBar";
import { CommandPalette } from "@/components/CommandPalette";

function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <ActivityBar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-grow overflow-hidden relative">
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
