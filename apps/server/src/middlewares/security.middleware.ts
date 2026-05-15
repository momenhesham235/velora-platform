import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Application } from 'express';

const SENSITIVE_BODY_KEYS = new Set([
  'password',
  'confirmPassword',
  'newPassword',
  'refreshToken',
  'token',
]);

/**
 * Redact sensitive fields from request body before logging
 */
export function redactBody(body: unknown): unknown {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return body;
  }

  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    redacted[key] = SENSITIVE_BODY_KEYS.has(key) ? '[REDACTED]' : value;
  }
  return redacted;
}

export const helmetMiddleware = helmet();

/** General API rate limit */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    statusCode: 429,
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

/** Stricter limit for auth endpoints */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    statusCode: 429,
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

export function applySecurityMiddleware(app: Application): void {
  app.use(helmetMiddleware);
  app.use('/api', apiRateLimiter);
  app.use('/api/auth', authRateLimiter);
}
