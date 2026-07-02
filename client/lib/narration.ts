export type NarrationDifficulty = "Easy" | "Medium" | "Hard";

export type NarrationContext = {
  algorithmTitle?: string;
  difficulty?: NarrationDifficulty;
  topic?: string;
  approachName?: string;
  family?: string;
  cardTitle?: string;
};

export type NarrationLine = {
  id: string;
  text: string;
  explanation: string;
  sourceLine?: number;
  rate?: number;
  pitch?: number;
  pauseAfterMs?: number;
};

export type WalkthroughBlock = {
  kind: "heading" | "paragraph" | "list";
  text: string;
};

const normalizeSpace = (value: string) => value.replace(/\s+/g, " ").trim();

const hashString = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

const pick = <T,>(values: T[], seed: string) => values[hashString(seed) % values.length];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const stripMarkdown = (value: string) =>
  normalizeSpace(
    value
      .replace(/```[\s\S]*?```/g, " code example ")
      .replace(/!\[[^\]]*]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
      .replace(/[*_~`>#]/g, "")
      .replace(/^-{3,}$/g, "")
  );

const contextTitle = (fallback: string, context?: NarrationContext) =>
  stripMarkdown(context?.algorithmTitle || context?.cardTitle || fallback || "this problem");

const difficultyCoaching = (difficulty: NarrationDifficulty | undefined, seed: string) => {
  if (difficulty === "Hard") {
    return pick(
      [
        "Slow down here; this is one of the places where the proof and the implementation meet.",
        "For a hard problem, this is the kind of state change worth tracing by hand.",
        "Do not rush this step; the important part is why the next candidate is still valid.",
      ],
      seed
    );
  }

  if (difficulty === "Medium") {
    return pick(
      [
        "The main trick is to keep the state honest after this move.",
        "This is the point where the pattern starts doing real work.",
        "If this feels fuzzy, connect it back to the invariant before moving on.",
      ],
      seed
    );
  }

  return pick(
    [
      "If you are new to this, focus on the one variable that changed.",
      "This is a friendly step: understand the reason once, then the code follows naturally.",
      "For a beginner, the useful habit is to say this update in plain English.",
    ],
    seed
  );
};

const lineRoleExplanation = (title: string, text: string, context?: NarrationContext) => {
  const clean = stripMarkdown(text);
  const lower = clean.toLowerCase();
  const problem = contextTitle(title, context);
  const family = context?.family ? `${context.family.toLowerCase()} pattern` : "algorithm pattern";

  if (title.toLowerCase().includes("story dry run")) {
    return `Treat this like a page in the worked example for ${problem}. The goal is not speed yet; the goal is to watch the state change clearly.`;
  }
  if (lower.includes("complexity") || /\bo\([^)]+\)/i.test(clean)) {
    return `For ${problem}, this is the cost story. It tells you which operation grows when the input becomes larger.`;
  }
  if (lower.startsWith("if ") || lower.includes("condition") || lower.includes("whether")) {
    return `This is the decision point. In ${family}, a good condition does more than branch; it proves which move is safe next.`;
  }
  if (lower.includes("return") || lower.includes("answer") || lower.includes("final")) {
    return `This is where the work is handed back as the answer. Check that the stored state really represents what ${problem} asks for.`;
  }
  if (lower.includes("initialize") || lower.includes("start") || lower.includes("base case")) {
    return `This sets the starting promise. A clean beginning matters because every later update depends on this state being truthful.`;
  }
  if (lower.includes("while") || lower.includes("loop") || lower.includes("iterate") || lower.includes("repeat")) {
    return `This is the rhythm of the solution. Each pass should either consume input, shrink the search space, or make the answer more certain.`;
  }
  if (lower.includes("edge") || lower.includes("empty") || lower.includes("duplicate") || lower.includes("boundary")) {
    return `This is a boundary check. Beginners often understand the main case first, but these cases reveal whether the idea is actually sturdy.`;
  }
  if (lower.includes("invariant") || lower.includes("proof") || lower.includes("why")) {
    return `This is the trust contract for ${problem}. If the invariant stays true, the algorithm is not guessing.`;
  }

  return `This is one meaningful piece of ${problem}. Connect it to the ${family}, then ask what state changes because of it.`;
};

const friendlyExplanation = (
  title: string,
  text: string,
  context: NarrationContext | undefined,
  index: number,
  total: number
) => {
  const problem = contextTitle(title, context);
  const role = lineRoleExplanation(title, text, context);
  const seed = `${problem}-${title}-${text}-${index}-${total}`;
  const opening = pick(
    [
      "Here is the human version.",
      "Read this slowly.",
      "Think of it this way.",
      "The useful idea is this.",
      "A simple way to hear it is this.",
    ],
    seed
  );
  const pace = difficultyCoaching(context?.difficulty, seed);
  const loweredRole = `${role.charAt(0).toLowerCase()}${role.slice(1)}`;

  if (total <= 1) return `${opening} ${role} ${pace}`;
  if (index === 0) return `${opening} First, ${loweredRole} ${pace}`;
  if (index === total - 1) return `${opening} Finally, ${loweredRole} ${pace}`;
  return `${opening} Next, ${loweredRole} ${pace}`;
};

const narrationPace = (text: string, context?: NarrationContext) => {
  const words = text.split(/\s+/).filter(Boolean).length;
  const difficultyOffset = context?.difficulty === "Hard" ? -0.05 : context?.difficulty === "Medium" ? -0.02 : 0;
  const lengthOffset = words > 34 ? -0.04 : words > 22 ? -0.02 : 0;
  return clamp(0.91 + difficultyOffset + lengthOffset, 0.78, 0.96);
};

export const narrationLines = (
  title: string,
  values: string[],
  context?: NarrationContext
): NarrationLine[] => {
  const cleanValues = values.map(stripMarkdown).filter(Boolean);

  return cleanValues.map((text, index) => ({
    id: `${context?.algorithmTitle || title}-${title}-${index}`,
    text,
    explanation: friendlyExplanation(title, text, { ...context, cardTitle: title }, index, cleanValues.length),
    rate: narrationPace(text, context),
    pitch: context?.difficulty === "Hard" ? 0.94 : 0.98,
    pauseAfterMs: text.length > 170 ? 360 : 220,
  }));
};

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

const explainCodeLine = (line: string, language: string, context?: NarrationContext) => {
  const clean = normalizeSpace(line);
  const lower = clean.toLowerCase();
  const problem = contextTitle("implementation", context);
  const assignment = clean.match(/(?:let|const|var|int|long|double|float|string|bool|auto)?\s*([A-Za-z_]\w*)\s*=/);

  if (/^(\/\/|#|\/\*|\*)/.test(clean)) return `This comment is a signpost for the ${language} solution, so use it to predict the next piece of code.`;
  if (/\b(class|interface|struct)\b/.test(lower)) return `This declares the container for the ${language} version of ${problem}.`;
  if (/\b(function|def|public|private|protected|static)\b/.test(lower) && clean.includes("(")) {
    return `This declares the operation being solved. The parameters are the input story the rest of the code will transform.`;
  }
  if (/\b(for|while)\b/.test(lower)) return `This loop is where progress happens. Watch which variable moves so the code cannot spin forever.`;
  if (/\bif\b/.test(lower)) return `This condition is the fork in the road. It should match the same decision you would make in the dry run.`;
  if (/\belse\b/.test(lower)) return `This is the alternate path, used when the previous test has ruled out the first choice.`;
  if (/\breturn\b/.test(lower)) return `This returns the state that now represents the answer for ${problem}.`;
  if (assignment?.[1]) return `This updates ${assignment[1]}. Say what ${assignment[1]} means after the assignment, not just what the syntax does.`;
  if (/^(import|from|include|using|package)\b/.test(lower)) return `This makes a ${language} library or namespace available to the solution.`;
  return `This line advances the ${language} implementation by one concrete step. Tie it back to the dry run before moving on.`;
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

export const codeNarrationLines = (
  code: string,
  language: string,
  context?: NarrationContext
): NarrationLine[] =>
  code
    .split("\n")
    .map((line, sourceLine) => ({ line, sourceLine }))
    .filter(({ line }) => line.trim().length > 0)
    .map(({ line, sourceLine }, index) => {
      const text = speakableCode(line);
      return {
        id: `code-${context?.algorithmTitle || "implementation"}-${sourceLine}-${index}`,
        text: text || `Line ${sourceLine + 1}`,
        explanation: explainCodeLine(line, language, context),
        sourceLine,
        rate: context?.difficulty === "Hard" ? 0.82 : 0.86,
        pitch: 0.95,
        pauseAfterMs: 180,
      };
    });

export const toSpeakableNarration = (line: NarrationLine) => {
  const text = normalizeSpace(line.text);
  const explanation = normalizeSpace(line.explanation);
  if (!explanation) return text;
  return `${text}. ... ${explanation}`;
};

export const narrationVoiceProfile = (line: NarrationLine, index: number, total: number) => {
  const seed = hashString(`${line.id}-${line.text}-${index}`);
  const rateJitter = ((seed % 7) - 3) * 0.008;
  const pitchJitter = ((seed % 5) - 2) * 0.012;
  const finalPause = index >= total - 1 ? 0 : undefined;

  return {
    rate: clamp((line.rate ?? 0.88) + rateJitter, 0.76, 0.98),
    pitch: clamp((line.pitch ?? 0.96) + pitchJitter, 0.88, 1.06),
    volume: 1,
    pauseAfterMs: finalPause ?? line.pauseAfterMs ?? 220,
  };
};