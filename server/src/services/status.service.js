const { supabase } = require("../config/db");

const STATUS_TIMEOUT_MS = Number(process.env.STATUS_PROBE_TIMEOUT_MS || 2000);

async function withTimeout(promise, timeoutMs = STATUS_TIMEOUT_MS) {
  let timeout;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error(`Probe timed out after ${timeoutMs}ms`)), timeoutMs);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

async function databaseStatus() {
  if (!supabase) {
    return { status: "degraded", ready: false, detail: "Cloud database is not configured" };
  }
  const startedAt = Date.now();
  try {
    const result = await withTimeout(supabase.from("users").select("id", { head: true, count: "exact" }).limit(1));
    if (result.error) throw result.error;
    return { status: "operational", ready: true, latencyMs: Date.now() - startedAt, detail: "Supabase reachable" };
  } catch (error) {
    return {
      status: "outage",
      ready: false,
      latencyMs: Date.now() - startedAt,
      detail: /timed out/i.test(error?.message || "") ? "Database probe timed out" : "Database probe failed",
    };
  }
}

async function collaborationStatus(infrastructure) {
  if (!infrastructure?.store) {
    return { status: "degraded", ready: false, mode: "unavailable", detail: "Realtime core is starting" };
  }
  try {
    const health = await withTimeout(infrastructure.store.health());
    const distributed = infrastructure.mode === "redis";
    return {
      status: health.ready && distributed ? "operational" : "degraded",
      ready: Boolean(health.ready),
      distributed,
      mode: infrastructure.mode,
      latencyMs: health.latencyMs,
      detail: infrastructure.degradedReason || health.detail,
      instanceId: infrastructure.instanceId,
    };
  } catch {
    return { status: "outage", ready: false, distributed: false, mode: infrastructure.mode, detail: "Realtime state probe failed" };
  }
}

async function buildPublicStatus(infrastructure) {
  const [database, collaboration] = await Promise.all([
    databaseStatus(),
    collaborationStatus(infrastructure),
  ]);
  const memory = process.memoryUsage();
  const api = {
    status: "operational",
    ready: true,
    uptimeSeconds: Math.round(process.uptime()),
    memoryRssMb: Math.round(memory.rss / 1024 / 1024),
    release: process.env.RENDER_GIT_COMMIT || process.env.GIT_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || "local",
  };
  const components = { api, database, collaboration };
  const componentStates = Object.values(components).map((component) => component.status);
  const status = componentStates.includes("outage")
    ? "partial-outage"
    : componentStates.includes("degraded")
      ? "degraded"
      : "operational";

  return {
    status,
    checkedAt: new Date().toISOString(),
    components,
    realtime: infrastructure?.metrics?.snapshot?.() || null,
    slo: {
      availabilityTarget: 99.9,
      collaborationP95TargetMs: 150,
      reconnectSuccessTarget: 99,
    },
  };
}

module.exports = {
  buildPublicStatus,
  collaborationStatus,
  databaseStatus,
};
