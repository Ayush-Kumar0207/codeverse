const { deployProject } = require("../services/deployment.service");
const { getDeploymentTunnelUrl } = require("../services/deploymentTunnel.service");

function trimTrailingSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

function getBridgeBaseUrl(req) {
  if (process.env.DEPLOY_BRIDGE_BASE_URL) {
    return trimTrailingSlash(process.env.DEPLOY_BRIDGE_BASE_URL);
  }

  const deployPort = process.env.DEPLOY_PORT || 5001;
  return `${req.protocol}://${req.hostname}:${deployPort}`;
}

function projectUrl(baseUrl, projectId) {
  return `${trimTrailingSlash(baseUrl)}/${encodeURIComponent(projectId)}/`;
}

async function handleDeploy(req, res) {
  const { projectId, files } = req.body;

  if (!projectId || !files) {
    return res.status(400).json({ error: "Missing projectId or files" });
  }

  try {
    console.log(`Initiating deployment for ${projectId}...`);
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const result = await deployProject(projectId, files, { baseUrl });
    const tunnelUrl = getDeploymentTunnelUrl();
    const bridgeUrl = projectUrl(getBridgeBaseUrl(req), result.projectId);
    const publicUrl = tunnelUrl ? projectUrl(tunnelUrl, result.projectId) : "";
    
    res.status(200).json({
      message: "Deployment successful.",
      url: result.url,
      bridgeUrl,
      publicUrl,
      tunnelActive: Boolean(publicUrl),
      files: result.files,
      timestamp: result.timestamp,
    });
  } catch (err) {
    console.error("Deployment failed:", err);
    res.status(500).json({ error: err.message || "Deployment orchestration failed." });
  }
}

module.exports = {
  handleDeploy
};
