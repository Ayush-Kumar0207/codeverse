const MAX_ASSISTANT_CONTEXT_CHARS = 7000;
const ACTIVE_FILE_CONTEXT_CHARS = 2400;
const OTHER_FILE_CONTEXT_CHARS = 900;

export function normalizeIdentity(value?: string | null) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

export function clipForAssistant(value: string, limit: number) {
  if (value.length <= limit) return value;

  const marker = "\n...[file shortened for assistant context]...\n";
  const contentBudget = Math.max(0, limit - marker.length);
  const head = Math.floor(contentBudget * 0.7);
  const tail = Math.max(0, contentBudget - head);
  const tailText = tail > 0 ? value.slice(-tail) : "";

  return `${value.slice(0, head)}${marker}${tailText}`.slice(0, limit);
}

export function buildAssistantWorkspaceContext(files: Record<string, string>, activeFile: string) {
  const orderedNames = [
    activeFile,
    ...Object.keys(files)
      .filter((fileName) => fileName !== activeFile)
      .sort((left, right) => left.localeCompare(right)),
  ].filter(Boolean);

  let remaining = MAX_ASSISTANT_CONTEXT_CHARS;
  const sections: string[] = [];

  for (const fileName of orderedNames) {
    if (remaining <= 0) break;

    const perFileLimit = fileName === activeFile ? ACTIVE_FILE_CONTEXT_CHARS : OTHER_FILE_CONTEXT_CHARS;
    const snippet = clipForAssistant(files[fileName] || "", Math.min(perFileLimit, remaining));
    const section = [`File: ${fileName}`, "```", snippet, "```"].join("\n");

    sections.push(section);
    remaining -= section.length;
  }

  return sections.join("\n\n");
}

export function createWorkspaceSnapshotSignature(files: Record<string, string>) {
  return JSON.stringify(Object.entries(files).sort(([left], [right]) => left.localeCompare(right)));
}

export function sanitizeDemoUserName(value?: string | null) {
  const normalized = (value || "").trim().replace(/[^a-zA-Z0-9 _-]/g, "").slice(0, 32);
  return normalized || "Demo Collaborator";
}
