const { spawn } = require("child_process");
const path = require("path");
const { createHash } = require("crypto");

const WORKER_PATH = path.join(__dirname, "evidence-review.worker.js");
const ROLE_DEFINITIONS = [
  ["reviewer", "Correctness Reviewer", "Runs compiler diagnostics and correctness analysis."],
  ["security", "Security Agent", "Runs AST security-boundary and credential analysis."],
  ["test", "Test Agent", "Compiler-links executable regression tests to changed source."],
  ["performance", "Performance Agent", "Inspects compiler loop structure and measured budgets."],
  ["architecture", "Architecture Agent", "Builds module dependencies and detects cycles and boundary debt."],
  ["devils-advocate", "Devil's Advocate", "Challenges falsifiability, rollback, and recovery assumptions."],
];

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
function clamp(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}
function workspaceDigest(files) {
  return digest(Object.entries(files).sort(([left], [right]) => left.localeCompare(right)));
}
function sanitizedEnvironment() {
  const environment = {
    PATH: process.env.PATH || "",
    SystemRoot: process.env.SystemRoot || "",
    TEMP: process.env.TEMP || "",
    TMP: process.env.TMP || "",
    NODE_ENV: "test",
  };
  for (const key of ["DOCKER_HOST", "DOCKER_TLS_VERIFY", "DOCKER_CERT_PATH", "DOCKER_CONTEXT"]) {
    if (process.env[key]) environment[key] = process.env[key];
  }
  return environment;
}
function workerInvocation(engine) {
  if (engine === "process") {
    return {
      command: process.execPath,
      args: ["--max-old-space-size=96", "--disable-proto=throw", WORKER_PATH],
      isolation: { engine: "separate-process", network: "host-policy", filesystem: "worker-runtime", capabilities: "process-user" },
    };
  }
  if (engine === "docker") {
    const image = String(process.env.EVIDENCE_ANALYZER_IMAGE || "").trim();
    if (!image || !/^[a-z0-9][a-z0-9./:@_-]{2,240}$/i.test(image)) throw new Error("EVIDENCE_ANALYZER_IMAGE is required for production review isolation");
    if (process.env.NODE_ENV === "production" && !/@sha256:[0-9a-f]{64}$/i.test(image)) throw new Error("EVIDENCE_ANALYZER_IMAGE must be pinned by SHA-256 digest");
    return {
      command: "docker",
      args: [
        "run", "--rm", "--network", "none", "--read-only",
        "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
        "--pids-limit", "32", "--memory", "160m", "--cpus", "0.5",
        "--user", "65534:65534", "--tmpfs", "/tmp:rw,noexec,nosuid,size=16m",
        "-i", image, "node", "src/services/evidence-review.worker.js",
      ],
      isolation: { engine: "docker", network: "none", filesystem: "read-only", capabilities: "dropped" },
    };
  }
  throw new Error("Unsupported evidence analyzer engine");
}
function executeWorker(payload) {
  const engine = process.env.EVIDENCE_ANALYZER_ENGINE || (process.env.NODE_ENV === "production" ? "docker" : "process");
  const invocation = workerInvocation(engine);
  const startedAt = Date.now();
  return new Promise((resolve, reject) => {
    const child = spawn(invocation.command, invocation.args, {
      env: sanitizedEnvironment(),
      windowsHide: true,
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "", stderr = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("Isolated review role timed out"));
    }, 15_000);
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0) return reject(new Error(stderr || "Isolated review role failed"));
      try {
        resolve({ ...JSON.parse(stdout), isolation: invocation.isolation, wallTimeMs: Date.now() - startedAt });
      } catch (error) {
        reject(new Error("Isolated review role returned invalid output: " + error.message));
      }
    });
    child.stdin.end(JSON.stringify(payload));
  });
}
function challengeKey(role, issue) {
  return [role, issue.title, issue.fileName || "", issue.line || 0].join(":");
}
function toolResult(role, output, patchDigest) {
  return {
    tool: role + ":" + output.isolation.engine,
    status: output.status === "blocked" ? "failed" : "passed",
    durationMs: Math.max(1, output.wallTimeMs),
    outputDigest: digest({ role, patchDigest, findings: output.findings || [], isolation: output.isolation }),
    summary: (output.findings || []).length
      ? output.findings.length + " compiler-backed finding" + (output.findings.length === 1 ? "" : "s") + "."
      : "Isolated analyzer passed.",
    isolation: output.isolation,
  };
}
function agentResult(definition, output, patchDigest) {
  const [id, name, responsibility] = definition;
  return {
    id, name, responsibility,
    status: output.status,
    summary: output.findings.length
      ? output.findings.length + " evidence-backed challenge" + (output.findings.length === 1 ? "" : "s") + " raised."
      : "Independent isolated analysis passed.",
    findings: output.findings,
    engine: "tool",
    toolRuns: [toolResult(id, output, patchDigest)],
  };
}
async function analyzeRound(files, requirement, rollback, evidence) {
  const outputs = await Promise.all(ROLE_DEFINITIONS.map(([role]) => executeWorker({ role, files, requirement, rollback, evidence })));
  return ROLE_DEFINITIONS.map((definition, index) => agentResult(definition, outputs[index], workspaceDigest(files)));
}
function verdictFor(agents) {
  if (agents.some((item) => item.status === "blocked")) return "blocked";
  if (agents.filter((item) => item.status === "warning").length > 2) return "changes-requested";
  return "approved";
}
async function runIsolatedReviewBoard(files, requirement, rollback, evidence = {}, options = {}) {
  const initialPatchDigest = workspaceDigest(files);
  const initialBuilder = await executeWorker({ role: "builder", files, findings: [] });
  const firstAgents = await analyzeRound(files, requirement, rollback, evidence);
  const firstFindings = firstAgents.flatMap((agent) => agent.findings.map((issue) => ({ ...issue, from: agent.id })));
  const firstChallenges = firstFindings.map((issue) => ({
    id: challengeKey(issue.from, issue),
    from: issue.from,
    to: "builder",
    claim: issue.title + ": " + issue.recommendation,
    resolved: false,
  }));
  let proposal = null;
  let proposalError = "";
  if (firstFindings.length && typeof options.generateRevision === "function") {
    try {
      proposal = await options.generateRevision({ files, requirement, rollback, evidence, findings: firstFindings, patchDigest: initialPatchDigest });
    } catch (error) {
      proposalError = String(error?.message || error);
    }
  }
  const revision = await executeWorker({
    role: "builder",
    files,
    findings: firstFindings,
    proposedFiles: proposal?.files,
    proposedActions: proposal?.actions,
  });
  const revisedFiles = revision.revisedFiles;
  const revisedPatchDigest = workspaceDigest(revisedFiles);
  const finalAgents = await analyzeRound(revisedFiles, requirement, rollback, evidence);
  const unresolved = new Set(finalAgents.flatMap((agent) => agent.findings.map((issue) => challengeKey(agent.id, issue))));
  const resolvedChallenges = firstChallenges.map((challenge) => ({ ...challenge, resolved: !unresolved.has(challenge.id) }));
  const finalVerdict = verdictFor(finalAgents);
  const unresolvedCritical = finalAgents.some((agent) => agent.status === "blocked");
  const builder = {
    id: "builder",
    name: "Builder",
    responsibility: "Revises the digest-addressed artifact in response to isolated challenges and resubmits it.",
    status: unresolvedCritical ? "blocked" : revision.actions.length || firstChallenges.length ? "passed" : "passed",
    summary: revision.actions.length
      ? revision.actions.length + " challenge-driven revision" + (revision.actions.length === 1 ? "" : "s") + " applied."
      : firstChallenges.length ? "No safe automatic revision could resolve the remaining challenges." : "No revision was required.",
    findings: [],
    engine: "tool",
    toolRuns: [{
      tool: "builder:" + revision.isolation.engine,
      status: unresolvedCritical ? "failed" : "passed",
      durationMs: Math.max(1, initialBuilder.wallTimeMs + revision.wallTimeMs),
      outputDigest: digest({ initialPatchDigest, revisedPatchDigest, actions: revision.actions, isolation: revision.isolation, model: proposal?.model, provider: proposal?.provider }),
      summary: "Builder executed in isolation and produced artifact " + revisedPatchDigest.slice(0, 12) + ".",
      isolation: revision.isolation,
    }],
    actions: revision.actions,
    strategy: proposal?.files ? "general-autonomous" : "deterministic-safe-repair",
    model: proposal?.model,
    provider: proposal?.provider,
    proposalError: proposalError || undefined,
  };
  const agents = [builder, ...finalAgents];
  const blocked = agents.filter((item) => item.status === "blocked").length;
  const warnings = agents.filter((item) => item.status === "warning").length;
  return {
    initialPatchDigest,
    patchDigest: revisedPatchDigest,
    revisedFiles,
    builderActions: revision.actions,
    agents,
    rounds: [
      {
        round: 1,
        patchDigest: initialPatchDigest,
        phase: "challenge",
        challenges: firstChallenges,
        builderResponse: firstChallenges.length + " isolated challenge" + (firstChallenges.length === 1 ? "" : "s") + " received.",
        verdict: verdictFor(firstAgents),
      },
      {
        round: 2,
        patchDigest: revisedPatchDigest,
        phase: "revision",
        challenges: resolvedChallenges,
        builderResponse: revision.actions.length ? revision.actions.map((item) => item.action).join(" ") : "No safe automatic code edit was available.",
        verdict: finalVerdict,
      },
      {
        round: 3,
        patchDigest: revisedPatchDigest,
        phase: "consensus",
        challenges: resolvedChallenges,
        builderResponse: unresolved.size ? unresolved.size + " challenge" + (unresolved.size === 1 ? "" : "s") + " remain unresolved." : "Every challenge was re-executed and resolved.",
        verdict: finalVerdict,
      },
    ],
    verdict: finalVerdict,
    score: clamp(100 - blocked * 20 - warnings * 6),
    consensus: clamp((agents.filter((item) => item.status === "passed").length / agents.length) * 100),
    executedTools: agents.flatMap((item) => item.toolRuns.map((run) => run.tool)),
    isolation: {
      requiredInProduction: "docker",
      roleCount: agents.length,
      independentProcesses: agents.length,
    },
  };
}
module.exports = { runIsolatedReviewBoard };
