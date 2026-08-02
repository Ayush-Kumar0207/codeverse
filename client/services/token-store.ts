const TOKEN_KEY = "codeverse.oauth_token";

/**
 * Persist a JWT token obtained from the OAuth flow.
 * This token is sent as a Bearer header by the API client
 * to work around third-party cookie restrictions.
 */
export function setOAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Storage may be unavailable (private browsing, quota exceeded, etc.)
  }
}

/** Read the persisted OAuth token, if any. */
export function getOAuthToken(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

/** Remove the persisted OAuth token (e.g. on logout). */
export function clearOAuthToken(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignore — if we can't clear, the token will expire on its own.
  }
}
