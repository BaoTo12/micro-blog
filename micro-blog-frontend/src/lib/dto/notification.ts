export type NotificationType = 'LIKE' | 'FOLLOW' | 'COMMENT' | 'MENTION' | 'SYSTEM';

export interface Notification {
  id: bigint;
  recipientId: bigint;
  actorId?: bigint;
  type: NotificationType;
  objectType?: string;
  objectId?: bigint;
  payload?: any; // JSONB can be mapped to any
  isRead: boolean;
  createdAt: Date;
}
