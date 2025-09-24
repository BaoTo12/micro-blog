export type PostVisibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED';

export interface Post {
  id: bigint;
  authorId: bigint;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  likeCount: number;
  commentCount: number;
  visibility: PostVisibility;
  version: bigint;
}
