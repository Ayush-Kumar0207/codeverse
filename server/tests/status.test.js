const test = require("node:test");
const assert = require("node:assert/strict");
const { buildPublicStatus, collaborationStatus } = require("../src/services/status.service");
const { RealtimeMetrics, percentile } = require("../src/collaboration/realtimeMetrics");

test("realtime metrics expose stable p50, p95, and p99 percentiles", () => {
  const metrics = new RealtimeMetrics();
  [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].forEach((value) => metrics.recordUpdate(value));
  const snapshot = metrics.snapshot();
  assert.equal(snapshot.latencyMs.p50, 50);
  assert.equal(snapshot.latencyMs.p95, 100);
  assert.equal(snapshot.latencyMs.p99, 100);
  assert.equal(percentile([], 0.95), null);
});

test("public status distinguishes distributed readiness from explicit single-node fallback", async () => {
  const distributed = {
    mode: "redis",
    instanceId: "status-test",
    degradedReason: "",
    store: { health: async () => ({ ready: true, latencyMs: 3, detail: "Redis reachable" }) },
    metrics: new RealtimeMetrics(),
  };
  const collaboration = await collaborationStatus(distributed);
  assert.equal(collaboration.status, "operational");
  assert.equal(collaboration.distributed, true);
  assert.equal(collaboration.latencyMs, 3);

  const publicStatus = await buildPublicStatus(distributed);
  assert.equal(publicStatus.components.api.ready, true);
  assert.equal(publicStatus.components.collaboration.status, "operational");
  assert.equal(publicStatus.slo.collaborationP95TargetMs, 150);

  const fallback = await collaborationStatus({
    mode: "single-node",
    degradedReason: "Redis not configured",
    store: { health: async () => ({ ready: true }) },
  });
  assert.equal(fallback.status, "degraded");
  assert.equal(fallback.distributed, false);
  assert.match(fallback.detail, /Redis/);
});
