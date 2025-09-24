export interface Comment {
  id: bigint;
  postId: bigint;
  authorId: bigint;
  content: string;
  createdAt: Date;
}
