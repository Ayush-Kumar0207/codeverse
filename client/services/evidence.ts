import type {
  ArenaLeaderboardEntry,
  ArenaScenario,
  ArenaScenarioTemplateInput,
  ArenaSession,
  ChangeEvidencePackage,
  EngineeringDigitalTwin,
  EngineeringEvent,
  EvidenceOSSnapshot,
  ReviewBoardRun,
  UnderstandingChallenge,
  UnderstandingVerification,
} from "@shared/types/evidence";
import type { EvidenceEventInput } from "@/lib/evidence-local";
import apiClient from "./api";

export async function fetchEvidenceSnapshot(projectId: string) {
  const { data } = await apiClient.get<EvidenceOSSnapshot>("/api/evidence/" + encodeURIComponent(projectId));
  return data;
}

export async function postEvidenceEvent(
  projectId: string,
  payload: EvidenceEventInput & { sessionId: string }
) {
  const { data } = await apiClient.post<{ event: EvidenceOSSnapshot["events"][number] }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/events",
    payload
  );
  return data.event;
}

export async function postEvidencePackage(
  projectId: string,
  payload: {
    title: string;
    requirement: string;
    rationale: string;
    rollback: string;
    files: Record<string, string>;
    sessionId?: string;
    baseDigest?: string;
    apiCompatibility?: "passed" | "failed";
    requireRollbackDrill?: boolean;
  }
) {
  const { data } = await apiClient.post<{ package: ChangeEvidencePackage }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/packages",
    payload
  );
  return data.package;
}

export async function verifyEvidencePackage(projectId: string, packageId: string) {
  const { data } = await apiClient.get<{ verification: { packageId: string; changeDigest: string; signatureVerified: boolean; exactArtifactVerified: boolean; attestationCoverage: number; invalidAttestations: string[]; verified: boolean; verifiedAt: string } }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/packages/" + encodeURIComponent(packageId) + "/verify"
  );
  return data.verification;
}

export async function postReviewBoard(
  projectId: string,
  payload: {
    files: Record<string, string>;
    requirement: string;
    rollback: string;
    sessionId: string;
    rootCause?: string;
    testDigest?: string;
    performanceDeltaPct?: number;
    performanceBudgetPct?: number;
  }
) {
  const { data } = await apiClient.post<{ review: ReviewBoardRun }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/reviews",
    payload
  );
  return data.review;
}

export async function postUnderstandingChallenge(
  projectId: string,
  payload: { fileName: string; code: string; files: Record<string, string> }
) {
  const { data } = await apiClient.post<{ challenge: UnderstandingChallenge }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/challenges",
    payload
  );
  return data.challenge;
}

export async function postUnderstandingVerification(
  projectId: string,
  payload: {
    challengeId: string;
    fileName: string;
    code: string;
    answers: Record<string, string>;
    sessionId: string;
    actor: { name: string; kind: "human" };
    workspaceDigest?: string;
    files: Record<string, string>;
    expiresAt?: string;
    signals?: { elapsedMs?: number; revisionCount?: number; idleResumes?: number; pasteCount?: number; externalFocusChanges?: number };
  }
) {
  const { data } = await apiClient.post<{ verification: UnderstandingVerification }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/verifications",
    payload
  );
  return data.verification;
}

export async function postDigitalTwin(
  projectId: string,
  payload: { files: Record<string, string>; activeFile: string; events?: EngineeringEvent[] }
) {
  const { data } = await apiClient.post<{ twin: EngineeringDigitalTwin }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/twin",
    payload
  );
  return data.twin;
}



export async function executeReplayVerification(projectId: string, sessionId: string, payload: { newSessionId?: string; actor?: { name: string; kind: "human" } } = {}) {
  const { data } = await apiClient.post<{ report: {
    sessionId: string;
    replayDigest: string;
    serverExecuted: boolean;
    verified: boolean;
    manifestVerified: boolean;
    commandVerified: boolean;
    exitCodeVerified: boolean;
    outputVerified: boolean;
    actual: { sourceDigest: string; command: string; exitCode: number; outputDigest: string; engine: string; image?: string | null; durationMs: number; sandbox: Record<string, unknown> };
    verifiedAt: string;
  } }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/replays/" + encodeURIComponent(sessionId) + "/verify",
    payload
  );
  return data.report;
}

export async function fetchEvidenceExport(projectId: string, privacy: "full" | "redacted") {
  const { data } = await apiClient.get<{ report: Record<string, unknown>; digest: string }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/export",
    { params: { privacy } }
  );
  return data;
}

export async function postArenaScenarioTemplate(payload: ArenaScenarioTemplateInput) {
  const { data } = await apiClient.post<{ scenario: ArenaScenario }>("/api/evidence/arena/scenarios", payload);
  return data.scenario;
}

export async function fetchArenaScenarios() {
  const { data } = await apiClient.get<{ scenarios: ArenaScenario[] }>("/api/evidence/arena/scenarios");
  return data.scenarios;
}

export async function fetchArenaSessions(projectId: string) {
  const { data } = await apiClient.get<{ sessions: ArenaSession[] }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/arena/sessions"
  );
  return data.sessions;
}

export async function startArenaSession(
  projectId: string,
  payload: { scenarioId: string; consentRecorded: true; privacyMode: "full" | "redacted"; organizationId?: string; lobby?: boolean }
) {
  const { data } = await apiClient.post<{ session: ArenaSession }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/arena/sessions",
    payload
  );
  return data.session;
}

export async function joinArenaLobbyByCode(projectId: string, lobbyCode: string, name?: string) {
  const { data } = await apiClient.post<{ session: ArenaSession }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/arena/lobbies/join",
    { lobbyCode, name }
  );
  return data.session;
}

export async function matchmakeArenaSession(
  projectId: string,
  payload: { scenarioId: string; privacyMode: "full" | "redacted"; name?: string }
) {
  const { data } = await apiClient.post<{ session: ArenaSession; matched: boolean }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/arena/matchmake",
    payload
  );
  return data;
}

export async function beginArenaLobby(projectId: string, sessionId: string) {
  const { data } = await apiClient.post<{ session: ArenaSession }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/arena/sessions/" + encodeURIComponent(sessionId) + "/begin"
  );
  return data.session;
}

export async function postArenaAction(
  projectId: string,
  sessionId: string,
  payload: { type: EngineeringEvent["type"]; summary: string; evidenceEventId?: string }
) {
  const { data } = await apiClient.post<{ session: ArenaSession }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/arena/sessions/" + encodeURIComponent(sessionId) + "/actions",
    payload
  );
  return data.session;
}

export async function submitArenaSession(
  projectId: string,
  sessionId: string,
  payload: { files: Record<string, string>; reviewerNotes?: string[] }
) {
  const { data } = await apiClient.post<{ session: ArenaSession }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/arena/sessions/" + encodeURIComponent(sessionId) + "/submit",
    payload
  );
  return data.session;
}

export async function verifyArenaSignedReport(projectId: string, sessionId: string) {
  const { data } = await apiClient.get<{ verification: { sessionId: string; reportDigest: string; digestVerified: boolean; signatureVerified: boolean; verified: boolean; verifiedAt: string } }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/arena/sessions/" + encodeURIComponent(sessionId) + "/report/verify"
  );
  return data.verification;
}

export async function fetchArenaLeaderboard(scenarioId?: string) {
  const { data } = await apiClient.get<{ leaderboard: ArenaLeaderboardEntry[] }>(
    "/api/evidence/arena/leaderboard",
    { params: scenarioId ? { scenarioId } : undefined }
  );
  return data.leaderboard;
}