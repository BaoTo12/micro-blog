#### Redis keys & conventions

Prefixes: feed:, post:, user:, rate:

- **Per-user feed** (sorted set)
  Key: feed:{userId} (ZSET)
  Member: postId (string or long)
  Score: createdAtEpochMillis
  Usage: ZREVRANGE feed:{userId} start stop -> list of postIds newest→oldest
  Maintenance: cap to top N (e.g., 1000) — use ZREMRANGEBYRANK or ZREMRANGEBYSCORE.
- **Post cache (hash)** (optional to avoid DB hit)
  Key: post:{postId} (HASH) fields: id, authorId, content, createdAt, likeCount, commentCount
  TTL: none if kept updated; or expire after 24h if using fallback.
- **Rate limit**
  Key: rate:{userId}:{action} -> e.g., counter or token bucket state (use Bucket4j Redis or sliding window implementation).
- **Followers streaming** (not a key, but fetch follower IDs via DB query in pages to avoid OOM).

#### Redis push (fan-out on write) flow

- Post created in DB (transactional).
- Publish PostCreatedEvent.
- Async worker consumes event: fetch follower ids in batches (e.g., 1000 at a time) and ZADD feed:{followerId} score postId for each follower. Use pipeline/batched writes.
- Trim feed:{followerId} to keep top N with ZREMRANGEBYRANK feed:{followerId} 0 -1001.

#### Rate-limiting & abuse design (detailed)

Use Bucket4j + Redis extension (stateless across nodes). Config:

```yaml
rate-limits:
  create-post: capacity=20 refill=20/1m
  like: capacity=60 refill=60/1m
  comment: capacity=60 refill=60/1m
```

Enforce via a server OncePerRequestFilter that:

- identifies actor (userId or IP),
- gets bucket from Redis,
- tries to tryConsume(1) and returns 429 if false,
- includes headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset.
