const MAX_SAMPLES = 10_000;

function percentile(values, quantile) {
  if (!values.length) return null;
  const ordered = [...values].sort((left, right) => left - right);
  const index = Math.min(ordered.length - 1, Math.max(0, Math.ceil(quantile * ordered.length) - 1));
  return Math.round(ordered[index] * 100) / 100;
}

class RealtimeMetrics {
  constructor() {
    this.startedAt = Date.now();
    this.connectedSockets = 0;
    this.totalConnections = 0;
    this.totalReconnects = 0;
    this.crdtUpdates = 0;
    this.duplicateOperations = 0;
    this.permissionDenials = 0;
    this.errors = 0;
    this.operationLatencies = [];
  }

  connected({ recovered = false } = {}) {
    this.connectedSockets += 1;
    this.totalConnections += 1;
    if (recovered) this.totalReconnects += 1;
  }

  disconnected() {
    this.connectedSockets = Math.max(0, this.connectedSockets - 1);
  }

  recordUpdate(durationMs) {
    this.crdtUpdates += 1;
    if (Number.isFinite(durationMs)) {
      this.operationLatencies.push(Math.max(0, durationMs));
      if (this.operationLatencies.length > MAX_SAMPLES) {
        this.operationLatencies.splice(0, this.operationLatencies.length - MAX_SAMPLES);
      }
    }
  }

  recordDuplicate() {
    this.duplicateOperations += 1;
  }

  recordPermissionDenial() {
    this.permissionDenials += 1;
  }

  recordError() {
    this.errors += 1;
  }

  snapshot() {
    return {
      connectedSockets: this.connectedSockets,
      totalConnections: this.totalConnections,
      totalReconnects: this.totalReconnects,
      crdtUpdates: this.crdtUpdates,
      duplicateOperations: this.duplicateOperations,
      permissionDenials: this.permissionDenials,
      errors: this.errors,
      latencyMs: {
        samples: this.operationLatencies.length,
        p50: percentile(this.operationLatencies, 0.5),
        p95: percentile(this.operationLatencies, 0.95),
        p99: percentile(this.operationLatencies, 0.99),
      },
      observedSince: new Date(this.startedAt).toISOString(),
    };
  }
}

module.exports = {
  RealtimeMetrics,
  percentile,
};
