const { supabase } = require("../config/db");
const HttpError = require("../utils/httpError");
const localCodeStore = require("./localCodeStore.service");

function isSupabaseUnavailable(error) {
  const message = `${error?.message || ""} ${error?.cause?.message || ""}`;
  return (
    !supabase ||
    /fetch failed|getaddrinfo|ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ETIMEDOUT|timed out|timeout|network/i.test(message)
  );
}

function canUseLocalCodeStore() {
  return process.env.NODE_ENV !== "production";
}

function cloudVersionError() {
  return new HttpError(
    503,
    "Cloud version storage is temporarily unavailable. Your workspace remains safe on this device; retry the cloud save later."
  );
}

function shouldUseDevelopmentStore(error) {
  return (
    canUseLocalCodeStore() &&
    (isSupabaseUnavailable(error) ||
      error?.code === "22P02" ||
      error?.code === "23503" ||
      /invalid input syntax|foreign key/i.test(error?.message || ""))
  );
}

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeVersion(version) {
  return {
    _id: version._id || version.id,
    userId: version.userId || version.user_id,
    fileName: version.fileName || version.file_name,
    code: version.code || "",
    language: version.language,
    createdAt: version.createdAt || version.created_at,
  };
}

async function saveCodeVersion({ code, userId, fileName }) {
  const payload = {
    code: typeof code === "string" ? code : "",
    userId: cleanText(userId),
    fileName: cleanText(fileName),
  };

  if (!payload.code || !payload.userId || !payload.fileName) {
    throw new HttpError(400, "Missing code, fileName or authenticated user");
  }

  const saveLocalVersion = async () => {
    await localCodeStore.saveVersion(payload);
    return { message: "Code version saved on this development device" };
  };

  if (!supabase) {
    if (canUseLocalCodeStore()) return saveLocalVersion();
    throw cloudVersionError();
  }

  try {
    const { error } = await supabase
      .from("versions")
      .insert([{ user_id: payload.userId, file_name: payload.fileName, code: payload.code }])
      .select()
      .single();

    if (error) throw error;
    return { message: "Code version saved successfully" };
  } catch (error) {
    if (shouldUseDevelopmentStore(error)) return saveLocalVersion();
    if (isSupabaseUnavailable(error)) throw cloudVersionError();
    throw error;
  }
}

async function getCodeVersions({ userId, fileName }) {
  const params = {
    userId: cleanText(userId),
    fileName: cleanText(fileName),
  };

  if (!params.userId || !params.fileName) {
    throw new HttpError(400, "Missing authenticated user or fileName");
  }

  const getLocalVersions = async () => {
    const versions = await localCodeStore.findVersions(params);
    return { versions: versions.map(normalizeVersion) };
  };

  if (!supabase) {
    if (canUseLocalCodeStore()) return getLocalVersions();
    throw cloudVersionError();
  }

  try {
    const { data: versions, error } = await supabase
      .from("versions")
      .select("*")
      .eq("user_id", params.userId)
      .eq("file_name", params.fileName)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) throw error;
    return { versions: (versions || []).map(normalizeVersion) };
  } catch (error) {
    if (shouldUseDevelopmentStore(error)) return getLocalVersions();
    if (isSupabaseUnavailable(error)) throw cloudVersionError();
    throw error;
  }
}

async function getSavedCodes(userId) {
  const cleanUserId = cleanText(userId);
  if (!cleanUserId) throw new HttpError(400, "Missing authenticated user");

  const getLocalCodes = async () => {
    const codes = await localCodeStore.findByUser(cleanUserId);
    return { codes: codes.map(normalizeVersion) };
  };

  if (!supabase) {
    if (canUseLocalCodeStore()) return getLocalCodes();
    throw cloudVersionError();
  }

  try {
    const { data: codes, error } = await supabase
      .from("versions")
      .select("*")
      .eq("user_id", cleanUserId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { codes: (codes || []).map(normalizeVersion) };
  } catch (error) {
    if (shouldUseDevelopmentStore(error)) return getLocalCodes();
    if (isSupabaseUnavailable(error)) throw cloudVersionError();
    throw error;
  }
}

async function saveLegacyVersion({ userId, fileName, code }) {
  return saveCodeVersion({ userId, fileName, code });
}

async function getLegacyVersions(userId, fileName) {
  return getCodeVersions({ userId, fileName });
}

module.exports = {
  canUseLocalCodeStore,
  getCodeVersions,
  getLegacyVersions,
  getSavedCodes,
  saveCodeVersion,
  saveLegacyVersion,
};
