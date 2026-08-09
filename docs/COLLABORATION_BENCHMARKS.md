# Distributed collaboration benchmark

CodeVerse measures collaboration as a distributed system, not as an in-process event emitter. This report captures a reproducible local baseline for two Socket.IO server instances sharing room state, presence, idempotency keys, and pub/sub through Redis while Yjs merges concurrent edits.

## Result

Measured on 2026-08-09 with Node.js 22.14.0, Redis 7.4 Alpine, Windows 10 build 26200, an AMD Ryzen 7 7735U (8 cores / 16 logical processors), and 15.2 GB RAM. Both application servers, Redis, and clients ran on the same machine over loopback. Each scenario used one room, two server instances, 100 CRDT operations in batches of three simultaneous editors, one all-subscriber propagation probe, and reconnects for 5% of clients (capped at 20).

| Signal | 100 clients | 500 clients |
| --- | ---: | ---: |
| Connect wall time | 218 ms | 988 ms |
| Room join wall time | 689 ms | 5,696 ms |
| Connection p50 / p95 / p99 | 84.96 / 117.35 / 119.36 ms | 76.35 / 170.46 / 174.53 ms |
| Room join p50 / p95 / p99 | 110.75 / 325.82 / 419.52 ms | 360.36 / 683.09 / 877.05 ms |
| CRDT acknowledgement p50 / p95 / p99 | 41.91 / 94.65 / 139.63 ms | 59.42 / 104.27 / 305.26 ms |
| Cross-instance propagation p50 / p95 / p99 | 19.04 / 20.42 / 20.50 ms | 50.07 / 54.95 / 55.38 ms |
| Reconnect p50 / p95 / p99 | 29.63 / 32.98 / 32.98 ms | 71.44 / 80.19 / 88.68 ms |
| Reconnect success | 100% (5/5) | 100% (20/20) |
| Final shared revision | 101 | 101 |

The 500-client process ended at 213 MB RSS and 86 MB used heap. Every subscriber received the cross-instance probe, both nodes observed the same final Redis revision, and reconnect tokens recovered all sampled sessions.

## Reproduce it

Start Redis, install server dependencies, and run:

```bash
cd server
BENCHMARK_REDIS_URL=redis://127.0.0.1:6379 \
BENCHMARK_CLIENTS=100,500 \
BENCHMARK_UPDATES=100 \
BENCHMARK_UPDATE_CONCURRENCY=3 \
npm run benchmark:collaboration
```

On PowerShell, set the same environment variables with `$env:NAME='value'` before running the npm command. The script exits non-zero without Redis so a single-process fallback cannot be mistaken for distributed evidence.

## What this does and does not prove

This baseline proves multi-instance convergence, fan-out, operation idempotency, reconnect recovery, and bounded local resource use under the stated workload. It does not represent internet latency, multi-region Redis, provider throttling, or a managed production cluster. Production SLOs should use the public `/api/status` telemetry plus an external probe and should be reviewed after every infrastructure or CRDT change.

The p99 CRDT acknowledgement tail at 500 clients is the next optimization target. The p95 remains 104.27 ms, below the current 150 ms collaboration target, while propagation p95 remains 54.95 ms.
