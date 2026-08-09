const crypto = require("crypto");

const ROOM_TTL_SECONDS = Number(process.env.COLLABORATION_ROOM_TTL_SECONDS || 60 * 60 * 24 * 30);
const PRESENCE_TTL_SECONDS = Number(process.env.COLLABORATION_PRESENCE_TTL_SECONDS || 90);
const OPERATION_TTL_SECONDS = Number(process.env.COLLABORATION_OPERATION_TTL_SECONDS || 60 * 60 * 24);
const LOCK_TTL_MS = Number(process.env.COLLABORATION_LOCK_TTL_MS || 5000);

function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}

function normalizeRoom(roomId, value = {}) {
  const source = value && typeof value === "object" ? value : {};
  return {
    roomId,
    files: source.files && typeof source.files === "object" ? source.files : {},
    activeFile: typeof source.activeFile === "string" ? source.activeFile : "",
    collaboratorsCanEdit: source.collaboratorsCanEdit !== false,
    organizer: source.organizer || null,
    crdtState: typeof source.crdtState === "string" ? source.crdtState : "",
    revision: Number(source.revision || 0),
    updatedAt: source.updatedAt || new Date().toISOString(),
  };
}

class MemoryCollaborationStore {
  constructor() {
    this.mode = "single-node";
    this.rooms = new Map();
    this.presence = new Map();
    this.operations = new Map();
    this.queues = new Map();
  }

  async getRoom(roomId) {
    return clone(this.rooms.get(roomId) || null);
  }

  async ensureRoom(roomId, initial = {}) {
    const existing = await this.getRoom(roomId);
    if (existing) return existing;
    return this.mutateRoom(roomId, (room) => {
      if (room.revision === 0 && Object.keys(room.files).length === 0) {
        Object.assign(room, normalizeRoom(roomId, initial));
      }
      return room;
    });
  }

  async mutateRoom(roomId, mutation) {
    const previous = this.queues.get(roomId) || Promise.resolve();
    let release;
    const current = new Promise((resolve) => { release = resolve; });
    const queued = previous.then(() => current);
    this.queues.set(roomId, queued);
    await previous;

    try {
      const room = normalizeRoom(roomId, this.rooms.get(roomId));
      const changed = (await mutation(room)) || room;
      changed.updatedAt = new Date().toISOString();
      this.rooms.set(roomId, clone(changed));
      return clone(changed);
    } finally {
      release();
      if (this.queues.get(roomId) === queued) this.queues.delete(roomId);
    }
  }

  async setPresence(roomId, socketId, value) {
    const room = this.presence.get(roomId) || new Map();
    room.set(socketId, { ...clone(value), expiresAt: Date.now() + PRESENCE_TTL_SECONDS * 1000 });
    this.presence.set(roomId, room);
  }

  async removePresence(roomId, socketId) {
    const room = this.presence.get(roomId);
    if (!room) return null;
    const value = room.get(socketId) || null;
    room.delete(socketId);
    if (!room.size) this.presence.delete(roomId);
    return value ? clone(value) : null;
  }

  async listPresence(roomId) {
    const room = this.presence.get(roomId);
    if (!room) return [];
    const now = Date.now();
    for (const [socketId, value] of room.entries()) {
      if (value.expiresAt <= now) room.delete(socketId);
    }
    return [...room.values()].map(({ expiresAt: _expiresAt, ...value }) => clone(value));
  }

  async markOperation(roomId, operationId) {
    const now = Date.now();
    for (const [key, expiresAt] of this.operations.entries()) {
      if (expiresAt <= now) this.operations.delete(key);
    }
    const key = `${roomId}:${operationId}`;
    if (this.operations.has(key)) return false;
    this.operations.set(key, now + OPERATION_TTL_SECONDS * 1000);
    return true;
  }

  async health() {
    return { ready: true, mode: this.mode, detail: "Single-node development store" };
  }

  async close() {}
}

class RedisCollaborationStore {
  constructor(client, { prefix = "codeverse:collaboration" } = {}) {
    this.client = client;
    this.prefix = prefix;
    this.mode = "redis";
  }

  key(...parts) {
    return [this.prefix, ...parts].join(":");
  }

  async getRoom(roomId) {
    const value = await this.client.get(this.key("room", roomId));
    return value ? normalizeRoom(roomId, JSON.parse(value)) : null;
  }

  async ensureRoom(roomId, initial = {}) {
    const existing = await this.getRoom(roomId);
    if (existing) return existing;
    return this.mutateRoom(roomId, (room) => {
      if (room.revision === 0 && Object.keys(room.files).length === 0) {
        Object.assign(room, normalizeRoom(roomId, initial));
      }
      return room;
    });
  }

  async acquireLock(roomId) {
    const lockKey = this.key("lock", roomId);
    const token = crypto.randomUUID();
    const deadline = Date.now() + LOCK_TTL_MS * 2;

    while (Date.now() < deadline) {
      const result = await this.client.set(lockKey, token, { NX: true, PX: LOCK_TTL_MS });
      if (result === "OK") return { lockKey, token };
      await new Promise((resolve) => setTimeout(resolve, 15 + Math.floor(Math.random() * 20)));
    }

    throw new Error(`Timed out acquiring collaboration lock for ${roomId}`);
  }

  async releaseLock({ lockKey, token }) {
    await this.client.eval(
      "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end",
      { keys: [lockKey], arguments: [token] }
    );
  }

  async mutateRoom(roomId, mutation) {
    const lock = await this.acquireLock(roomId);
    try {
      const room = normalizeRoom(roomId, await this.getRoom(roomId));
      const changed = (await mutation(room)) || room;
      changed.updatedAt = new Date().toISOString();
      await this.client.set(this.key("room", roomId), JSON.stringify(changed), { EX: ROOM_TTL_SECONDS });
      return normalizeRoom(roomId, changed);
    } finally {
      await this.releaseLock(lock);
    }
  }

  async setPresence(roomId, socketId, value) {
    const presenceKey = this.key("presence", roomId, socketId);
    const indexKey = this.key("presence-index", roomId);
    const expiresAt = Date.now() + PRESENCE_TTL_SECONDS * 1000;
    await this.client.multi()
      .set(presenceKey, JSON.stringify(value), { EX: PRESENCE_TTL_SECONDS })
      .zAdd(indexKey, [{ score: expiresAt, value: socketId }])
      .expire(indexKey, PRESENCE_TTL_SECONDS * 2)
      .exec();
  }

  async removePresence(roomId, socketId) {
    const presenceKey = this.key("presence", roomId, socketId);
    const indexKey = this.key("presence-index", roomId);
    const value = await this.client.get(presenceKey);
    await this.client.multi().del(presenceKey).zRem(indexKey, socketId).exec();
    return value ? JSON.parse(value) : null;
  }

  async listPresence(roomId) {
    const indexKey = this.key("presence-index", roomId);
    const now = Date.now();
    await this.client.zRemRangeByScore(indexKey, 0, now);
    const socketIds = await this.client.zRangeByScore(indexKey, now + 1, "+inf");
    if (!socketIds.length) return [];
    const values = await this.client.mGet(socketIds.map((socketId) => this.key("presence", roomId, socketId)));
    return values.filter(Boolean).map((value) => JSON.parse(value));
  }

  async markOperation(roomId, operationId) {
    const result = await this.client.set(this.key("operation", roomId, operationId), "1", {
      NX: true,
      EX: OPERATION_TTL_SECONDS,
    });
    return result === "OK";
  }

  async health() {
    const startedAt = Date.now();
    const response = await this.client.ping();
    return {
      ready: response === "PONG",
      mode: this.mode,
      latencyMs: Date.now() - startedAt,
      detail: "Redis-backed distributed store and pub/sub",
    };
  }

  async close() {
    if (this.client.isOpen) await this.client.quit();
  }
}

module.exports = {
  MemoryCollaborationStore,
  RedisCollaborationStore,
  normalizeRoom,
};
