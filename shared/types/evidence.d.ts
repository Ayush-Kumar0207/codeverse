export type EvidenceActorKind = "human" | "ai" | "system";

export type EngineeringEventType =
  | "session.started"
  | "session.environment"
  | "cursor.moved"
  | "clipboard.pasted"
  | "chat.message"
  | "code.changed"
  | "file.created"
  | "file.deleted"
  | "ai.prompted"
  | "ai.responded"
  | "command.executed"
  | "test.passed"
  | "test.failed"
  | "runtime.succeeded"
  | "runtime.failed"
  | "debugger.checkpoint"
  | "trace.observed"
  | "network.request"
  | "database.change"
  | "security.finding"
  | "performance.measurement"
  | "snapshot.created"
  | "branch.created"
  | "decision.recorded"
  | "review.completed"
  | "understanding.verified"
  | "deployment.attempted"
  | "deployment.succeeded"
  | "deployment.failed"
  | "artifact.attested"
  | "proof.verified"
  | "replay.executed"
  | "arena.started"
  | "arena.action"
  | "arena.completed";

export interface EvidenceActor {
  id?: string;
  name: string;
  kind: EvidenceActorKind;
}

export interface EngineeringEvent {
  id: string;
  projectId: string;
  sessionId: string;
  sequence: number;
  type: EngineeringEventType;
  actor: EvidenceActor;
  summary: string;
  source: string;
  fileName?: string;
  payload: Record<string, unknown>;
  causedBy?: string;
  occurredAt: string;
  previousHash: string;
  integrityHash: string;
}

export type EvidenceRelation =
  | "implements"
  | "verified-by"
  | "caused-fix"
  | "reviewed-by"
  | "deployed-as"
  | "reads-from"
  | "writes-to"
  | "calls"
  | "traced-by"
  | "derived-from"
  | "attested-by"
  | "explains"
  | "affects";

export interface ReplayEnvironmentManifest {
  runtime: string;
  platform: string;
  architecture: string;
  containerImage?: string;
  lockfileHash?: string;
  sourceDigest: string;
  snapshotComplete: boolean;
  dependencyVersions: Record<string, string>;
  environmentKeys: string[];
  environment: Record<string, string>;
  capturedAt: string;
}

export interface ReplayFrame {
  eventId: string;
  sequence: number;
  occurredAt: string;
  files: Record<string, string>;
  activeFile?: string;
  cursor?: { fileName: string; lineNumber: number; column: number };
  terminal?: { command: string; language?: string; exitCode?: number; outputDigest?: string };
  debugger?: { breakpoints: Array<{ fileName: string; line: number }>; variables: Record<string, unknown> };
  network?: Array<{ method: string; url: string; status?: number; durationMs?: number }>;
  database?: Array<{ operation: string; target: string; mutationDigest?: string }>;
  traces?: Array<{ traceId: string; spanId?: string; service?: string; durationMs?: number }>;
}

export interface EngineeringReplaySession {
  sessionId: string;
  manifest: ReplayEnvironmentManifest;
  frames: ReplayFrame[];
  deterministic: boolean;
  replayDigest: string;
  missingInputs: string[];
  branches: Array<{ eventId: string; sourceEventId: string; createdAt: string }>;
}

export type EvidenceCheckStatus = "passed" | "warning" | "missing";

export interface EvidenceCheck {
  id: string;
  label: string;
  status: EvidenceCheckStatus;
  detail: string;
}

export interface EvidenceAttestation {
  id: string;
  kind: "source" | "test" | "runtime" | "security" | "compatibility" | "performance" | "migration" | "deployment" | "rollback" | "understanding";
  subjectDigest: string;
  evidenceDigest: string;
  status: "verified" | "failed" | "unavailable";
  eventId?: string;
  detail: string;
  createdAt: string;
}

export interface ChangeEvidencePackage {
  id: string;
  projectId: string;
  title: string;
  requirement: string;
  rationale: string;
  rollback: string;
  files: string[];
  checks: EvidenceCheck[];
  score: number;
  status: "ready" | "needs-evidence";
  createdAt: string;
  createdBy: EvidenceActor;
  changeDigest: string;
  baseDigest?: string;
  manifestDigest: string;
  attestations: EvidenceAttestation[];
  signature: string;
  signatureAlgorithm?: "hmac-sha256";
  signatureIssuer?: string;
  signatureKeyId?: string;
  exactArtifactVerified: boolean;
}

export type ReviewSeverity = "info" | "warning" | "critical";

export interface ReviewFinding {
  id: string;
  severity: ReviewSeverity;
  title: string;
  detail: string;
  recommendation: string;
  fileName?: string;
  line?: number;
}

export interface ReviewAgentResult {
  id: "builder" | "reviewer" | "security" | "test" | "performance" | "architecture" | "devils-advocate";
  name: string;
  responsibility: string;
  status: "passed" | "warning" | "blocked";
  summary: string;
  findings: ReviewFinding[];
  engine?: "tool" | "ai" | "hybrid";
  toolRuns?: Array<{ tool: string; status: "passed" | "failed"; durationMs: number; outputDigest: string; summary: string; isolation?: { engine: string; network?: string; filesystem?: string; capabilities?: string } }>;
  actions?: Array<{ findingId: string; fileName: string; action: string }>;
  strategy?: "general-autonomous" | "deterministic-safe-repair";
  model?: string;
  provider?: string;
  proposalError?: string;
}

export interface ReviewBoardRound {
  round: number;
  patchDigest: string;
  phase: "build" | "challenge" | "revision" | "consensus";
  challenges: Array<{ id?: string; from: ReviewAgentResult["id"]; to: ReviewAgentResult["id"]; claim: string; resolved: boolean }>;
  builderResponse: string;
  verdict: "approved" | "changes-requested" | "blocked";
}

export interface ReviewBoardRun {
  id: string;
  executionStatus?: "preview" | "completed";
  projectId: string;
  requirement: string;
  verdict: "approved" | "changes-requested" | "blocked";
  score: number;
  agents: ReviewAgentResult[];
  createdAt: string;
  initialPatchDigest?: string;
  patchDigest: string;
  revisedFiles?: Record<string, string>;
  builderActions?: Array<{ findingId: string; fileName: string; action: string }>;
  rounds: ReviewBoardRound[];
  consensus: number;
  executedTools: string[];
  isolation?: { requiredInProduction: string; roleCount: number; independentProcesses: number };
}

export interface UnderstandingQuestion {
  id: string;
  prompt: string;
  focus: "purpose" | "invariant" | "failure" | "security" | "prediction" | "modification" | "debugging" | "dataflow" | "transfer";
  expectedConcepts: string[];
  task?: { kind: "explain" | "predict" | "patch" | "debug" | "diagram"; fixture?: string; expectedDigest?: string };
}

export interface UnderstandingChallenge {
  id: string;
  projectId: string;
  fileName: string;
  questions: UnderstandingQuestion[];
  codeDigest: string;
  expiresAt: string;
  nonce: string;
}

export interface UnderstandingVerification {
  id: string;
  projectId: string;
  challengeId: string;
  fileName: string;
  score: number;
  passed: boolean;
  feedback: Array<{ questionId: string; score: number; detail: string }>;
  createdAt: string;
  dimensions: { explanation: number; prediction: number; modification: number; debugging: number; dataFlow: number };
  behavioralSignals: { answerSimilarity: number; revisionCount: number; elapsedMs: number; continuity: number; pasteCount: number; externalFocusChanges: number };
  executionEvidence?: {
    emptyBoundary?: { result: string; execution?: Record<string, unknown> };
    nullBoundary?: { result: string; execution?: Record<string, unknown> };
    compiler?: { engine: string; language?: string; diagnostics: number };
    modification?: { compiled: boolean; preservesValid: boolean; handlesInvalid: boolean; probes: Record<string, string> };
  };
  codeDigest: string;
}

export interface EvidenceGraphNode {
  id: string;
  kind: "requirement" | "decision" | "change" | "test" | "runtime" | "security" | "review" | "deployment" | "artifact" | "api" | "data";
  label: string;
  status: "passed" | "warning" | "failed" | "neutral";
  eventId?: string;
}

export interface EvidenceGraphEdge {
  id: string;
  source: string;
  target: string;
  relation: EvidenceRelation;
}

export interface DigitalTwinNode {
  id: string;
  kind: "frontend" | "service" | "api" | "data" | "queue" | "provider" | "test" | "config" | "module" | "deployment" | "migration" | "consumer" | "security-boundary";
  label: string;
  fileName?: string;
  owner?: string;
  runtime?: { calls: number; failures: number; p95Ms: number };
}

export interface DigitalTwinEdge {
  id: string;
  source: string;
  target: string;
  relation: "imports" | "calls" | "tests" | "renders" | "configures" | "reads" | "writes" | "publishes" | "consumes" | "deploys" | "owns" | "traces";
  evidence?: "compiler" | "tree-sitter-ast-grep" | "html-parser" | "sql-parser" | "runtime-trace" | "otel-span" | "coverage-map";
}

export interface EngineeringDigitalTwin {
  nodes: DigitalTwinNode[];
  edges: DigitalTwinEdge[];
  impact: {
    activeFile: string;
    affectedFiles: string[];
    testsToRun: string[];
    risks: string[];
    blastRadius: "low" | "medium" | "high";
    securityBoundaries: string[];
    migrationsRequired: string[];
    apiConsumers: string[];
    confidence: number;
  };
  telemetry: { traces: number; requests: number; databaseMutations: number; deployments: number };
  analysis?: { engine: string; compilerDiagnostics: number; runtimeCorrelations: number; coverageFiles: string[]; symbolFiles: number; languages?: string[]; languageEngines?: Record<string, { language: string; engine: string; nodes: number; diagnostics: number }> };
  generatedAt: string;
}

export type ArenaScenarioKind = "outage" | "memory-leak" | "concurrency" | "dependency-compromise" | "database-recovery" | "malicious-patch" | "api-latency" | "vulnerable-api";

export interface ArenaScenario {
  id: string;
  title: string;
  kind: ArenaScenarioKind;
  difficulty: "intermediate" | "advanced" | "expert";
  briefing: string;
  timeLimitMinutes: number;
  allowedAI: "none" | "limited" | "full-with-disclosure";
  injectedFaults: Array<{ id: string; description: string; hidden: boolean; files: Record<string, string> }>;
  rubric: Array<{ id: string; label: string; weight: number; evidenceTypes: EngineeringEventType[] }>;
  starterFiles: Record<string, string>;
  acceptanceTestCount?: number;
  organizationId?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface ArenaScenarioTemplateInput {
  organizationId: string;
  title: string;
  briefing: string;
  kind: ArenaScenarioKind;
  difficulty: ArenaScenario["difficulty"];
  timeLimitMinutes: number;
  allowedAI: ArenaScenario["allowedAI"];
  starterFiles: Record<string, string>;
  injectedFaults?: ArenaScenario["injectedFaults"];
  rubric?: ArenaScenario["rubric"];
  acceptanceTests: Array<{ id?: string; code: string; timeoutMs?: number; weight?: number; trials?: number }>;
}

export interface ArenaParticipant {
  id: string;
  name: string;
  role: "candidate" | "team-member" | "evaluator";
}

export interface ArenaSession {
  id: string;
  projectId: string;
  scenarioId: string;
  organizationId?: string;
  status: "lobby" | "running" | "submitted" | "graded" | "expired";
  participants: ArenaParticipant[];
  startedAt?: string;
  deadlineAt?: string;
  submittedAt?: string;
  lobbyCode?: string;
  environmentLocked?: boolean;
  workspace?: Record<string, string>;
  allowedAI?: ArenaScenario["allowedAI"];
  policyViolations?: Array<{ id: string; type: string; count?: number; occurredAt: string }>;
  reviewerNotes?: string[];
  consent?: { recorded: boolean; recordedAt: string; privacyMode: "full" | "redacted" };
  actions: Array<{ id: string; type: EngineeringEventType; summary: string; occurredAt: string; evidenceEventId?: string }>;
  score?: ArenaScorecard;
  rubricScores?: Record<string, number>;
  rank?: number;
  weightedScore?: number;
  privacyMode?: "full" | "redacted";
  acceptance?: { passed: number; total: number; score: number; verified: boolean; calibration?: { weighted: boolean; repeatedTrials: number; p95Measured: boolean }; results: Array<{ id: string; passed: boolean; passedTrials: number; trials: number; weight: number; exitCode: number; outputDigest: string; durationMs: number; p95DurationMs: number; engine: string; image?: string | null }> };
  signedReport?: { digest: string; signature: string; signatureAlgorithm?: "hmac-sha256"; signatureIssuer?: string; signatureKeyId?: string; generatedAt: string; consentRecorded: boolean; privacyMode: "full" | "redacted"; report: Record<string, unknown> };
}

export interface ArenaLeaderboardEntry {
  sessionId: string;
  scenarioId: string;
  participant: string;
  score: number;
  elapsedMs: number;
  rank: number;
  integrityVerified: boolean;
}

export interface ArenaScorecard {
  finalCorrectness: number;
  problemSolvingProcess: number;
  debuggingAbility: number;
  testQuality: number;
  codeComprehension: number;
  securityAwareness: number;
  evidenceIntegrity: number;
  aiDependence: "Low" | "Moderate" | "High";
}

export interface EvidenceOSSnapshot {
  projectId: string;
  events: EngineeringEvent[];
  packages: ChangeEvidencePackage[];
  reviews: ReviewBoardRun[];
  verifications: UnderstandingVerification[];
  graph: { nodes: EvidenceGraphNode[]; edges: EvidenceGraphEdge[] };
  scorecard: ArenaScorecard;
  integrity: { verified: boolean; checkedEvents: number; brokenAt?: string };
  replay: EngineeringReplaySession[];
  arenas: ArenaSession[];
}

