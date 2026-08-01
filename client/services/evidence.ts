import type {
  ChangeEvidencePackage,
  EngineeringDigitalTwin,
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
  }
) {
  const { data } = await apiClient.post<{ package: ChangeEvidencePackage }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/packages",
    payload
  );
  return data.package;
}

export async function postReviewBoard(
  projectId: string,
  payload: {
    files: Record<string, string>;
    requirement: string;
    rollback: string;
    sessionId: string;
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
  payload: { fileName: string; code: string }
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
  payload: { files: Record<string, string>; activeFile: string }
) {
  const { data } = await apiClient.post<{ twin: EngineeringDigitalTwin }>(
    "/api/evidence/" + encodeURIComponent(projectId) + "/twin",
    payload
  );
  return data.twin;
}

