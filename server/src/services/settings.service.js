const { supabase } = require("../config/db");

/**
 * Creates a new setting snapshot for the user.
 */
async function insertSnapshot(userId, config) {
  const { data, error } = await supabase
    .from("setting_snapshots")
    .insert([{ user_id: userId, config }])
    .select()
    .single();

  if (error) {
    console.error("Supabase Error [insertSnapshot]:", error.message, error.details);
    throw error;
  }

  // Background prune
  pruneSnapshots(userId);

  return data;
}

/**
 * Keeps only the last 20 snapshots per user to save space.
 */
async function pruneSnapshots(userId) {
  try {
    const { data: snapshots, error } = await supabase
      .from("setting_snapshots")
      .select("id")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase Error [pruneSnapshots]:", error.message);
      return;
    }

    if (snapshots.length > 20) {
      const idsToDelete = snapshots.slice(20).map(s => s.id);
      await supabase
        .from("setting_snapshots")
        .delete()
        .in("id", idsToDelete);
    }
  } catch (err) {
    console.error("Snapshot Pruning failed:", err);
  }
}

/**
 * Retrieves the latest snapshot for retroactive sync.
 */
async function getLatestSnapshot(userId) {
  const { data, error } = await supabase
    .from("setting_snapshots")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Supabase Error [getLatestSnapshot]:", error.message);
    throw error;
  }
  return data;
}

/**
 * Retrieves the snapshot history for the timeline.
 */
async function getHistory(userId) {
  const { data, error } = await supabase
    .from("setting_snapshots")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Error [getHistory]:", error.message);
    throw error;
  }
  return data;
}

module.exports = {
  insertSnapshot,
  getLatestSnapshot,
  getHistory,
};
