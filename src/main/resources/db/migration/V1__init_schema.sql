CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- TODO Core user table (named `users`)
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email varchar(255),
  password varchar(255),
  activated boolean NOT NULL DEFAULT true,
  lang_key varchar(10),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz
);

--TODO POST
CREATE TABLE IF NOT EXISTS post (
  id BIGSERIAL PRIMARY KEY,
  author_id bigint NOT NULL,
  title VARCHAR(125) NOT NULL,
  content TEXT NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  like_count integer NOT NULL DEFAULT 0,
  comment_count integer NOT NULL DEFAULT 0,
  visibility varchar(20) NOT NULL DEFAULT 'PUBLIC',
  version bigint NOT NULL DEFAULT 0,
  CONSTRAINT fk_post_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT chk_post_visibility CHECK (visibility IN ('PUBLIC','PRIVATE','UNLISTED'))
);

ALTER TABLE post
ADD COLUMN IF NOT EXISTS tsv_tile_content tsvector GENERATED ALWAYS AS
(to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(content, ''))) STORED;

-- ! Indexes for post
-- Purpose:
--  - Optimize common queries:
--    * idx_post_author_created: fetch a user's posts ordered by creation time.
--    * idx_post_created: latest posts globally.
--    * idx_post_created_public: latest public posts (partial index, smaller & faster).
-- Notes:
--  - Adjust columns and ordering based on actual query patterns.
CREATE INDEX IF NOT EXISTS idx_post_author_created ON post (author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_created ON post (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_created_public ON post (created_at DESC) WHERE visibility = 'PUBLIC';

-- ! Full-text (GIN) index for content
CREATE INDEX IF NOT EXISTS idx_post_content_gin ON post USING gin (to_tsvector('english', content));

-- ! Trigram index for fuzzy substring searches
CREATE INDEX IF NOT EXISTS idx_post_content_trgm ON post USING gin (content gin_trgm_ops);

--TODO FOLLOW table
-- Follower = người theo dõi (người bấm nút follow bạn).
-- Followee = người được theo dõi (người mà bạn bấm follow).
CREATE TABLE IF NOT EXISTS follow (
  id BIGSERIAL PRIMARY KEY,
  follower_id bigint NOT NULL,
  followee_id bigint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_follow_followee FOREIGN KEY (followee_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_follow_follower FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes to support follower/followee lookups
CREATE INDEX IF NOT EXISTS idx_follow_follower ON follow (follower_id);
CREATE INDEX IF NOT EXISTS idx_follow_followee ON follow (followee_id);

-- --------------------------------------------------------------------------------
-- TODO post_like
-- --------------------------------------------------------------------------------
-- Purpose:
--  - Track individual user likes for posts.
--  - Post likes are stored separately so you can enforce one-like-per-user and
--    also show like lists.
-- Important:
--  - A trigger keeps post.like_count in sync (denormalized counter).
CREATE TABLE IF NOT EXISTS post_like (
  id BIGSERIAL PRIMARY KEY,
  post_id bigint NOT NULL,
  user_id bigint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_postlike_post FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  CONSTRAINT fk_postlike_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT uk_postlike_unique UNIQUE (post_id, user_id) -- Prevent duplicate likes by same user for same post
);

CREATE INDEX IF NOT EXISTS idx_like_post ON post_like (post_id);
CREATE INDEX IF NOT EXISTS idx_like_user ON post_like (user_id);

-- --------------------------------------------------------------------------------
--TODO COMMENT table
-- --------------------------------------------------------------------------------
-- Purpose:
--  - Store comments attached to posts.
--  - comment_count on post is kept in sync with a trigger.
-- Notes:
--  - If you need threaded comments, add parent_comment_id (nullable FK to comment.id).
CREATE TABLE IF NOT EXISTS comment (
  id BIGSERIAL PRIMARY KEY,
  post_id bigint NOT NULL,
  author_id bigint NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_comment_post FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  CONSTRAINT fk_comment_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index to read comments for a post, newest first
CREATE INDEX IF NOT EXISTS idx_comment_post ON comment (post_id, created_at DESC);


--! SUPPORTING ENTITIES (profiles, counters, bookmarks, attachments, hashtags)
CREATE TABLE IF NOT EXISTS user_profile (
  user_id bigint PRIMARY KEY,
  display_name varchar(100),
  bio text,
  avatar_url text,
  location varchar(255),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  CONSTRAINT fk_user_profile_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

--TODO saved_post (bookmarks)
CREATE TABLE IF NOT EXISTS saved_post (
  user_id bigint NOT NULL,
  post_id bigint NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_saved_post_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_saved_post_post FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, post_id)

);

CREATE INDEX IF NOT EXISTS idx_saved_post_user ON saved_post (user_id, created_at DESC);


--TODO hashtag and post_hashtag join table
CREATE TABLE IF NOT EXISTS hashtag (
  id BIGSERIAL PRIMARY KEY,
  tag varchar(100) NOT NULL,
  normalized_tag varchar(100) NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hashtag_normalized ON hashtag (normalized_tag);

CREATE TABLE IF NOT EXISTS post_hashtag (
  post_id bigint NOT NULL,
  hashtag_id bigint NOT NULL,
  CONSTRAINT fk_post_hashtag_post FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  CONSTRAINT fk_post_hashtag_hashtag FOREIGN KEY (hashtag_id) REFERENCES hashtag(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, hashtag_id)
);

CREATE INDEX IF NOT EXISTS idx_post_hashtag_post ON post_hashtag (post_id);
CREATE INDEX IF NOT EXISTS idx_post_hashtag_hashtag ON post_hashtag (hashtag_id);

-- --------------------------------------------------------------------------------
--TODO notification
-- --------------------------------------------------------------------------------
-- Purpose:
--  - Store user notifications (likes, follows, comments, mentions, system alerts).
--  - payload JSONB allows flexible data for different notification types.
-- Columns:
--  - recipient_id: who receives the notification (FK -> users).
--  - actor_id: the user who caused the notification (nullable for system).
-- Notes:
--  - Consider TTL/archiving strategy for old notifications to keep table small.
CREATE TABLE IF NOT EXISTS notification (
  id BIGSERIAL PRIMARY KEY,
  recipient_id bigint NOT NULL,
  actor_id bigint,
  type varchar(50) NOT NULL,    -- LIKE, FOLLOW, COMMENT, MENTION, SYSTEM
  object_type varchar(50),
  object_id bigint,
  payload jsonb,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_notification_recipient FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_notification_actor FOREIGN KEY (actor_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_notification_recipient ON notification (recipient_id, is_read, created_at DESC);


-- --------------------------------------------------------------------------------
--TODO user_block
-- --------------------------------------------------------------------------------
-- Purpose:
--  - Track blocked relationships (blocker -> blocked) to enforce content/hiding rules.
-- Constraints:
--  - Unique constraint to avoid duplicates.
--  - check to avoid self-blocking.
-- Notes:
--  - Enforce block checks at application level when building feeds and permissions.
CREATE TABLE IF NOT EXISTS user_block (
  id BIGSERIAL PRIMARY KEY,
  blocker_id bigint NOT NULL,
  blocked_id bigint NOT NULL,
  CONSTRAINT uq_user_block UNIQUE (blocker_id, blocked_id),
  CONSTRAINT chk_user_block_no_self CHECK (blocker_id <> blocked_id),
  CONSTRAINT fk_user_block_blocker FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_block_blocked FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_block_blocker ON user_block (blocker_id);
CREATE INDEX IF NOT EXISTS idx_user_block_blocked ON user_block (blocked_id);

--TODO content_report (moderation)
CREATE TABLE IF NOT EXISTS content_report (
  id BIGSERIAL PRIMARY KEY,
  reporter_id bigint,
  post_id bigint,
  reason varchar(255),
  details text,
  status varchar(20) NOT NULL DEFAULT 'OPEN', -- OPEN, IN_REVIEW, RESOLVED, DISMISSED
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz,
  CONSTRAINT fk_content_report_reporter FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_content_report_post FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE SET NULL,
  CONSTRAINT chk_content_report_status CHECK (status IN ('OPEN', 'IN_REVIEW', 'RESOLVED', 'DISMISSED'))
);

CREATE INDEX IF NOT EXISTS idx_content_report_status ON content_report (status);
CREATE INDEX IF NOT EXISTS idx_content_report_post ON content_report (post_id);

-- --------------------------------------------------------------------------------
--TODO user_feed (durable feed backup / fan-out storage)
-- --------------------------------------------------------------------------------
-- Purpose:
--  - Durable per-user feed storage for fast read of timeline (user_id, post_id).
--  - score column used for ordering (e.g., epoch millis).
-- Usage patterns:
--  - Either populated by fan-out-on-write (push) or feed builder jobs (pull).
--  - This table is optional — some systems compute feeds on the fly instead.
CREATE TABLE IF NOT EXISTS user_feed (
  user_id bigint NOT NULL,
  post_id bigint NOT NULL,
  score bigint NOT NULL, -- epoch millis for ordering
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_user_feed_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_feed_post FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_user_feed_user_score ON user_feed (user_id, score DESC);

