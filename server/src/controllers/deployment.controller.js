const { deployProject } = require("../services/deployment.service");

async function handleDeploy(req, res) {
  const { projectId, files } = req.body;

  if (!projectId || !files) {
    return res.status(400).json({ error: "Missing projectId or files" });
  }

  try {
    console.log(`Initiating deployment for ${projectId}...`);
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const result = await deployProject(projectId, files, { baseUrl });
    
    res.status(200).json({
      message: "Deployment successful.",
      url: result.url,
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
