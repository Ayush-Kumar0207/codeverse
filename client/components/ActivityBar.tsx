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
  role?: "organizer" | "collaborator";
  canEdit?: boolean;
}

interface PresenceHeaderProps {
  projectTitle: string;
  users?: PresenceUser[];
  showBackButton?: boolean;
  backHref?: string;
  onDeploy?: () => void;
  latencyMs?: number | null;
  connected?: boolean;
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
                  <div
                    role="img"
                    aria-label="User"
                    className="w-8 h-8 rounded-full border border-primary/50 group-hover:scale-110 transition-transform bg-cover bg-center"
                    style={{ backgroundImage: `url(${user.avatar})` }}
                  />
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
  latencyMs = null,
  connected = false,
}: PresenceHeaderProps) {
  return (
    <header className="z-40 flex h-12 items-center justify-between border-b border-slate-800 bg-[#090d14]/95 px-4 text-slate-100 backdrop-blur-md">
      <div className="flex items-center space-x-3">
        {showBackButton && (
          <Link
            href={backHref}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-800 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
            aria-label="Back"
            title="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
        )}
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Workspace</span>
        <span className="text-sm font-medium text-slate-100">{projectTitle || "Untitled Project"}</span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden items-center gap-2 rounded-md border border-slate-800 bg-slate-950/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 sm:flex">
          <span className={cn("h-1.5 w-1.5 rounded-full", connected ? "bg-emerald-400" : "bg-rose-400")} />
          <span>{connected ? `${latencyMs ?? "-"}ms` : "Offline"}</span>
        </div>

        {/* Presence Avatars */}
        <div className="flex -space-x-2">
          {users.slice(0, 3).map((u, i) => (
            <TooltipProvider key={i} delay={0}>
              <Tooltip>
                <TooltipTrigger>
                  <div 
                    className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-slate-800 bg-slate-900 ring-1 ring-indigo-500/20"
                  >
                    {u.avatar ? (
                      <div
                        role="img"
                        aria-label={u.username}
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${u.avatar})` }}
                      />
                    ) : (
                      <span className="text-[10px] uppercase">{u.username?.slice(0, 2)}</span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {u.username} ({u.role === "organizer" ? "Organizer" : u.canEdit === false ? "View only" : u.status || "Editing"})
                  </p>
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

        <div className="h-4 w-[1px] bg-slate-800" />
        
        <button 
          onClick={onDeploy}
          className="flex items-center space-x-2 rounded-md bg-indigo-500 px-3 py-1 text-xs font-medium text-white shadow-lg shadow-indigo-500/15 transition-colors hover:bg-indigo-400"
        >
          <Github className="w-3 h-3" />
          <span>Deploy</span>
        </button>
      </div>
    </header>
  );
}
