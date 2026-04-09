const { supabase } = require("../../config/db");
const HttpError = require("../utils/httpError");

async function saveCodeVersion({ code, userId, fileName }) {
  if (!code || !userId || !fileName) {
    throw new HttpError(400, "Missing code, fileName or userId");
  }

  const { data, error } = await supabase
    .from("versions")
    .insert([{ user_id: userId, file_name: fileName, code }])
    .select()
    .single();

  if (error) throw error;
  return { message: "Code version saved successfully" };
}

async function getCodeVersions({ userId, fileName }) {
  if (!userId || !fileName) {
    throw new HttpError(400, "Missing userId or fileName");
  }

  const { data: versions, error } = await supabase
    .from("versions")
    .select("*")
    .eq("user_id", userId)
    .eq("file_name", fileName)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) throw error;
  return { versions };
}

async function getSavedCodes(userId) {
  const { data: codes, error } = await supabase
    .from("versions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
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

