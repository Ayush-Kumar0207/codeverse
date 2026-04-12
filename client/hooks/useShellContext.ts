"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function useShellContext() {
  const pathname = usePathname();
  const { user } = useAuth();

  const isEditor = pathname?.startsWith("/editor");
  const isDashboard = pathname === "/dashboard";
  const isProfile = pathname === "/profile";
  const isEncyclopedia = pathname?.startsWith("/encyclopedia");

  return {
    pathname,
    user,
    isEditor,
    isDashboard,
    isProfile,
    isEncyclopedia,
    // Future expansion for active file or selected text
    currentContext: isEditor ? "Development" : isEncyclopedia ? "Resource" : "System",
  };
}
