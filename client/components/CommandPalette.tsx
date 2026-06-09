"use client";

import * as React from "react";
import { flushSync } from "react-dom";
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
import { AT_ALGORITHMS, type AlgorithmEntry } from "@/data/algos";
import { useAuth } from "@/context/AuthContext";
import { useSettings, type ThemeType } from "@/context/SettingsContext";
import { useShellContext } from "@/hooks/useShellContext";

type CommandAction = () => void | Promise<void>;
type AskAssistantDetail = {
  stateContext?: Record<string, unknown>;
  question?: string;
};

const themeCycle: ThemeType[] = ["midnight", "hacker", "solarized", "amoled"];
const commandStatsKey = "codeverse:command-palette:stats";
const pendingAssistantPromptKey = "codeverse:pending-ai-prompt";

const normalize = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9#+]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value: string) => normalize(value).split(" ").filter(Boolean);
const queryAliases: Record<string, string[]> = {
  ai: ["assistant"],
  api: ["backend", "health"],
  dp: ["dynamic", "programming"],
  bfs: ["breadth", "first", "search"],
  dfs: ["depth", "first", "search"],
  mst: ["minimum", "spanning", "tree"],
  scc: ["strongly", "connected", "components"],
  ui: ["appearance", "theme"],
};

const expandQueryTokens = (query: string) => {
  const tokens = tokenize(query);
  const expanded = new Set(tokens);

  tokens.forEach((token) => queryAliases[token]?.forEach((alias) => expanded.add(alias)));
  return Array.from(expanded);
};

const commandMatches = (query: string, ...sources: string[]) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;

  const haystack = sources.map(normalize).join(" ");
  return tokenize(normalizedQuery).every((token) =>
    [token, ...(queryAliases[token] || [])].some((candidate) => haystack.includes(candidate))
  );
};

const scoreAlgorithm = (query: string, algorithm: AlgorithmEntry) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 0;

  const searchable = [
    algorithm.id.replace(/-/g, " "),
    algorithm.title,
    algorithm.topic,
    algorithm.category,
    algorithm.difficulty,
    algorithm.frequencyLevel,
    algorithm.overview,
    ...(algorithm.useCases || []),
    ...algorithm.approaches.flatMap((approach) => [
      approach.name,
      approach.description,
      approach.timeComplexity,
      approach.spaceComplexity,
    ]),
  ]
    .join(" ");
  const normalizedSearchable = normalize(searchable);
  const titleSearchable = normalize(`${algorithm.title} ${algorithm.id.replace(/-/g, " ")}`);

  if (titleSearchable === normalizedQuery) return 240;
  if (titleSearchable.includes(normalizedQuery)) return 180;
  if (normalizedSearchable.includes(normalizedQuery)) return 120;

  return expandQueryTokens(normalizedQuery).reduce((score, token) => {
    if (titleSearchable.split(" ").includes(token)) return score + 36;
    if (titleSearchable.includes(token)) return score + 28;
    if (normalizedSearchable.split(" ").includes(token)) return score + 20;
    if (normalizedSearchable.includes(token)) return score + 12;
    return score;
  }, 0);
};

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [isCheckingHealth, setIsCheckingHealth] = React.useState(false);
  const [notice, setNotice] = React.useState("");
  const dialogActionsRef = React.useRef<{ close: () => void; unmount: () => void } | null>(null);
  const isCommandClosingRef = React.useRef(false);
  const { settings, updateSetting, diagnostics, apm, syncStatus } = useSettings();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isEditor, isDashboard, isEncyclopedia, currentContext, pathname } = useShellContext();

  const query = search.trim();
  const normalizedQuery = normalize(search);

  const bestAlgorithmMatch = React.useMemo(() => {
    if (normalizedQuery.length < 2) return null;

    return AT_ALGORITHMS.map((algorithm) => ({
      algorithm,
      score: scoreAlgorithm(normalizedQuery, algorithm),
    }))
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score || left.algorithm.title.localeCompare(right.algorithm.title))[0]?.algorithm || null;
  }, [normalizedQuery]);

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

  React.useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const closePalette = React.useCallback(() => {
    isCommandClosingRef.current = true;
    setSearch("");
    setOpen(false);
    dialogActionsRef.current?.close();
    window.setTimeout(() => {
      isCommandClosingRef.current = false;
    }, 250);
  }, []);

  React.useEffect(() => {
    closePalette();
  }, [closePalette, pathname]);

  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    if (nextOpen && isCommandClosingRef.current) return;
    setOpen(nextOpen);
    if (!nextOpen) setSearch("");
  }, []);

  const rememberCommand = React.useCallback((id: string, title: string) => {
    try {
      const previous = JSON.parse(window.localStorage.getItem(commandStatsKey) || "{}") as Record<
        string,
        { uses?: number; lastUsed?: number; title?: string }
      >;
      window.localStorage.setItem(
        commandStatsKey,
        JSON.stringify({
          ...previous,
          [id]: {
            uses: (previous[id]?.uses || 0) + 1,
            lastUsed: Date.now(),
            title,
          },
        })
      );
    } catch {
      // Command memory is only a convenience layer.
    }
  }, []);

  const runCommand = React.useCallback(
    (id: string, title: string, action: CommandAction) => {
      rememberCommand(id, title);

      try {
        flushSync(closePalette);
        window.setTimeout(closePalette, 0);
        window.setTimeout(closePalette, 150);
        void Promise.resolve(action()).catch((error: unknown) => {
          setNotice(error instanceof Error ? error.message : "Command failed");
        });
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Command failed");
      }
    },
    [closePalette, rememberCommand]
  );

  const runSystemAudit = async () => {
    rememberCommand("check-health", "Check API Health");
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
    if (!text) throw new Error("Nothing to copy from this page.");

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      if (!copied) throw new Error("Clipboard access is unavailable in this browser.");
    }

    setNotice(successMessage);
  };

  const copyInviteLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    return copyText(url, "Current page link copied.");
  };

  const copySessionSummary = () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const summary = [
      `CodeVerse session: ${url}`,
      `Context: ${currentContext}`,
      `Theme: ${settings.appearance.theme}`,
      bestAlgorithmMatch ? `Search focus: ${bestAlgorithmMatch.title}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return copyText(summary, "Session summary copied.");
  };

  const askAssistant = (question: string) => {
    const userFocus = query ? `\n\nUser search focus: ${query}` : "";
    const aiTabButton = document.querySelector(
      'button[value="assistant"], [data-tab-value="assistant"]'
    ) as HTMLButtonElement | null;
    window.dispatchEvent(new CustomEvent("codeverse:open-assistant-panel"));
    aiTabButton?.click();

    const detail: AskAssistantDetail = {
      stateContext: {
        context: currentContext,
        page: window.location.pathname,
        query,
        matchedAlgorithm: bestAlgorithmMatch?.title,
      },
      question: `${question}${userFocus}`,
    };

    window.sessionStorage.setItem(pendingAssistantPromptKey, JSON.stringify(detail));
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("algotrace:ask_ai", { detail }));
    }, aiTabButton ? 120 : 0);
    setNotice("Assistant prompt prepared in the editor panel.");
  };

  const algorithmValue = bestAlgorithmMatch
    ? `${bestAlgorithmMatch.title} ${bestAlgorithmMatch.topic} ${bestAlgorithmMatch.category}`
    : "";
  const showDashboard = commandMatches(query, "dashboard project workspace recent saves");
  const showOpenSandbox =
    Boolean(bestAlgorithmMatch) ||
    commandMatches(query, "open sandbox demo editor algorithm visualizer practice", algorithmValue);
  const showEncyclopedia =
    Boolean(bestAlgorithmMatch) ||
    commandMatches(query, "algorithm encyclopedia resources learn visualizers", algorithmValue);
  const showRefactor = commandMatches(query, "refactor optimize improve code active file clarity correctness complexity assistant");
  const showTests = commandMatches(query, "generate tests test cases edge edge-cases adversarial expected outputs validation");
  const showHealth = commandMatches(query, "check health api backend status diagnostics latency memory");
  const showTheme = commandMatches(query, "cycle toggle theme appearance dark light", settings.appearance.theme);
  const showFocus = commandMatches(query, "focus mode reduce effects distractions calm");
  const showSettings = commandMatches(query, "settings preferences appearance editor sync audio diagnostics");
  const showCopyLink = commandMatches(query, "copy current link invite url page clipboard");
  const showCopySummary = commandMatches(query, "copy session summary share context workspace note");
  const showProfile = commandMatches(query, "profile account identity saved artifacts");
  const showSignOut = commandMatches(query, "sign out logout account session");

  const workspaceHasMatches = showDashboard || showOpenSandbox || showEncyclopedia;
  const editorHasMatches = isEditor && (showRefactor || showTests);
  const systemHasMatches = showHealth || showTheme || showFocus || showSettings;
  const shareHasMatches = showCopyLink || showCopySummary;
  const accountHasMatches = Boolean(user && (showProfile || showSignOut));

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

  const openSandbox = () => {
    const target = bestAlgorithmMatch
      ? `/editor/demo-sandbox?mode=demo&algo=${bestAlgorithmMatch.id}`
      : "/editor/demo-sandbox?mode=demo";
    router.push(target);
  };

  const openEncyclopedia = () => {
    const targetQuery = bestAlgorithmMatch?.title || query;
    router.push(targetQuery ? `/encyclopedia?query=${encodeURIComponent(targetQuery)}` : "/encyclopedia");
  };

  const footerText =
    notice ||
    `${currentContext} · ${syncStatus === "syncing" ? "syncing" : "ready"} · ${apm} APM · ${pathname || "/"}`;

  if (!open) return null;

  return (
    <CommandDialog actionsRef={dialogActionsRef} open={open} onOpenChange={handleOpenChange}>
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 border-b border-border bg-popover">
          <div className="flex items-center justify-between gap-4 px-4 pt-4">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Command Palette</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Search actions, pages, and tools. Results adapt to the current workspace.
              </p>
            </div>
            <div className="hidden items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-1 text-[11px] font-medium text-muted-foreground sm:flex">
              <span>Ctrl</span>
              <span>K</span>
            </div>
          </div>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Type a command, destination, or algorithm..."
          />
        </div>

        <CommandList className="min-h-0 flex-1 p-2 pr-3">
          <CommandEmpty className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <Sparkles className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">No command found</p>
            <p className="text-xs text-muted-foreground">Try dashboard, sandbox, theme, health, tests, or an algorithm name.</p>
          </CommandEmpty>

          {workspaceHasMatches && (
            <CommandGroup heading="Workspace">
              {showDashboard && (
                <CommandItem
                  data-command-id="dashboard"
                  value="open dashboard project browser workspace recent saves"
                  onSelect={() => runCommand("dashboard", "Dashboard", () => router.push(user ? "/dashboard" : "/login"))}
                >
                  <LayoutDashboard className="text-sky-300" />
                  <CommandText
                    title="Dashboard"
                    description={isDashboard ? "You are already in the project workspace." : "Open projects, recent saves, and workspace stats."}
                  />
                  <CommandShortcut>Ctrl D</CommandShortcut>
                </CommandItem>
              )}
              {showOpenSandbox && (
                <CommandItem
                  data-command-id="open-sandbox"
                  value={`open sandbox demo editor algorithm visualizer practice ${algorithmValue}`}
                  onSelect={() => runCommand("open-sandbox", "Open Sandbox", openSandbox)}
                >
                  <Code2 className="text-primary" />
                  <CommandText
                    title="Open Sandbox"
                    description={
                      bestAlgorithmMatch
                        ? `Start a sandbox for ${bestAlgorithmMatch.title}.`
                        : "Start a disposable coding session."
                    }
                  />
                </CommandItem>
              )}
              {showEncyclopedia && (
                <CommandItem
                  data-command-id="encyclopedia"
                  value={`open encyclopedia algorithms resources learn visualizers ${algorithmValue}`}
                  onSelect={() => runCommand("encyclopedia", "Algorithm Encyclopedia", openEncyclopedia)}
                >
                  <BookOpen className="text-emerald-300" />
                  <CommandText
                    title="Algorithm Encyclopedia"
                    description={
                      bestAlgorithmMatch
                        ? `Open learning resources for ${bestAlgorithmMatch.title}.`
                        : isEncyclopedia
                          ? "Search within the learning library."
                          : "Browse learning resources and visualizers."
                    }
                  />
                </CommandItem>
              )}
            </CommandGroup>
          )}

          {editorHasMatches && (
            <>
              {workspaceHasMatches && <CommandSeparator />}
              <CommandGroup heading="Editor">
                {showRefactor && (
                  <CommandItem
                    data-command-id="refactor-active-file"
                    value="ask assistant refactor optimize active file improve code clarity correctness complexity"
                    onSelect={() =>
                      runCommand("refactor-active-file", "Refactor Active File", () =>
                        askAssistant(
                          "Refactor the active file for clarity, correctness, maintainability, and time complexity. Return concrete code edits and explain tradeoffs."
                        )
                      )
                    }
                  >
                    <Wand2 className="text-primary" />
                    <CommandText
                      title="Refactor Active File"
                      description="Ask the assistant for focused code improvements using the current workspace context."
                    />
                  </CommandItem>
                )}
                {showTests && (
                  <CommandItem
                    data-command-id="generate-tests"
                    value="generate tests edge cases active file adversarial expected outputs validation"
                    onSelect={() =>
                      runCommand("generate-tests", "Generate Test Cases", () =>
                        askAssistant(
                          "Generate edge cases, adversarial tests, and expected outputs for the active file. Explain why each case matters."
                        )
                      )
                    }
                  >
                    <Clipboard className="text-amber-300" />
                    <CommandText
                      title="Generate Test Cases"
                      description="Create stronger tests shaped by the current file and your search focus."
                    />
                  </CommandItem>
                )}
              </CommandGroup>
            </>
          )}

          {systemHasMatches && (
            <>
              {(workspaceHasMatches || editorHasMatches) && <CommandSeparator />}
              <CommandGroup heading="System">
                {showHealth && (
                  <CommandItem data-command-id="check-health" value="check health api status diagnostics backend latency memory" onSelect={() => void runSystemAudit()}>
                    {isCheckingHealth ? (
                      <Loader2 className="animate-spin text-primary" />
                    ) : (
                      <Activity className="text-primary" />
                    )}
                    <CommandText
                      title="Check API Health"
                      description={`Verify backend status. Last known: ${diagnostics.latency || "?"}ms, ${diagnostics.memory || "?"} MB.`}
                    />
                  </CommandItem>
                )}
                {showTheme && (
                  <CommandItem
                    data-command-id="cycle-theme"
                    value={`toggle theme dark light appearance current ${settings.appearance.theme}`}
                    onSelect={() => runCommand("cycle-theme", "Cycle Theme", toggleTheme)}
                  >
                    <Settings className="text-primary" />
                    <CommandText title="Cycle Theme" description={`Current: ${settings.appearance.theme}.`} />
                  </CommandItem>
                )}
                {showFocus && (
                  <CommandItem
                    data-command-id="focus-mode"
                    value="toggle focus mode reduce effects distractions calm"
                    onSelect={() => runCommand("focus-mode", "Focus Mode", toggleFocusMode)}
                  >
                    <Focus className="text-emerald-300" />
                    <CommandText title="Focus Mode" description="Reduce decorative effects for this browser session." />
                  </CommandItem>
                )}
                {showSettings && (
                  <CommandItem
                    data-command-id="settings"
                    value="open settings preferences appearance editor sync audio diagnostics"
                    onSelect={() => runCommand("settings", "Settings", () => router.push("/settings"))}
                  >
                    <Settings className="text-muted-foreground" />
                    <CommandText title="Settings" description="Open appearance, editor, and sync preferences." />
                  </CommandItem>
                )}
              </CommandGroup>
            </>
          )}

          {shareHasMatches && (
            <>
              {(workspaceHasMatches || editorHasMatches || systemHasMatches) && <CommandSeparator />}
              <CommandGroup heading="Share">
                {showCopyLink && (
                  <CommandItem data-command-id="copy-link" value="copy invite link current page url clipboard" onSelect={() => runCommand("copy-link", "Copy Current Link", copyInviteLink)}>
                    <Clipboard className="text-sky-300" />
                    <CommandText title="Copy Current Link" description="Copy this page URL to the clipboard." />
                  </CommandItem>
                )}
                {showCopySummary && (
                  <CommandItem data-command-id="copy-summary" value="copy session summary share context workspace" onSelect={() => runCommand("copy-summary", "Copy Session Summary", copySessionSummary)}>
                    <Share2 className="text-primary" />
                    <CommandText title="Copy Session Summary" description="Copy a concise session note with page and context." />
                  </CommandItem>
                )}
              </CommandGroup>
            </>
          )}

          {accountHasMatches && (
            <>
              {(workspaceHasMatches || editorHasMatches || systemHasMatches || shareHasMatches) && <CommandSeparator />}
              <CommandGroup heading="Account">
                {showProfile && (
                  <CommandItem data-command-id="profile" value="open profile account identity saved artifacts" onSelect={() => runCommand("profile", "Profile", () => router.push("/profile"))}>
                    <User className="text-muted-foreground" />
                    <CommandText title="Profile" description="View your account and workspace identity." />
                  </CommandItem>
                )}
                {showSignOut && (
                  <CommandItem
                    data-command-id="sign-out"
                    value="sign out logout account session"
                    onSelect={() =>
                      runCommand("sign-out", "Sign Out", () => {
                        logout();
                        router.push("/login");
                      })
                    }
                    className="text-red-300 data-[selected=true]:bg-red-500/10 data-[selected=true]:text-red-200"
                  >
                    <LogOut className="text-red-300" />
                    <CommandText title="Sign Out" description="End the current session." />
                  </CommandItem>
                )}
              </CommandGroup>
            </>
          )}
        </CommandList>

        <div className="command-palette-footer flex shrink-0 items-center justify-between gap-4 border-t border-border bg-popover px-4 py-3">
          <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
            {isCheckingHealth ? (
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-primary" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
            )}
            <span className="truncate">{footerText}</span>
          </div>
          <span className="hidden shrink-0 text-xs text-muted-foreground/70 sm:inline">Esc to close</span>
        </div>
      </div>
    </CommandDialog>
  );
}

function CommandText({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="truncate text-sm font-semibold">{title}</div>
      <div className="mt-0.5 truncate text-xs text-muted-foreground">{description}</div>
    </div>
  );
}
