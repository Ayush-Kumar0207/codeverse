const fs = require("fs").promises;
const path = require("path");
const { buildAlgorithmDeploymentIndex } = require("./algorithmDeploymentPage.service");

const DEPLOY_DIR = path.join(__dirname, "../../../deployments");
const DEFAULT_SERVER_PORT = process.env.PORT || 5000;

async function ensureDeployDir() {
  await fs.mkdir(DEPLOY_DIR, { recursive: true });
}

function slugifyProjectId(projectId) {
  const slug = String(projectId || "workspace")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);

  return /[a-z0-9]/.test(slug) ? slug : `workspace-${Date.now()}`;
}

function sanitizeRelativeFileName(fileName) {
  const normalized = String(fileName || "").replace(/\\/g, "/");
  const safeParts = normalized
    .split("/")
    .filter((part) => part && part !== "." && part !== "..")
    .map((part) => part.replace(/[^a-zA-Z0-9._-]/g, "_"));

  const safeRelativePath = safeParts.join("/");

  if (!safeRelativePath) {
    throw new Error(`Invalid deployment file name: ${fileName}`);
  }

  return safeRelativePath;
}

function resolveDeployFile(root, fileName) {
  const safeRelativePath = sanitizeRelativeFileName(fileName);
  const filePath = path.resolve(root, safeRelativePath);
  const rootPath = path.resolve(root);
  const relativeToRoot = path.relative(rootPath, filePath);

  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    throw new Error(`Deployment file escaped project directory: ${fileName}`);
  }

  return { filePath, safeRelativePath };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

function chooseJavaScriptEntry(filesByRelativePath) {
  const preferred = ["main.js", "index.js", "script.js", "solution.js", "trace-demo.js"];

  for (const fileName of preferred) {
    const match = findCaseInsensitive(filesByRelativePath, fileName);
    if (match) {
      return match;
    }
  }

  for (const fileName of filesByRelativePath.keys()) {
    if (fileName.toLowerCase().endsWith(".js")) {
      return fileName;
    }
  }

  return null;
}

function markdownToHtml(markdown) {
  const lines = String(markdown || "").replace(/\\n/g, "\n").split(/\r?\n/);
  const html = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      continue;
    }

    if (trimmed.startsWith("# ")) {
      closeList();
      html.push(`<h1>${escapeHtml(trimmed.slice(2))}</h1>`);
      continue;
    }

    if (trimmed.startsWith("## ")) {
      closeList();
      html.push(`<h2>${escapeHtml(trimmed.slice(3))}</h2>`);
      continue;
    }

    if (trimmed.startsWith("### ")) {
      closeList();
      html.push(`<h3>${escapeHtml(trimmed.slice(4))}</h3>`);
      continue;
    }

    if (trimmed.startsWith("- ")) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${escapeHtml(trimmed.slice(2))}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${escapeHtml(trimmed)}</p>`);
  }

  closeList();
  return html.join("\n");
}

function extractMarkdownTitle(markdown) {
  const titleLine = String(markdown || "")
    .replace(/\\n/g, "\n")
    .split(/\r?\n/)
    .find((line) => line.trim().startsWith("# "));

  return titleLine ? titleLine.trim().slice(2).trim() : "";
}

function titleFromProjectId(projectId) {
  const words = String(projectId || "")
    .split(/[-_]/g)
    .filter(Boolean)
    .filter((word) => !["demo", "sandbox"].includes(word.toLowerCase()));

  if (words.length === 0) {
    return "Published App";
  }

  return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function buildGeneratedIndex({ projectId, filesByRelativePath }) {
  const readmeFile =
    findCaseInsensitive(filesByRelativePath, "README.md") ||
    findCaseInsensitive(filesByRelativePath, "PROBLEM.md");
  const readmeContent = readmeFile ? filesByRelativePath.get(readmeFile) : "";
  const title = extractMarkdownTitle(readmeContent) || titleFromProjectId(projectId);
  const readmeHtml = readmeFile
    ? markdownToHtml(readmeContent)
    : "<p>This published app was built from the current CodeVerse workspace.</p>";
  const scriptEntry = chooseJavaScriptEntry(filesByRelativePath);
  const cssFiles = Array.from(filesByRelativePath.keys()).filter((fileName) =>
    fileName.toLowerCase().endsWith(".css")
  );
  const workspaceFiles = Array.from(filesByRelativePath.keys())
    .sort((a, b) => a.localeCompare(b))
    .map((fileName) => `<li><a href="./${encodeURI(fileName)}">${escapeHtml(fileName)}</a></li>`)
    .join("\n");
  const cssLinks = cssFiles
    .map((fileName) => `<link rel="stylesheet" href="./${encodeURI(fileName)}" />`)
    .join("\n");
  const scriptTag = scriptEntry
    ? `<script src="./${encodeURI(scriptEntry)}" defer></script>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    ${cssLinks}
    <style>
      :root {
        color-scheme: dark;
        --bg: #05070d;
        --panel: #0c1220;
        --panel-soft: #111827;
        --line: rgba(148, 163, 184, 0.22);
        --text: #f8fafc;
        --muted: #94a3b8;
        --accent: #6d6af8;
        --accent-2: #22c55e;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        background:
          radial-gradient(circle at 20% 0%, rgba(109, 106, 248, 0.22), transparent 28rem),
          linear-gradient(135deg, #05070d 0%, #070b13 45%, #02030a 100%);
        color: var(--text);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      main {
        width: min(1080px, calc(100vw - 40px));
        margin: 0 auto;
        padding: 56px 0;
      }

      .shell {
        border: 1px solid var(--line);
        background: rgba(12, 18, 32, 0.84);
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 24px 90px rgba(0, 0, 0, 0.45);
      }

      header {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        padding: 28px;
        border-bottom: 1px solid var(--line);
      }

      .eyebrow {
        color: var(--accent);
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      h1 {
        margin: 8px 0 0;
        font-size: clamp(32px, 4vw, 56px);
        line-height: 1;
      }

      h2 {
        margin-top: 32px;
        font-size: 22px;
      }

      h3 {
        margin-top: 24px;
        color: #dbeafe;
      }

      p,
      li {
        color: #cbd5e1;
        font-size: 16px;
        line-height: 1.75;
      }

      a {
        color: #a5b4fc;
        text-decoration: none;
      }

      .badge {
        align-self: flex-start;
        border: 1px solid rgba(34, 197, 94, 0.28);
        border-radius: 999px;
        color: var(--accent-2);
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.1em;
        padding: 10px 14px;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .content {
        display: grid;
        grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.7fr);
        gap: 24px;
        padding: 28px;
      }

      .panel {
        border: 1px solid var(--line);
        background: rgba(2, 6, 23, 0.42);
        border-radius: 18px;
        padding: 24px;
      }

      #console-output {
        margin: 0;
        min-height: 180px;
        max-height: 420px;
        overflow: auto;
        white-space: pre-wrap;
        color: #bbf7d0;
        font: 14px/1.65 "SFMono-Regular", Consolas, "Liberation Mono", monospace;
      }

      .empty-console {
        color: var(--muted);
      }

      @media (max-width: 820px) {
        header,
        .content {
          grid-template-columns: 1fr;
        }

        header {
          flex-direction: column;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="shell">
        <header>
          <div>
            <div class="eyebrow">Published Application</div>
            <h1>${escapeHtml(title)}</h1>
          </div>
          <div class="badge">Live App</div>
        </header>

        <div class="content">
          <article class="panel">
            ${readmeHtml}
          </article>

          <aside class="panel">
            <h2>Source Files</h2>
            <ul>
              ${workspaceFiles}
            </ul>
            <h2>Runtime Output</h2>
            <pre id="console-output"><span class="empty-console">JavaScript console output will appear here when this app runs.</span></pre>
          </aside>
        </div>
      </section>
    </main>

    <script>
      (() => {
        const output = document.getElementById("console-output");
        const write = (label, values) => {
          output.textContent = output.textContent.includes("JavaScript console output will appear here") ? "" : output.textContent;
          const line = values.map((value) => {
            if (typeof value === "string") return value;
            try {
              return JSON.stringify(value, null, 2);
            } catch {
              return String(value);
            }
          }).join(" ");
          output.textContent += label ? label + " " + line + "\\n" : line + "\\n";
        };

        const originalLog = console.log.bind(console);
        const originalError = console.error.bind(console);
        console.log = (...values) => {
          originalLog(...values);
          write("", values);
        };
        console.error = (...values) => {
          originalError(...values);
          write("[error]", values);
        };
        window.addEventListener("error", (event) => {
          write("[runtime error]", [event.message]);
        });
      })();
    </script>
    ${scriptTag}
  </body>
</html>`;
}

async function deployProject(projectId, files, options = {}) {
  if (!files || typeof files !== "object" || Array.isArray(files)) {
    throw new Error("Deployment requires a file map.");
  }

  const fileEntries = Object.entries(files);

  if (fileEntries.length === 0) {
    throw new Error("Deployment requires at least one file.");
  }

  await ensureDeployDir();

  const safeProjectId = slugifyProjectId(projectId);
  const projectDeployPath = path.join(DEPLOY_DIR, safeProjectId);
  const filesByRelativePath = new Map();

  await fs.rm(projectDeployPath, { recursive: true, force: true });
  await fs.mkdir(projectDeployPath, { recursive: true });

  for (const [fileName, content] of fileEntries) {
    const { filePath, safeRelativePath } = resolveDeployFile(projectDeployPath, fileName);
    const serializedContent =
      typeof content === "string" ? content.replace(/\\n/g, "\n") : JSON.stringify(content, null, 2);

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, serializedContent, "utf8");
    filesByRelativePath.set(safeRelativePath, serializedContent);
  }

  const customIndexFile = findCaseInsensitive(filesByRelativePath, "index.html");

  if (!customIndexFile) {
    const algorithmIndex = buildAlgorithmDeploymentIndex({ filesByRelativePath });
    const generatedIndex = algorithmIndex || buildGeneratedIndex({ projectId: safeProjectId, filesByRelativePath });
    await fs.writeFile(path.join(projectDeployPath, "index.html"), generatedIndex, "utf8");
    filesByRelativePath.set("index.html", generatedIndex);
  }

  const baseUrl = options.baseUrl || `http://localhost:${DEFAULT_SERVER_PORT}`;

  return {
    projectId: safeProjectId,
    url: `${baseUrl}/deployments/${encodeURIComponent(safeProjectId)}/`,
    path: projectDeployPath,
    files: Array.from(filesByRelativePath.keys()).sort((a, b) => a.localeCompare(b)),
    timestamp: new Date().toISOString(),
  };
}

module.exports = {
  DEPLOY_DIR,
  deployProject,
  escapeHtml,
  resolveDeployFile,
  sanitizeRelativeFileName,
  slugifyProjectId,
};
