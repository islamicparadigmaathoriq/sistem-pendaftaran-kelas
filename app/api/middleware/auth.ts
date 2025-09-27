// file: app/api/middleware/auth.ts

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export interface DecodedToken {
  id: string;
  email: string;
  role: 'ADMIN' | 'STUDENT';
  iat: number;
  exp: number;
}

export const authMiddleware = (handler: Function, roles: string[] = []) => {
  // Terima `params` sebagai argumen eksplisit di sini
  return async (req: NextRequest, { params }: { params: any }) => {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authentication failed. No token provided.' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
      (req as any).user = decoded;

      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return NextResponse.json(
          { message: 'Access denied. You do not have the required role.' },
          { status: 403 }
        );
      }

      // Teruskan `req` dan `params` ke handler
      return handler(req, { params });
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json({ message: 'Invalid or expired token.' }, { status: 401 });
    }
  };
};