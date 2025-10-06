import { Controller, Get, Post, Put, Delete } from "@nestjs/common"
import type { RateLimitingService } from "./rate-limiting.service"
import type { CreateRateLimitDto } from "./dto/create-rate-limit.dto"
import type { UpdateRateLimitDto } from "./dto/update-rate-limit.dto"
import type { CreateWhitelistDto } from "./dto/create-whitelist.dto"
import type { QueryAbuseLogsDto } from "./dto/query-abuse-logs.dto"

@Controller("rate-limiting")
export class RateLimitingController {
  constructor(private readonly rateLimitingService: RateLimitingService) {}

  // Throttler setup
  @Post("configs")
  async createRateLimit(dto: CreateRateLimitDto) {
    return this.rateLimitingService.createRateLimit(dto)
  }

  // Custom limits
  @Get("configs")
  async getRateLimits(endpoint?: string, role?: string) {
    return this.rateLimitingService.getRateLimits(endpoint, role)
  }

  @Get("configs/:id")
  async getRateLimitById(id: string) {
    return this.rateLimitingService.getRateLimitById(id)
  }

  @Get("configs/effective/:endpoint")
  async getEffectiveRateLimit(endpoint: string, role?: string) {
    return this.rateLimitingService.getEffectiveRateLimit(endpoint, role)
  }

  // Burst handling
  @Put("configs/:id")
  async updateRateLimit(id: string, dto: UpdateRateLimitDto) {
    return this.rateLimitingService.updateRateLimit(id, dto)
  }

  @Delete("configs/:id")
  async deleteRateLimit(id: string) {
    await this.rateLimitingService.deleteRateLimit(id)
    return { message: "Rate limit deleted successfully" }
  }

  // Whitelist
  @Post("whitelist")
  async addToWhitelist(dto: CreateWhitelistDto) {
    return this.rateLimitingService.addToWhitelist(dto)
  }

  @Get("whitelist")
  async getWhitelist() {
    return this.rateLimitingService.getWhitelist()
  }

  @Delete("whitelist/:id")
  async removeFromWhitelist(id: string) {
    await this.rateLimitingService.removeFromWhitelist(id)
    return { message: "Removed from whitelist successfully" }
  }

  @Get("whitelist/check/:identifier")
  async checkWhitelist(identifier: string) {
    const isWhitelisted = await this.rateLimitingService.isWhitelisted(identifier)
    return { identifier, isWhitelisted }
  }

  // Abuse logs
  @Get("abuse-logs")
  async getAbuseLogs(query: QueryAbuseLogsDto) {
    return this.rateLimitingService.getAbuseLogs(query)
  }

  @Get("abuse-logs/stats")
  async getAbuseStats(startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : undefined
    const end = endDate ? new Date(endDate) : undefined
    return this.rateLimitingService.getAbuseStats(start, end)
  }

  // Dynamic adjust
  @Post("configs/adjust")
  async adjustRateLimitDynamically(body: {
    endpoint: string
    role: string
    adjustment: { ttl?: number; limit?: number; burstLimit?: number }
  }) {
    return this.rateLimitingService.adjustRateLimitDynamically(body.endpoint, body.role, body.adjustment)
  }
}
