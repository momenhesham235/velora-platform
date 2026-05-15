/**
 * Express Type Extensions
 * 
 * Extends Express Request interface to include custom properties
 */

import { WorkspaceContext } from '@velora/types';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        id: string;
        email: string;
        role: 'user' | 'admin' | 'superadmin';
        isEmailVerified: boolean;
      };
      workspaceContext?: WorkspaceContext;
    }
  }
}

export {};
