export type OAuthProvider = "github" | "google";

export function getOAuthUrl(provider: OAuthProvider) {
  return `/api/auth/${provider}`;
}
