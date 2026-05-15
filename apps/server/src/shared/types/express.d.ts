/**
 * Express Type Extensions
 * 
 * Extends Express Request interface to include custom properties
 */

import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'user' | 'admin' | 'superadmin';
        isEmailVerified: boolean;
      };
    }
  }
}

export {};
