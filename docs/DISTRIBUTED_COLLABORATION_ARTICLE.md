---
title: "What it took to move a collaborative browser IDE beyond process memory"
description: "The Redis, Yjs, reconnect, permission, and benchmark decisions behind CodeVerse's distributed collaboration path."
tags: webdev, opensource, architecture, javascript
canonical_url: ""
published: false
---

# What it took to move a collaborative browser IDE beyond process memory

The first collaboration model in CodeVerse was convincing in exactly the way a local demo needs to be convincing.

Open two tabs. Join the same room. Type in one editor. Watch the other editor update.

Then ask one unpleasant question: what happens when those two sockets land on different server instances?

The answer was that the room stopped being a room. Each process had its own memory, its own presence list, and its own idea of the current files. A restart erased state. A reconnect could create a second identity. A load balancer could turn a working demo into two isolated conversations.

This article is about the work that followed: moving CodeVerse from synchronized tabs to a collaboration path I could test across processes, recover after disconnects, and describe without pretending a local benchmark was a production capacity claim.

## The real boundary was not Socket.IO

Socket.IO made connection handling and room fan-out approachable, but it did not decide where truth lived.

That distinction matters. A room name inside one Socket.IO process is a routing convenience, not durable shared state. Once I wanted multiple application instances, I needed separate answers for four kinds of information:

1. **Document state** — the convergent contents of every file.
2. **Room policy** — organizer identity, edit permissions, active file, and revision.
3. **Presence** — which sockets are here now, on which instance, with which effective role.
4. **Durability** — what survives Redis expiry, application restarts, or a longer period of inactivity.

CodeVerse now uses Yjs for convergent document updates, Redis for live distributed room state and pub/sub, and Supabase for durable room snapshots and membership data. Socket.IO remains the transport and fan-out layer.

That separation was more important than any individual library choice.

## Redis does three different jobs

It is easy to say “I added Redis” and leave the architecture vague. In CodeVerse, Redis has three explicit responsibilities.

### 1. Cross-instance fan-out

The Socket.IO Redis adapter connects a publisher and subscriber client to every application instance. An update accepted by instance A can reach sockets connected to instance B without a custom relay protocol.

### 2. Shared live state

A separate Redis client stores the normalized room record: files, active file, edit policy, organizer, encoded Yjs state, revision, and update time. Presence uses expiring per-socket records plus a sorted-set index, so abandoned sockets do not remain visible forever.

Room state has a longer TTL. Presence is intentionally short-lived. Operation IDs expire on a different schedule again. Treating those lifetimes as identical would either make stale users linger or make useful room state disappear too aggressively.

### 3. Coordination

CRDTs resolve concurrent document edits, but a room mutation includes more than CRDT text. It also materializes files, increments a revision, updates an active file, and may change permissions.

Those compound mutations are serialized with a small Redis lock acquired through `SET NX PX`. Release uses a compare-and-delete Lua expression, so an expired lock cannot be accidentally removed by its former owner after another process acquires it.

The lock is deliberately bounded. Failing with “timed out acquiring collaboration lock” is safer than waiting indefinitely while a room appears to accept work.

## Yjs solved convergence, not authorization

Every collaboration update has to pass server-side checks before it reaches the Yjs document.

The socket must still belong to the requested room. A viewer cannot edit. A collaborator can edit only while the room policy permits it. The organizer can change that policy or remove a collaborator; a client cannot grant itself the organizer role by changing its payload.

After authorization, the server decodes the Yjs update, applies it to the stored document, materializes the file map, selects a valid active file, stores the new encoded CRDT state, and increments the room revision. Only then does it broadcast and acknowledge the operation.

This is an important line in the design: **convergence does not imply permission**. A perfectly convergent unauthorized edit is still unauthorized.

## Every mutation needs an identity

Networks retry. Browsers reconnect. A user can double-click. A proxy can deliver an acknowledgement late enough that the client sends the same operation again.

Each CRDT update therefore carries an `operationId`. Redis records it with `NX` and an expiry. The first server instance to mark the operation processes it; a later delivery receives a successful duplicate acknowledgement without applying the edit twice.

This is not exactly-once delivery. It is a practical idempotency boundary: at-least-once transport behavior with one accepted mutation per operation ID during the configured window.

That wording is less impressive than “exactly once,” but it is accurate.

## Reconnect is an identity problem

A socket ID is not a user identity. It changes when the connection changes and it says nothing about the role that was previously authorized.

When a room join succeeds, CodeVerse issues an expiring signed reconnect token bound to the room, user ID, and role. A returning client presents that token during the next join. The server authorizes the recovery, restores presence under the new socket, returns the latest CRDT snapshot and revision, and tells the client whether the session was recovered.

The token does not replace normal authorization. It is evidence for one narrow recovery path, and it expires.

This also made reconnect behavior testable. The benchmark disconnects a sample of clients, reconnects them—potentially to the other application instance—and records whether the recovered identity is acknowledged.

## Durable snapshots are not on the hot path

Writing every keystroke to the durable database would add avoidable latency and cost. Never writing a snapshot would make Redis the only recovery story.

CodeVerse uses a debounced persistence boundary. Live operations update Redis and broadcast immediately. After a short quiet period, the current room snapshot is written to Supabase. A fresh room load can start from that durable snapshot, then continue through Redis-backed live state.

The public status response reports when collaboration is using the intended Redis path and when it has fallen back to an explicit single-node mode. Production can require Redis and fail startup rather than silently presenting a horizontally scalable UI backed by process memory.

That failure mode was a product decision as much as an infrastructure decision. Degraded behavior should be named where a user or operator can see it.

## The benchmark I wanted to see before calling it distributed

I built a benchmark that starts two real Socket.IO servers against Redis, connects clients across both instances, joins one shared room, applies concurrent Yjs updates, sends one all-subscriber propagation probe, and reconnects a sample of clients with their signed recovery tokens.

It refuses to run without Redis. A single-process fallback cannot accidentally produce a “distributed” result.

On my local machine—Ryzen 7 7735U, 15.2 GB RAM, Node.js 22.14.0, Redis 7.4, all traffic over loopback—the latest 500-client run produced:

- 54.95 ms cross-instance propagation p95;
- 104.27 ms CRDT acknowledgement p95;
- 305.26 ms CRDT acknowledgement p99;
- 80.19 ms reconnect p95;
- 100% recovery for the 20 sampled reconnects;
- 213 MB process RSS at the end of the scenario.

Every subscriber received the propagation probe, and both application instances observed the same final room revision.

The 100-client and 500-client tables, method, environment, and reproduction command are in the [public benchmark report](https://github.com/Ayush-Kumar0207/codeverse/blob/main/docs/COLLABORATION_BENCHMARKS.md).

## What those numbers do not prove

They do not prove that the free public deployment supports 500 simultaneous editors.

The run did not include internet latency, a multi-region topology, managed-provider throttling, a remote Redis service, or noisy-neighbor behavior. The clients, servers, and Redis process shared one machine. It is a controlled regression baseline, not a hosted capacity certificate.

The p99 acknowledgement tail at 500 clients is also a real warning. The p95 stays under the current 150 ms target, but some operations took substantially longer. I would rather publish that tail than hide it behind an average.

The next performance work should compare saved benchmark runs, make regressions fail against an explicit threshold, and repeat the test whenever the protocol or infrastructure changes.

## What I would do differently

I would define the state boundaries before building the first room UI.

The fastest early implementation treated “room” as one concept. The distributed version had to separate document convergence, permission state, transient presence, operation idempotency, routing, and durable recovery. That separation would have made the first version slightly slower to write and much easier to evolve.

I would also add failure vocabulary earlier. “Connected” is not enough. An operator needs to know whether the service is using Redis or process memory. A user needs to know whether an edit is forbidden, duplicated, pending, or recovered. A benchmark needs to distinguish acknowledgement from propagation.

Specific language made the system easier to test.

## The project is feature-frozen now

CodeVerse already has more surface area than it needs for another showcase feature. The current work is reliability, accessibility, documentation, security, performance, and contributor experience.

If this architecture interests you, I would value criticism of the boundaries above. If you want a smaller entry point, the repository has focused issues for keyboard dialog behavior, contributor setup diagnostics, and status-page failure contracts.

- [Try CodeVerse](https://codeverse-rho.vercel.app)
- [Read the source](https://github.com/Ayush-Kumar0207/codeverse)
- [See the contributor guide](https://github.com/Ayush-Kumar0207/codeverse/blob/main/CONTRIBUTING.md)
- [Join the feature-freeze discussion](https://github.com/Ayush-Kumar0207/codeverse/discussions/48)

I built the project independently and publish launch notes under **The Sable Falcon** ([@TheSableFalcon](https://x.com/TheSableFalcon)). The code, benchmark method, limitations, and open work are public because quiet work should still be inspectable.
