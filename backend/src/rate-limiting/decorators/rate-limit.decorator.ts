import { SetMetadata } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

export const RATE_LIMIT_KEY = 'rate_limit';

export interface RateLimitOptions {
  limit: number;
  ttl: number; // in milliseconds
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (context: any) => string;
}

export const RateLimit = (options: RateLimitOptions) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    // Apply Throttle decorator with the specified options
    const throttleDecorator = Throttle({
      [options.keyGenerator ? 'custom' : 'short']: {
        limit: options.limit,
        ttl: options.ttl / 1000, // Convert to seconds for Throttle
      },
    });

    // Apply the throttle decorator
    if (descriptor) {
      throttleDecorator(target, propertyKey, descriptor);
    }

    // Set metadata for custom rate limiting logic
    SetMetadata(RATE_LIMIT_KEY, options)(target, propertyKey, descriptor);
  };
};

// Predefined rate limit decorators for common scenarios
export const StrictRateLimit = (limit: number, ttl: number = 60000) =>
  RateLimit({ limit, ttl });

export const ModerateRateLimit = (limit: number, ttl: number = 300000) =>
  RateLimit({ limit, ttl });

export const LenientRateLimit = (limit: number, ttl: number = 3600000) =>
  RateLimit({ limit, ttl });

// Gossip-specific rate limits
export const GossipRateLimit = () =>
  RateLimit({ limit: 10, ttl: 60000 }); // 10 gossip posts per minute

export const VoteRateLimit = () =>
  RateLimit({ limit: 20, ttl: 60000 }); // 20 votes per minute

export const CommentRateLimit = () =>
  RateLimit({ limit: 15, ttl: 60000 }); // 15 comments per minute

export const AdminRateLimit = () =>
  RateLimit({ limit: 5, ttl: 60000 }); // 5 admin actions per minute
