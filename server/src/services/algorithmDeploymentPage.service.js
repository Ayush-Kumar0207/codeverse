function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function jsonForScript(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function findCaseInsensitive(filesByRelativePath, target) {
  const expected = target.toLowerCase();
  for (const fileName of filesByRelativePath.keys()) {
    if (fileName.toLowerCase() === expected) {
      return fileName;
    }
  }

  return null;
}

function readAssignedLiteral(source, variableName) {
  const declarationPattern = new RegExp(`(?:const|let|var)\\s+${variableName}\\s*=`);
  const declarationMatch = declarationPattern.exec(source);

  if (!declarationMatch) {
    return null;
  }

  const searchStart = declarationMatch.index + declarationMatch[0].length;
  const firstObject = source.indexOf("{", searchStart);
  const firstArray = source.indexOf("[", searchStart);
  const candidates = [firstObject, firstArray].filter((index) => index >= 0);

  if (candidates.length === 0) {
    return null;
  }

  const literalStart = Math.min(...candidates);
  const open = source[literalStart];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let index = literalStart; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }

    if (char === "\"" || char === "'") {
      quote = char;
      continue;
    }

    if (char === open) {
      depth += 1;
    } else if (char === close) {
      depth -= 1;
      if (depth === 0) {
        return source.slice(literalStart, index + 1);
      }
    }
  }

  return null;
}

function parseAssignedJson(source, variableName) {
  const literal = readAssignedLiteral(source, variableName);

  if (!literal) {
    return null;
  }

  try {
    return JSON.parse(literal);
  } catch {
    return null;
  }
}

function pickSourceFiles(filesByRelativePath) {
  const sourceExtensions = [".cpp", ".py", ".java", ".js", ".ts"];
  return Array.from(filesByRelativePath.entries())
    .filter(([fileName]) => {
      const lowerName = fileName.toLowerCase();
      return sourceExtensions.some((extension) => lowerName.endsWith(extension)) && lowerName !== "tracer.js";
    })
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([fileName, content]) => ({
      fileName,
      label: labelForFile(fileName),
      content,
    }));
}

function labelForFile(fileName) {
  const lowerName = fileName.toLowerCase();
  if (lowerName.endsWith(".cpp")) return "C++";
  if (lowerName.endsWith(".py")) return "Python";
  if (lowerName.endsWith(".java")) return "Java";
  if (lowerName.endsWith(".js")) return "JavaScript";
  if (lowerName.endsWith(".ts")) return "TypeScript";
  return fileName;
}

function getAlgorithmDeploymentData(filesByRelativePath) {
  const tracerFileName = findCaseInsensitive(filesByRelativePath, "tracer.js");

  if (!tracerFileName) {
    return null;
  }

  const tracerSource = filesByRelativePath.get(tracerFileName);
  const algorithm = parseAssignedJson(tracerSource, "algorithm");
  const trace = parseAssignedJson(tracerSource, "trace");

  if (!algorithm || !Array.isArray(trace) || trace.length === 0) {
    return null;
  }

  return {
    algorithm,
    trace,
    sourceFiles: pickSourceFiles(filesByRelativePath),
  };
}

function buildAlgorithmDeploymentIndex({ filesByRelativePath }) {
  const payload = getAlgorithmDeploymentData(filesByRelativePath);

  if (!payload) {
    return null;
  }

  const algorithm = payload.algorithm;
  const title = algorithm.title || "Algorithm Visual Lab";
  const topic = algorithm.topic || algorithm.family || "Algorithm";
  const difficulty = algorithm.difficulty || "Practice";
  const family = algorithm.family || "Pattern";
  const time = algorithm.timeComplexity || "O(?)";
  const space = algorithm.spaceComplexity || "O(?)";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)} | Algorithm Lab</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #061015;
        --surface: rgba(11, 22, 31, 0.86);
        --surface-2: rgba(16, 31, 44, 0.88);
        --line: rgba(176, 204, 224, 0.18);
        --text: #f8fbff;
        --muted: #9fb6ca;
        --cyan: #36d7f6;
        --teal: #4ee7ba;
        --amber: #ffd166;
        --rose: #ff6b8a;
        --violet: #8b8cff;
      }

      * {
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        margin: 0;
        min-height: 100vh;
        background:
          radial-gradient(circle at 14% 8%, rgba(78, 231, 186, 0.22), transparent 30rem),
          radial-gradient(circle at 90% 12%, rgba(54, 215, 246, 0.16), transparent 28rem),
          linear-gradient(145deg, #061015 0%, #081720 52%, #04070d 100%);
        color: var(--text);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      button,
      input,
      select {
        font: inherit;
      }

      .app {
        width: min(1440px, calc(100vw - 32px));
        margin: 0 auto;
        padding: 32px 0 54px;
      }

      .hero {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 28px;
        align-items: end;
        min-height: 240px;
        padding: 34px;
        border: 1px solid var(--line);
        border-radius: 28px;
        background:
          linear-gradient(135deg, rgba(11, 22, 31, 0.78), rgba(12, 20, 34, 0.92)),
          radial-gradient(circle at 78% 18%, rgba(255, 209, 102, 0.12), transparent 18rem);
        box-shadow: 0 34px 110px rgba(0, 0, 0, 0.36);
      }

      .eyebrow {
        color: var(--teal);
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0.2em;
        text-transform: uppercase;
      }

      h1 {
        margin: 14px 0 0;
        max-width: 1000px;
        font-size: clamp(38px, 6vw, 92px);
        line-height: 0.95;
        letter-spacing: 0;
      }

      .hero-copy {
        margin: 18px 0 0;
        max-width: 920px;
        color: var(--muted);
        font-size: clamp(17px, 2vw, 22px);
        line-height: 1.55;
      }

      .metric-rail {
        display: grid;
        gap: 12px;
        min-width: 240px;
      }

      .metric {
        border: 1px solid var(--line);
        border-radius: 18px;
        background: rgba(5, 12, 19, 0.62);
        padding: 16px;
      }

      .metric span {
        display: block;
        color: var(--muted);
        font-size: 11px;
        font-weight: 900;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .metric strong {
        display: block;
        margin-top: 8px;
        color: var(--text);
        font: 800 20px/1.1 "SFMono-Regular", Consolas, monospace;
      }

      .lab {
        display: grid;
        grid-template-columns: minmax(0, 1.55fr) minmax(330px, 0.45fr);
        gap: 22px;
        align-items: stretch;
        margin-top: 22px;
      }

      .visual-area,
      .story-area,
      .code-area {
        border: 1px solid var(--line);
        border-radius: 24px;
        background: var(--surface);
        overflow: hidden;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.26);
      }

      .visual-area,
      .story-area {
        display: flex;
        min-width: 0;
        min-height: 0;
        height: clamp(390px, calc(100vh - 170px), 560px);
        flex-direction: column;
      }

      .section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 18px 20px;
        border-bottom: 1px solid var(--line);
      }

      .section-head h2 {
        margin: 0;
        font-size: 16px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .step-pill {
        border: 1px solid rgba(78, 231, 186, 0.34);
        border-radius: 999px;
        color: var(--teal);
        font-size: 12px;
        font-weight: 900;
        padding: 9px 12px;
      }

      .stage {
        flex: 1;
        height: auto;
        min-height: 0;
        padding: 16px;
        overflow: hidden;
      }

      .diff-stage {
        display: grid;
        grid-template-columns: minmax(340px, 1fr) 46px minmax(340px, 1fr);
        gap: 12px;
        align-items: stretch;
        height: 100%;
        min-height: 0;
        overflow-x: auto;
        overflow-y: hidden;
        padding-bottom: 4px;
        scrollbar-gutter: stable;
      }

      .diff-panel {
        display: flex;
        min-width: 0;
        min-height: 0;
        flex-direction: column;
        border: 1px solid rgba(159, 182, 202, 0.18);
        border-radius: 22px;
        background: rgba(5, 12, 19, 0.42);
        overflow: hidden;
      }

      .diff-panel.after {
        border-color: rgba(78, 231, 186, 0.3);
        background:
          radial-gradient(circle at 50% 0%, rgba(78, 231, 186, 0.12), transparent 16rem),
          rgba(5, 12, 19, 0.48);
      }

      .diff-panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        min-height: 58px;
        padding: 12px 14px;
        border-bottom: 1px solid rgba(159, 182, 202, 0.16);
      }

      .diff-label {
        color: var(--muted);
        font-size: 11px;
        font-weight: 950;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .diff-sub {
        color: #cde5f4;
        font-size: 13px;
        font-weight: 850;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }

      .diff-content {
        flex: 1;
        display: grid;
        place-items: center;
        min-width: 0;
        min-height: 0;
        overflow: hidden;
        padding: 12px;
      }

      .diff-arrow {
        align-self: center;
        display: grid;
        place-items: center;
        width: 46px;
        height: 46px;
        border: 1px solid rgba(78, 231, 186, 0.34);
        border-radius: 16px;
        background: rgba(78, 231, 186, 0.12);
        color: var(--teal);
        font-size: 18px;
        font-weight: 950;
        box-shadow: 0 0 36px rgba(78, 231, 186, 0.12);
      }

      .diff-arrow span {
        margin-top: -2px;
      }

      .state-viewport {
        width: 100%;
        max-width: 100%;
        max-height: 100%;
        overflow: auto;
        overscroll-behavior: contain;
        scrollbar-gutter: stable both-edges;
      }

      .state-viewport::-webkit-scrollbar,
      .diff-stage::-webkit-scrollbar,
      pre::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      .state-viewport::-webkit-scrollbar-thumb,
      .diff-stage::-webkit-scrollbar-thumb,
      pre::-webkit-scrollbar-thumb {
        border-radius: 999px;
        background: rgba(159, 182, 202, 0.3);
        border: 2px solid rgba(5, 12, 19, 0.72);
      }

      .array-stage {
        display: grid;
        grid-template-columns: repeat(var(--count), minmax(52px, 1fr));
        gap: 8px;
        align-items: center;
        min-width: max(100%, calc(var(--count) * 58px));
      }

      .array-cell {
        position: relative;
        min-height: 104px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 6px;
      }

      .bar {
        position: relative;
        display: grid;
        place-items: center;
        width: 100%;
        height: 54px;
        min-height: 54px;
        border: 1px solid rgba(159, 182, 202, 0.22);
        border-radius: 14px;
        background: linear-gradient(180deg, rgba(54, 215, 246, 0.22), rgba(78, 231, 186, 0.12));
        color: var(--text);
        overflow: hidden;
        overflow-wrap: anywhere;
        padding: 0 6px 6px;
        text-align: center;
        font: 900 15px/1.05 "SFMono-Regular", Consolas, monospace;
        transition: border-color 260ms ease, transform 260ms ease, background 260ms ease;
      }

      .bar::after {
        content: "";
        position: absolute;
        left: 8px;
        bottom: 7px;
        width: var(--magnitude, 30%);
        max-width: calc(100% - 16px);
        height: 3px;
        border-radius: 999px;
        background: rgba(78, 231, 186, 0.82);
        box-shadow: 0 0 14px rgba(78, 231, 186, 0.24);
      }

      .array-cell.negative .bar::after {
        background: rgba(255, 107, 138, 0.88);
        box-shadow: 0 0 14px rgba(255, 107, 138, 0.2);
      }

      .array-cell.zero .bar::after {
        background: rgba(159, 182, 202, 0.78);
      }

      .array-cell.window .bar {
        border-color: rgba(255, 209, 102, 0.56);
        background: linear-gradient(180deg, rgba(255, 209, 102, 0.22), rgba(54, 215, 246, 0.08));
      }

      .array-cell.solution .bar {
        border-color: rgba(78, 231, 186, 0.9);
        background: linear-gradient(180deg, rgba(78, 231, 186, 0.42), rgba(54, 215, 246, 0.16));
      }

      .array-cell.active .bar {
        border-color: rgba(54, 215, 246, 0.95);
        transform: translateY(-3px);
        box-shadow: 0 0 30px rgba(54, 215, 246, 0.2);
      }

      .array-cell.retired {
        opacity: 0.42;
      }

      .array-cell.changed .bar {
        border-color: rgba(255, 209, 102, 0.96);
        background: linear-gradient(180deg, rgba(255, 209, 102, 0.36), rgba(78, 231, 186, 0.12));
        box-shadow: 0 0 30px rgba(255, 209, 102, 0.14);
      }

      .diff-panel.after .array-cell.changed .bar {
        border-color: rgba(78, 231, 186, 0.96);
        background: linear-gradient(180deg, rgba(78, 231, 186, 0.5), rgba(54, 215, 246, 0.14));
      }

      .cell-index {
        color: var(--muted);
        font: 800 10px/1 "SFMono-Regular", Consolas, monospace;
        text-align: center;
      }

      .pointer-row {
        min-height: 22px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 4px;
      }

      .pointer-chip,
      .tiny-chip {
        border-radius: 999px;
        background: rgba(54, 215, 246, 0.16);
        color: #b9f5ff;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: 0.08em;
        padding: 5px 7px;
        text-transform: uppercase;
      }

      .matrix-stage {
        display: grid;
        gap: 8px;
        min-width: 100%;
        justify-content: stretch;
      }

      .matrix-row {
        display: grid;
        grid-template-columns: repeat(var(--cols), minmax(44px, 1fr));
        min-width: max(100%, calc(var(--cols) * 54px));
        gap: 8px;
      }

      .matrix-cell {
        display: grid;
        place-items: center;
        width: 100%;
        min-width: 44px;
        aspect-ratio: 1;
        border: 1px solid rgba(159, 182, 202, 0.22);
        border-radius: 14px;
        background: rgba(8, 20, 30, 0.74);
        overflow-wrap: anywhere;
        padding: 4px;
        text-align: center;
        font: 900 15px/1.1 "SFMono-Regular", Consolas, monospace;
      }

      .matrix-cell.active {
        border-color: rgba(78, 231, 186, 0.92);
        background: rgba(78, 231, 186, 0.18);
        box-shadow: 0 0 28px rgba(78, 231, 186, 0.14);
      }

      .matrix-cell.changed {
        border-color: rgba(255, 209, 102, 0.96);
        background: rgba(255, 209, 102, 0.16);
        box-shadow: 0 0 28px rgba(255, 209, 102, 0.12);
      }

      .diff-panel.after .matrix-cell.changed {
        border-color: rgba(78, 231, 186, 0.96);
        background: rgba(78, 231, 186, 0.2);
      }

      .graph-stage {
        position: relative;
        min-height: 320px;
        height: min(360px, 100%);
        width: 100%;
      }

      .graph-lines {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .graph-line {
        stroke: rgba(159, 182, 202, 0.26);
        stroke-width: 3;
      }

      .graph-line.active {
        stroke: var(--amber);
      }

      .graph-line.changed {
        stroke: var(--teal);
        stroke-width: 5;
      }

      .graph-node {
        position: absolute;
        display: grid;
        place-items: center;
        width: 68px;
        height: 68px;
        border: 1px solid rgba(159, 182, 202, 0.25);
        border-radius: 22px;
        background: rgba(8, 20, 30, 0.9);
        font-weight: 950;
        transform: translate(-50%, -50%);
      }

      .graph-node.active,
      .graph-node.source {
        border-color: rgba(54, 215, 246, 0.9);
        background: rgba(54, 215, 246, 0.16);
      }

      .graph-node.frontier {
        border-color: rgba(255, 209, 102, 0.86);
        background: rgba(255, 209, 102, 0.14);
      }

      .graph-node.done {
        border-color: rgba(78, 231, 186, 0.82);
        background: rgba(78, 231, 186, 0.14);
      }

      .graph-node.changed {
        outline: 3px solid rgba(255, 209, 102, 0.42);
        box-shadow: 0 0 32px rgba(255, 209, 102, 0.14);
      }

      .diff-panel.after .graph-node.changed {
        outline-color: rgba(78, 231, 186, 0.54);
      }

      .stack-lanes {
        display: grid;
        gap: 12px;
        width: 100%;
      }

      .lane {
        border: 1px solid var(--line);
        border-radius: 18px;
        padding: 14px;
        background: rgba(5, 12, 19, 0.42);
      }

      .lane h3 {
        margin: 0 0 14px;
        color: var(--muted);
        font-size: 12px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      .lane-items {
        display: flex;
        flex-wrap: nowrap;
        gap: 10px;
        overflow-x: auto;
        padding-bottom: 4px;
      }

      .lane-item {
        min-width: 48px;
        flex: 0 0 auto;
        border-radius: 14px;
        background: rgba(54, 215, 246, 0.14);
        padding: 12px 14px;
        font: 900 16px/1 "SFMono-Regular", Consolas, monospace;
        text-align: center;
      }

      .lane-item.changed {
        background: rgba(255, 209, 102, 0.22);
        box-shadow: inset 0 0 0 1px rgba(255, 209, 102, 0.48);
      }

      .diff-panel.after .lane-item.changed {
        background: rgba(78, 231, 186, 0.22);
        box-shadow: inset 0 0 0 1px rgba(78, 231, 186, 0.54);
      }

      .story-body {
        flex: 1;
        min-height: 0;
        overflow: auto;
        padding: 22px;
      }

      .phase {
        color: var(--amber);
        font-size: 12px;
        font-weight: 950;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      .headline {
        margin: 12px 0 0;
        font-size: clamp(24px, 2.4vw, 36px);
        line-height: 1.08;
      }

      .narrative,
      .decision,
      .prompt {
        color: #c7d7e4;
        font-size: 16px;
        line-height: 1.65;
      }

      .explain-panel {
        margin-top: 18px;
        border: 1px solid rgba(54, 215, 246, 0.2);
        border-radius: 18px;
        background: rgba(54, 215, 246, 0.055);
        padding: 14px;
      }

      .explain-title {
        color: var(--text);
        font-size: 15px;
        font-weight: 950;
      }

      .explain-plain {
        margin: 8px 0 0;
        color: #d5e4ef;
        font-size: 14px;
        line-height: 1.55;
      }

      .explain-grid {
        display: grid;
        gap: 9px;
        margin-top: 12px;
      }

      .explain-card {
        border: 1px solid rgba(159, 182, 202, 0.16);
        border-radius: 14px;
        background: rgba(5, 12, 19, 0.38);
        padding: 11px;
      }

      .explain-card span {
        display: block;
        color: var(--teal);
        font-size: 10px;
        font-weight: 950;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .explain-card p {
        margin: 5px 0 0;
        color: #c7d7e4;
        font-size: 13px;
        line-height: 1.5;
      }

      .decision {
        margin-top: 18px;
        border-left: 3px solid var(--teal);
        padding-left: 14px;
      }

      .code-focus {
        margin-top: 18px;
        border: 1px solid rgba(54, 215, 246, 0.22);
        border-radius: 16px;
        background: rgba(54, 215, 246, 0.08);
        padding: 14px;
        color: #d8fbff;
        font: 800 13px/1.6 "SFMono-Regular", Consolas, monospace;
      }

      .variables {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 10px;
        margin-top: 18px;
      }

      .variable {
        border: 1px solid var(--line);
        border-radius: 14px;
        background: rgba(5, 12, 19, 0.42);
        padding: 12px;
      }

      .variable span {
        display: block;
        color: var(--muted);
        font-size: 11px;
        font-weight: 850;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .variable strong {
        display: block;
        margin-top: 8px;
        overflow-wrap: anywhere;
        font: 900 15px/1.35 "SFMono-Regular", Consolas, monospace;
      }

      .controls {
        display: grid;
        gap: 14px;
        margin-top: 22px;
        border: 1px solid var(--line);
        border-radius: 22px;
        background: rgba(5, 12, 19, 0.46);
        padding: 16px;
      }

      .button-row {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .control-button {
        border: 1px solid rgba(159, 182, 202, 0.24);
        border-radius: 14px;
        background: rgba(16, 31, 44, 0.9);
        color: var(--text);
        cursor: pointer;
        font-weight: 900;
        padding: 12px 14px;
      }

      .control-button.primary {
        border-color: rgba(78, 231, 186, 0.46);
        background: linear-gradient(135deg, rgba(78, 231, 186, 0.9), rgba(54, 215, 246, 0.88));
        color: #041116;
      }

      input[type="range"] {
        width: 100%;
        accent-color: var(--teal);
      }

      .timeline {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(42px, 1fr));
        gap: 8px;
      }

      .timeline button {
        border: 1px solid rgba(159, 182, 202, 0.2);
        border-radius: 12px;
        background: rgba(8, 20, 30, 0.78);
        color: var(--muted);
        cursor: pointer;
        padding: 9px 0;
        font-weight: 900;
      }

      .timeline button.active {
        border-color: rgba(78, 231, 186, 0.72);
        color: var(--teal);
        background: rgba(78, 231, 186, 0.12);
      }

      .code-area {
        margin-top: 22px;
      }

      .code-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }

      .code-tab {
        border: 1px solid rgba(159, 182, 202, 0.24);
        border-radius: 999px;
        background: rgba(5, 12, 19, 0.54);
        color: var(--muted);
        cursor: pointer;
        font-size: 12px;
        font-weight: 900;
        padding: 9px 12px;
      }

      .code-tab.active {
        border-color: rgba(54, 215, 246, 0.72);
        color: var(--cyan);
      }

      pre {
        margin: 0;
        max-height: 520px;
        overflow: auto;
        padding: 22px;
        color: #d6e6f3;
        font: 14px/1.7 "SFMono-Regular", Consolas, "Liberation Mono", monospace;
        white-space: pre;
      }

      .empty-state {
        display: grid;
        place-items: center;
        min-height: 260px;
        color: var(--muted);
        text-align: center;
      }

      @media (max-width: 1020px) {
        .hero,
        .lab {
          grid-template-columns: 1fr;
        }

        .diff-stage {
          grid-template-columns: minmax(300px, 1fr) 42px minmax(300px, 1fr);
        }

        .diff-arrow {
          justify-self: center;
        }

        .metric-rail {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 680px) {
        .app {
          width: min(100vw - 18px, 1440px);
          padding-top: 12px;
        }

        .hero,
        .stage,
        .story-body {
          padding: 18px;
        }

        .stage {
          padding: 10px;
        }

        .visual-area {
          height: clamp(320px, 58vh, 460px);
        }

        .story-area {
          height: auto;
          max-height: none;
        }

        .diff-stage {
          grid-template-columns: minmax(280px, 1fr) 38px minmax(280px, 1fr);
          gap: 8px;
        }

        .diff-panel-header {
          min-height: 52px;
          padding: 10px;
        }

        .array-stage {
          min-width: max(100%, calc(var(--count) * 50px));
          gap: 8px;
        }

        .array-cell {
          min-height: 98px;
        }

        .bar {
          border-radius: 12px;
          height: 50px;
          min-height: 50px;
          font-size: 14px;
        }

        .metric-rail {
          grid-template-columns: 1fr;
        }

        .lab {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <main class="app">
      <section class="hero">
        <div>
          <div class="eyebrow">Interactive Algorithm Lab</div>
          <h1>${escapeHtml(title)}</h1>
          <p class="hero-copy" id="problem-lens"></p>
        </div>
        <div class="metric-rail" aria-label="Algorithm complexity">
          <div class="metric"><span>Topic</span><strong>${escapeHtml(topic)}</strong></div>
          <div class="metric"><span>Difficulty</span><strong>${escapeHtml(difficulty)}</strong></div>
          <div class="metric"><span>Time</span><strong>${escapeHtml(time)}</strong></div>
          <div class="metric"><span>Space</span><strong>${escapeHtml(space)}</strong></div>
        </div>
      </section>

      <section class="lab">
        <section class="visual-area">
          <div class="section-head">
            <h2>${escapeHtml(family)} Visualizer</h2>
            <span class="step-pill" id="step-pill">Step 1</span>
          </div>
          <div class="stage" id="stage"></div>
        </section>

        <aside class="story-area">
          <div class="section-head">
            <h2>Decision Console</h2>
            <span class="step-pill" id="progress-pill">0%</span>
          </div>
          <div class="story-body">
            <div class="phase" id="phase"></div>
            <h2 class="headline" id="headline"></h2>
            <p class="narrative" id="narrative"></p>
            <div class="explain-panel" id="explain-panel"></div>
            <p class="decision" id="decision"></p>
            <p class="prompt" id="prompt"></p>
            <div class="code-focus" id="code-focus"></div>
            <div class="variables" id="variables"></div>
            <div class="controls">
              <input id="step-range" type="range" min="0" value="0" />
              <div class="button-row">
                <button class="control-button" id="reset-button" type="button">Reset</button>
                <button class="control-button" id="prev-button" type="button">Previous</button>
                <button class="control-button primary" id="play-button" type="button">Play</button>
                <button class="control-button" id="next-button" type="button">Next</button>
              </div>
              <div class="timeline" id="timeline"></div>
            </div>
          </div>
        </aside>
      </section>

      <section class="code-area" id="code-area">
        <div class="section-head">
          <h2>Implementation Lens</h2>
          <div class="code-tabs" id="code-tabs"></div>
        </div>
        <pre id="code-view"></pre>
      </section>
    </main>

    <script id="algorithm-data" type="application/json">${jsonForScript(payload)}</script>
    <script>
      (() => {
        const payload = JSON.parse(document.getElementById("algorithm-data").textContent);
        const trace = payload.trace || [];
        const algorithm = payload.algorithm || {};
        const sourceFiles = payload.sourceFiles || [];

        let currentIndex = 0;
        let timer = null;
        let activeSourceIndex = 0;

        const elements = {
          lens: document.getElementById("problem-lens"),
          stage: document.getElementById("stage"),
          stepPill: document.getElementById("step-pill"),
          progressPill: document.getElementById("progress-pill"),
          phase: document.getElementById("phase"),
          headline: document.getElementById("headline"),
          narrative: document.getElementById("narrative"),
          explain: document.getElementById("explain-panel"),
          decision: document.getElementById("decision"),
          prompt: document.getElementById("prompt"),
          codeFocus: document.getElementById("code-focus"),
          variables: document.getElementById("variables"),
          range: document.getElementById("step-range"),
          timeline: document.getElementById("timeline"),
          reset: document.getElementById("reset-button"),
          prev: document.getElementById("prev-button"),
          play: document.getElementById("play-button"),
          next: document.getElementById("next-button"),
          codeArea: document.getElementById("code-area"),
          codeTabs: document.getElementById("code-tabs"),
          codeView: document.getElementById("code-view"),
        };

        elements.range.max = Math.max(trace.length - 1, 0);
        elements.lens.textContent = trace[0]?.problemLens || algorithm.simulationProfile || "Step through the sample input and watch the invariant stay true.";

        function asArray(value) {
          return Array.isArray(value) ? value : [];
        }

        function formatValue(value) {
          if (value === null || value === undefined) return "";
          if (typeof value === "object") return JSON.stringify(value);
          return String(value);
        }

        function clampIndex(index) {
          return Math.max(0, Math.min(trace.length - 1, index));
        }

        function stableValue(value) {
          if (value === undefined) return "undefined";
          try {
            return JSON.stringify(value);
          } catch {
            return String(value);
          }
        }

        function baselineState(state) {
          const copy = JSON.parse(JSON.stringify(state || {}));
          delete copy.pointers;
          delete copy.window;
          delete copy.solution;
          delete copy.retired;
          delete copy.activeCells;
          delete copy.variables;

          if (copy.graph?.nodes) {
            copy.graph.nodes = copy.graph.nodes.map((node) => ({ ...node, state: "unseen" }));
            copy.graph.edges = asArray(copy.graph.edges).map((edge) => {
              const clean = { ...edge };
              delete clean.state;
              return clean;
            });
          }

          if (copy.tree?.nodes) {
            copy.tree.nodes = copy.tree.nodes.map((node) => ({ ...node, state: "unseen" }));
            copy.tree.edges = asArray(copy.tree.edges).map((edge) => {
              const clean = { ...edge };
              delete clean.state;
              return clean;
            });
          }

          return copy;
        }

        function getLinearValues(state) {
          return state?.values || state?.array || state?.dpRow || state?.working_array || state?.nums;
        }

        function pointerLabels(state, index) {
          return asArray(state?.pointers)
            .filter((pointer) => Number(pointer.index) === index)
            .map((pointer) => pointer.label || "ptr");
        }

        function arrayFlags(state, index) {
          const pointers = asArray(state?.pointers);
          const solution = new Set(asArray(state?.solution).map(Number));
          const retired = new Set(asArray(state?.retired).map(Number));
          const windowLeft = Number(state?.window?.left);
          const windowRight = Number(state?.window?.right);
          const hasWindow = Number.isFinite(windowLeft) && Number.isFinite(windowRight);

          return {
            active: pointers.some((pointer) => Number(pointer.index) === index),
            window: hasWindow && index >= windowLeft && index <= windowRight,
            solution: solution.has(index),
            retired: retired.has(index),
            labels: pointerLabels(state, index).join("|"),
          };
        }

        function arrayCellChanged(state, compareState, index, value) {
          if (!compareState) return false;
          const compareValues = getLinearValues(compareState) || [];
          const currentFlags = arrayFlags(state, index);
          const compareFlags = arrayFlags(compareState, index);

          return stableValue(value) !== stableValue(compareValues[index]) ||
            currentFlags.active !== compareFlags.active ||
            currentFlags.window !== compareFlags.window ||
            currentFlags.solution !== compareFlags.solution ||
            currentFlags.retired !== compareFlags.retired ||
            currentFlags.labels !== compareFlags.labels;
        }

        function renderArrayHtml(state, values, compareState) {
          const numericValues = values.map(Number).filter(Number.isFinite);
          const compareValues = getLinearValues(compareState) || [];
          const maxAbs = Math.max(1, ...numericValues.map((value) => Math.abs(value)), ...compareValues.map(Number).filter(Number.isFinite).map((value) => Math.abs(value)));

          return '<div class="array-stage" style="--count:' + Math.max(values.length, 1) + ';">' + values.map((value, index) => {
            const numeric = Number(value);
            const magnitude = Number.isFinite(numeric) ? Math.round(Math.max(0.16, Math.abs(numeric) / maxAbs) * 100) + "%" : "30%";
            const labels = pointerLabels(state, index);
            const flags = arrayFlags(state, index);
            const changed = arrayCellChanged(state, compareState, index, value);
            const classes = [
              "array-cell",
              Number.isFinite(numeric) && numeric < 0 ? "negative" : "",
              Number.isFinite(numeric) && numeric > 0 ? "positive" : "",
              Number.isFinite(numeric) && numeric === 0 ? "zero" : "",
              flags.active ? "active" : "",
              flags.window ? "window" : "",
              flags.solution ? "solution" : "",
              flags.retired ? "retired" : "",
              changed ? "changed" : "",
            ].filter(Boolean).join(" ");

            return '<div class="' + classes + '">' +
              '<div class="pointer-row">' + labels.map((label) => '<span class="pointer-chip">' + escapeText(label) + '</span>').join("") + '</div>' +
              '<div class="bar" style="--magnitude:' + magnitude + ';">' + escapeText(formatValue(value)) + '</div>' +
              '<div class="cell-index">i=' + index + '</div>' +
            '</div>';
          }).join("") + '</div>';
        }

        function matrixForState(state) {
          return state?.matrix || state?.dpTable || null;
        }

        function matrixCellChanged(state, compareState, rowIndex, colIndex, value) {
          if (!compareState) return false;
          const compareMatrix = matrixForState(compareState) || [];
          const currentActive = new Set(asArray(state?.activeCells).map(String));
          const compareActive = new Set(asArray(compareState?.activeCells).map(String));
          const key = rowIndex + '-' + colIndex;
          const compareValue = asArray(compareMatrix[rowIndex])[colIndex];

          return stableValue(value) !== stableValue(compareValue) || currentActive.has(key) !== compareActive.has(key);
        }

        function renderMatrixHtml(state, matrix, compareState) {
          const active = new Set(asArray(state?.activeCells).map(String));
          const maxColumns = Math.max(1, ...matrix.map((row) => asArray(row).length));
          return '<div class="matrix-stage">' + matrix.map((row, rowIndex) => {
            const cells = asArray(row).map((value, colIndex) => {
              const key = rowIndex + '-' + colIndex;
              const classes = [
                "matrix-cell",
                active.has(key) ? "active" : "",
                matrixCellChanged(state, compareState, rowIndex, colIndex, value) ? "changed" : "",
              ].filter(Boolean).join(" ");
              return '<div class="' + classes + '">' + escapeText(formatValue(value)) + '</div>';
            }).join("");

            return '<div class="matrix-row" style="--cols:' + maxColumns + ';">' + cells + '</div>';
          }).join("") + '</div>';
        }

        function graphLikeForState(state) {
          return state?.graph?.nodes ? state.graph : state?.tree?.nodes ? state.tree : null;
        }

        function mapById(items) {
          return new Map(asArray(items).map((item) => [String(item.id || item.from + "->" + item.to), item]));
        }

        function edgeKey(edge) {
          return String(edge.from) + "->" + String(edge.to) + ":" + String(edge.label || "");
        }

        function renderGraphLikeHtml(state, graphLike, compareState) {
          const nodes = asArray(graphLike.nodes);
          const edges = asArray(graphLike.edges);
          const compareGraph = graphLikeForState(compareState) || {};
          const compareNodes = mapById(compareGraph.nodes);
          const compareEdges = new Map(asArray(compareGraph.edges).map((edge) => [edgeKey(edge), edge]));
          const positions = {};

          nodes.forEach((node, index) => {
            if (Number.isFinite(Number(node.level))) {
              const x = 50 + Number(node.position || 0) * 18;
              const y = 15 + Number(node.level) * 24;
              positions[node.id] = { x, y };
              return;
            }

            const angle = (-90 + (360 / Math.max(nodes.length, 1)) * index) * Math.PI / 180;
            positions[node.id] = {
              x: 50 + Math.cos(angle) * 32,
              y: 50 + Math.sin(angle) * 32,
            };
          });

          const lines = edges.map((edge) => {
            const from = positions[edge.from];
            const to = positions[edge.to];
            if (!from || !to) return "";
            const compareEdge = compareEdges.get(edgeKey(edge));
            const changed = stableValue(edge.state) !== stableValue(compareEdge?.state);
            return '<line class="graph-line ' + (edge.state === "active" ? "active " : "") + (changed ? "changed" : "") + '" x1="' + from.x + '%" y1="' + from.y + '%" x2="' + to.x + '%" y2="' + to.y + '%" />';
          }).join("");

          const nodeHtml = nodes.map((node) => {
            const position = positions[node.id] || { x: 50, y: 50 };
            const stateClass = node.state || "";
            const compareNode = compareNodes.get(String(node.id));
            const changed = stableValue(node.state) !== stableValue(compareNode?.state) || stableValue(node.label) !== stableValue(compareNode?.label);
            return '<div class="graph-node ' + escapeText(stateClass) + (changed ? ' changed' : '') + '" style="left:' + position.x + '%;top:' + position.y + '%;">' + escapeText(node.label || node.id) + '</div>';
          }).join("");

          return '<div class="graph-stage"><svg class="graph-lines" viewBox="0 0 100 100" preserveAspectRatio="none">' + lines + '</svg>' + nodeHtml + '</div>';
        }

        function laneItems(value) {
          return Array.isArray(value) ? value : String(value || "").split(/\\s*->\\s*|,\\s*/).filter(Boolean);
        }

        function renderLanesHtml(state, compareState) {
          const lanes = [
            ["Stack", state?.stack],
            ["Queue", state?.queue],
            ["Output", state?.output],
            ["Path", state?.path],
          ].filter(([, value]) => Array.isArray(value) || typeof value === "string");

          if (lanes.length === 0) {
            return '<div class="empty-state">This step is best understood through the decision console and variables.</div>';
          }

          return '<div class="stack-lanes">' + lanes.map(([label, values]) => {
            const items = laneItems(values);
            const compareItems = laneItems(compareState?.[label.toLowerCase()]);
            return '<div class="lane"><h3>' + escapeText(label) + '</h3><div class="lane-items">' +
              items.map((item, index) => {
                const changed = stableValue(item) !== stableValue(compareItems[index]);
                return '<span class="lane-item ' + (changed ? "changed" : "") + '">' + escapeText(formatValue(item)) + '</span>';
              }).join("") +
              '</div></div>';
          }).join("") + '</div>';
        }

        function renderStateHtml(state, compareState) {
          const matrix = matrixForState(state);
          let kind = "lanes";
          let body = "";

          if (Array.isArray(matrix)) {
            kind = "matrix";
            body = renderMatrixHtml(state, matrix, compareState);
            return '<div class="state-viewport ' + kind + '-viewport">' + body + '</div>';
          }

          const graphLike = graphLikeForState(state);
          if (graphLike) {
            kind = "graph";
            body = renderGraphLikeHtml(state, graphLike, compareState);
            return '<div class="state-viewport ' + kind + '-viewport">' + body + '</div>';
          }

          const values = getLinearValues(state);
          if (Array.isArray(values)) {
            kind = "array";
            body = renderArrayHtml(state, values, compareState);
            return '<div class="state-viewport ' + kind + '-viewport">' + body + '</div>';
          }

          body = renderLanesHtml(state, compareState);
          return '<div class="state-viewport ' + kind + '-viewport">' + body + '</div>';
        }

        function stepTitle(state, index, fallback) {
          if (!state) return fallback;
          const phase = state.phase || state.headline || fallback;
          return 'Step ' + (index + 1) + ': ' + phase;
        }

        function renderStepGuide(state, previousState) {
          const guide = buildStepGuide(state, previousState);
          return '<div class="explain-title">Step explained from zero</div>' +
            '<p class="explain-plain">' + escapeText(guide.plain) + '</p>' +
            '<div class="explain-grid">' +
              guideItem('1', 'Look here first', guide.observe) +
              guideItem('2', 'What changed', guide.changed) +
              guideItem('3', 'Why this is safe', guide.why) +
              guideItem('4', 'Carry forward', guide.remember) +
              guideItem('5', 'Code connection', guide.code) +
            '</div>';
        }

        function guideItem(number, title, body) {
          return '<div class="explain-card"><span>' + number + '. ' + escapeText(title) + '</span><p>' + escapeText(body) + '</p></div>';
        }

        function buildStepGuide(state, previousState) {
          const headline = state?.headline || 'This step';
          const narrative = state?.narrative || state?.explanation || '';
          const decision = state?.decision || '';
          const invariant = state?.invariant || '';
          const implementationFocus = state?.implementationFocus || '';

          return {
            plain: narrative
              ? headline + ' In plain words, this step asks one small question and updates only the state needed to answer it. ' + narrative
              : headline + ' This frame shows one safe move of the algorithm, not the whole solution at once.',
            observe: describeFocus(state),
            changed: describeChanges(state, previousState),
            why: decision
              ? decision + ' The earlier processed part has already proved enough information for this choice.'
              : 'Use the highlighted state to decide the next safe move. The step is valid when it keeps the algorithm promise true.',
            remember: invariant
              ? invariant + ' Keep this promise in mind before moving to the next step.'
              : 'After this frame, remember only the highlighted state and shown registers; the algorithm has compressed the past into those facts.',
            code: implementationFocus
              ? 'This visual move corresponds to: ' + implementationFocus + '. Read it left to right: compute the new candidate, then store the best or latest state.'
              : 'The code for this step updates the highlighted pointer, cell, container, or register shown in the visual lane.',
          };
        }

        function describeFocus(state) {
          const pointers = pointersFor(state);
          const values = getLinearValues(state);

          if (pointers.length > 0) {
            return pointers.slice(0, 3).map((pointer) => {
              const value = values ? values[pointer.index] : undefined;
              const valueText = value === undefined ? '' : ', value ' + shortValue(value);
              return 'Find ' + pointer.label + ' at index ' + pointer.index + valueText + '. That is the exact item this step is reasoning about.';
            }).join(' ');
          }

          const activeCells = asArray(state?.activeCells);
          if (activeCells.length > 0) {
            return 'Look at cell ' + activeCells.map(shortValue).slice(0, 4).join(', ') + '. Those cells are where the table rule is being applied right now.';
          }

          const windowLeft = Number(state?.window?.left);
          const windowRight = Number(state?.window?.right);
          if (Number.isFinite(windowLeft) && Number.isFinite(windowRight)) {
            return 'Look at the window from index ' + windowLeft + ' to ' + windowRight + '. Everything inside it is the current candidate group; everything outside is context.';
          }

          const activeNodes = activeNodeLabels(state?.graph || state?.tree);
          if (activeNodes.length > 0) {
            return 'Look at node ' + activeNodes.slice(0, 4).join(', ') + '. The algorithm is deciding what to do with that node before moving outward.';
          }

          const stack = asArray(state?.stack);
          const queue = asArray(state?.queue);
          if (stack.length > 0) return 'Look at the top of the stack: ' + shortValue(stack[stack.length - 1]) + '. A stack works from the most recently added unresolved item.';
          if (queue.length > 0) return 'Look at the front of the queue: ' + shortValue(queue[0]) + '. A queue works from the oldest waiting item.';

          return 'Start with the highlighted visual state, then read the registers. Together they tell you what the algorithm currently knows.';
        }

        function describeChanges(state, previousState) {
          if (!previousState) {
            return 'This is the starting snapshot. Nothing has changed yet; this step sets up the first useful facts.';
          }

          const changes = []
            .concat(describePointerChanges(state, previousState))
            .concat(describeValueChanges(state, previousState))
            .concat(describeVariableChanges(state, previousState));

          if (changes.length === 0) {
            return 'The raw values did not change much here. The important change is conceptual: a pointer, candidate, or proof has advanced.';
          }

          return changes.slice(0, 4).join(' ');
        }

        function describePointerChanges(state, previousState) {
          const current = pointersFor(state);
          const previous = new Map(pointersFor(previousState).map((pointer) => [pointer.label, pointer.index]));
          const changes = [];

          current.forEach((pointer) => {
            const oldIndex = previous.get(pointer.label);
            if (Number.isFinite(oldIndex) && oldIndex !== pointer.index) {
              changes.push(pointer.label + ' moved from index ' + oldIndex + ' to ' + pointer.index + '.');
            } else if (!Number.isFinite(oldIndex)) {
              changes.push(pointer.label + ' appeared at index ' + pointer.index + '.');
            }
          });

          return changes;
        }

        function describeValueChanges(state, previousState) {
          const current = getLinearValues(state);
          const previous = getLinearValues(previousState);
          if (!Array.isArray(current) || !Array.isArray(previous)) return [];

          const changes = [];
          current.forEach((value, index) => {
            if (stableValue(value) !== stableValue(previous[index])) {
              changes.push('Index ' + index + ' changed from ' + shortValue(previous[index]) + ' to ' + shortValue(value) + '.');
            }
          });
          return changes;
        }

        function describeVariableChanges(state, previousState) {
          const current = state?.variables || {};
          const previous = previousState?.variables || {};
          return Object.entries(current)
            .filter(([key]) => key !== 'sampleRun')
            .filter(([key, value]) => stableValue(value) !== stableValue(previous[key]))
            .slice(0, 4)
            .map(([key, value]) => humanizeKey(key) + ' became ' + shortValue(value) + '.');
        }

        function pointersFor(state) {
          const pointers = asArray(state?.pointers)
            .map((pointer) => ({
              label: pointer?.label || 'ptr',
              index: Number(pointer?.index),
            }))
            .filter((pointer) => Number.isFinite(pointer.index));

          [
            ['left_index', 'left'],
            ['right_index', 'right'],
            ['current_i', 'i'],
            ['current_w', 'w'],
          ].forEach(([key, label]) => {
            const index = Number(state?.[key]);
            if (Number.isFinite(index)) pointers.push({ label, index });
          });

          return pointers;
        }

        function activeNodeLabels(graphLike) {
          return asArray(graphLike?.nodes)
            .filter((node) => ['active', 'source', 'frontier'].includes(String(node?.state || '')))
            .map((node) => node?.label || node?.id)
            .filter(Boolean)
            .map(String);
        }

        function humanizeKey(key) {
          return String(key)
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .trim();
        }

        function shortValue(value) {
          const raw = stableValue(value);
          return raw.length > 42 ? raw.slice(0, 39) + '...' : raw;
        }

        function renderVisual(state, previousState) {
          const beforeState = previousState || baselineState(state);
          const beforeTitle = previousState ? stepTitle(previousState, currentIndex - 1, "Previous state") : "Clean input before the first decision";
          const afterTitle = stepTitle(state, currentIndex, "Current state");

          elements.stage.innerHTML =
            '<div class="diff-stage">' +
              '<section class="diff-panel before">' +
                '<div class="diff-panel-header"><div><div class="diff-label">Before</div><div class="diff-sub">' + escapeText(beforeTitle) + '</div></div></div>' +
                '<div class="diff-content">' + renderStateHtml(beforeState, state) + '</div>' +
              '</section>' +
              '<div class="diff-arrow" aria-hidden="true"><span>-&gt;</span></div>' +
              '<section class="diff-panel after">' +
                '<div class="diff-panel-header"><div><div class="diff-label">After</div><div class="diff-sub">' + escapeText(afterTitle) + '</div></div></div>' +
                '<div class="diff-content">' + renderStateHtml(state, beforeState) + '</div>' +
              '</section>' +
            '</div>';
          syncComparisonScroll();
        }

        function syncComparisonScroll() {
          const viewports = Array.from(elements.stage.querySelectorAll(".state-viewport"));
          if (viewports.length < 2) return;

          let syncing = false;
          viewports.forEach((source) => {
            source.addEventListener("scroll", () => {
              if (syncing) return;
              syncing = true;
              viewports.forEach((target) => {
                if (target !== source) {
                  target.scrollLeft = source.scrollLeft;
                  target.scrollTop = source.scrollTop;
                }
              });
              requestAnimationFrame(() => {
                syncing = false;
              });
            }, { passive: true });
          });
        }

        function renderVariables(state) {
          const variables = state.variables || {};
          const entries = Object.entries(variables).filter(([key]) => key !== "sampleRun");
          elements.variables.innerHTML = entries.map(([key, value]) => (
            '<div class="variable"><span>' + escapeText(key) + '</span><strong>' + escapeText(formatValue(value)) + '</strong></div>'
          )).join("");
        }

        function renderTimeline() {
          elements.timeline.innerHTML = trace.map((step, index) => (
            '<button type="button" class="' + (index === currentIndex ? "active" : "") + '" data-step="' + index + '">' + (index + 1) + '</button>'
          )).join("");
        }

        function renderCodeTabs() {
          if (sourceFiles.length === 0) {
            elements.codeArea.style.display = "none";
            return;
          }

          elements.codeTabs.innerHTML = sourceFiles.map((file, index) => (
            '<button type="button" class="code-tab ' + (index === activeSourceIndex ? "active" : "") + '" data-source="' + index + '">' + escapeText(file.label) + '</button>'
          )).join("");
          elements.codeView.textContent = sourceFiles[activeSourceIndex]?.content || "";
        }

        function render() {
          if (trace.length === 0) {
            elements.stage.innerHTML = '<div class="empty-state">No visual trace is available for this algorithm yet.</div>';
            return;
          }

          const state = trace[currentIndex];
          const previousState = currentIndex > 0 ? trace[currentIndex - 1] : null;
          const total = trace.length;
          const progress = state.progress ?? Math.round(((currentIndex + 1) / total) * 100);
          elements.stepPill.textContent = 'Step ' + (currentIndex + 1) + ' of ' + total;
          elements.progressPill.textContent = progress + '%';
          elements.phase.textContent = state.phase || 'Step ' + (currentIndex + 1);
          elements.headline.textContent = state.headline || 'Watch this state change';
          elements.narrative.textContent = state.narrative || state.explanation || '';
          elements.decision.textContent = state.decision ? 'Decision: ' + state.decision : state.invariant || '';
          elements.prompt.textContent = state.beginnerPrompt ? 'Try this: ' + state.beginnerPrompt : '';
          elements.codeFocus.textContent = state.implementationFocus || 'Implementation focus appears here while the simulation runs.';
          elements.range.value = String(currentIndex);
          elements.explain.innerHTML = renderStepGuide(state, previousState);
          renderVisual(state, previousState);
          renderVariables(state);
          renderTimeline();
          renderCodeTabs();
        }

        function setStep(index) {
          currentIndex = clampIndex(index);
          render();
        }

        function stop() {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
          elements.play.textContent = "Play";
        }

        function play() {
          if (timer) {
            stop();
            return;
          }

          elements.play.textContent = "Pause";
          timer = setInterval(() => {
            if (currentIndex >= trace.length - 1) {
              stop();
              return;
            }
            setStep(currentIndex + 1);
          }, 1500);
        }

        function escapeText(value) {
          return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
        }

        elements.reset.addEventListener("click", () => {
          stop();
          setStep(0);
        });
        elements.prev.addEventListener("click", () => {
          stop();
          setStep(currentIndex - 1);
        });
        elements.next.addEventListener("click", () => {
          stop();
          setStep(currentIndex + 1);
        });
        elements.play.addEventListener("click", play);
        elements.range.addEventListener("input", (event) => {
          stop();
          setStep(Number(event.target.value));
        });
        elements.timeline.addEventListener("click", (event) => {
          const button = event.target.closest("button[data-step]");
          if (!button) return;
          stop();
          setStep(Number(button.dataset.step));
        });
        elements.codeTabs.addEventListener("click", (event) => {
          const button = event.target.closest("button[data-source]");
          if (!button) return;
          activeSourceIndex = Number(button.dataset.source);
          renderCodeTabs();
        });
        window.addEventListener("keydown", (event) => {
          if (event.key === "ArrowRight") {
            stop();
            setStep(currentIndex + 1);
          } else if (event.key === "ArrowLeft") {
            stop();
            setStep(currentIndex - 1);
          } else if (event.key === " ") {
            event.preventDefault();
            play();
          }
        });

        render();
      })();
    </script>
  </body>
</html>`;
}

module.exports = {
  buildAlgorithmDeploymentIndex,
  getAlgorithmDeploymentData,
};
