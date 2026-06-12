export type NarrationLine = {
  id: string;
  text: string;
  explanation: string;
  sourceLine?: number;
};

export type WalkthroughBlock = {
  kind: "heading" | "paragraph" | "list";
  text: string;
};

const normalizeSpace = (value: string) => value.replace(/\s+/g, " ").trim();

export const stripMarkdown = (value: string) =>
  normalizeSpace(
    value
      .replace(/```[\s\S]*?```/g, " code example ")
      .replace(/!\[[^\]]*]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
      .replace(/[*_~`>#]/g, "")
      .replace(/^-{3,}$/g, "")
  );

const friendlyExplanation = (title: string, text: string) => {
  const clean = stripMarkdown(text);
  const lower = clean.toLowerCase();

  if (lower.includes("complexity") || /\bo\([^)]+\)/i.test(clean)) {
    return `In practical terms, this tells us how the cost of ${title.toLowerCase()} changes as the input grows.`;
  }
  if (lower.startsWith("if ") || lower.includes("condition")) {
    return "Think of this as the decision gate: the algorithm checks this fact before choosing its next move.";
  }
  if (lower.includes("return") || lower.includes("answer")) {
    return "This is the result we preserve after the useful work is complete.";
  }
  if (lower.includes("initialize") || lower.includes("start")) {
    return "This prepares the small amount of state the algorithm needs before the main work begins.";
  }
  if (lower.includes("while") || lower.includes("loop") || lower.includes("iterate")) {
    return "This is the repeating part of the idea. Each pass makes measurable progress toward the answer.";
  }
  if (lower.includes("edge") || lower.includes("empty") || lower.includes("duplicate")) {
    return "This is worth testing because ordinary assumptions often break at exactly this boundary.";
  }

  return `Put simply, this is one important piece of ${title.toLowerCase()}. Keep it in mind while connecting it to the next line.`;
};

export const narrationLines = (title: string, values: string[]): NarrationLine[] =>
  values
    .map(stripMarkdown)
    .filter(Boolean)
    .map((text, index) => ({
      id: `${title}-${index}`,
      text,
      explanation: friendlyExplanation(title, text),
    }));

export const walkthroughBlocks = (description: string): WalkthroughBlock[] =>
  description
    .split(/\r?\n/)
    .map((raw) => raw.trim())
    .filter((raw) => raw && !/^-{3,}$/.test(raw))
    .map((raw) => {
      if (/^#{1,6}\s+/.test(raw)) {
        return { kind: "heading" as const, text: stripMarkdown(raw.replace(/^#{1,6}\s+/, "")) };
      }
      if (/^(?:[-*+]|\d+\.)\s+/.test(raw)) {
        return { kind: "list" as const, text: stripMarkdown(raw.replace(/^(?:[-*+]|\d+\.)\s+/, "")) };
      }
      return { kind: "paragraph" as const, text: stripMarkdown(raw) };
    })
    .filter((block) => block.text);

const explainCodeLine = (line: string, language: string) => {
  const clean = normalizeSpace(line);
  const lower = clean.toLowerCase();

  if (/^(\/\/|#|\/\*|\*)/.test(clean)) return "This comment describes the intention of the code that follows.";
  if (/\b(class|interface|struct)\b/.test(lower)) return "This declares the container that groups the solution's behavior and data.";
  if (/\b(function|def|public|private|protected|static)\b/.test(lower) && clean.includes("(")) {
    return "This declares a reusable operation. Its inputs arrive through the parameters inside the parentheses.";
  }
  if (/\b(for|while)\b/.test(lower)) return "This loop repeats the enclosed work while steadily moving through the problem.";
  if (/\bif\b/.test(lower)) return "This condition chooses whether the guarded branch should run.";
  if (/\belse\b/.test(lower)) return "This is the fallback path when the previous condition is not satisfied.";
  if (/\breturn\b/.test(lower)) return "This sends the completed result back to the caller.";
  if (clean.includes("=")) return "This updates the program state so the next step has the information it needs.";
  if (/^(import|from|include|using|package)\b/.test(lower)) return `This makes a ${language} library or namespace available to the solution.`;
  return "This line advances the implementation by one small, concrete step.";
};

const speakableCode = (line: string) =>
  normalizeSpace(line)
    .replace(/=>/g, " arrow ")
    .replace(/===/g, " strictly equals ")
    .replace(/==/g, " equals ")
    .replace(/&&/g, " and ")
    .replace(/\|\|/g, " or ")
    .replace(/\+\+/g, " increment ")
    .replace(/--/g, " decrement ")
    .replace(/[{}[\];]/g, " ");

export const codeNarrationLines = (code: string, language: string): NarrationLine[] =>
  code
    .split("\n")
    .map((line, sourceLine) => ({ line, sourceLine }))
    .filter(({ line }) => line.trim().length > 0)
    .map(({ line, sourceLine }, index) => {
      const text = speakableCode(line);
      return {
        id: `code-${sourceLine}-${index}`,
        text: text || `Line ${sourceLine + 1}`,
        explanation: explainCodeLine(line, language),
        sourceLine,
      };
    });
