import { getApiBaseUrl, getMissingApiMessage } from "./runtime-config";

export type OAuthProvider = "github" | "google";

function isLocalBrowser() {
  if (typeof window === "undefined") return false;
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

export function getOAuthUrl(provider: OAuthProvider) {
  if (typeof window !== "undefined" && !isLocalBrowser()) {
    return `/api/auth/${provider}`;
  }

  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    const params = new URLSearchParams({
      oauth_error: getMissingApiMessage(),
    });

    return `/login?${params.toString()}`;
  }

  return `${apiBaseUrl}/api/auth/${provider}`;
}
