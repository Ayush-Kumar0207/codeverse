"use client";

import * as React from "react";
import {
  Activity,
  BookOpen,
  CheckCircle2,
  Clipboard,
  Code2,
  Focus,
  LayoutDashboard,
  Loader2,
  LogOut,
  Settings,
  Share2,
  Sparkles,
  User,
  Wand2,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSettings, type ThemeType } from "@/context/SettingsContext";
import { useShellContext } from "@/hooks/useShellContext";

type CommandAction = () => void | Promise<void>;
const themeCycle: ThemeType[] = ["midnight", "hacker", "solarized", "amoled"];

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [isCheckingHealth, setIsCheckingHealth] = React.useState(false);
  const [notice, setNotice] = React.useState("");
  const { settings, updateSetting } = useSettings();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isEditor, currentContext } = useShellContext();

  React.useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };

    const toggle = () => setOpen((value) => !value);

    document.addEventListener("keydown", down);
    window.addEventListener("toggle-command-palette", toggle);

    return () => {
      document.removeEventListener("keydown", down);
      window.removeEventListener("toggle-command-palette", toggle);
    };
  }, []);

  const runCommand = React.useCallback((action: CommandAction) => {
    try {
      void Promise.resolve(action()).catch((error: unknown) => {
        setNotice(error instanceof Error ? error.message : "Command failed");
      });
      setOpen(false);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Command failed");
    }
  }, []);

  const runSystemAudit = async () => {
    setIsCheckingHealth(true);
    setNotice("Checking API health...");

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "http://localhost:5000";
      const started = performance.now();
      const response = await fetch(`${baseUrl}/api/health`);
      if (!response.ok) throw new Error(`Health check failed (${response.status})`);

      const health = await response.json();
      const latency = Math.round(performance.now() - started);
      setNotice(
        `API healthy · ${latency}ms latency · ${health.memory?.heapUsedMb ?? "?"} MB heap`
      );
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Backend is unreachable");
    } finally {
      setIsCheckingHealth(false);
    }
  };

  const copyText = async (text: string, successMessage: string) => {
    await navigator.clipboard?.writeText(text);
    setNotice(successMessage);
  };

  const copyInviteLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    return copyText(url, "Current page link copied.");
  };

  const copySessionSummary = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    return copyText(`CodeVerse session: ${url}`, "Session summary copied.");
  };

  const askAssistant = (question: string) => {
    window.dispatchEvent(
      new CustomEvent("algotrace:ask_ai", {
        detail: {
          stateContext: { context: currentContext, page: window.location.pathname },
          question,
        },
      })
    );
    setNotice("Assistant prompt prepared in the editor panel.");
  };

  const toggleFocusMode = () => {
    document.documentElement.classList.toggle("focus-mode");
    setNotice("Focus mode toggled for this browser session.");
  };

  const toggleTheme = () => {
    const currentIndex = themeCycle.indexOf(settings.appearance.theme);
    const nextTheme = themeCycle[(currentIndex + 1) % themeCycle.length];
    updateSetting("appearance", { theme: nextTheme });
    setNotice(`Theme changed to ${nextTheme}.`);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <div className="flex flex-col">
        <div className="border-b border-white/10 bg-[#0b111c]">
          <div className="flex items-center justify-between gap-4 px-4 pt-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Command Palette</h2>
              <p className="mt-1 text-xs text-slate-500">Search actions, pages, and tools.</p>
            </div>
            <div className="hidden items-center gap-1 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] font-medium text-slate-400 sm:flex">
              <span>Ctrl</span>
              <span>K</span>
            </div>
          </div>
          <CommandInput placeholder="Type a command or destination..." />
        </div>

        <CommandList className="max-h-[440px] p-2">
          <CommandEmpty className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Sparkles className="h-6 w-6 text-slate-500" />
            <p className="text-sm font-medium text-slate-300">No command found</p>
            <p className="text-xs text-slate-500">Try searching for dashboard, profile, theme, or health.</p>
          </CommandEmpty>

          <CommandGroup heading="Workspace">
            <CommandItem value="open dashboard project browser" onSelect={() => runCommand(() => router.push("/dashboard"))}>
              <LayoutDashboard className="text-sky-300" />
              <CommandText title="Dashboard" description="Open your project workspace." />
              <CommandShortcut>Ctrl D</CommandShortcut>
            </CommandItem>
            <CommandItem value="open sandbox demo editor" onSelect={() => runCommand(() => router.push("/editor/demo-sandbox?mode=demo"))}>
              <Code2 className="text-indigo-300" />
              <CommandText title="Open Sandbox" description="Start a disposable coding session." />
            </CommandItem>
            <CommandItem value="open encyclopedia algorithms resources" onSelect={() => runCommand(() => router.push("/encyclopedia"))}>
              <BookOpen className="text-emerald-300" />
              <CommandText title="Algorithm Encyclopedia" description="Browse learning resources and visualizers." />
            </CommandItem>
          </CommandGroup>

          {isEditor && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Editor">
                <CommandItem
                  value="ask assistant refactor optimize active file"
                  onSelect={() =>
                    runCommand(() =>
                      askAssistant(
                        "Refactor the active file for clarity, correctness, and time complexity. Return concrete code edits and explain tradeoffs."
                      )
                    )
                  }
                >
                  <Wand2 className="text-indigo-300" />
                  <CommandText title="Refactor Active File" description="Ask the assistant for focused code improvements." />
                </CommandItem>
                <CommandItem
                  value="generate tests edge cases active file"
                  onSelect={() =>
                    runCommand(() =>
                      askAssistant(
                        "Generate edge cases and adversarial tests for the active file. Include expected outputs and explain why each case matters."
                      )
                    )
                  }
                >
                  <Clipboard className="text-amber-300" />
                  <CommandText title="Generate Test Cases" description="Create edge cases for the current code." />
                </CommandItem>
              </CommandGroup>
            </>
          )}

          <CommandSeparator />
          <CommandGroup heading="System">
            <CommandItem value="check health api status diagnostics" onSelect={() => void runSystemAudit()}>
              {isCheckingHealth ? (
                <Loader2 className="animate-spin text-indigo-300" />
              ) : (
                <Activity className="text-indigo-300" />
              )}
              <CommandText title="Check API Health" description="Verify backend latency and memory usage." />
            </CommandItem>
            <CommandItem value="toggle theme dark light appearance" onSelect={() => runCommand(toggleTheme)}>
              <Settings className="text-primary" />
              <CommandText title="Cycle Theme" description={`Current: ${settings.appearance.theme}.`} />
            </CommandItem>
            <CommandItem value="toggle focus mode reduce effects" onSelect={() => runCommand(toggleFocusMode)}>
              <Focus className="text-emerald-300" />
              <CommandText title="Focus Mode" description="Reduce decorative effects for this session." />
            </CommandItem>
            <CommandItem value="open settings preferences" onSelect={() => runCommand(() => router.push("/settings"))}>
              <Settings className="text-slate-300" />
              <CommandText title="Settings" description="Open appearance, editor, and sync preferences." />
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />
          <CommandGroup heading="Share">
            <CommandItem value="copy invite link current page" onSelect={() => runCommand(copyInviteLink)}>
              <Clipboard className="text-sky-300" />
              <CommandText title="Copy Current Link" description="Copy this page URL to the clipboard." />
            </CommandItem>
            <CommandItem value="copy session summary share" onSelect={() => runCommand(copySessionSummary)}>
              <Share2 className="text-indigo-300" />
              <CommandText title="Copy Session Summary" description="Copy a short shareable session note." />
            </CommandItem>
          </CommandGroup>

          {user && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Account">
                <CommandItem value="open profile account" onSelect={() => runCommand(() => router.push("/profile"))}>
                  <User className="text-slate-300" />
                  <CommandText title="Profile" description="View your account and workspace identity." />
                </CommandItem>
                <CommandItem
                  value="sign out logout"
                  onSelect={() =>
                    runCommand(() => {
                      logout();
                      router.push("/login");
                    })
                  }
                  className="text-red-300 data-[selected=true]:bg-red-500/10 data-[selected=true]:text-red-200"
                >
                  <LogOut className="text-red-300" />
                  <CommandText title="Sign Out" description="End the current session." />
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>

        <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-[#0b111c] px-4 py-3">
          <div className="flex min-w-0 items-center gap-2 text-xs text-slate-400">
            {isCheckingHealth ? (
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-indigo-300" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
            )}
            <span className="truncate">{notice || `Context: ${currentContext}`}</span>
          </div>
          <span className="hidden shrink-0 text-xs text-slate-600 sm:inline">Esc to close</span>
        </div>
      </div>
    </CommandDialog>
  );
}

function CommandText({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="truncate text-sm font-semibold">{title}</div>
      <div className="mt-0.5 truncate text-xs text-slate-500">{description}</div>
    </div>
  );
}
