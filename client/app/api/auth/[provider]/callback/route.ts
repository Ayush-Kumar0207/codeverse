import { NextRequest, NextResponse } from "next/server";

const DEFAULT_API_BASE_URL = "https://codeverse-5422.onrender.com";
const DEFAULT_CLIENT_BASE_URL = "https://codeverse-rho.vercel.app";
const SUPPORTED_PROVIDERS = new Set(["github", "google"]);

function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.API_BASE_URL ||
    DEFAULT_API_BASE_URL
  ).replace(/\/$/, "");
}

function getClientBaseUrl(request: NextRequest) {
  if (request.nextUrl.hostname === "localhost" || request.nextUrl.hostname === "127.0.0.1") {
    return request.nextUrl.origin;
  }

  return (
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    process.env.CLIENT_URL ||
    DEFAULT_CLIENT_BASE_URL
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
  const clientBaseUrl = getClientBaseUrl(request);
  const backendCallbackUrl = new URL(`/api/auth/${provider}/callback`, getApiBaseUrl());
  backendCallbackUrl.search = requestUrl.search;
  backendCallbackUrl.searchParams.set(
    "redirect_uri",
    new URL(`/api/auth/${provider}/callback`, clientBaseUrl).toString()
  );
  backendCallbackUrl.searchParams.set("client_url", clientBaseUrl);

  return NextResponse.redirect(backendCallbackUrl, 307);
}
