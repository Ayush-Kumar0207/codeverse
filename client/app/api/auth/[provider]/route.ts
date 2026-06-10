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

  const clientBaseUrl = getClientBaseUrl(request);
  const callbackUrl = new URL(`/api/auth/${provider}/callback`, clientBaseUrl).toString();
  const backendStartUrl = new URL(`/api/auth/${provider}`, getApiBaseUrl());
  backendStartUrl.searchParams.set("client_url", clientBaseUrl);
  backendStartUrl.searchParams.set("callback_url", callbackUrl);

  try {
    const response = await fetch(backendStartUrl, {
      redirect: "manual",
      headers: {
        "x-client-base-url": clientBaseUrl,
        "x-oauth-callback-url": callbackUrl,
      },
    });

    const location = response.headers.get("location");
    if (location) return NextResponse.redirect(location);

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("oauth_error", `${provider} sign-in did not return an OAuth redirect.`);
    return NextResponse.redirect(loginUrl);
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("oauth_error", `${provider} sign-in is temporarily unavailable.`);
    return NextResponse.redirect(loginUrl);
  }
}
