import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { Request } from 'express';
import { RateLimitService } from '../services/rate-limit.service';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  private readonly logger = new Logger(CustomThrottlerGuard.name);

  constructor(private readonly rateLimitService: RateLimitService) {
    super();
  }

  async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
    throttler: string,
  ): Promise<boolean> {
    const { req, res } = this.getRequestResponse(context);
    const key = this.generateKey(context, req);
    const ttlMilliseconds = ttl * 1000;

    try {
      const { totalHits, timeToExpire } = await this.storageService.increment(
        key,
        ttlMilliseconds,
      );

      if (totalHits > limit) {
        // Log violation to database
        await this.logViolation(req, context, totalHits, limit, throttler);
        
        throw new ThrottlerException();
      }

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - totalHits));
      res.setHeader('X-RateLimit-Reset', new Date(Date.now() + timeToExpire).toISOString());

      return true;
    } catch (error) {
      if (error instanceof ThrottlerException) {
        throw error;
      }
      
      this.logger.error('Rate limiting error:', error);
      return true; // Allow request if rate limiting fails
    }
  }

  private async logViolation(
    req: Request,
    context: ExecutionContext,
    requestCount: number,
    limit: number,
    throttler: string,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      const ipAddress = this.getClientIp(req);
      const endpoint = this.getEndpoint(context);
      const userAgent = req.get('User-Agent');

      await this.rateLimitService.logViolation({
        userId,
        ipAddress,
        endpoint,
        violationType: throttler as any,
        requestCount,
        limit,
        userAgent,
        metadata: {
          method: req.method,
          url: req.url,
          headers: this.sanitizeHeaders(req.headers),
        },
      });
    } catch (error) {
      this.logger.error('Failed to log rate limit violation:', error);
    }
  }

  private getClientIp(req: Request): string {
    return (
      req.ip ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection as any)?.socket?.remoteAddress ||
      'unknown'
    );
  }

  private getEndpoint(context: ExecutionContext): string {
    const handler = context.getHandler();
    const className = context.getClass().name;
    const methodName = handler.name;
    return `${className}.${methodName}`;
  }

  private sanitizeHeaders(headers: any): Record<string, any> {
    const sanitized: Record<string, any> = {};
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
    
    for (const [key, value] of Object.entries(headers)) {
      if (!sensitiveHeaders.includes(key.toLowerCase())) {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  }
}
