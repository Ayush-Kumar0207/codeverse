const { deployProject } = require("../services/deployment.service");
const Project = require("../config/db").Project; // Or appropriate project model

async function handleDeploy(req, res) {
  const { projectId, files } = req.body;

  if (!projectId || !files) {
    return res.status(400).json({ error: "Missing projectId or files" });
  }

  try {
    console.log(`🚀 Initiating Aegis Deployment for ${projectId}...`);
    const result = await deployProject(projectId, files);
    
    res.status(200).json({
      message: "✅ Deployment successful!",
      url: result.url,
      timestamp: result.timestamp
    });
  } catch (err) {
    console.error("Deployment failed:", err);
    res.status(500).json({ error: "Deployment orchestration failed." });
  }
}

module.exports = {
  handleDeploy
};
