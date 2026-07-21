"use client";

import { Suspense, type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AT_ALGORITHMS, type AlgorithmEntry, type AlgorithmStoryDryRun } from "@/data/algos";
import { buildAlgorithmLearningProfile } from "@/lib/algo-learning";
import {
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Copy,
  Cpu,
  Database,
  ExternalLink,
  Layers3,
  ListChecks,
  Maximize2,
  Menu,
  Minimize2,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import NarratedSlab, { NarratedLine } from "@/components/NarratedSlab";
import SemanticText from "@/components/SemanticText";
import SyntaxCodeViewer from "@/components/SyntaxCodeViewer";
import { codeNarrationLines, narrationLines, walkthroughBlocks, type NarrationContext, type WalkthroughBlock } from "@/lib/narration";
import { hasCinematicVisualizer } from "@/lib/cinematic-visualizers";

const difficultyStyles: Record<AlgorithmEntry["difficulty"], string> = {
  Easy: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  Medium: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  Hard: "border-red-400/25 bg-red-400/10 text-red-300",
};

const frequencyStyles: Record<AlgorithmEntry["frequencyLevel"], string> = {
  "Very High": "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
  High: "border-sky-400/25 bg-sky-400/10 text-sky-200",
  Medium: "border-violet-400/25 bg-violet-400/10 text-violet-200",
  Variable: "border-slate-400/20 bg-slate-400/10 text-slate-300",
  Niche: "border-slate-400/20 bg-slate-400/10 text-slate-300",
};

const getComplexityStyle = (complexity: string) => {
  const value = complexity.toLowerCase();
  if (value.includes("2^") || value.includes("n^") || value.includes("factorial")) {
    return "border-red-400/25 bg-red-400/10 text-red-300";
  }
  if (value.includes("n log n")) return "border-amber-400/25 bg-amber-400/10 text-amber-300";
  if (value.includes("log n") || value === "o(1)") {
    return "border-emerald-400/25 bg-emerald-400/10 text-emerald-300";
  }
  if (value.includes("n")) return "border-sky-400/25 bg-sky-400/10 text-sky-300";
  return "border-slate-400/20 bg-slate-400/10 text-slate-300";
};

const getFileExtension = (language: string) => {
  if (language === "Python") return "py";
  if (language === "Java") return "java";
  if (language === "C++") return "cpp";
  if (language === "TypeScript") return "ts";
  return "js";
};

export default function EncyclopediaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#050910] text-sm font-semibold text-slate-300">
          Loading encyclopedia...
        </div>
      }
    >
      <EncyclopediaContent />
    </Suspense>
  );
}

function EncyclopediaContent() {
  const searchParams = useSearchParams();
  const queryFromUrl = searchParams?.get("query") || "";
  const [activeAlgo, setActiveAlgo] = useState<AlgorithmEntry>(AT_ALGORITHMS[0]);
  const [searchTerm, setSearchTerm] = useState(queryFromUrl);
  const [activeApproachIdx, setActiveApproachIdx] = useState(0);
  const [selectedLang, setSelectedLang] = useState("JavaScript");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (AT_ALGORITHMS[0]?.topic) initial[AT_ALGORITHMS[0].topic] = true;
    return initial;
  });

  useEffect(() => {
    const savedLang = localStorage.getItem("algo-trace-preferred-lang");
    if (savedLang) setSelectedLang(savedLang);
  }, []);

  const filteredAlgos = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return AT_ALGORITHMS;

    return AT_ALGORITHMS.filter((algo) =>
      `${algo.title} ${algo.topic} ${algo.category} ${algo.difficulty} ${algo.frequencyLevel}`
        .toLowerCase()
        .includes(query)
    );
  }, [searchTerm]);

  const groupedAlgos = useMemo(
    () =>
      filteredAlgos.reduce((acc, algo) => {
        const topic = algo.topic || "Uncategorized";
        if (!acc[topic]) acc[topic] = [];
        acc[topic].push(algo);
        return acc;
      }, {} as Record<string, AlgorithmEntry[]>),
    [filteredAlgos]
  );

  const topicCount = useMemo(() => new Set(AT_ALGORITHMS.map((algo) => algo.topic || "Uncategorized")).size, []);
  const activeApproach = activeAlgo.approaches[activeApproachIdx] || activeAlgo.approaches[0];
  const approachTabs = useMemo(() => buildApproachTabs(activeAlgo.approaches), [activeAlgo.approaches]);
  const activeImplementation =
    activeApproach.implementations.find((impl) => impl.language === selectedLang) ||
    activeApproach.implementations[0];
  const learning = useMemo(() => buildAlgorithmLearningProfile(activeAlgo, activeApproach), [activeAlgo, activeApproach]);
  const narrationContext = useMemo<NarrationContext>(
    () => ({
      algorithmTitle: activeAlgo.title,
      difficulty: activeAlgo.difficulty,
      topic: activeAlgo.topic,
      approachName: activeApproach.name,
      family: learning.family,
    }),
    [activeAlgo.difficulty, activeAlgo.title, activeAlgo.topic, activeApproach.name, learning.family]
  );
  const isSearchActive = searchTerm.trim().length > 0;
  const codeFileName = `${activeAlgo.id}-${slugify(activeApproach.name)}.${getFileExtension(
    activeImplementation?.language || selectedLang
  )}`;
  const narrationPrefix = `${activeAlgo.id}-${slugify(activeApproach.name)}`;
  const walkthrough = useMemo(() => walkthroughBlocks(activeApproach.description), [activeApproach.description]);
  const implementationNarration = useMemo(
    () =>
      codeNarrationLines(
        activeImplementation?.code || "// No implementation available",
        activeImplementation?.language || selectedLang,
        narrationContext
      ),
    [activeImplementation?.code, activeImplementation?.language, narrationContext, selectedLang]
  );

  useEffect(() => {
    const languages = activeApproach.implementations.map((implementation) => implementation.language);
    if (languages.length > 0 && !languages.includes(selectedLang)) {
      setSelectedLang(languages[0]);
    }
  }, [activeApproach, selectedLang]);

  const handleLangChange = (lang: string) => {
    setSelectedLang(lang);
    localStorage.setItem("algo-trace-preferred-lang", lang);
  };

  const handleSelectAlgo = useCallback((algo: AlgorithmEntry) => {
    setActiveAlgo(algo);
    setActiveApproachIdx(0);
    setExpandedTopics((prev) => ({ ...prev, [algo.topic || "Uncategorized"]: true }));
    setIsLibraryOpen(false);
    setCopied(false);
  }, []);

  useEffect(() => {
    if (!queryFromUrl.trim()) return;

    setSearchTerm(queryFromUrl);
    const query = queryFromUrl.trim().toLowerCase();
    const match = AT_ALGORITHMS.find((algo) =>
      `${algo.title} ${algo.topic} ${algo.category} ${algo.difficulty} ${algo.frequencyLevel}`
        .toLowerCase()
        .includes(query)
    );

    if (match) handleSelectAlgo(match);
  }, [handleSelectAlgo, queryFromUrl]);

  const toggleTopic = (topic: string) => {
    setExpandedTopics((prev) => ({ ...prev, [topic]: !prev[topic] }));
  };

  const copySnippet = async () => {
    await navigator.clipboard.writeText(activeImplementation?.code || "");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const libraryPanel = (
    <LibraryPanel
      activeAlgo={activeAlgo}
      expandedTopics={expandedTopics}
      filteredCount={filteredAlgos.length}
      groupedAlgos={groupedAlgos}
      isSearchActive={isSearchActive}
      onClose={() => setIsLibraryOpen(false)}
      onSearch={setSearchTerm}
      onSelectAlgo={handleSelectAlgo}
      onToggleTopic={toggleTopic}
      searchTerm={searchTerm}
      topicCount={topicCount}
    />
  );

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-[#050910] text-slate-100">
      {!isFullscreen && (
        <>
          <aside className="hidden h-full min-h-0 w-[360px] shrink-0 border-r border-white/10 bg-[#080e18] lg:flex">
            {libraryPanel}
          </aside>

          {isLibraryOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setIsLibraryOpen(false)}>
              <aside
                className="h-full w-[min(92vw,380px)] border-r border-white/10 bg-[#080e18] shadow-2xl shadow-black"
                onClick={(event) => event.stopPropagation()}
              >
                {libraryPanel}
              </aside>
            </div>
          )}
        </>
      )}

      <main className={cn("relative flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden", isFullscreen && "fixed inset-0 z-50 bg-[#050910]")}>
        <div className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-white/10 bg-[#080e18]/95 px-4 backdrop-blur-xl lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {!isFullscreen && (
              <button
                onClick={() => setIsLibraryOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06] lg:hidden"
                aria-label="Open algorithm library"
                title="Open algorithm library"
              >
                <Menu className="h-4 w-4" />
              </button>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Encyclopedia</p>
              <p className="truncate text-sm font-semibold text-slate-200">{activeAlgo.topic}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {activeAlgo.visualizerCode && (
              <a
                href={`/editor/demo-sandbox?mode=demo&algo=${activeAlgo.id}&presentation=1&narrate=1`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-500 px-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/35 transition hover:bg-indigo-400 sm:px-4"
              >
                <Play className="h-4 w-4" />
                <span className="hidden sm:inline">Simulate</span>
              </a>
            )}
            <button
              onClick={() => setIsFullscreen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-white/20 hover:bg-white/[0.06]"
              aria-label={isFullscreen ? "Exit focus view" : "Open focus view"}
              title={isFullscreen ? "Exit focus view" : "Open focus view"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className={cn("mx-auto flex w-full flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8", isFullscreen ? "max-w-6xl" : "max-w-[1480px]")}>
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="rounded-lg border border-white/10 bg-[#0a101b] p-5 shadow-2xl shadow-black/20 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill className="border-indigo-400/25 bg-indigo-400/10 text-indigo-200">{activeAlgo.category || activeAlgo.topic}</Pill>
                  <Pill className={difficultyStyles[activeAlgo.difficulty]}>{activeAlgo.difficulty}</Pill>
                  <Pill className={frequencyStyles[activeAlgo.frequencyLevel]}>{activeAlgo.frequencyLevel} frequency</Pill>
                  <Pill className="border-slate-400/20 bg-slate-400/10 text-slate-300">{learning.family}</Pill>
                </div>

                <div className="mt-5 max-w-4xl">
                  <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">{activeAlgo.title}</h1>
                  <p className="mt-4 text-base leading-7 text-slate-300">
                    <SemanticText>{activeAlgo.overview}</SemanticText>
                  </p>
                </div>

                {activeAlgo.useCases?.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {activeAlgo.useCases.slice(0, 6).map((useCase) => (
                      <span key={useCase} className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs font-medium text-slate-300">
                        <SemanticText>{useCase}</SemanticText>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <aside className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <Metric label="Time" value={activeApproach.timeComplexity} icon={Cpu} />
                <Metric label="Space" value={activeApproach.spaceComplexity} icon={Database} />
                <Metric label="Approaches" value={`${activeAlgo.approaches.length}`} icon={Layers3} />
                <Metric label="Notes" value={learning.coverage} icon={Sparkles} />
              </aside>
            </section>

            {activeAlgo.visualizerCode && (
              <section className="flex flex-col gap-4 rounded-lg border border-indigo-400/20 bg-indigo-400/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg border border-indigo-300/20 bg-indigo-300/10 p-2 text-indigo-200">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      {hasCinematicVisualizer(activeAlgo) ? "Cinematic 3D visualizer available" : "Interactive visualizer available"}
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-300">
                      {hasCinematicVisualizer(activeAlgo)
                        ? "Open this problem in the editor as an interactive 3D explanation stage. The Simulate button above keeps the classic 2D trace."
                        : "Open this problem in the editor with a ready-made trace script."}
                    </p>
                  </div>
                </div>
                <a
                  href={hasCinematicVisualizer(activeAlgo) ? `/editor/demo-sandbox?mode=demo&algo=${activeAlgo.id}&viz=3d&presentation=1&narrate=1` : `/editor/demo-sandbox?mode=demo&algo=${activeAlgo.id}&presentation=1&narrate=1`}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 text-sm font-semibold text-white transition hover:bg-indigo-400"
                >
                  <Play className="h-4 w-4" />
                  {hasCinematicVisualizer(activeAlgo) ? "Open 3D Visualizer" : "Open Visualizer"}
                </a>
              </section>
            )}

            <section className="rounded-lg border border-white/10 bg-[#0a101b] shadow-2xl shadow-black/20">
              <div className="flex flex-col gap-4 border-b border-white/10 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Selected approach</p>
                  <h2 className="mt-1 text-lg font-semibold text-white">{activeApproach.name}</h2>
                  <p className="mt-1 text-xs text-slate-500">{activeAlgo.approaches.length} verified {activeAlgo.approaches.length === 1 ? "solution" : "solutions"}; only available tiers are shown.</p>
                </div>
              </div>

              <div id="selected-approach-content" className="space-y-4 p-4 lg:p-5">
                <InsightCard
                  narrationId={`${narrationPrefix}-mental-model`}
                  title="Mental model"
                  label={learning.family}
                  icon={BrainCircuit}
                  text={learning.mentalModel}
                  context={narrationContext}
                />

                <StepCard narrationId={`${narrationPrefix}-execution-plan`} title="Execution plan" icon={ListChecks} steps={learning.executionSteps} context={narrationContext} />

                <InsightCard narrationId={`${narrationPrefix}-invariant`} title="Invariant" icon={ShieldCheck} text={learning.invariant} context={narrationContext} />
                <InsightCard narrationId={`${narrationPrefix}-why-it-works`} title="Why it works" icon={Target} text={learning.whyItWorks} context={narrationContext} />

                <DetailedWalkthrough
                  narrationId={`${narrationPrefix}-walkthrough`}
                  blocks={walkthrough}
                  context={narrationContext}
                />

                {activeApproach.storyDryRun && (
                  <StoryDryRunCard
                    narrationId={`${narrationPrefix}-story-dry-run`}
                    dryRun={activeApproach.storyDryRun}
                    context={narrationContext}
                  />
                )}

                <ListCard
                  narrationId={`${narrationPrefix}-edge-cases`}
                  title="Edge cases to test"
                  icon={ShieldCheck}
                  items={learning.edgeCases}
                  tone="emerald"
                  context={narrationContext}
                />
                <ListCard
                  narrationId={`${narrationPrefix}-interview-notes`}
                  title="Interview notes"
                  icon={Sparkles}
                  items={learning.interviewNotes}
                  tone="indigo"
                  context={narrationContext}
                />
                <ComplexityCard
                  narrationId={`${narrationPrefix}-time-complexity`}
                  title="Time complexity"
                  value={activeApproach.timeComplexity}
                  description={learning.timeExplanation}
                  icon={Cpu}
                  tone="amber"
                  context={narrationContext}
                />
                <ComplexityCard
                  narrationId={`${narrationPrefix}-space-complexity`}
                  title="Space complexity"
                  value={activeApproach.spaceComplexity}
                  description={learning.spaceExplanation}
                  icon={Database}
                  tone="cyan"
                  context={narrationContext}
                />
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-[#0a101b] shadow-2xl shadow-black/20">
              <div className="flex flex-col gap-4 border-b border-white/10 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-indigo-300">
                    <Code2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Implementation</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-400">Reference code for the selected approach.</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeApproach.implementations.map((implementation) => (
                    <button
                      key={implementation.language}
                      onClick={() => handleLangChange(implementation.language)}
                      className={cn(
                        "h-9 rounded-lg px-3 text-sm font-semibold transition",
                        activeImplementation?.language === implementation.language
                          ? "bg-indigo-500 text-white"
                          : "border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
                      )}
                    >
                      {implementation.language}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 lg:p-5">
                <NarratedSlab
                  id={`${narrationPrefix}-implementation-${activeImplementation?.language || selectedLang}`}
                  title={`${activeImplementation?.language || selectedLang} code walkthrough`}
                  label="Narration starts only from the playback controls"
                  icon={Code2}
                  headerActions={(
                    <div className="flex gap-2" role="tablist" aria-label="Solution approaches">
                      {activeAlgo.approaches.map((approach, index) => (
                        <button
                          key={`${approach.name}-${index}`}
                          type="button"
                          role="tab"
                          aria-selected={activeApproachIdx === index}
                          aria-controls="implementation-code-panel"
                          title={approach.name}
                          onClick={() => {
                            setActiveApproachIdx(index);
                            setCopied(false);
                          }}
                          className={cn(
                            "inline-flex h-9 shrink-0 items-center rounded-lg px-3 text-sm font-semibold transition",
                            activeApproachIdx === index
                              ? "bg-white text-slate-950 shadow-lg shadow-black/20"
                              : "border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
                          )}
                        >
                          {approachTabs[index]}
                        </button>
                      ))}
                    </div>
                  )}
                  lines={implementationNarration}
                >
                  {({ activeIndex }) => (
                    <div id="implementation-code-panel" role="tabpanel" className="overflow-hidden rounded-lg border border-white/10 bg-[#070b12]">
                      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                          <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                          <span className="ml-2 truncate font-mono text-xs text-slate-500">{codeFileName}</span>
                        </div>
                        <button
                          onClick={copySnippet}
                          className="inline-flex h-8 items-center gap-2 rounded-lg px-2.5 text-xs font-semibold text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                        >
                          {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <SyntaxCodeViewer
                        code={activeImplementation?.code || "// No implementation available"}
                        language={activeImplementation?.language || selectedLang}
                        fileName={codeFileName}
                        activeLine={activeIndex === null ? null : implementationNarration[activeIndex]?.sourceLine}
                      />
                    </div>
                  )}
                </NarratedSlab>
              </div>
            </section>

            {activeAlgo.leetcodeLink && (
              <a
                href={activeAlgo.leetcodeLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-indigo-400/20 bg-indigo-400/10 px-3 py-2 text-sm font-semibold text-indigo-200 transition hover:border-indigo-300/35 hover:bg-indigo-400/15"
              >
                Open original problem
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function LibraryPanel({
  activeAlgo,
  expandedTopics,
  filteredCount,
  groupedAlgos,
  isSearchActive,
  onClose,
  onSearch,
  onSelectAlgo,
  onToggleTopic,
  searchTerm,
  topicCount,
}: {
  activeAlgo: AlgorithmEntry;
  expandedTopics: Record<string, boolean>;
  filteredCount: number;
  groupedAlgos: Record<string, AlgorithmEntry[]>;
  isSearchActive: boolean;
  onClose: () => void;
  onSearch: (term: string) => void;
  onSelectAlgo: (algo: AlgorithmEntry) => void;
  onToggleTopic: (topic: string) => void;
  searchTerm: string;
  topicCount: number;
}) {
  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="border-b border-white/10 p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <BookOpen className="h-4 w-4 text-indigo-300" />
              Algorithm Library
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {AT_ALGORITHMS.length} entries across {topicCount} topics
            </p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 lg:hidden"
            aria-label="Close algorithm library"
            title="Close algorithm library"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            aria-label="Search algorithms"
            placeholder="Search algorithms"
            value={searchTerm}
            onChange={(event) => onSearch(event.target.value)}
            className="h-11 w-full rounded-lg border border-white/10 bg-[#050910] pl-10 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>{filteredCount} visible</span>
          <span>{isSearchActive ? "Search mode" : "Grouped by topic"}</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
        {Object.keys(groupedAlgos).length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <Search className="h-8 w-8 text-slate-600" />
            <h3 className="mt-4 text-sm font-semibold text-white">No matches found</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">Try another title, topic, or difficulty.</p>
          </div>
        ) : (
          Object.entries(groupedAlgos).map(([topic, algos]) => {
            const isExpanded = isSearchActive || expandedTopics[topic];

            return (
              <section key={topic} className="mb-2">
                <button
                  onClick={() => onToggleTopic(topic)}
                  className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
                >
                  <span className="truncate">{topic}</span>
                  <span className="flex items-center gap-2 text-xs text-slate-500">
                    {algos.length}
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </span>
                </button>

                {isExpanded && (
                  <div className="mt-1 space-y-1">
                    {algos.map((algo) => {
                      const isActive = activeAlgo.id === algo.id;
                      const firstApproach = algo.approaches[0];

                      return (
                        <button
                          key={algo.id}
                          onClick={() => onSelectAlgo(algo)}
                          className={cn(
                            "w-full rounded-lg border p-3 text-left transition",
                            isActive
                              ? "border-indigo-400/35 bg-indigo-400/10 shadow-lg shadow-indigo-950/20"
                              : "border-transparent hover:border-white/10 hover:bg-white/[0.04]"
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className={cn("min-w-0 text-sm font-semibold leading-5", isActive ? "text-indigo-100" : "text-slate-200")}>
                              {algo.title}
                            </span>
                            <span className={cn("shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[11px]", getComplexityStyle(firstApproach.timeComplexity))}>
                              {firstApproach.timeComplexity}
                            </span>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <span className={cn("rounded-md border px-1.5 py-0.5 text-[11px] font-semibold", difficultyStyles[algo.difficulty])}>
                              {algo.difficulty}
                            </span>
                            <span className="truncate text-xs text-slate-500">{algo.frequencyLevel} frequency</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#0a101b] p-4 shadow-xl shadow-black/15">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
          <p className="mt-2 truncate font-mono text-sm font-semibold text-white">{value}</p>
        </div>
        <div className="rounded-lg border border-indigo-400/20 bg-indigo-400/10 p-2 text-indigo-300">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("rounded-md border px-2.5 py-1 text-xs font-semibold", className)}>{children}</span>;
}

function InsightCard({
  narrationId,
  title,
  label,
  icon: Icon,
  text,
  context,
}: {
  narrationId: string;
  title: string;
  label?: string;
  icon: LucideIcon;
  text: string;
  context?: NarrationContext;
}) {
  const lines = narrationLines(title, [text], context);

  return (
    <NarratedSlab id={narrationId} title={title} label={label} icon={Icon} lines={lines}>
      <NarratedLine index={0} className="text-sm leading-7 text-slate-300">
        <SemanticText>{text}</SemanticText>
      </NarratedLine>
    </NarratedSlab>
  );
}

function StepCard({
  narrationId,
  title,
  icon: Icon,
  steps,
  context,
}: {
  narrationId: string;
  title: string;
  icon: LucideIcon;
  steps: string[];
  context?: NarrationContext;
}) {
  const lines = narrationLines(title, steps, context);

  return (
    <NarratedSlab id={narrationId} title={title} icon={Icon} iconClassName="narrated-slab-icon-cyan" lines={lines}>
      <ol className="space-y-3">
        {steps.map((step, index) => (
          <li key={step}>
            <NarratedLine index={index} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 text-sm leading-6 text-slate-300">
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-cyan-400/20 bg-cyan-400/10 font-mono text-xs font-semibold text-cyan-200">
                {index + 1}
              </span>
              <SemanticText>{step}</SemanticText>
            </NarratedLine>
          </li>
        ))}
      </ol>
    </NarratedSlab>
  );
}

function StoryDryRunCard({
  narrationId,
  dryRun,
  context,
}: {
  narrationId: string;
  dryRun: AlgorithmStoryDryRun;
  context?: NarrationContext;
}) {
  const narrationValues = [
    `Sample input. ${dryRun.sampleInput}`,
    ...dryRun.steps.map((step) => `${step.title}. ${step.state}. ${step.explanation}`),
    `Sample output. ${dryRun.sampleOutput}. ${dryRun.closingInsight}`,
  ];
  const lines = narrationLines("Story dry run", narrationValues, context);
  const finalIndex = dryRun.steps.length + 1;

  return (
    <NarratedSlab
      id={narrationId}
      title="Story dry run"
      label="Step-by-step example"
      icon={BookOpen}
      iconClassName="narrated-slab-icon-cyan"
      lines={lines}
    >
      <div className="space-y-4">
        <NarratedLine index={0} className="rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm leading-6 text-slate-300">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Sample input</p>
          <p className="mt-2 font-mono text-xs leading-6 text-slate-200">{dryRun.sampleInput}</p>
        </NarratedLine>

        <ol className="space-y-3">
          {dryRun.steps.map((step, index) => {
            const variables = Object.entries(step.variables || {});

            return (
              <li key={`${step.title}-${index}`}>
                <NarratedLine index={index + 1} className="rounded-lg border border-white/10 bg-[#070b12] p-3 text-sm leading-6 text-slate-300">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-cyan-400/20 bg-cyan-400/10 font-mono text-xs font-semibold text-cyan-200">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-white">{step.title}</h4>
                      <p className="mt-1 text-slate-300"><SemanticText>{step.state}</SemanticText></p>
                      <p className="mt-2 text-slate-400"><SemanticText>{step.explanation}</SemanticText></p>
                      {variables.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {variables.map(([key, value]) => (
                            <span key={key} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[11px] text-slate-300">
                              <span className="text-slate-500">{key}</span> = {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </NarratedLine>
              </li>
            );
          })}
        </ol>

        <NarratedLine index={finalIndex} className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm leading-6 text-emerald-50">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Sample output</p>
          <p className="mt-2 text-slate-200"><SemanticText>{dryRun.sampleOutput}</SemanticText></p>
          <p className="mt-2 text-slate-300"><SemanticText>{dryRun.closingInsight}</SemanticText></p>
        </NarratedLine>
      </div>
    </NarratedSlab>
  );
}

function ListCard({
  narrationId,
  title,
  icon: Icon,
  items,
  tone,
  context,
}: {
  narrationId: string;
  title: string;
  icon: LucideIcon;
  items: string[];
  tone: "emerald" | "indigo";
  context?: NarrationContext;
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : "border-indigo-400/20 bg-indigo-400/10 text-indigo-300";
  const lines = narrationLines(title, items, context);

  return (
    <NarratedSlab id={narrationId} title={title} icon={Icon} iconClassName={toneClass} lines={lines}>
      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li key={item}>
            <NarratedLine index={index} className="flex gap-2 text-sm leading-6 text-slate-300">
              <Check className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
              <SemanticText>{item}</SemanticText>
            </NarratedLine>
          </li>
        ))}
      </ul>
    </NarratedSlab>
  );
}

function ComplexityCard({
  narrationId,
  title,
  value,
  description,
  icon: Icon,
  tone,
  context,
}: {
  narrationId: string;
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  tone: "amber" | "cyan";
  context?: NarrationContext;
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
      : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";
  const lines = narrationLines(title, [`${value}. ${description}`], context);

  return (
    <NarratedSlab id={narrationId} title={title} label={value} icon={Icon} iconClassName={toneClass} lines={lines}>
      <NarratedLine index={0} className="text-sm leading-7 text-slate-300">
        <SemanticText>{description}</SemanticText>
      </NarratedLine>
    </NarratedSlab>
  );
}

function DetailedWalkthrough({
  narrationId,
  blocks,
  context,
}: {
  narrationId: string;
  blocks: WalkthroughBlock[];
  context?: NarrationContext;
}) {
  const lines = narrationLines("Detailed walkthrough", blocks.map((block) => block.text), context);

  return (
    <NarratedSlab id={narrationId} title="Detailed walkthrough" icon={BookOpen} lines={lines}>
      <div className="space-y-3">
        {blocks.map((block, index) => (
          <NarratedLine
            key={`${block.kind}-${block.text}-${index}`}
            index={index}
            className={cn(
              "text-sm leading-7 text-slate-300",
              block.kind === "heading" && "mt-5 text-base font-semibold text-white",
              block.kind === "list" && "grid grid-cols-[16px_minmax(0,1fr)] gap-2"
            )}
          >
            {block.kind === "list" && <Check className="mt-1.5 h-3.5 w-3.5 text-slate-500" />}
            <SemanticText>{block.text}</SemanticText>
          </NarratedLine>
        ))}
      </div>
    </NarratedSlab>
  );
}

function buildApproachTabs(approaches: AlgorithmEntry["approaches"]) {
  const bases = approaches.map((approach) => {
    const name = approach.name.toLowerCase();
    if (name.includes("brute")) return "Brute";
    if (name.includes("better")) return "Better";
    if (name.includes("optimal") || name.includes("optimized")) return "Optimal";
    return approaches.length === 1 ? "Canonical" : "Optimal";
  });
  const totals = bases.reduce<Record<string, number>>((counts, base) => {
    counts[base] = (counts[base] || 0) + 1;
    return counts;
  }, {});
  const seen: Record<string, number> = {};
  return bases.map((base) => {
    seen[base] = (seen[base] || 0) + 1;
    return totals[base] > 1 ? `${base} ${seen[base]}` : base;
  });
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "approach";
}
