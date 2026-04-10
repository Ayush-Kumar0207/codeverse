const fs = require('fs').promises;
const path = require('path');
const localtunnel = require('localtunnel');

const DEPLOY_DIR = path.join(__dirname, '../../../deployments');
const tunnels = {}; // Keep track of active tunnels

/**
 * Ensures deployment directory exists
 */
async function ensureDeployDir() {
  try {
    await fs.mkdir(DEPLOY_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

/**
 * Deploys project files to a static environment and exposes them via localtunnel
 */
async function deployProject(projectId, files) {
  await ensureDeployDir();
  
  const projectDeployPath = path.join(DEPLOY_DIR, projectId);
  
  // 1. Clean and create project directory
  try {
    await fs.rm(projectDeployPath, { recursive: true, force: true });
    await fs.mkdir(projectDeployPath, { recursive: true });
  } catch (err) {
    console.error(`Failed to create deployment directory for ${projectId}:`, err);
  }

  // 2. Write files
  for (const [fileName, content] of Object.entries(files)) {
    const filePath = path.join(projectDeployPath, fileName);
    // Ensure parent dir exists for the file
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content);
  }

  // 3. Setup Tunnel (Mocking a real cloud bridge)
  // In a real scenario, this would be a URL from a VPS or Vercel API.
  // Using port 5000 as our dedicated deployment listener
  const port = process.env.DEPLOY_PORT || 5001;

  if (!tunnels[projectId]) {
    try {
      const tunnel = await localtunnel({ 
        port, 
        subdomain: `codeverse-${projectId.toLowerCase().substring(0, 10)}` 
      });
      
      tunnels[projectId] = tunnel.url;
      
      tunnel.on('close', () => {
        delete tunnels[projectId];
      });
    } catch (err) {
      console.error("Tunnel creation failed, falling back to local IP:", err);
      tunnels[projectId] = `http://localhost:${port}/${projectId}`;
    }
  }

  return {
     url: `${tunnels[projectId]}/${projectId}/`,
     path: projectDeployPath,
     timestamp: new Date().toISOString()
  };
}

module.exports = {
  deployProject
};
