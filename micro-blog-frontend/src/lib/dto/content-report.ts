export type ReportStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'DISMISSED';

export interface ContentReport {
  id: bigint;
  reporterId?: bigint;
  postId?: bigint;
  reason?: string;
  details?: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt?: Date;
}
