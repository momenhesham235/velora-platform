import { describe, it, expect } from 'vitest';
import { redactBody } from '../security.middleware';

describe('redactBody', () => {
  it('redacts sensitive fields', () => {
    const result = redactBody({
      email: 'a@b.com',
      password: 'secret123',
      refreshToken: 'tok',
    }) as Record<string, string>;

    expect(result.email).toBe('a@b.com');
    expect(result.password).toBe('[REDACTED]');
    expect(result.refreshToken).toBe('[REDACTED]');
  });
});
