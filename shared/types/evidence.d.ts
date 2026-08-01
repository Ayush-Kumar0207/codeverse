export type EvidenceActorKind = "human" | "ai" | "system";

export type EngineeringEventType =
  | "session.started"
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
  | "deployment.failed";

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

export type EvidenceCheckStatus = "passed" | "warning" | "missing";

export interface EvidenceCheck {
  id: string;
  label: string;
  status: EvidenceCheckStatus;
  detail: string;
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
}

export interface ReviewBoardRun {
  id: string;
  projectId: string;
  requirement: string;
  verdict: "approved" | "changes-requested" | "blocked";
  score: number;
  agents: ReviewAgentResult[];
  createdAt: string;
}

export interface UnderstandingQuestion {
  id: string;
  prompt: string;
  focus: "purpose" | "invariant" | "failure" | "security" | "prediction";
  expectedConcepts: string[];
}

export interface UnderstandingChallenge {
  id: string;
  projectId: string;
  fileName: string;
  questions: UnderstandingQuestion[];
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
}

export interface EvidenceGraphNode {
  id: string;
  kind: "requirement" | "decision" | "change" | "test" | "runtime" | "security" | "review" | "deployment";
  label: string;
  status: "passed" | "warning" | "failed" | "neutral";
  eventId?: string;
}

export interface EvidenceGraphEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
}

export interface DigitalTwinNode {
  id: string;
  kind: "frontend" | "service" | "api" | "data" | "test" | "config" | "module";
  label: string;
  fileName?: string;
}

export interface DigitalTwinEdge {
  id: string;
  source: string;
  target: string;
  relation: "imports" | "calls" | "tests" | "renders" | "configures";
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
  };
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
}

