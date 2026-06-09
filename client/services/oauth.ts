import { getApiBaseUrl, getMissingApiMessage } from "./runtime-config";

export type OAuthProvider = "github" | "google";

export function getOAuthUrl(provider: OAuthProvider) {
  const apiBaseUrl = getApiBaseUrl();

  if (!apiBaseUrl) {
    const params = new URLSearchParams({
      oauth_error: getMissingApiMessage(),
    });

    return `/login?${params.toString()}`;
  }

  return `${apiBaseUrl}/api/auth/${provider}`;
}
