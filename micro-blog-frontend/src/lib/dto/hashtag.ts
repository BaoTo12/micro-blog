export interface Hashtag {
  id: bigint;
  tag: string;
  normalizedTag: string;
  createdAt: Date;
}

export interface PostHashtag {
  postId: bigint;
  hashtagId: bigint;
}
