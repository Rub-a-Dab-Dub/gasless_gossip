import { Injectable, type ExecutionContext } from "@nestjs/common"
import { ThrottlerGuard } from "@nestjs/throttler"
import type { RateLimitingService } from "../rate-limiting.service"

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  constructor(private rateLimitingService: RateLimitingService) {
    super()
  }

  async handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const identifier = this.getIdentifier(request)

    // Check whitelist
    const isWhitelisted = await this.rateLimitingService.isWhitelisted(identifier)
    if (isWhitelisted) {
      return true
    }

    // Get custom rate limit for this endpoint and role
    const endpoint = request.route?.path || request.url
    const role = request.user?.role

    const customLimit = await this.rateLimitingService.getEffectiveRateLimit(endpoint, role)

    if (customLimit) {
      limit = customLimit.limit + customLimit.burstLimit
      ttl = customLimit.ttl
    }

    try {
      return await super.handleRequest(context, limit, ttl)
    } catch (error) {
      // Log abuse
      await this.rateLimitingService.logAbuse(identifier, endpoint, request.method, limit, 1, {
        userAgent: request.headers["user-agent"],
        role,
      })
      throw error
    }
  }

  private getIdentifier(request: any): string {
    return request.user?.id || request.ip || "anonymous"
  }
}
