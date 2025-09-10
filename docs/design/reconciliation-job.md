### Interview talking points & tradeoffs

- Fan-out read vs write: explain read-latency vs write-cost tradeoff. Demonstrate hybrid approach for celebrity users.

- Denormalization: counters on post are eventual consistency tradeoff vs read performance; show how to repair via background reconciliation job.

- Indexing: show author_id, created_at composite index and tradeoffs (writes slightly slower, reads faster). Show unique indexes on follow and like to prevent dupes.

- Rate limiting & abuse: use per-IP and per-user buckets; different limits for authenticated endpoints (post creation) vs unauthenticated reads.

```yaml
rate-limits:
  create-post: capacity=20 refill=20/1m
  like: capacity=60 refill=60/1m
  comment: capacity=60 refill=60/1m
```

- Scaling story: stateless app nodes, Redis for fast feeds, Kafka for write fan-out worker, Search (ES) for discovery.

#### Fan out read or write

Short summary

Fan-out on read (pull model): compute the timeline when a user requests it by querying the DB for posts from users they follow.

Fan-out on write (push model): when someone creates a post, push that post ID into a precomputed per-user feed store (e.g., Redis sorted set) for each follower. Then reads are cheap.

Fan-out on READ (compute-on-demand)

How it works:

User requests /api/timeline?page=0&size=20.

Backend finds followeeIds for user.

Performs SQL:

SELECT \* FROM post
WHERE author_id IN (:followeeIds)
ORDER BY created_at DESC
LIMIT 20 OFFSET 0;

Pros

Simpler to implement.

No extra write-time work or extra storage.

Good when follow lists are small or when write rate is low.

Cons

Query gets expensive if followeeIds is large (thousands) — IN (...) with many ids can be slow.

Reads are heavier; worst for read-heavy systems (social apps are read-heavy).

Typical complexity

Read: O(k log N) or O(N) depending on indexes and DB engine, where k = number of followees.

Write: cheap (just insert post).

When to use

Small scale / prototypes / early development.

When followers per user are small (e.g., average < 100).

When simplicity and correctness are priorities.

Fan-out on WRITE (push model — precompute feeds)

How it works:

User B posts something.

Backend finds B’s followers list.

For each follower F, do ZADD feed:F score postId into Redis sorted set (score = timestamp).

User A reads /api/timeline → backend does ZREVRANGE feed:A 0 19 to get postIds, then fetch posts.

Example Redis ops:

ZADD feed:alice 1690000000000 12345
ZREVRANGE feed:alice 0 19

Pros

Reads are extremely fast (O(log N) per insert, O(log N + k) per read where k is page size).

Best for read-heavy workloads (social apps are read-heavy).

Cons

Write-time cost can be huge: if a user has 1M followers (a celebrity), a single post may require 1M writes (big spike).

Requires more storage (per-user feed copies).

Need batching/pipelining and backpressure for high fan-out.

Typical complexity

Write: O(F \* log M) where F = followers count, M = feed length per follower.

Read: O(page_size) + small DB hits to hydrate posts.

When to use

When you expect many reads per post (typical social app).

When low read latency is critical.

When you can handle complexity: worker queues, batch writes, eventual consistency.

Hybrid strategies (common in practice)

Push for normal users, pull for celebrities: if author has < threshold followers, push to followers; if > threshold, skip push and recompute on read (or special cache).

Push asynchronously: write post immediately to DB and add a message to Kafka/queue; consumers write to Redis asynchronously (smooths spikes).

Short-lived push + DB fallback: attempt to read from Redis; if missing, fallback to DB query for that page.

### Intuition explain

Why I suggested relational SQL (Postgres) for the core data

ACID & transactions. Posts, follows, likes, counters need correctness (you don’t want lost likes after a crash). Postgres gives strong transactional guarantees so you can update a post_like row and increment like_count atomically or with compensating reconciliation jobs.

Relational queries & joins. Social graph queries (followers, followees, joins with posts) are naturally relational. Expressing author_id IN (...) ORDER BY created_at is straightforward and indexed.

Maturity & toolchain. Postgres has first-class support for transactions, indexes (btree, gin), JSONB for semi-structured fields, extensions, and excellent operational maturity. Liquibase / Flyway migrations, backups, etc.

Correctness over premature scale complexity. For a graduation project and for most production small-to-medium workloads, Postgres + Redis can handle the required scale. Prematurely choosing distributed NoSQL (Cassandra, DynamoDB) complicates development and interview explanations unless you need that write-scale.

What GraphQL actually is (and what it solves)

GraphQL = a query language + server runtime for exposing a flexible API to clients. It lets clients ask exactly for the fields they need in a single request (reduces over/underfetching) and supports mutations/subscriptions.

It is not a database. It resolves queries by calling resolvers which will fetch data from DBs, caches, microservices, etc. You still need a data store (Postgres, Mongo, etc).

So: GraphQL vs REST vs SQL — separation of concerns

DB choice: Postgres (SQL) vs NoSQL (e.g., Cassandra) vs key-value (Redis) — choose based on data/consistency/scale.

API choice: REST vs GraphQL — choose based on client needs and team familiarity.

Use REST if endpoints are simple, you want low complexity, and clients are few.

Use GraphQL if clients need flexible shapes, many different UI screens, or you want a single gateway that aggregates many microservices.

When GraphQL makes sense for this microblog project

Use GraphQL if:

You want flexible clients (mobile + web) asking for different post fields without many endpoints.

You want client-driven fetching and fewer round-trips.

You want to demonstrate modern API design (good portfolio point) and are comfortable solving the GraphQL resolver issues (N+1, auth per-field, caching).

If your goal is deliver an MVP quickly and keep the server simple for interviews, REST is fine — then introduce GraphQL later.

Practical architecture options (recommended)

Option A — REST backend + Postgres + Redis + ES (Simple, safer for interview)

Postgres = primary data store.

Redis = per-user feed ZSETs & caches.

Elasticsearch = search.

REST controllers (JHipster) expose endpoints like /api/timeline, /api/posts/{id}/like.

Good for demonstrating fundamentals, transactions, and scaling tradeoffs.

Option B — GraphQL API over Postgres + Redis + ES (if you want GraphQL)

Use GraphQL server (Spring GraphQL or Apollo) as the API gateway.

Resolvers fetch posts from Redis (fast), hydrate from Postgres, and query ES for searches.

Use DataLoader pattern to batch DB calls and avoid N+1.

Implement cursor-based pagination on timeline (better for feeds).

Use subscriptions (WebSocket) for push notifications / real-time timeline updates.

Option C — Hybrid

Keep REST for admin & simple flows, add GraphQL for the main UI(s). Many teams use both.

Key engineering tradeoffs you must be able to explain in interviews
Q: “Why Postgres (SQL) instead of a NoSQL DB?”

Answer succinctly: Postgres provides transactional consistency and flexible query power for social-graph queries and counters; it reduces the complexity of correctness (ACID) during development. If we later need very high write throughput across millions of followers, we can add a write-optimized store (Cassandra) for feed fan-out, but that introduces operational complexity and eventual consistency tradeoffs.

Q: “Why not GraphQL for the API?”

Answer succinctly: GraphQL is a great API layer if you want flexible client queries. For MVP and interview clarity I prefer REST because it’s simpler and focuses the conversation on core backend design (transactions, feed strategy, caching). If the employer values modern client experience, I’ll discuss adding GraphQL as an API gateway on top of the same data stores.

Q: “Why Redis + Postgres?”

Answer succinctly: Use Redis for low-latency, per-user feed storage and counters; Postgres for canonical, durable data. Redis is ephemeral cache/queue; Postgres is the single source of truth.

Q: “Fan-out write vs fan-out read — what did you choose and why?”

Answer template (for interview):

For the MVP I implemented fan-out on read to keep correctness and simplicity: timeline queries are computed from Postgres using an indexed query over followee ids. It’s easy to reason about and test.

Next I implemented the fan-out write approach using an async worker that pushes post IDs into Redis sorted sets for followers. That optimizes read latency. For very large followers (celebrities) I use a hybrid approach: celebrity posts are not pushed to all feeds synchronously; instead I mark them as hot and use read-time merge or a separate “celebrity feed” strategy.

Implementation details & pitfalls if you pick GraphQL

N+1 resolver problem. If Timeline.posts maps to Post.author, naive resolvers will cause N+1 DB calls. Use DataLoader to batch by id.

Authorization complexity. You must enforce field-level auth if needed (e.g., private fields). REST controller-level auth is simpler.

Caching and persisted queries. GraphQL response caching is harder — must leverage persisted queries, CDN caches, or response cache layers.

Cursor pagination. Prefer cursor (cursor-based) pagination for feeds (better correctness with inserts) instead of offset/page.

Subscriptions: GraphQL subscriptions let you push updates but add complexity (scaling websockets, auth for each socket).
