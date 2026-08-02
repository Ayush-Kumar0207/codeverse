const { Project, ScriptTarget, ModuleKind, SyntaxKind } = require("ts-morph");
const path = require("path");
const { createHash } = require("crypto");

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== "object") return value;
  return Object.keys(value).sort().reduce((result, key) => {
    result[key] = canonicalize(value[key]);
    return result;
  }, {});
}
function digest(value) {
  return createHash("sha256").update(JSON.stringify(canonicalize(value))).digest("hex");
}
function finding(severity, title, detail, recommendation, fileName, line) {
  return { id: digest({ severity, title, detail, fileName, line }).slice(0, 24), severity, title, detail, recommendation, ...(fileName ? { fileName } : {}), ...(line ? { line } : {}) };
}
function location(sourceFile, node) {
  return { fileName: sourceFile.getFilePath().replace(/^\/virtual\//, ""), line: node?.getStartLineNumber?.() || 1 };
}
function projectFor(files) {
  const project = new Project({
    useInMemoryFileSystem: true,
    compilerOptions: {
      allowJs: true,
      checkJs: true,
      noEmit: true,
      target: ScriptTarget.ES2022,
      module: ModuleKind.CommonJS,
      skipLibCheck: true,
    },
  });
  for (const [fileName, content] of Object.entries(files)) {
    if (/\.[cm]?[jt]sx?$/.test(fileName)) project.createSourceFile("/virtual/" + fileName.replace(/\\/g, "/"), content, { overwrite: true });
  }
  return project;
}
function resolveImport(sourceName, request, names) {
  if (!request.startsWith(".")) return null;
  const base = path.posix.normalize(path.posix.join(path.posix.dirname(sourceName), request));
  return names.find((name) => name === base || name.replace(/\.[^.]+$/, "") === base || name.startsWith(base + "/index.")) || null;
}
function analyzeCorrectness(files) {
  const findings = [];
  const project = projectFor(files);
  for (const diagnostic of project.getPreEmitDiagnostics()) {
    const sourceFile = diagnostic.getSourceFile();
    const message = diagnostic.getMessageText();
    const detail = typeof message === "string" ? message : message.getMessageText();
    if (!sourceFile || /Cannot find (?:name|module)|implicitly has an 'any' type/.test(detail)) continue;
    findings.push(finding("critical", "Compiler rejected source", detail, "Fix the compiler diagnostic before review.", sourceFile.getFilePath().replace(/^\/virtual\//, ""), diagnostic.getLineNumber() || 1));
  }
  for (const [fileName, content] of Object.entries(files)) {
    const match = /\b(TODO|FIXME|HACK)\b/i.exec(content);
    if (match) findings.push(finding("warning", "Unresolved implementation marker", "The artifact contains " + match[1] + ".", "Resolve or justify the marker.", fileName, content.slice(0, match.index).split("\n").length));
  }
  return findings;
}
function analyzeSecurity(files) {
  const findings = [];
  for (const [fileName, content] of Object.entries(files)) {
    const secret = /(api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"'\n]{8,}["']/i.exec(content);
    if (secret) findings.push(finding("critical", "Credential-like literal", "A credential is embedded in source.", "Move it to an authenticated secret boundary and rotate it.", fileName, content.slice(0, secret.index).split("\n").length));
  }
  const project = projectFor(files);
  for (const sourceFile of project.getSourceFiles()) {
    for (const call of sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)) {
      const name = call.getExpression().getText();
      if (/^(eval|Function|execSync|exec|spawn)$/.test(name) || /\.exec(?:Sync)?$/.test(name)) {
        const at = location(sourceFile, call);
        findings.push(finding("critical", "Executable trust boundary", name + " executes dynamic or operating-system input.", "Replace it with an allow-listed non-shell interface.", at.fileName, at.line));
      }
    }
    for (const property of sourceFile.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)) {
      if (property.getName() === "innerHTML") {
        const at = location(sourceFile, property);
        findings.push(finding("critical", "Unsafe HTML boundary", "innerHTML bypasses framework escaping.", "Use sanitized or text-only rendering.", at.fileName, at.line));
      }
    }
  }
  return findings;
}
function analyzeTests(files) {
  const findings = [];
  const names = Object.keys(files);
  const tests = names.filter((name) => /(?:test|spec)\.[cm]?[jt]sx?$|__tests__/i.test(name));
  if (!tests.length) return [finding("critical", "No executable test surface", "No test source exists in the reviewed artifact.", "Add a regression test that imports the changed behavior.")];
  const project = projectFor(files);
  const linked = new Set();
  for (const sourceFile of project.getSourceFiles()) {
    const sourceName = sourceFile.getFilePath().replace(/^\/virtual\//, "");
    if (!tests.includes(sourceName)) continue;
    for (const declaration of sourceFile.getImportDeclarations()) {
      const target = resolveImport(sourceName, declaration.getModuleSpecifierValue(), names);
      if (target) linked.add(target);
    }
    for (const call of sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)) {
      if (call.getExpression().getText() !== "require") continue;
      const request = call.getArguments()[0]?.getText().replace(/^["']|["']$/g, "");
      const target = resolveImport(sourceName, request || "", names);
      if (target) linked.add(target);
    }
  }
  const sourceFiles = names.filter((name) => /\.[cm]?[jt]sx?$/.test(name) && !tests.includes(name));
  if (sourceFiles.length && !sourceFiles.some((name) => linked.has(name))) {
    findings.push(finding("critical", "Tests are not compiler-linked to source", "No test import resolves to a changed source module.", "Import and exercise the changed module from a regression test."));
  }
  return findings;
}
function analyzePerformance(files, evidence) {
  const findings = [];
  const project = projectFor(files);
  for (const sourceFile of project.getSourceFiles()) {
    for (const loop of sourceFile.getDescendants().filter((node) => [SyntaxKind.ForStatement, SyntaxKind.ForOfStatement, SyntaxKind.ForInStatement, SyntaxKind.WhileStatement].includes(node.getKind()))) {
      if (!loop.getDescendants().some((node) => [SyntaxKind.ForStatement, SyntaxKind.ForOfStatement, SyntaxKind.ForInStatement, SyntaxKind.WhileStatement].includes(node.getKind()))) continue;
      if (!Number.isFinite(Number(evidence.performanceDeltaPct))) {
        const at = location(sourceFile, loop);
        findings.push(finding("warning", "Nested iteration lacks a benchmark", "Compiler AST found nested iteration without measured p95 evidence.", "Attach an artifact-bound performance measurement.", at.fileName, at.line));
      }
    }
  }
  if (Number(evidence.performanceDeltaPct) > Number(evidence.performanceBudgetPct ?? 10)) {
    findings.push(finding("critical", "Performance budget exceeded", "Measured regression exceeds the declared budget.", "Revise the patch or approve a new explicit budget."));
  }
  return findings;
}
function analyzeArchitecture(files, requirement) {
  const findings = [];
  const names = Object.keys(files);
  if (!String(requirement || "").trim()) findings.push(finding("critical", "Unlinked requirement", "The artifact has no falsifiable product outcome.", "State an explicit acceptance requirement."));
  const project = projectFor(files);
  const graph = new Map(names.map((name) => [name, []]));
  for (const sourceFile of project.getSourceFiles()) {
    const sourceName = sourceFile.getFilePath().replace(/^\/virtual\//, "");
    const requests = [
      ...sourceFile.getImportDeclarations().map((item) => item.getModuleSpecifierValue()),
      ...sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)
        .filter((call) => call.getExpression().getText() === "require")
        .map((call) => call.getArguments()[0]?.getText().replace(/^["']|["']$/g, "") || ""),
    ];
    for (const request of requests) {
      const target = resolveImport(sourceName, request, names);
      if (target) graph.get(sourceName)?.push(target);
    }
    if (sourceFile.getFullText().split("\n").length > 700) findings.push(finding("warning", "Oversized module", sourceName + " exceeds 700 lines.", "Split it at a compiler-visible interface.", sourceName));
  }
  const visiting = new Set(), visited = new Set();
  function walk(name, chain) {
    if (visiting.has(name)) {
      findings.push(finding("warning", "Circular module dependency", [...chain, name].join(" -> "), "Break the cycle at an explicit interface.", name));
      return;
    }
    if (visited.has(name)) return;
    visiting.add(name);
    for (const target of graph.get(name) || []) walk(target, [...chain, name]);
    visiting.delete(name);
    visited.add(name);
  }
  for (const name of graph.keys()) walk(name, []);
  return findings;
}
function analyzeDevilsAdvocate(rollback, evidence) {
  const findings = [];
  if (!String(rollback || "").trim()) findings.push(finding("critical", "No rollback strategy", "The artifact has no recovery path.", "Document and execute a rollback acceptance test."));
  if (!String(evidence.rootCause || "").trim()) findings.push(finding("critical", "Root cause is not falsifiable", "No failing path or causal claim was supplied.", "Attach the failing input, trace, and expected recovery."));
  return findings;
}
function replaceSecrets(content) {
  return content.replace(/(api[_-]?key|secret|password|token)(\s*[:=]\s*)["'][^"'\n]{8,}["']/gi, (_, name, operator) => {
    const key = String(name).replace(/[^a-z0-9]/gi, "_").toUpperCase();
    return name + operator + "process.env." + key;
  });
}
function reviseArtifact(files, findings) {
  const revisedFiles = { ...files };
  const actions = [];
  for (const issue of findings) {
    if (!issue.fileName || !Object.hasOwn(revisedFiles, issue.fileName)) continue;
    if (issue.title === "Credential-like literal") {
      const next = replaceSecrets(revisedFiles[issue.fileName]);
      if (next !== revisedFiles[issue.fileName]) {
        revisedFiles[issue.fileName] = next;
        actions.push({ findingId: issue.id, fileName: issue.fileName, action: "Moved embedded credential to an environment boundary." });
      }
    }
    if (issue.title === "Unresolved implementation marker") {
      revisedFiles[issue.fileName] = revisedFiles[issue.fileName].replace(/\b(TODO|FIXME|HACK)\b:?\s*/gi, "");
      actions.push({ findingId: issue.id, fileName: issue.fileName, action: "Removed unresolved implementation marker." });
    }
  }
  return { revisedFiles, actions };
}
function analyzeRole(input) {
  const files = input.files || {};
  const evidence = input.evidence || {};
  const startedAt = Date.now();
  let findings = [];
  if (input.role === "reviewer") findings = analyzeCorrectness(files);
  if (input.role === "security") findings = analyzeSecurity(files);
  if (input.role === "test") findings = analyzeTests(files);
  if (input.role === "performance") findings = analyzePerformance(files, evidence);
  if (input.role === "architecture") findings = analyzeArchitecture(files, input.requirement);
  if (input.role === "devils-advocate") findings = analyzeDevilsAdvocate(input.rollback, evidence);
  if (input.role === "builder") {
    const revision = reviseArtifact(files, input.findings || []);
    return { role: input.role, ...revision, durationMs: Date.now() - startedAt };
  }
  const status = findings.some((item) => item.severity === "critical") ? "blocked" : findings.length ? "warning" : "passed";
  return { role: input.role, findings, status, durationMs: Date.now() - startedAt };
}
async function main() {
  let input = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) input += chunk;
  process.stdout.write(JSON.stringify(analyzeRole(JSON.parse(input))));
}
if (require.main === module) {
  main().catch((error) => {
    process.stderr.write(String(error?.stack || error));
    process.exitCode = 1;
  });
}
module.exports = { analyzeRole };
