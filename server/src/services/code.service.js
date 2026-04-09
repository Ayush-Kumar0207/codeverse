const Version = require("../../models/Version");
const HttpError = require("../utils/httpError");

async function saveCodeVersion({ code, userId, fileName }) {
  if (!code || !userId || !fileName) {
    throw new HttpError(400, "Missing code, fileName or userId");
  }

  const version = new Version({ userId, fileName, code });
  await version.save();
  return { message: "Code version saved successfully" };
}

async function getCodeVersions({ userId, fileName }) {
  if (!userId || !fileName) {
    throw new HttpError(400, "Missing userId or fileName");
  }

  const versions = await Version.find({ userId, fileName }).sort({ createdAt: -1 }).limit(10);
  return { versions };
}

async function getSavedCodes(userId) {
  const codes = await Version.find({ userId }).sort({ createdAt: -1 });
  return { codes };
}

async function saveLegacyVersion({ userId, fileName, code }) {
  return saveCodeVersion({ userId, fileName, code });
}

async function getLegacyVersions(userId, fileName) {
  return getCodeVersions({ userId, fileName });
}

module.exports = {
  saveCodeVersion,
  getCodeVersions,
  getSavedCodes,
  saveLegacyVersion,
  getLegacyVersions,
};

