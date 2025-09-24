export interface UserProfile {
  userId: bigint;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;
  createdAt: Date;
  updatedAt?: Date;
}
