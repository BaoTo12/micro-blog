## Sequential Diagrams

### Flow A — Create Post (synchronous + async fan-out)

- Client -> POST /api/posts (JWT)
- Backend validates content, saves Post in PostgreSQL in transaction.
- Backend writes to ES index (sync or queued), and publishes - PostCreatedEvent (Spring ApplicationEvent or Kafka).
- Response: returns PostDTO immediately.
- Async worker consumes event -> batch fetch followers -> update Redis feeds ZADD feed:{followerId} -> trim.
- (Optional) Notify real-time channels (WebSocket) for online followers.

### Flow B — Get Timeline

1. Client -> GET /api/timeline?page=0&size=20 (JWT)

2. Backend attempts to ZREVRANGE feed:{userId} 0 19.

- If result non-empty: fetch post details either from post:{id} cache or post table (batch select WHERE id IN (...)) and return ordered results.
- If result empty or fallback condition: fetch followees from DB and query post table WHERE author_id IN (...) ORDER BY created_at DESC with pagination.

3. Response: list of PostDTOs.

## Use Case Diagram

- User-facing features
- Sign up / log in (JWT auth).
- Edit profile (display name, bio, avatar).
- Create a post (text, maybe attachments later).
- See other users’ profiles and their posts.
- Follow/unfollow other users.
- See a home timeline made of posts by people you follow + your own posts, newest first (paginated).
- Like / unlike posts (idempotent).
- Comment on posts.
- Search posts by content (Elasticsearch).

## Admin / operational features

- Rate-limiting (avoid spam), observability (metrics), tests, and Dockerized deployment for demo.
