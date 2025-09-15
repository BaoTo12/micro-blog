ALTER TABLE post DROP COLUMN tsv_tile_content;
ALTER TABLE post DROP COLUMN title;

ALTER TABLE post
ADD COLUMN IF NOT EXISTS tsv_content tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;

