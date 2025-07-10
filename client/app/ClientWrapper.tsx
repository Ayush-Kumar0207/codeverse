"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import NavBarPrivate from "@/components/NavBarPrivate";
import NavBarPublic from "@/components/NavBarPublic";

function ConditionalNavBar() {
  const { user } = useAuth();
  return user ? <NavBarPrivate /> : <NavBarPublic />;
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <ConditionalNavBar />
          <main className="flex-grow container mx-auto px-4 py-6">{children}</main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
