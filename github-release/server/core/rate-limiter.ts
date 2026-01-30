interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: RateLimitConfig;
  constructor(config: Partial<RateLimitConfig> = {}) {
    this.config = { windowMs: 60000, maxRequests: 100, ...config };
  }
  isAllowed(key: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(key) ?? [];
    const valid = timestamps.filter(t => now - t < this.config.windowMs);
    if (valid.length >= this.config.maxRequests) return false;
    valid.push(now);
    this.requests.set(key, valid);
    return true;
  }
  getRemainingRequests(key: string): number {
    const timestamps = this.requests.get(key) ?? [];
    const valid = timestamps.filter(t => Date.now() - t < this.config.windowMs);
    return Math.max(0, this.config.maxRequests - valid.length);
  }
}
export const rateLimiter = new RateLimiter();
