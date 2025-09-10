## High-level architecture

- **JHipster Monolith** (Spring Boot backend + React frontend) — single deployable jar.
- **PostgreSQL** — primary relational store for entities.
- **Redis** — sorted-set per-user feed (push model) + caches + rate-limit buckets.
- **Elasticsearch** — index posts for full-text search.
- **JWT** — stateless auth.
- **Docker Compose** for dev; containerized app for production. Optionally push Docker images to registry; GitHub Actions for CI.
- **Observability**: Micrometer → Prometheus, structured logs (JSON) → ELK/Cloud.

### Product Overview

A JHipster monolith (Spring Boot) + React app that provides authenticated users a microblog (create posts, follow/unfollow, like, comment, home timeline). The timeline is delivered with low latency via Redis per-user sorted sets (push model) with a DB read fallback. Posts are indexed in Elasticsearch for full-text search. JWT auth, PostgreSQL as primary store. Docker Compose for dev; Testcontainers + GitHub Actions for CI.

#### High-level functional requirements (MRs) — acceptance-oriented

**MR1 — Authentication & Accounts**

- FR1.1 Users can register and log in (JWT).
- FR1.2 User profile: username (unique login), display name, bio, avatar URL.

**MR2 — Social Graph**

- FR2.1 Authenticated user can follow/unfollow other users.
- FR2.2 Cannot follow the same user twice; can’t follow self.

**MR3 — Posts**

- FR3.1 Authenticated user can create a text post (max 10,000 chars).
- FR3.2 Author can edit or delete their post.
- FR3.3 Posts have createdAt, optional updatedAt, visibility enum (PUBLIC/PRIVATE).

**MR4 — Interactions**

- FR4.1 Authenticated user can like/unlike a post (idempotent).
- FR4.2 Authenticated user can comment on a post (max 2,000 chars).

**MR5 — Home timeline**

- FR5.1 Home timeline shows posts by followees + own posts, ordered newest→oldest.
- FR5.2 Timeline is paginated. Default page size 20.
- FR5.3 Timeline should display like_count, comment_count, author info.

**MR6 — Search**

- FR6.1 Users can search posts by content via Elasticsearch with pagination and relevance by recency boost.

**MR7 — Non-functional**

- NFR1: 80th percentile timeline fetch latency ≤ 200ms for medium-sized follow lists (<100 followees).
- NFR2: Rate limit: create-post ≤ 20/min per user (configurable).
- NFR3: System must be dockerized and runnable locally via docker-compose up.

### Tổng quan chức năng (scope chính)

MVP (bắt buộc):

- Đăng ký / đăng nhập (JWT)
- CRUD Post (create, read, delete; edit optional)
- Follow / unfollow
- Timeline (home feed — posts của followees + self), paginated
- Like / unlike (idempotent)
- Comment
- Basic search (full-text)
- Frontend React minimal (timeline + composer + profile + follow button)

Stretch (nên có nếu còn thời gian):

- Redis-based fan-out push (per-user feed)
- Elasticsearch full search + suggestions
- Notifications (in-app)
- Attachment uploads (S3)
- Rate limiting
- Integration tests (Testcontainers), Cypress e2e
- Monitoring (Prometheus + Grafana)

### User stories

1. User đăng ký / login
   AC: đăng ký trả 201; đăng nhập trả JWT; JWT dùng để gọi API bảo mật.
2. User đăng ký / login
   AC: POST /api/posts với body {content, visibility} trả 201 + post DTO; created_at auto; author là user auth.
   Nội dung tối đa 10000 ký tự; validation trả 400 khi invalid.
3. User xem timeline
   AC: GET /api/timeline?page=0&size=20 trả page chứa posts của những người user follow + self, sắp xếp mới nhất trước.
   Lateny: P80 < 300ms cho page size 20 (dev goal).
4. User follow/unfollow
   AC: POST /api/users/{id}/follow toggles follow; cannot follow self (400) ; unique constraint.
5. User like/unlike post
   AC: POST /api/posts/{id}/like returns {liked: true, likeCount: N} idempotent; DELETE /api/posts/{id}/like unlikes.
   Post.like_count chính xác (transactional or reconciled).
6. User comment
   AC: POST /api/posts/{id}/comment returns 201 comment DTO and increments comment_count.
7. Search posts
   AC: GET /api/\_search/posts?q=xxx returns list paged; supports tokenization (ES) or tsvector.
8. Bookmark (save)
   AC: POST /api/posts/{id}/save and DELETE un-save. GET /api/users/{id}/saved returns saved list.
9. Profile view
   AC: GET /api/users/{id}/profile returns profile + user_stats (followers_count, posts_count...).
10. Basic notifications
    AC: When A likes B’s post, B has a notification row with type=LIKE.

# 3 — Domain Model & Entities (mapping trường, FK, lý do)

Dưới đây là danh sách các **entities chính** với trường tối thiểu, khóa ngoại (FK), ràng buộc, và lý do thiết kế.

---

## `jhi_user` (auth)

- **Fields**:  
  `id`, `login`, `email`, `password_hash`, `activated`, `created_date`
- **Vì**: Authentication, các entity khác dùng FK tham chiếu `author_id`.

---

## `user_profile`

- **Fields**:  
  `user_id (PK, FK)`, `display_name`, `bio`, `avatar_url`, `website`, `location`
- **Vì**:
  - Tách biệt **auth** và **public profile**.
  - Giúp bảo mật, dễ mở rộng.

---

## `post`

- **Fields**:  
  `id`, `author_id (FK)`, `content TEXT`,  
  `created_at timestamptz`, `updated_at`,  
  `like_count int`, `comment_count int`,  
  `visibility varchar`, `version bigint`
- **Vì**:
  - Core content.
  - Counters (`like_count`, `comment_count`) giúp hiển thị UI nhanh.
  - `version` để hỗ trợ **optimistic locking**.

---

## `follow`

- **Fields**:  
  `id`, `follower_id`, `followee_id`, `created_at`
- **Ràng buộc**:
  - `unique(follower_id, followee_id)`
  - `check (follower_id != followee_id)`
- **Vì**: Mô hình social graph.

---

## `post_like`

- **Fields**:  
  `id`, `post_id`, `user_id`, `created_at`
- **Ràng buộc**:
  - `unique(post_id, user_id)`
- **Vì**:
  - Quản lý lượt like.
  - Hỗ trợ auditing.
  - Dễ truy vấn ai đã like.

---

## `comment`

- **Fields**:  
  `id`, `post_id`, `author_id`, `content`, `created_at`
- **Vì**: Nội dung trao đổi, gắn FK với `post`.

---

## `hashtag` & `post_hashtag`

- **hashtag Fields**:  
  `id`, `tag`, `normalized_tag`
- **post_hashtag Fields**:  
  `post_id (FK)`, `hashtag_id (FK)`
- **Vì**:
  - Mapping table để truy vấn theo tag.
  - Hỗ trợ trending / search.

---

## `attachment`

- **Fields**:  
  `id`, `post_id (FK)`, `url`, `content_type`, `size`
- **Vì**: Metadata cho file, hình ảnh, video.

---

## `saved_post` (bookmark)

- **Fields**:  
  `user_id (PK, FK)`, `post_id (PK, FK)`, `created_at`
- **Vì**: Cho phép người dùng **lưu bài viết** để đọc lại sau.

---

## `notification`

- **Fields**:  
  `id`, `recipient_id (FK)`, `actor_id (FK)`,  
  `type`, `object_type`, `object_id`,  
  `payload JSONB`, `is_read`, `created_at`
- **Vì**: Hệ thống thông báo (like, comment, follow, mention).

---

## `user_stats`

- **Fields**:  
  `user_id (PK, FK)`,  
  `followers_count`, `following_count`,  
  `posts_count`, `likes_received_count`
- **Vì**: Denormalized counters để tăng tốc query.

---

## Các bảng optional

- **`user_session`** → quản lý session đăng nhập.
- **`post_draft`** → lưu bài nháp.
- **`user_feed`** → DB-backed feed (fan-out write/read).

# 4 — API contract (endpoints chính, payload mẫu)

Đây là bộ endpoint tối thiểu bạn sẽ implement.  
(Auth: Authorization: Bearer <JWT>)

---

## Auth

- **POST** `/api/register`  
  Body: `{login, email, password}`  
  → `201 Created`

- **POST** `/api/authenticate`  
  Body: `{username, password}`  
  → `{id_token}`

---

## User / Profile

- **GET** `/api/users/{id}`  
  → user DTO

- **GET** `/api/users/{id}/profile`  
  → profile + user_stats

- **POST** `/api/users/{id}/follow`  
  → `{followed: true|false}`

---

## Posts

- **POST** `/api/posts`  
  Body: `{content, visibility}`  
  → `201 postDTO`

- **GET** `/api/posts/{id}`  
  → postDTO

- **DELETE** `/api/posts/{id}`  
  → `204 No Content`

- **GET** `/api/posts?authorId=&page=&size=`  
  → paged result

---

## Timeline

- **GET** `/api/timeline?page=0&size=20`  
  → `page { content:[postDTO], totalElements, ... }`

---

## Like

- **POST** `/api/posts/{id}/like`  
  → `{liked: true, likeCount: N}`

- **DELETE** `/api/posts/{id}/like`  
  → `{liked: false, likeCount: N}`

---

## Comment

- **POST** `/api/posts/{id}/comment`  
  Body: `{content}`  
  → `201 commentDTO`

- **GET** `/api/posts/{id}/comments?page&size`  
  → paged comments

---

## Search

- **GET** `/api/_search/posts?q=xxx&page=0&size=20`  
  → paged posts

---

## Bookmark

- **POST** `/api/posts/{id}/save`  
  → `200 OK`

- **GET** `/api/users/{id}/saved?page&size`  
  → saved posts

---

## Notifications

- **GET** `/api/notifications?page&size`  
  → paged notifications

- **POST** `/api/notifications/{id}/read`  
  → `200 OK`

# 5 — Luồng nghiệp vụ chính (sequence flows, step-by-step)

---

## 5.1 Create Post (MVP fan-out read)

1. **Client** gửi:  
   `POST /api/posts (JWT)`
2. **Backend**: `PostService.createPost()`
3. **Transaction**:
   - `INSERT` vào bảng `post` (set `created_at`).
4. **Event**: Publish `PostCreatedEvent` (in-process).
5. **Feed**: Không push ngay (fan-out read).
   - Optionally gửi async indexer tới **Elasticsearch (ES)**.
6. **Response**: `201 postDTO`.

---

## 5.2 Timeline Read (fan-out read)

1. **Client** gửi:  
   `GET /api/timeline (user U)`
2. **Server**:
   - Query danh sách followee:
     ```sql
     SELECT followee_id FROM follow WHERE follower_id = :uid;
     ```
   - Query bài viết:
     ```sql
     SELECT *
     FROM post
     WHERE author_id IN (:followees + :uid)
       AND visibility = 'PUBLIC'
     ORDER BY created_at DESC
     LIMIT :size OFFSET :page*size;
     ```
3. **Kết quả**: Trả về `paged result`.

---

## 5.3 Fan-out Write (push) — optional, high-performance read

1. **Post created** -> `PostCreatedEvent` enqueued vào queue (**Kafka / Redis Stream**) hoặc xử lý async.
2. **Worker**:
   - Đọc followers theo page.
   - Pipeline:
     ```text
     Redis ZADD feed:{follower} score=timestamp postId
     ```
3. **On read**:
   - Server query Redis:
     ```text
     ZREVRANGE feed:{user} start stop
     ```
   - Sau đó:
     ```sql
     SELECT * FROM post WHERE id IN (...);
     ```
   - Hydrate & reorder.
4. **Ưu điểm**: Đọc rất nhanh.  
   **Nhược điểm**: Write amplification lớn khi user có nhiều followers.

---

## 5.4 Like / Unlike

1. **Transaction**:
   - `INSERT` hoặc `DELETE` trong `post_like`.
   - Đồng thời `UPDATE post SET like_count = like_count ± 1`.
     - Có thể dùng **DB trigger** hoặc **application-level update** trong cùng transaction.
2. **Response**: Trả về `new likeCount`.
