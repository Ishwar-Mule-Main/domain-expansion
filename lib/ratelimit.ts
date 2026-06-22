import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Upstash Redis client with graceful fallback if environment variables are missing
const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Helper function to create rate limit configurations
const createLimiter = (requests: number, window: string) => {
  const isMock = !redis || process.env.UPSTASH_REDIS_REST_URL?.includes("mock");

  if (isMock) {
    // Mock rate limiter for local testing without Upstash configured
    return {
      limit: async () => ({
        success: true,
        limit: requests,
        remaining: requests,
        reset: Date.now() + 60000,
      }),
    };
  }

  const limiter = new Ratelimit({
    redis: redis!,
    limiter: Ratelimit.slidingWindow(requests, window as any),
    analytics: true,
    prefix: "domain-expansion-ratelimit",
  });

  return {
    limit: async (ip: string) => {
      try {
        return await limiter.limit(ip);
      } catch (err) {
        console.error("Rate limiter API failure (failing open):", err);
        return {
          success: true,
          limit: requests,
          remaining: requests,
          reset: Date.now() + 60000,
        };
      }
    },
  };
};

// Leads Endpoint: max 3 submissions per IP per hour
export const leadsRateLimiter = createLimiter(3, "1 h");

// Contact Endpoint: max 3 submissions per IP per hour
export const contactRateLimiter = createLimiter(3, "1 h");

// TechGuild Waitlist: max 1 sign-up per IP per day
export const waitlistRateLimiter = createLimiter(1, "24 h");

// Admin Auth: max 5 requests per IP per 15 minutes
export const authRateLimiter = createLimiter(5, "15 m");
