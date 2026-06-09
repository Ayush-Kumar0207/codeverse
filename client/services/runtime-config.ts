const LOCAL_API_BASE_URL = "http://localhost:5000";

function normalizeUrl(value?: string) {
  return (value || "").trim().replace(/\/$/, "");
}

function getHostname(value: string) {
  try {
    return new URL(value).hostname;
  } catch {
    return "";
  }
}

function isLocalHostname(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

function isLocalUrl(value: string) {
  return isLocalHostname(getHostname(value));
}

function isBrowserLocalhost() {
  if (typeof window === "undefined") return false;
  return isLocalHostname(window.location.hostname);
}

export function getApiBaseUrl() {
  const configuredUrl = normalizeUrl(process.env.NEXT_PUBLIC_API_BASE_URL);

  if (typeof window === "undefined") {
    return configuredUrl || LOCAL_API_BASE_URL;
  }

  if (isBrowserLocalhost()) {
    return configuredUrl || LOCAL_API_BASE_URL;
  }

  if (configuredUrl && !isLocalUrl(configuredUrl)) {
    return configuredUrl;
  }

  return "";
}

export function getMissingApiMessage() {
  return "OAuth sign-in is not configured for this deployment. Set NEXT_PUBLIC_API_BASE_URL to your deployed backend URL.";
}
