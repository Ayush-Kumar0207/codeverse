import { AT_ALGORITHMS } from "@/data/algos";
import { getCinematicVisualizerCode } from "@/lib/cinematic-visualizers";
import type { SharedProject } from "@shared/types/project";

export interface DemoWorkspaceSeed {
  project: SharedProject;
  files: Record<string, string>;
  activeFile: string;
}

interface DemoWorkspaceOptions {
  algoId?: string | null;
  visualizerMode?: string | null;
  preferredLanguage?: string | null;
}

const SCORE_LENS_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ScoreLens</title>
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    <main class="app-shell">
      <section class="hero">
        <p class="eyebrow">ScoreLens</p>
        <h1>Fast score summary</h1>
        <p>Paste any set of numbers and get a clean total, average, highest value, and count.</p>
      </section>
      <section class="workspace" aria-label="Score calculator">
        <form id="score-form" class="input-panel">
          <label for="scores">Scores</label>
          <textarea id="scores" rows="6">72, 88, 91, 64</textarea>
          <button type="submit">Calculate</button>
        </form>
        <section class="result-grid" aria-live="polite">
          <article><span>Total</span><strong id="total">-</strong></article>
          <article><span>Average</span><strong id="average">-</strong></article>
          <article><span>Best</span><strong id="best">-</strong></article>
          <article><span>Count</span><strong id="count">-</strong></article>
        </section>
      </section>
    </main>
    <script src="./script.js"></script>
  </body>
</html>`;

const SCORE_LENS_CSS = `:root {
  color-scheme: dark;
  --bg: #071018;
  --surface: #0d1a24;
  --line: rgba(189, 213, 234, 0.18);
  --text: #f5f8fb;
  --muted: #9fb3c7;
  --accent: #53d7b7;
  --accent-strong: #20a4f3;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  background: radial-gradient(circle at 18% 12%, rgba(83, 215, 183, 0.18), transparent 28rem),
    linear-gradient(135deg, var(--bg), #0a121c 55%, #061012);
  color: var(--text);
  font-family: Inter, ui-sans-serif, system-ui, sans-serif;
}
.app-shell { width: min(1120px, calc(100vw - 40px)); margin: 0 auto; padding: 64px 0; }
.hero { max-width: 720px; margin-bottom: 36px; }
.eyebrow, label, .result-grid span {
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
h1 { margin: 0; font-size: clamp(42px, 7vw, 84px); line-height: 0.96; }
.hero p:last-child { color: var(--muted); font-size: clamp(18px, 2vw, 22px); line-height: 1.6; }
.workspace { display: grid; grid-template-columns: minmax(280px, 0.9fr) minmax(320px, 1.1fr); gap: 24px; }
.input-panel, .result-grid article {
  border: 1px solid var(--line);
  background: rgba(13, 26, 36, 0.82);
  border-radius: 18px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.32);
}
.input-panel { display: flex; flex-direction: column; gap: 16px; padding: 24px; }
textarea {
  min-height: 180px;
  resize: vertical;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--bg);
  color: var(--text);
  font: 18px/1.6 "SFMono-Regular", Consolas, monospace;
  padding: 16px;
  outline: none;
}
textarea:focus { border-color: rgba(83, 215, 183, 0.72); box-shadow: 0 0 0 3px rgba(83, 215, 183, 0.12); }
button {
  border: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent), var(--accent-strong));
  color: #041018;
  cursor: pointer;
  font-size: 16px;
  font-weight: 900;
  padding: 14px 18px;
}
.result-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.result-grid article { min-height: 170px; padding: 24px; }
.result-grid span { color: var(--muted); display: block; }
.result-grid strong { display: block; font-size: clamp(36px, 6vw, 66px); line-height: 1; margin-top: 26px; }
@media (max-width: 820px) { .workspace, .result-grid { grid-template-columns: 1fr; } }`;

const SCORE_LENS_SCRIPT = `const form = document.querySelector("#score-form");
const scoresInput = document.querySelector("#scores");
const fields = Object.fromEntries(["total", "average", "best", "count"].map((key) => [key, document.querySelector("#" + key)]));

function parseScores(value) {
  return (value.match(/-?\\d+(?:\\.\\d+)?/g) || []).map(Number).filter(Number.isFinite);
}

function summarizeScores(scores) {
  if (!scores.length) return { total: "-", average: "-", best: "-", count: "-" };
  const total = scores.reduce((sum, score) => sum + score, 0);
  return { total, average: Number((total / scores.length).toFixed(2)), best: Math.max(...scores), count: scores.length };
}

function updateSummary() {
  const summary = summarizeScores(parseScores(scoresInput.value));
  Object.entries(summary).forEach(([key, value]) => { fields[key].textContent = value; });
}

scoresInput.addEventListener("input", updateSummary);
form.addEventListener("submit", (event) => { event.preventDefault(); updateSummary(); });
updateSummary();`;

const SCORE_LENS_TRACER = `const rawInput = "72, 88, 91, 64";
const numbers = rawInput.match(/-?\\d+(?:\\.\\d+)?/g).map(Number);
const totalSteps = numbers.length + 2;

recordTrace({
  kind: "array",
  algorithm: { title: "ScoreLens summary", family: "Input parsing" },
  step: 1,
  totalSteps,
  progress: 25,
  headline: "Read score input",
  narrative: "ScoreLens starts from the comma-separated values shown in the demo textarea.",
  values: rawInput.split(",").map((value) => value.trim()),
  variables: { rawInput },
});

const total = numbers.reduce((sum, score, index) => {
  const runningTotal = sum + score;
  recordTrace({
    kind: "array",
    algorithm: { title: "ScoreLens summary", family: "Reduction" },
    step: index + 2,
    totalSteps,
    progress: Math.round(((index + 2) / totalSteps) * 100),
    headline: "Add the next score",
    narrative: "Adding " + score + " moves the running total from " + sum + " to " + runningTotal + ".",
    values: numbers,
    pointers: [{ label: "score", index, tone: "emerald" }],
    variables: { score, runningTotal },
  });
  return runningTotal;
}, 0);

recordTrace({
  kind: "array",
  algorithm: { title: "ScoreLens summary", family: "Result" },
  step: totalSteps,
  totalSteps,
  progress: 100,
  headline: "Render the summary cards",
  narrative: "The final values are ready for the Total, Average, Best, and Count cards.",
  values: numbers,
  variables: { total, average: Number((total / numbers.length).toFixed(2)), best: Math.max(...numbers), count: numbers.length },
});`;

function getExtension(language: string) {
  if (language === "Python") return "py";
  if (language === "C++") return "cpp";
  if (language === "Java") return "java";
  return "js";
}

function createAlgorithmWorkspace(options: DemoWorkspaceOptions): DemoWorkspaceSeed | null {
  const algorithm = options.algoId
    ? AT_ALGORITHMS.find((candidate) => candidate.id === options.algoId)
    : undefined;
  if (!algorithm) return null;

  const files: Record<string, string> = {};
  const approach = algorithm.approaches[0];
  const cinematicCode = options.visualizerMode === "3d" ? getCinematicVisualizerCode(algorithm) : "";
  const traceFileName = cinematicCode ? "cinematic-3d.js" : algorithm.visualizerCode ? "tracer.js" : "";
  let activeFile = traceFileName;

  if (traceFileName) files[traceFileName] = cinematicCode || algorithm.visualizerCode || "";

  approach?.implementations?.forEach((implementation) => {
    const fileName = `solution.${getExtension(implementation.language)}`;
    files[fileName] = implementation.code;
    if (!traceFileName && (!activeFile || implementation.language.toLowerCase() === options.preferredLanguage?.toLowerCase())) {
      activeFile = fileName;
    }
  });

  const useCases = algorithm.useCases.length
    ? algorithm.useCases.map((useCase) => `- ${useCase}`).join("\n")
    : "- Practice the core idea with the included sample runner.";
  files["PROBLEM.md"] = [`# ${algorithm.title}`, "", algorithm.overview, "", "## Use Cases", useCases].join("\n");

  return {
    project: { _id: `algo-${algorithm.id}`, title: algorithm.title, language: "javascript", isDemo: true, code: "" },
    files,
    activeFile: activeFile || "PROBLEM.md",
  };
}

export function createDemoWorkspace(options: DemoWorkspaceOptions = {}): DemoWorkspaceSeed {
  const algorithmWorkspace = createAlgorithmWorkspace(options);
  if (algorithmWorkspace) return algorithmWorkspace;

  return {
    project: { _id: "demo-sandbox", title: "ScoreLens", language: "html", isDemo: true, code: SCORE_LENS_HTML },
    files: {
      "index.html": SCORE_LENS_HTML,
      "style.css": SCORE_LENS_CSS,
      "script.js": SCORE_LENS_SCRIPT,
      "tracer.js": SCORE_LENS_TRACER,
      "README.md": "# ScoreLens\n\nA working single-page web app that calculates totals, averages, best scores, and item counts from any numeric list.\n\n## Files\n- index.html: Page structure\n- style.css: Visual design\n- script.js: Score parsing and calculation logic\n- tracer.js: AlgoTrace walkthrough for the summary algorithm",
    },
    activeFile: "index.html",
  };
}
