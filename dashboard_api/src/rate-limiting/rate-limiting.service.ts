import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { RateLimitConfig } from "./entities/rate-limit-config.entity"
import type { RateLimitWhitelist } from "./entities/rate-limit-whitelist.entity"
import type { RateLimitAbuseLog } from "./entities/rate-limit-abuse-log.entity"
import type { CreateRateLimitDto } from "./dto/create-rate-limit.dto"
import type { UpdateRateLimitDto } from "./dto/update-rate-limit.dto"
import type { CreateWhitelistDto } from "./dto/create-whitelist.dto"
import type { QueryAbuseLogsDto } from "./dto/query-abuse-logs.dto"

@Injectable()
export class RateLimitingService {
  private rateLimitConfigRepo: Repository<RateLimitConfig>
  private whitelistRepo: Repository<RateLimitWhitelist>
  private abuseLogRepo: Repository<RateLimitAbuseLog>

  constructor(
    rateLimitConfigRepo: Repository<RateLimitConfig>,
    whitelistRepo: Repository<RateLimitWhitelist>,
    abuseLogRepo: Repository<RateLimitAbuseLog>,
  ) {
    this.rateLimitConfigRepo = rateLimitConfigRepo
    this.whitelistRepo = whitelistRepo
    this.abuseLogRepo = abuseLogRepo
  }

  // Create throttler setup
  async createRateLimit(dto: CreateRateLimitDto): Promise<RateLimitConfig> {
    const config = this.rateLimitConfigRepo.create({
      ...dto,
      burstLimit: dto.burstLimit || 0,
      priority: dto.priority || 0,
    })
    return this.rateLimitConfigRepo.save(config)
  }

  // Read custom limits
  async getRateLimits(endpoint?: string, role?: string): Promise<RateLimitConfig[]> {
    const query = this.rateLimitConfigRepo
      .createQueryBuilder("config")
      .where("config.isActive = :isActive", { isActive: true })
      .orderBy("config.priority", "DESC")

    if (endpoint) {
      query.andWhere("(config.endpoint = :endpoint OR config.endpoint IS NULL)", {
        endpoint,
      })
    }

    if (role) {
      query.andWhere("(config.role = :role OR config.role IS NULL)", { role })
    }

    return query.getMany()
  }

  async getRateLimitById(id: string): Promise<RateLimitConfig> {
    return this.rateLimitConfigRepo.findOne({ where: { id } })
  }

  // Get effective rate limit for a specific context
  async getEffectiveRateLimit(endpoint: string, role?: string): Promise<RateLimitConfig | null> {
    const limits = await this.getRateLimits(endpoint, role)

    // Return the highest priority matching limit
    if (limits.length > 0) {
      return limits[0]
    }

    // Return default global limit if exists
    const defaultLimit = await this.rateLimitConfigRepo.findOne({
      where: { endpoint: null, role: null, isActive: true },
      order: { priority: "DESC" },
    })

    return defaultLimit
  }

  // Update burst handling
  async updateRateLimit(id: string, dto: UpdateRateLimitDto): Promise<RateLimitConfig> {
    await this.rateLimitConfigRepo.update(id, dto)
    return this.getRateLimitById(id)
  }

  async deleteRateLimit(id: string): Promise<void> {
    await this.rateLimitConfigRepo.delete(id)
  }

  // Whitelist management
  async addToWhitelist(dto: CreateWhitelistDto): Promise<RateLimitWhitelist> {
    const whitelist = this.whitelistRepo.create(dto)
    return this.whitelistRepo.save(whitelist)
  }

  async removeFromWhitelist(id: string): Promise<void> {
    await this.whitelistRepo.delete(id)
  }

  async getWhitelist(): Promise<RateLimitWhitelist[]> {
    return this.whitelistRepo.find({
      where: { isActive: true },
      order: { createdAt: "DESC" },
    })
  }

  async isWhitelisted(identifier: string): Promise<boolean> {
    const entry = await this.whitelistRepo.findOne({
      where: { identifier, isActive: true },
    })

    if (!entry) return false

    // Check if whitelist entry has expired
    if (entry.expiresAt && new Date() > entry.expiresAt) {
      await this.whitelistRepo.update(entry.id, { isActive: false })
      return false
    }

    return true
  }

  // Abuse logging
  async logAbuse(
    identifier: string,
    endpoint: string,
    method: string,
    requestCount: number,
    limitExceeded: number,
    metadata?: Record<string, any>,
  ): Promise<RateLimitAbuseLog> {
    const severity = this.calculateSeverity(limitExceeded, requestCount)

    const log = this.abuseLogRepo.create({
      identifier,
      endpoint,
      method,
      requestCount,
      limitExceeded,
      metadata,
      severity,
    })

    return this.abuseLogRepo.save(log)
  }

  async getAbuseLogs(query: QueryAbuseLogsDto): Promise<{
    logs: RateLimitAbuseLog[]
    total: number
  }> {
    const qb = this.abuseLogRepo.createQueryBuilder("log")

    if (query.identifier) {
      qb.andWhere("log.identifier = :identifier", {
        identifier: query.identifier,
      })
    }

    if (query.endpoint) {
      qb.andWhere("log.endpoint = :endpoint", { endpoint: query.endpoint })
    }

    if (query.severity) {
      qb.andWhere("log.severity = :severity", { severity: query.severity })
    }

    if (query.startDate && query.endDate) {
      qb.andWhere("log.createdAt BETWEEN :startDate AND :endDate", {
        startDate: query.startDate,
        endDate: query.endDate,
      })
    }

    qb.orderBy("log.createdAt", "DESC")

    const total = await qb.getCount()

    if (query.limit) {
      qb.limit(query.limit)
    }

    if (query.offset) {
      qb.offset(query.offset)
    }

    const logs = await qb.getMany()

    return { logs, total }
  }

  async getAbuseStats(
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalAbuses: number
    bySeverity: Record<string, number>
    topAbusers: Array<{ identifier: string; count: number }>
    topEndpoints: Array<{ endpoint: string; count: number }>
  }> {
    const qb = this.abuseLogRepo.createQueryBuilder("log")

    if (startDate && endDate) {
      qb.where("log.createdAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
    }

    const totalAbuses = await qb.getCount()

    // Count by severity
    const severityCounts = await this.abuseLogRepo
      .createQueryBuilder("log")
      .select("log.severity", "severity")
      .addSelect("COUNT(*)", "count")
      .groupBy("log.severity")
      .getRawMany()

    const bySeverity = severityCounts.reduce(
      (acc, { severity, count }) => {
        acc[severity] = Number.parseInt(count)
        return acc
      },
      {} as Record<string, number>,
    )

    // Top abusers
    const topAbusers = await this.abuseLogRepo
      .createQueryBuilder("log")
      .select("log.identifier", "identifier")
      .addSelect("COUNT(*)", "count")
      .groupBy("log.identifier")
      .orderBy("count", "DESC")
      .limit(10)
      .getRawMany()

    // Top endpoints
    const topEndpoints = await this.abuseLogRepo
      .createQueryBuilder("log")
      .select("log.endpoint", "endpoint")
      .addSelect("COUNT(*)", "count")
      .groupBy("log.endpoint")
      .orderBy("count", "DESC")
      .limit(10)
      .getRawMany()

    return {
      totalAbuses,
      bySeverity,
      topAbusers: topAbusers.map((a) => ({
        identifier: a.identifier,
        count: Number.parseInt(a.count),
      })),
      topEndpoints: topEndpoints.map((e) => ({
        endpoint: e.endpoint,
        count: Number.parseInt(e.count),
      })),
    }
  }

  // Dynamic adjustment
  async adjustRateLimitDynamically(
    endpoint: string,
    role: string,
    adjustment: { ttl?: number; limit?: number; burstLimit?: number },
  ): Promise<RateLimitConfig> {
    const existingLimit = await this.rateLimitConfigRepo.findOne({
      where: { endpoint, role, isActive: true },
    })

    if (existingLimit) {
      return this.updateRateLimit(existingLimit.id, adjustment)
    }

    // Create new limit if doesn't exist
    return this.createRateLimit({
      name: `Dynamic limit for ${endpoint} - ${role}`,
      endpoint,
      role,
      ttl: adjustment.ttl || 60,
      limit: adjustment.limit || 100,
      burstLimit: adjustment.burstLimit || 0,
    })
  }

  private calculateSeverity(limitExceeded: number, requestCount: number): "low" | "medium" | "high" | "critical" {
    const ratio = limitExceeded / requestCount

    if (ratio > 10 || requestCount > 1000) return "critical"
    if (ratio > 5 || requestCount > 500) return "high"
    if (ratio > 2 || requestCount > 200) return "medium"
    return "low"
  }
}
