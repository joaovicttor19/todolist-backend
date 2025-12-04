import { Request } from 'express';

export interface AuthUser {
  userId: number;
  email: string;
}

export type AuthRequest = Request & { user: AuthUser };
