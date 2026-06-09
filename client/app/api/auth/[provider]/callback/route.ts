import { NextRequest, NextResponse } from "next/server";

const DEFAULT_API_BASE_URL = "https://codeverse-5422.onrender.com";
const SUPPORTED_PROVIDERS = new Set(["github", "google"]);

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    DEFAULT_API_BASE_URL
  ).replace(/\/$/, "");
}

type RouteContext = {
  params: Promise<{ provider: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { provider } = await context.params;

  if (!SUPPORTED_PROVIDERS.has(provider)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("oauth_error", "Unsupported OAuth provider.");
    return NextResponse.redirect(loginUrl);
  }

  const requestUrl = new URL(request.url);
  const backendCallbackUrl = new URL(`/api/auth/${provider}/callback`, getApiBaseUrl());
  backendCallbackUrl.search = requestUrl.search;

  return NextResponse.redirect(backendCallbackUrl, 307);
}
