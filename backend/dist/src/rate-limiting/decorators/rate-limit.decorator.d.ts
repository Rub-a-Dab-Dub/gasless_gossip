export declare const RATE_LIMIT_KEY = "rate_limit";
export interface RateLimitOptions {
    limit: number;
    ttl: number;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
    keyGenerator?: (context: any) => string;
}
export declare const RateLimit: (options: RateLimitOptions) => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
export declare const StrictRateLimit: (limit: number, ttl?: number) => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
export declare const ModerateRateLimit: (limit: number, ttl?: number) => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
export declare const LenientRateLimit: (limit: number, ttl?: number) => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
export declare const GossipRateLimit: () => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
export declare const VoteRateLimit: () => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
export declare const CommentRateLimit: () => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
export declare const AdminRateLimit: () => (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => void;
