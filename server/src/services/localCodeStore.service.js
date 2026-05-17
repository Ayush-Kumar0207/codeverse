const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const DATA_DIR = path.join(__dirname, "../../.data");
const VERSIONS_FILE = path.join(DATA_DIR, "versions.json");

async function readVersions() {
  try {
    const raw = await fs.readFile(VERSIONS_FILE, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeVersions(versions) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(VERSIONS_FILE, `${JSON.stringify(versions, null, 2)}\n`, "utf8");
}

async function saveVersion({ code, userId, fileName }) {
  const versions = await readVersions();
  const version = {
    _id: randomUUID(),
    userId,
    fileName,
    code,
    createdAt: new Date().toISOString(),
  };

  versions.unshift(version);
  await writeVersions(versions);

  return version;
}

async function findVersions({ userId, fileName }) {
  const versions = await readVersions();
  return versions
    .filter((version) => version.userId === userId && version.fileName === fileName)
    .slice(0, 10);
}

async function findByUser(userId) {
  const versions = await readVersions();
  return versions.filter((version) => version.userId === userId);
}

module.exports = {
  findByUser,
  findVersions,
  saveVersion,
};
