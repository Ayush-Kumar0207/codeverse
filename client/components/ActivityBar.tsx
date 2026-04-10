"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  ArrowLeft,
  Files, 
  Search, 
  MessageSquare, 
  Settings, 
  User, 
  Github, 
  LogOut,
  Command,
  LayoutGrid,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useNavigationMenu } from "@/hooks/useNavigationMenu";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface PresenceUser {
  username: string;
  avatar?: string;
  status?: string;
}

interface PresenceHeaderProps {
  projectTitle: string;
  users?: PresenceUser[];
  showBackButton?: boolean;
  backHref?: string;
  onDeploy?: () => void;
}

export function ActivityBar() {
  const { handleLogout } = useNavigationMenu();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: Search, label: "Search / Commands", id: "search", href: "#" },
    { icon: Files, label: "Dashboard", id: "dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "Algorithm Encyclopedia", id: "encyclopedia", href: "/encyclopedia" },
    { icon: MessageSquare, label: "Editor", id: "editor", href: "/editor/demo-sandbox?mode=demo" },
    { icon: LayoutGrid, label: "About", id: "about", href: "/about" },
  ];

  return (
    <div className="w-12 flex flex-col items-center py-4 bg-[var(--activity-bar-background)] border-r border-[var(--sidebar-border)] h-full z-50">
      <div className="mb-8">
        <TooltipProvider delay={0}>
          <Tooltip>
            <TooltipTrigger
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push("/");
              }}
              aria-label="Go to Landing Page"
              className="text-primary hover:scale-110 transition-transform flex items-center justify-center h-10 w-10 rounded-md"
            >
              <Command className="w-8 h-8" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="font-bold">Go to Landing Page</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex-1 flex flex-col space-y-4 w-full items-center">
        <TooltipProvider delay={0}>
          {navItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (item.id === "search") {
                    window.dispatchEvent(new CustomEvent("toggle-command-palette"));
                  } else {
                    router.push(item.href);
                  }
                }}
                aria-label={item.label}
                className={cn(
                  "h-10 w-10 flex items-center justify-center rounded-md transition-colors hover:bg-white/5",
                  pathname === item.href || (item.id === "editor" && pathname?.startsWith("/editor"))
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="w-6 h-6" />
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      <div className="mt-auto flex flex-col space-y-4 items-center w-full">
        <TooltipProvider delay={0}>
          <Tooltip>
            <TooltipTrigger
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push("/settings");
              }}
              className={cn(
                "h-10 w-10 flex items-center justify-center rounded-md transition-colors hover:bg-white/5",
                pathname === "/settings" ? "text-primary bg-white/5" : "text-muted-foreground"
              )}
            >
              <Settings className="w-6 h-6" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>System Settings</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleLogout();
              }}
              className="h-10 w-10 flex items-center justify-center rounded-md text-muted-foreground hover:bg-white/5"
            >
              <LogOut className="w-6 h-6 text-destructive/80" />
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push("/profile");
              }}
              className={cn(
                "w-full flex justify-center py-4 border-t border-white/10 mt-2 transition-all hover:bg-white/5 group",
                pathname === "/profile" ? "bg-white/5" : ""
              )}
            >
               {user?.avatar ? (
                  <img src={user.avatar} className="w-8 h-8 rounded-full border border-primary/50 group-hover:scale-110 transition-transform" alt="User" />
               ) : (
                  <User className={cn("w-6 h-6 group-hover:scale-110 transition-transform", pathname === "/profile" ? "text-primary" : "text-muted-foreground")} />
               )}
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Neural Identity</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export function PresenceHeader({
  projectTitle,
  users = [],
  showBackButton = false,
  backHref = "/",
  onDeploy,
}: PresenceHeaderProps) {
  return (
    <header className="h-12 border-b border-[var(--sidebar-border)] bg-background/80 backdrop-blur-md flex items-center justify-between px-4 z-40">
      <div className="flex items-center space-x-3">
        {showBackButton && (
          <Link
            href={backHref}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            aria-label="Back to landing page"
            title="Back to landing page"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        )}
        <span className="text-xs font-mono text-muted-foreground opacity-50 uppercase tracking-widest">Workspace</span>
        <span className="text-sm font-medium">{projectTitle || "Untitled Project"}</span>
      </div>

      <div className="flex items-center space-x-4">
        {/* Presence Avatars */}
        <div className="flex -space-x-2">
          {users.slice(0, 3).map((u, i) => (
            <TooltipProvider key={i} delay={0}>
              <Tooltip>
                <TooltipTrigger>
                  <div 
                    className="w-7 h-7 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden ring-1 ring-primary/20"
                  >
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.username} />
                    ) : (
                      <span className="text-[10px] uppercase">{u.username?.slice(0, 2)}</span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{u.username} ({u.status || "Editing"})</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          {users.length > 3 && (
            <div className="w-7 h-7 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold">
              +{users.length - 3}
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-border" />
        
        <button 
          onClick={onDeploy}
          className="flex items-center space-x-2 px-3 py-1 bg-primary text-primary-foreground text-xs rounded-md font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          <Github className="w-3 h-3" />
          <span>Deploy</span>
        </button>
      </div>
    </header>
  );
}
