/**
 * Rate Limiting Utilities
 * Implements rate limiting using Upstash Redis to prevent spam and abuse
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Check if Redis is configured
const isRedisConfigured = () => {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
};

// Initialize Redis only if configured
let redis: Redis | null = null;
if (isRedisConfigured()) {
  redis = Redis.fromEnv();
}

/**
 * Contact form rate limiter: 5 requests per hour per IP
 */
export const contactFormLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '3600 s'),
  analytics: true,
  prefix: 'ratelimit:contact',
}) : null;

/**
 * Email sending rate limiter: 2 requests per hour per IP (more restrictive)
 */
export const emailSendLimiter = redis ? new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, '3600 s'),
  analytics: true,
  prefix: 'ratelimit:email',
}) : null;

/**
 * Check rate limit and return result with headers
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ 
  success: boolean; 
  headers: Record<string, string>;
  bypass?: boolean;
}> {
  // If rate limiting not configured, allow in development but warn
  if (!limiter) {
    if (process.env.NODE_ENV === 'production') {
      console.error('⚠️ CRITICAL: Rate limiting not configured in production!');
    }
    return {
      success: true,
      bypass: true,
      headers: {
        'X-RateLimit-Warning': 'Rate limiting not configured',
      },
    };
  }

  const { success, limit, reset, remaining } = await limiter.limit(identifier);
  
  return {
    success,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': new Date(reset).toISOString(),
    },
  };
}

/**
 * Get identifier from request (IP address)
 */
export function getRequestIdentifier(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  return 'unknown-ip';
}

