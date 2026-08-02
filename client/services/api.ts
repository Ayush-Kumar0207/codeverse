import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { getApiBaseUrl } from "./runtime-config";

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "X-CodeVerse-Client": "web-v1",
  },
});

type EvidenceRequestConfig = InternalAxiosRequestConfig & { evidenceStartedAt?: number };

function evidenceUrl(config: { url?: string }) {
  const value = config.url || "";
  return value.startsWith("http") ? new URL(value).pathname : value.split("?")[0];
}

apiClient.interceptors.request.use((config) => {
  (config as EvidenceRequestConfig).evidenceStartedAt = performance.now();
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const url = evidenceUrl(response.config);
    if (typeof window !== "undefined" && !url.includes("/api/evidence/")) {
      const startedAt = (response.config as EvidenceRequestConfig).evidenceStartedAt || performance.now();
      window.dispatchEvent(new CustomEvent("codeverse:evidence", {
        detail: {
          type: "network.request",
          summary: String(response.config.method || "get").toUpperCase() + " " + url + " returned " + response.status + ".",
          source: "network-recorder",
          payload: {
            method: String(response.config.method || "get").toUpperCase(),
            url,
            status: response.status,
            durationMs: Math.max(0, Math.round(performance.now() - startedAt)),
          },
        },
      }));
    }
    return response;
  },
  (error) => {
    const config = (error?.config || {}) as EvidenceRequestConfig;
    const url = evidenceUrl(config);
    if (typeof window !== "undefined" && url && !url.includes("/api/evidence/")) {
      window.dispatchEvent(new CustomEvent("codeverse:evidence", {
        detail: {
          type: "network.request",
          summary: String(config.method || "get").toUpperCase() + " " + url + " failed.",
          source: "network-recorder",
          payload: {
            method: String(config.method || "get").toUpperCase(),
            url,
            status: Number(error?.response?.status || 0),
            durationMs: Math.max(0, Math.round(performance.now() - (config.evidenceStartedAt || performance.now()))),
            failed: true,
          },
        },
      }));
    }
    return Promise.reject(error);
  }
);

export default apiClient;
