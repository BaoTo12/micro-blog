export interface User {
  id: bigint;
  email: string;
  activated: boolean;
  createdAt: Date;
  updatedAt?: Date;
}
