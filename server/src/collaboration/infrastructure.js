const crypto = require("crypto");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const { MemoryCollaborationStore, RedisCollaborationStore } = require("./store");
const { RealtimeMetrics } = require("./realtimeMetrics");

async function createCollaborationInfrastructure(io, options = {}) {
  const redisUrl = options.redisUrl ?? process.env.REDIS_URL;
  const requireRedis = options.requireRedis ?? process.env.COLLABORATION_REQUIRE_REDIS === "true";
  const instanceId = process.env.INSTANCE_ID || process.env.RENDER_INSTANCE_ID || crypto.randomUUID();
  const metrics = options.metrics || new RealtimeMetrics();

  if (!redisUrl) {
    if (requireRedis) {
      throw new Error("REDIS_URL is required when COLLABORATION_REQUIRE_REDIS=true");
    }
    return {
      instanceId,
      mode: "single-node",
      store: options.store || new MemoryCollaborationStore(),
      metrics,
      degradedReason: "REDIS_URL is not configured; horizontal collaboration is disabled.",
      async close() {},
    };
  }

  const clientOptions = { url: redisUrl, socket: { reconnectStrategy: (attempt) => Math.min(1000, 50 * 2 ** attempt) } };
  const pubClient = createClient(clientOptions);
  const subClient = pubClient.duplicate();
  const stateClient = pubClient.duplicate();
  const clients = [pubClient, subClient, stateClient];
  clients.forEach((client) => client.on("error", (error) => {
    metrics.recordError();
    console.error("Redis collaboration error:", error.message);
  }));

  try {
    await Promise.all(clients.map((client) => client.connect()));
    io.adapter(createAdapter(pubClient, subClient));
    const store = new RedisCollaborationStore(stateClient, {
      prefix: options.prefix || process.env.COLLABORATION_REDIS_PREFIX || "codeverse:collaboration",
    });
    await store.health();

    return {
      instanceId,
      mode: "redis",
      store,
      metrics,
      degradedReason: "",
      async close() {
        await Promise.allSettled(clients.map((client) => client.isOpen ? client.quit() : Promise.resolve()));
      },
    };
  } catch (error) {
    await Promise.allSettled(clients.map((client) => client.isOpen ? client.quit() : Promise.resolve()));
    if (requireRedis) throw error;
    console.warn("Redis unavailable; collaboration is running in explicit single-node fallback mode:", error.message);
    return {
      instanceId,
      mode: "single-node",
      store: new MemoryCollaborationStore(),
      metrics,
      degradedReason: `Redis unavailable: ${error.message}`,
      async close() {},
    };
  }
}

module.exports = {
  createCollaborationInfrastructure,
};
