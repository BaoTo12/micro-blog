# Detailed Project Requirements for Microblogging Application

## 1. Introduction

This document outlines the detailed requirements for the Microblogging Application, a JHipster monolith (Spring Boot + React app) designed to provide authenticated users with microblogging functionalities. The application leverages PostgreSQL for primary data storage, Redis for high-performance timeline delivery and caching, and Elasticsearch for full-text search capabilities. Authentication is handled via JWT, and the entire system is containerized using Docker Compose for development and production environments.

## 2. High-Level Architecture

- **Monolith**: Single deployable JAR with a Spring Boot backend and React frontend.
- **PostgreSQL**: Primary relational database for entities.
- **Redis**: Used for per-user sorted-set feeds (push model), caches, and rate-limit buckets.
- **Elasticsearch**: Indexes posts for full-text search.
- **JWT**: Stateless authentication mechanism.
- **Docker Compose**: Used for local development and containerized deployment in production.
- **CI/CD**: GitHub Actions for Continuous Integration with optional Docker image pushes to a registry.
- **Observability**: Micrometer for Prometheus integration, structured JSON logs for ELK/Cloud, and OpenTelemetry + Jaeger for tracing.

## 3. Product Overview

The Microblogging Application allows authenticated users to create posts, follow/unfollow other users, like posts, comment on posts, and view a personalized home timeline. Posts are indexed for full-text search, and the timeline is optimized for low-latency delivery using Redis with a database fallback.

## 4. Functional Requirements (FRs)

### 4.1 Authentication & Accounts (MR1)
- **FR1.1**: Users can register and log in using JWT.
  - *Acceptance Criteria*: Registration returns `201 Created`; login returns a JWT, which is used for secure API calls.
- **FR1.2**: User profile includes: username (unique login), display name, bio, and avatar URL.

### 4.2 Social Graph (MR2)
- **FR2.1**: Authenticated users can follow/unfollow other users.
  - *Acceptance Criteria*: `POST /api/users/{id}/follow` toggles follow status.
- **FR2.2**: Users cannot follow the same user twice and cannot follow themselves.
  - *Acceptance Criteria*: Unique constraint enforced for `follower_id`, `followee_id`; `400 Bad Request` returned if a user tries to follow themselves.

### 4.3 Posts (MR3)
- **FR3.1**: Authenticated users can create a text post (maximum 10,000 characters).
  - *Acceptance Criteria*: `POST /posts` with `{content, visibility}` returns `201 Created` with `post DTO`; `created_at` is auto-generated; author is the authenticated user. Validation returns `400 Bad Request` for invalid content length.
- **FR3.2**: Authors can edit, or delete their posts.
  - *Acceptance Criteria*: `PUT /posts/{id}` updates a post and returns `200 OK`; `DELETE /posts/{id}` returns `204 No Content`.
- **FR3.3**: Posts have `createdAt`, optional `updatedAt`, and a `visibility` enum (PUBLIC/PRIVATE).

### 4.4 Interactions (MR4)
- **FR4.1**: Authenticated users can like/unlike a post (idempotent).
  - *Acceptance Criteria*: `POST /api/posts/{id}/like` returns `{liked: true, likeCount: N}`; `DELETE /api/posts/{id}/like` returns `{liked: false, likeCount: N}`. `Post.like_count` is accurately updated.
- **FR4.2**: Authenticated users can comment on a post (maximum 2,000 characters).
  - *Acceptance Criteria*: `POST /posts/{id}/comments` with `{content}` returns `201 commentDTO` and increments `comment_count`.

### 4.5 Home Timeline (MR5)
- **FR5.1**: Home timeline displays posts by followees and the user's own posts, ordered from newest to oldest.
  - *Acceptance Criteria*: `GET /timeline?page=0&size=20` returns a paginated result containing posts from followed users and the current user, sorted by `created_at` descending.
- **FR5.2**: Timeline is paginated with a default page size of 20.
- **FR5.3**: Timeline displays `like_count`, `comment_count`, and author information.

### 4.6 Search (MR6)
- **FR6.1**: Users can search posts by content using Elasticsearch, with pagination and relevance boosted by recency.
  - *Acceptance Criteria*: `GET /api/_search/posts?q=xxx` returns a paginated list of posts, supporting tokenization (ES) or `tsvector`.

### 4.7 Bookmark (FR8)
- Users can save posts to read later.
  - *Acceptance Criteria*: `POST /api/posts/{id}/save` saves a post; `DELETE` un-saves. `GET /api/users/{id}/saved` returns a list of saved posts.

### 4.8 User Management (New)
- **FR4.8.1**: Users can be deactivated.
  - *Acceptance Criteria*: `DELETE /users/{userId}` deactivates a user and returns `200 OK`.

### 4.9 User Profile Management (New)
- **FR4.9.1**: Users can create their profile.
  - *Acceptance Criteria*: `POST /profiles` creates a user profile and returns `200 OK` with the created profile.

### 4.10 Notifications (FR10)
- Basic in-app notifications for interactions.
  - *Acceptance Criteria*: When User A likes User B’s post, User B receives a notification with `type=LIKE`. `GET /api/notifications` returns paginated notifications; `POST /api/notifications/{id}/read` marks a notification as read.

## 5. Non-Functional Requirements (NFRs)

- **NFR1 (Performance)**: 80th percentile timeline fetch latency ≤ 200ms for medium-sized follow lists (<100 followees).
  - *Development Goal*: P80 < 300ms for page size 20.
- **NFR2 (Rate Limiting)**: Create-post is rate-limited to ≤ 20/min per user (configurable).
  - *Details*: Implemented via a server `OncePerRequestFilter` using Bucket4j + Redis, returning `429 Too Many Requests` with `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` headers.
  - *Other Rate Limits*: `like` capacity=60 refill=60/1m, `comment` capacity=60 refill=60/1m.
- **NFR3 (Deployability)**: System must be dockerized and runnable locally via `docker-compose up`.

## 6. Domain Model & Entities

### 6.1 `jhi_user` (Authentication)
- **Fields**: `id`, `login`, `email`, `password_hash`, `activated`, `created_date`.
- **Purpose**: Core for authentication; other entities reference `author_id` via FK.

### 6.2 `user_profile`
- **Fields**: `user_id (PK, FK)`, `display_name`, `bio`, `avatar_url`, `website`, `location`.
- **Purpose**: Separates authentication concerns from public profile data, enhancing security and extensibility.

### 6.3 `post`
- **Fields**: `id`, `author_id (FK)`, `content TEXT`, `created_at timestamptz`, `updated_at`, `like_count int`, `comment_count int`, `visibility varchar`, `version bigint`.
- **Purpose**: Stores core post content. `like_count` and `comment_count` are denormalized counters for fast UI display. `version` supports optimistic locking.

### 6.4 `follow`
- **Fields**: `id`, `follower_id`, `followee_id`, `created_at`.
- **Constraints**: `unique(follower_id, followee_id)`, `check (follower_id != followee_id)`.
- **Purpose**: Models the social graph.

### 6.5 `post_like`
- **Fields**: `id`, `post_id`, `user_id`, `created_at`.
- **Constraints**: `unique(post_id, user_id)`.
- **Purpose**: Manages likes, supports auditing, and allows querying who liked a post.

### 6.6 `comment`
- **Fields**: `id`, `post_id`, `author_id`, `content`, `created_at`.
- **Purpose**: Stores comment content, linked to `post` via FK.

### 6.7 `hashtag` & `post_hashtag`
- **`hashtag` Fields**: `id`, `tag`, `normalized_tag`.
- **`post_hashtag` Fields**: `post_id (FK)`, `hashtag_id (FK)`.
- **Purpose**: Mapping table for tag-based querying, supporting trending topics and search.

### 6.8 `attachment` (Stretch Goal)
- **Fields**: `id`, `post_id (FK)`, `url`, `content_type`, `size`.
- **Purpose**: Stores metadata for attached files (images, videos).

### 6.9 `saved_post` (Bookmark)
- **Fields**: `user_id (PK, FK)`, `post_id (PK, FK)`, `created_at`.
- **Purpose**: Allows users to save posts for later reading.

### 6.10 `notification`
- **Fields**: `id`, `recipient_id (FK)`, `actor_id (FK)`, `type`, `object_type`, `object_id`, `payload JSONB`, `is_read`, `created_at`.
- **Purpose**: Provides an in-app notification system (e.g., for likes, comments, follows, mentions).

### 6.11 `user_stats`
- **Fields**: `user_id (PK, FK)`, `followers_count`, `following_count`, `posts_count`, `likes_received_count`.
- **Purpose**: Denormalized counters to accelerate profile and dashboard queries.

### 6.12 Optional Tables
- **`user_session`**: For managing login sessions.
- **`post_draft`**: For saving post drafts.
- **`user_feed`**: For a DB-backed feed (fan-out write/read).

## 7. API Contract (Endpoints & Payloads)

*(Auth: `Authorization: Bearer <JWT>`)*

### 7.1 Auth
- **`POST /auth/register`**
  - Body: `{login, email, password}`
  - Response: `201 Created`
- **`POST /auth/login`**
  - Body: `{username, password}`
  - Response: `{id_token}`

### 7.2 User / Profile
- **`GET /users/{id}`**
  - Response: user DTO
- **`DELETE /users/{id}`**
  - Response: `200 OK`
- **`POST /profiles`**
  - Body: `{userId, displayName, bio, avatarUrl, website, location}`
  - Response: `200 OK` with created UserProfile DTO
- **`GET /profiles/{id}`**
  - Response: profile + user_stats
- **`POST /users/follows/{followeeId}`**
  - Response: `200 OK`
- **`DELETE /users/follows/{followeeId}`**
  - Response: `200 OK`

### 7.3 Posts
- **`POST /posts`**
  - Body: `{content, visibility}`
  - Response: `201 postDTO`
- **`GET /posts/{id}`**
  - Response: postDTO
- **`PUT /posts/{id}`**
  - Body: `{content, visibility}`
  - Response: `200 postDTO`
- **`DELETE /posts/{id}`**
  - Response: `204 No Content`
- **`GET /posts?authorId=&page=&size=`**
  - Response: paginated result

### 7.4 Timeline
- **`GET /timeline?page=0&size=20`**
  - Response: `page { content:[postDTO], totalElements, ... }`

### 7.5 Like
- **`POST /api/posts/{id}/like`**
  - Response: `{liked: true, likeCount: N}`
- **`DELETE /api/posts/{id}/like`**
  - Response: `{liked: false, likeCount: N}`

### 7.6 Comment
- **`POST /posts/{id}/comments`**
  - Body: `{content}`
  - Response: `201 commentDTO`
- **`GET /api/posts/{id}/comments?page&size`**
  - Response: paged comments

### 7.7 Search
- **`GET /api/_search/posts?q=xxx&page=0&size=20`**
  - Response: paged posts

### 7.8 Bookmark
- **`POST /api/posts/{id}/save`**
  - Response: `200 OK`
- **`GET /api/users/{id}/saved?page&size`**
  - Response: saved posts

### 7.9 Notifications
- **`GET /api/notifications?page&size`**
  - Response: paged notifications
- **`POST /api/notifications/{id}/read`**
  - Response: `200 OK`

## 8. Core Business Flows

### 8.1 Create Post (Synchronous + Async Fan-out)
1. **Client**: Sends `POST /posts` (with JWT).
2. **Backend**: `PostService.createPost()` validates content, saves Post in PostgreSQL within a transaction.
3. **Backend**: Optionally writes to Elasticsearch index (sync or queued) and publishes `PostCreatedEvent` (Spring `ApplicationEvent` or Kafka).
4. **Response**: Returns `201 postDTO` immediately.
5. **Async Worker**: Consumes the `PostCreatedEvent`, batch fetches followers, updates Redis feeds using `ZADD feed:{followerId}` (with `createdAtEpochMillis` as score), and trims the feed (e.g., `ZREMRANGEBYRANK feed:{followerId} 0 -1001`).
6. **Optional**: Notify real-time channels (WebSocket) for online followers.

### 8.2 Timeline Read (Fan-out Read)
1. **Client**: Sends `GET /timeline?page=0&size=20` (with JWT).
2. **Server**: Attempts to `ZREVRANGE feed:{userId} 0 19` from Redis.
   - **If Redis result is non-empty**: Fetches post details from `post:{id}` cache or `post` table (batch select `WHERE id IN (...)`) and returns ordered results.
   - **If Redis result is empty or fallback condition is met**: Fetches followees from DB and queries the `post` table `WHERE author_id IN (...) ORDER BY created_at DESC` with pagination.
3. **Response**: Returns a list of `PostDTO`s.

### 8.3 Like / Unlike
1. **Transaction**: `INSERT` or `DELETE` in `post_like` table. Concurrently, `UPDATE post SET like_count = like_count ± 1`. This update can be via a DB trigger or application-level within the same transaction.
2. **Response**: Returns `new likeCount`.

## 9. Testing Plan

### 9.1 Unit Tests
- Services (`TimelineService`, `PostService`, `LikeService`) using Mockito.
- Utilities (sanitizer, mappers).

### 9.2 Repository Tests
- `@DataJpaTest` for custom repository queries.

### 9.3 Integration Tests
- `@SpringBootTest` with Testcontainers for PostgreSQL, Redis, and Elasticsearch.
- Tests include: verifying post creation triggers ES indexing and Redis feed updates (using Awaitility for async worker), and correctness of timeline fallback reads.

### 9.4 E2E Tests (Cypress)
- Cover flows: register -> login -> follow -> post -> timeline -> like -> comment -> search.
- Utilize a seeded database for deterministic test results.

### 9.5 Load Tests (k6/Gatling)
- **Readers**: 10k concurrent users reading timelines (fetching from Redis).
- **Writers**: 500 concurrent users creating posts (measuring write latency with fan-out to feeds).
- **Celebrity Scenario**: 1 user with 1M followers posting; measure worker backlog processing rate.

### 9.6 Security Tests
- OWASP ZAP scan against a deployed staging instance.
- Manual penetration testing checklists for: SQL injection on search endpoints, XSS vectors on post content, Auth bypass (JWT replay/forged tokens).

### 9.7 CI Integration
- Unit tests run on every Pull Request.
- Integration tests run nightly or on the main branch (using Testcontainers).
- E2E tests run on the main branch after deployment to a preview environment (Docker Compose or staging).

## 10. Observability & Runbook

### 10.1 Metrics
- Implemented with Micrometer + Prometheus, exposed via `/actuator/prometheus`.
- Key metrics: timeline latency histogram, post creation latency, Redis write operations/errors, ES indexing latency/failures, rate limit hits per minute, worker backlog size.

### 10.2 Logging
- JSON structured logs with correlation ID (e.g., `X-Request-Id`).
- Example log format: `{timestamp, level, traceId, spanId, logger, message, userId, postId}`.

### 10.3 Tracing
- OpenTelemetry + Jaeger for tracing end-to-end flows (e.g., create-post -> feed-update path).

### 10.4 Alerts (Prometheus rules)
- High timeline latency (>500ms sustained for 5 minutes).
- Redis memory usage > 80% or operational errors exceeding a threshold.
- Elasticsearch cluster status yellow/red.
- Worker backlog exceeding a threshold (e.g., >1000 unprocessed events).

### 10.5 Runbook (Short)
- **Redis OOM**: Check eviction policy, increase instance size, restart worker, monitor backlog.
- **Elasticsearch Down**: Failover to DB search (temporarily disable search endpoint), notify team.
- **DB Migration Fails**: Rollback to previous schema snapshot, restore DB from backup if necessary.
