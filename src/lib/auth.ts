import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'royal-furniture-super-secret-key-change-in-production';

export interface TokenPayload {
  userId: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export function signToken(payload: Omit<TokenPayload, 'exp' | 'iat'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export function getUserFromRequest(req: NextRequest): TokenPayload | null {
  const token = req.cookies.get('rf_auth_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}
