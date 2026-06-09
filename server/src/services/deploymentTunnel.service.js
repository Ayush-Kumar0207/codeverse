const localtunnel = require("localtunnel");

let activeTunnel = null;
let activeTunnelUrl = "";

function isEnabledValue(value) {
  return ["1", "true", "yes", "on"].includes(String(value || "").trim().toLowerCase());
}

function isDeploymentTunnelEnabled() {
  return isEnabledValue(process.env.DEPLOY_TUNNEL_ENABLED);
}

function normalizeBaseUrl(value) {
  return String(value || "").replace(/\/+$/, "");
}

function cleanSubdomain(value) {
  const clean = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63);

  return clean || undefined;
}

async function startDeploymentTunnel({ port, subdomain, host, localHost } = {}) {
  if (!isDeploymentTunnelEnabled()) return null;
  if (activeTunnel) return activeTunnel;

  const options = {
    port: Number(port) || Number(process.env.DEPLOY_PORT) || 5001,
  };

  const cleanName = cleanSubdomain(subdomain || process.env.DEPLOY_TUNNEL_SUBDOMAIN);
  if (cleanName) options.subdomain = cleanName;
  if (host || process.env.DEPLOY_TUNNEL_HOST) {
    options.host = host || process.env.DEPLOY_TUNNEL_HOST;
  }
  if (localHost || process.env.DEPLOY_TUNNEL_LOCAL_HOST) {
    options.local_host = localHost || process.env.DEPLOY_TUNNEL_LOCAL_HOST;
  }

  activeTunnel = await localtunnel(options);
  activeTunnelUrl = normalizeBaseUrl(activeTunnel.url);

  activeTunnel.on("close", () => {
    console.warn("🌐 Deployment tunnel closed.");
    activeTunnel = null;
    activeTunnelUrl = "";
  });

  activeTunnel.on("error", (error) => {
    console.error("🌐 Deployment tunnel error:", error.message || error);
  });

  return activeTunnel;
}

function getDeploymentTunnelUrl() {
  return activeTunnelUrl;
}

module.exports = {
  getDeploymentTunnelUrl,
  isDeploymentTunnelEnabled,
  startDeploymentTunnel,
};
