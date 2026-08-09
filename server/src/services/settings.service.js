const { supabase } = require("../config/db");
const HttpError = require("../utils/httpError");

const SUPABASE_TIMEOUT_MS = Number(process.env.SUPABASE_TIMEOUT_MS || 2500);
const SUPABASE_RETRY_COUNT = Number(process.env.SUPABASE_RETRY_COUNT || 2);
const RETRYABLE_MESSAGE = /fetch failed|getaddrinfo|ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ETIMEDOUT|timed out|timeout|network/i;
const FRIENDLY_UNAVAILABLE_MESSAGE =
  "Cloud settings are temporarily unavailable. Your settings remain safe on this device and sync will retry automatically.";

function delay(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function isRetryable(error) {
  const status = Number(error?.status || error?.statusCode || 0);
  const message = `${error?.message || ""} ${error?.cause?.message || ""}`;
  return !status || status === 408 || status === 429 || status >= 500 || RETRYABLE_MESSAGE.test(message);
}

async function withTimeout(promise, label) {
  let timeout;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error(`${label} timed out after ${SUPABASE_TIMEOUT_MS}ms`)),
          SUPABASE_TIMEOUT_MS
        );
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

async function executeCloud(label, operation) {
  if (!supabase) throw new HttpError(503, FRIENDLY_UNAVAILABLE_MESSAGE);

  let lastError;
  for (let attempt = 0; attempt <= SUPABASE_RETRY_COUNT; attempt += 1) {
    try {
      const result = await withTimeout(operation(), label);
      if (result.error) throw result.error;
      return result.data;
    } catch (error) {
      lastError = error;
      if (!isRetryable(error) || attempt === SUPABASE_RETRY_COUNT) break;
      await delay(150 * 2 ** attempt);
    }
  }

  console.error(`Supabase Error [${label}]:`, lastError?.message || lastError);
  throw new HttpError(503, FRIENDLY_UNAVAILABLE_MESSAGE);
}

async function insertSnapshot(userId, config) {
  const data = await executeCloud("insertSnapshot", () =>
    supabase
      .from("setting_snapshots")
      .insert([{ user_id: userId, config }])
      .select()
      .single()
  );

  void pruneSnapshots(userId);
  return data;
}

async function pruneSnapshots(userId) {
  try {
    const snapshots = await executeCloud("pruneSnapshots.list", () =>
      supabase
        .from("setting_snapshots")
        .select("id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
    );

    if (snapshots.length > 20) {
      const idsToDelete = snapshots.slice(20).map((snapshot) => snapshot.id);
      await executeCloud("pruneSnapshots.delete", () =>
        supabase.from("setting_snapshots").delete().in("id", idsToDelete)
      );
    }
  } catch (error) {
    console.error("Snapshot pruning will retry during a future sync:", error.message);
  }
}

async function getLatestSnapshot(userId) {
  return executeCloud("getLatestSnapshot", () =>
    supabase
      .from("setting_snapshots")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
  );
}

async function getHistory(userId) {
  return executeCloud("getHistory", () =>
    supabase
      .from("setting_snapshots")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
  );
}

module.exports = {
  FRIENDLY_UNAVAILABLE_MESSAGE,
  insertSnapshot,
  getLatestSnapshot,
  getHistory,
};
