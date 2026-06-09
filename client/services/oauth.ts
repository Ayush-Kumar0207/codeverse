export type OAuthProvider = "github" | "google";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");

export function getOAuthUrl(provider: OAuthProvider) {
  return `${API_BASE_URL}/api/auth/${provider}`;
}
