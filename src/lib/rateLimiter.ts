// Simple in-memory rate limiter for serverless environment
// In production, consider using Redis or a database for distributed rate limiting

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 readings per 5 minutes

export function checkRateLimit(clientIp: string): {
  allowed: boolean;
  message?: string;
  remainingTime?: number;
  remainingMinutes?: number;
  remainingSeconds?: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIp);

  // Clean up expired entries periodically (simple cleanup)
  if (Math.random() < 0.01) {
    cleanupExpiredEntries(now);
  }

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitMap.set(clientIp, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    const remainingTime = entry.resetTime - now;
    const remainingMinutes = Math.ceil(remainingTime / 60000);
    const remainingSeconds = Math.ceil(remainingTime / 1000);
    
    return {
      allowed: false,
      message: `Has alcanzado el límite de lecturas. Por favor espera ${remainingMinutes} minutos antes de realizar otra consulta.`,
      remainingTime,
      remainingMinutes,
      remainingSeconds
    };
  }

  // Increment count
  entry.count++;
  rateLimitMap.set(clientIp, entry);
  
  return { allowed: true };
}

function cleanupExpiredEntries(now: number): void {
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}

export function getRemainingRequests(clientIp: string): number {
  const entry = rateLimitMap.get(clientIp);
  const now = Date.now();
  
  if (!entry || now > entry.resetTime) {
    return RATE_LIMIT_MAX_REQUESTS;
  }
  
  return Math.max(0, RATE_LIMIT_MAX_REQUESTS - entry.count);
}
