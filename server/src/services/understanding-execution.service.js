const { Project, ScriptTarget, ModuleKind, SyntaxKind, ts } = require("ts-morph");
const path = require("path");
const { executeSealedWorkspace } = require("./evidence-runtime.service");

function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
function stripCodeFence(value) {
  const text = String(value || "").trim();
  const match = /^\x60\x60\x60[a-z0-9_-]*\s*\n([\s\S]*?)\n\x60\x60\x60$/i.exec(text);
  return (match ? match[1] : text).trim();
}
function sourceAnalysis(fileName, source) {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: { allowJs: true, checkJs: true, noEmit: true, target: ScriptTarget.ES2022, module: ModuleKind.CommonJS, skipLibCheck: true },
  });
  const sourceFile = project.createSourceFile("/workspace/" + fileName.replace(/\\/g, "/"), source, { overwrite: true });
  const names = [
    ...sourceFile.getFunctions().map((item) => item.getName()).filter(Boolean),
    ...sourceFile.getVariableDeclarations().filter((item) => {
      const initializer = item.getInitializer();
      return initializer && [SyntaxKind.ArrowFunction, SyntaxKind.FunctionExpression].includes(initializer.getKind());
    }).map((item) => item.getName()),
  ];
  const parameters = [];
  for (const callable of [...sourceFile.getFunctions(), ...sourceFile.getVariableDeclarations()]) {
    for (const parameter of callable.getParameters?.() || []) parameters.push(parameter.getName());
  }
  const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression).map((item) => item.getExpression().getText()).slice(0, 20);
  const declarations = sourceFile.getVariableDeclarations().map((item) => item.getName()).slice(0, 20);
  const diagnostics = project.getPreEmitDiagnostics().filter((item) => {
    const text = item.getMessageText();
    const message = typeof text === "string" ? text : text.getMessageText();
    return !/Cannot find (?:name|module)|implicitly has an 'any' type/.test(message);
  });
  return {
    primary: names[0] || "",
    parameters,
    calls,
    declarations,
    returns: sourceFile.getDescendantsOfKind(SyntaxKind.ReturnStatement).length,
    diagnostics: diagnostics.map((item) => {
      const text = item.getMessageText();
      return typeof text === "string" ? text : text.getMessageText();
    }),
  };
}
function instrument(source, primary) {
  if (!primary) return source;
  return source + "\n;module.exports.__evidenceTarget = typeof " + primary + " === 'function' ? " + primary + " : module.exports.__evidenceTarget;\n";
}
function hiddenHarness(modulePath, fixture) {
  return [
    "const candidate = require(" + JSON.stringify(modulePath) + ");",
    "const target = typeof candidate === 'function' ? candidate : candidate.__evidenceTarget || Object.values(candidate).find((value) => typeof value === 'function');",
    "if (typeof target !== 'function') throw new Error('No callable export found');",
    "Promise.resolve().then(() => target(" + JSON.stringify(fixture) + ")).then(",
    "  (value) => console.log('EVIDENCE_RESULT:' + JSON.stringify({ status: 'returned', value })),",
    "  (error) => console.log('EVIDENCE_RESULT:' + JSON.stringify({ status: 'threw', name: error?.name || 'Error', message: error?.message || String(error) }))",
    ");",
  ].join("\n");
}
async function probe(files, fileName, source, primary, fixture) {
  const extension = path.extname(fileName).toLowerCase();
  if (![".js", ".jsx", ".cjs", ".mjs", ".ts", ".tsx", ".mts", ".cts"].includes(extension)) {
    return { supported: false, status: "unsupported" };
  }
  const moduleName = fileName.replace(/\\/g, "/");
  const needsTranspile = [".jsx", ".mjs", ".ts", ".tsx", ".mts", ".cts"].includes(extension);
  const runnableSource = needsTranspile ? ts.transpileModule(source, {
    fileName: moduleName,
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText : source;
  const runnableName = needsTranspile
    ? path.posix.join(path.posix.dirname(moduleName), ".evidence-target.cjs")
    : moduleName;
  const relativeModule = path.posix.relative(".evidence", runnableName);
  const modulePath = relativeModule.startsWith(".") ? relativeModule : "./" + relativeModule;
  const runnerName = ".evidence/probe.cjs";
  const execution = await executeSealedWorkspace({
    files: { ...files, [runnableName]: instrument(runnableSource, primary), [runnerName]: hiddenHarness(modulePath, fixture) },
    command: "node " + runnerName,
    language: "javascript",
    engine: process.env.UNDERSTANDING_EXECUTION_ENGINE,
    containerImage: process.env.UNDERSTANDING_RUNNER_IMAGE || process.env.ARENA_RUNNER_IMAGE,
    timeoutMs: 8000,
  });
  const marker = execution.output.split(/\r?\n/).find((line) => line.startsWith("EVIDENCE_RESULT:"));
  if (!marker) return { supported: true, status: "harness-failed", execution: { exitCode: execution.exitCode, outputDigest: execution.outputDigest, engine: execution.engine } };
  return { supported: true, ...JSON.parse(marker.slice("EVIDENCE_RESULT:".length)), execution: { exitCode: execution.exitCode, outputDigest: execution.outputDigest, engine: execution.engine } };
}
function normalizedResult(probeResult) {
  if (probeResult.status === "returned") return JSON.stringify(probeResult.value);
  if (probeResult.status === "threw") return "throws " + probeResult.name + " " + probeResult.message;
  return probeResult.status;
}
function answerSimilarity(values) {
  const tokenSets = values.map((value) => new Set(String(value).toLowerCase().match(/[a-z_$][\w$-]{2,}/g) || []));
  let total = 0, pairs = 0;
  for (let left = 0; left < tokenSets.length; left += 1) for (let right = left + 1; right < tokenSets.length; right += 1) {
    const union = new Set([...tokenSets[left], ...tokenSets[right]]);
    total += union.size ? [...tokenSets[left]].filter((token) => tokenSets[right].has(token)).length / union.size : 0;
    pairs += 1;
  }
  return clamp(total / Math.max(1, pairs) * 100);
}
async function evaluateExecutableUnderstanding(challenge, answers, signals, context) {
  const source = String(context.code || "");
  const files = context.files || { [challenge.fileName]: source };
  const analysis = sourceAnalysis(challenge.fileName, source);
  const emptyProbe = await probe(files, challenge.fileName, source, analysis.primary, []);
  const nullProbe = await probe(files, challenge.fileName, source, analysis.primary, null);
  const feedback = [];
  const dimensionScores = {};
  const executionEvidence = {
    emptyBoundary: { result: normalizedResult(emptyProbe), execution: emptyProbe.execution },
    nullBoundary: { result: normalizedResult(nullProbe), execution: nullProbe.execution },
    compiler: { engine: "ts-morph", diagnostics: analysis.diagnostics.length },
  };
  for (const question of challenge.questions) {
    const raw = String(answers[question.id] || "");
    const lower = raw.toLowerCase();
    let score = 0;
    let detail = "The response did not satisfy the executable assessment.";
    if (question.focus === "purpose" || question.focus === "transfer") {
      const concepts = question.expectedConcepts.filter((item) => lower.includes(item.toLowerCase())).length;
      score = clamp(concepts / Math.max(1, question.expectedConcepts.length) * 65 + (/\b(input|output|state|invariant|each)\b/.test(lower) ? 35 : 0));
      detail = "Explanation was checked against compiler-derived symbols and invariants.";
    }
    if (question.focus === "prediction") {
      const expected = normalizedResult(emptyProbe).toLowerCase();
      const exact = lower.includes(expected) || (emptyProbe.status === "returned" && lower.includes(JSON.stringify(emptyProbe.value).toLowerCase()));
      score = exact ? (/\b(because|branch|when|return)\b/.test(lower) ? 100 : 80) : 0;
      detail = exact ? "Prediction matches the hidden execution result." : "Prediction diverges from the hidden empty-input execution.";
    }
    if (question.focus === "debugging") {
      const expectedTerms = nullProbe.status === "threw"
        ? [String(nullProbe.name || "").toLowerCase(), ...String(nullProbe.message || "").toLowerCase().match(/[a-z_$][\w$]{3,}/g) || []]
        : ["null", "returned"];
      const hits = expectedTerms.filter((item) => item && lower.includes(item)).length;
      score = clamp(hits / Math.max(1, Math.min(3, expectedTerms.length)) * 70 + (/\b(first|operation|trace|line)\b/.test(lower) ? 30 : 0));
      detail = score >= 70 ? "Debugging answer matches the hidden null-input trace." : "Debugging answer does not identify the observed first failure.";
    }
    if (question.focus === "dataflow") {
      const graphNodes = [...new Set([...analysis.parameters, ...analysis.declarations, ...analysis.calls, "return"])].filter(Boolean);
      const hits = graphNodes.filter((item) => lower.includes(item.toLowerCase())).length;
      score = clamp(Math.min(70, hits * 20) + (/(?:->|→)/.test(raw) && raw.split(/(?:->|→)/).length >= 3 ? 30 : 0));
      detail = score >= 70 ? "Diagram overlaps the compiler-derived flow graph." : "Diagram misses compiler-derived parameters, calls, or return flow.";
    }
    if (question.focus === "modification") {
      const candidate = stripCodeFence(raw);
      const candidateAnalysis = sourceAnalysis(challenge.fileName, candidate);
      const candidateEmpty = candidateAnalysis.diagnostics.length ? { status: "compiler-error" } : await probe(files, challenge.fileName, candidate, candidateAnalysis.primary, []);
      const candidateValid = candidateAnalysis.diagnostics.length ? { status: "compiler-error" } : await probe(files, challenge.fileName, candidate, candidateAnalysis.primary, [1, 2]);
      const originalValid = await probe(files, challenge.fileName, source, analysis.primary, [1, 2]);
      const candidateNull = candidateAnalysis.diagnostics.length ? { status: "compiler-error" } : await probe(files, challenge.fileName, candidate, candidateAnalysis.primary, null);
      const preservesValid = normalizedResult(candidateValid) === normalizedResult(originalValid);
      const handlesInvalid = candidateNull.status !== "harness-failed" && !(candidateNull.status === "threw" && candidateNull.name === "TypeError");
      const executable = candidateAnalysis.diagnostics.length === 0 && candidateEmpty.status !== "harness-failed" && preservesValid && handlesInvalid;
      score = executable ? 100 : candidateAnalysis.diagnostics.length === 0 ? 40 : 0;
      detail = executable ? "Replacement compiled and passed hidden valid/invalid behavior probes." : "Replacement failed compilation or hidden behavior preservation.";
      executionEvidence.modification = {
        compiled: candidateAnalysis.diagnostics.length === 0,
        preservesValid,
        handlesInvalid,
        probes: {
          empty: normalizedResult(candidateEmpty),
          valid: normalizedResult(candidateValid),
          invalid: normalizedResult(candidateNull),
        },
      };
    }
    feedback.push({ questionId: question.id, score, detail });
    dimensionScores[question.focus] = score;
  }
  const dimensions = {
    explanation: clamp(((dimensionScores.purpose || 0) + (dimensionScores.transfer || 0)) / 2),
    prediction: dimensionScores.prediction || 0,
    modification: dimensionScores.modification || 0,
    debugging: dimensionScores.debugging || 0,
    dataFlow: dimensionScores.dataflow || 0,
  };
  const values = Object.values(answers).map(String);
  const similarity = answerSimilarity(values);
  const pasteCount = Math.max(0, Number(signals.pasteCount || 0));
  const externalFocusChanges = Math.max(0, Number(signals.externalFocusChanges || 0));
  const elapsedMs = Math.max(0, Number(signals.elapsedMs || 0));
  const score = clamp(
    Object.values(dimensions).reduce((sum, value) => sum + value, 0) / 5 -
    Math.max(0, similarity - 75) * 0.5 -
    Math.min(25, pasteCount * 8) -
    Math.min(15, externalFocusChanges * 2)
  );
  return {
    score,
    passed: score >= 70 && dimensions.modification >= 80 && dimensions.prediction >= 70 && dimensions.debugging >= 70 && dimensions.dataFlow >= 70,
    feedback,
    dimensions,
    executionEvidence,
    behavioralSignals: {
      answerSimilarity: similarity,
      revisionCount: Math.max(0, Number(signals.revisionCount || 0)),
      elapsedMs,
      continuity: clamp(100 - Number(signals.idleResumes || 0) * 15 - externalFocusChanges * 5 - (elapsedMs < 30_000 ? 30 : 0)),
      pasteCount,
      externalFocusChanges,
    },
    codeDigest: challenge.codeDigest,
  };
}
module.exports = { evaluateExecutableUnderstanding, sourceAnalysis };
