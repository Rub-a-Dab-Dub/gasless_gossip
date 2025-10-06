import { Injectable } from "@nestjs/common"
import { type Repository, MoreThan, LessThan } from "typeorm"
import { DegenScore } from "./entities/degen-score.entity"
import { LeaderboardBadge } from "./entities/leaderboard-badge.entity"
import { LeaderboardEvent } from "./entities/leaderboard-event.entity"
import type { ComputeDegenDto } from "./dto/compute-degen.dto"
import type { QueryLeaderboardDto } from "./dto/query-leaderboard.dto"
import type { AwardBadgeDto } from "./dto/award-badge.dto"
import type { ResetCycleDto } from "./dto/reset-cycle.dto"

@Injectable()
export class DegenLeaderboardService {
  private degenScoreRepo: Repository<DegenScore>
  private badgeRepo: Repository<LeaderboardBadge>
  private eventRepo: Repository<LeaderboardEvent>
  private redisClient: any // Redis client for caching

  constructor(repoFactory: any, redisClient?: any) {
    this.degenScoreRepo = repoFactory.getRepository(DegenScore)
    this.badgeRepo = repoFactory.getRepository(LeaderboardBadge)
    this.eventRepo = repoFactory.getRepository(LeaderboardEvent)
    this.redisClient = redisClient
  }

  async computeDegen(dto: ComputeDegenDto): Promise<DegenScore> {
    const { userId, username, category, totalBets, totalWagered, totalWon, totalLost } = dto

    // Calculate metrics
    const winRate = totalBets > 0 ? (totalWon / (totalWon + totalLost)) * 100 : 0
    const avgBetSize = totalBets > 0 ? totalWagered / totalBets : 0
    const riskScore = this.calculateRiskScore(avgBetSize, totalWagered, winRate)
    const score = this.calculateDegenScore(totalWagered, totalBets, riskScore, winRate)

    // Find or create score entry
    let degenScore = await this.degenScoreRepo.findOne({
      where: { userId, category, cycleId: dto.cycleId || "current" },
    })

    if (degenScore) {
      const oldRank = degenScore.rank
      degenScore.totalBets = totalBets
      degenScore.totalWagered = totalWagered
      degenScore.totalWon = totalWon
      degenScore.totalLost = totalLost
      degenScore.winRate = winRate
      degenScore.avgBetSize = avgBetSize
      degenScore.riskScore = riskScore
      degenScore.score = score

      const saved = await this.degenScoreRepo.save(degenScore)

      // Recalculate ranks
      await this.updateRanks(category, dto.cycleId || "current")

      // Check for rank changes
      const newScore = await this.degenScoreRepo.findOne({ where: { id: saved.id } })
      if (newScore && newScore.rank !== oldRank) {
        await this.createEvent({
          userId,
          eventType: "rank_change",
          category,
          data: { oldRank, newRank: newScore.rank, score },
          description: `Rank changed from ${oldRank} to ${newScore.rank}`,
        })
      }

      // Invalidate cache
      await this.invalidateCache(category, dto.cycleId)

      return newScore || saved
    } else {
      degenScore = this.degenScoreRepo.create({
        userId,
        username,
        category,
        totalBets,
        totalWagered,
        totalWon,
        totalLost,
        winRate,
        avgBetSize,
        riskScore,
        score,
        cycleId: dto.cycleId || "current",
        cycleStartDate: dto.cycleStartDate ? new Date(dto.cycleStartDate) : new Date(),
        cycleEndDate: dto.cycleEndDate ? new Date(dto.cycleEndDate) : undefined,
      })

      const saved = await this.degenScoreRepo.save(degenScore)
      await this.updateRanks(category, dto.cycleId || "current")

      return saved
    }
  }

  async getLeaderboard(query: QueryLeaderboardDto): Promise<DegenScore[]> {
    const { category = "overall", cycleId = "current", limit = 100, minScore } = query

    // Try cache first
    const cacheKey = `leaderboard:${category}:${cycleId}:${limit}`
    if (this.redisClient) {
      const cached = await this.redisClient.get(cacheKey)
      if (cached) return JSON.parse(cached)
    }

    const where: any = { category, cycleId }
    if (minScore) where.score = MoreThan(minScore)

    const leaderboard = await this.degenScoreRepo.find({
      where,
      order: { rank: "ASC" },
      take: limit,
    })

    // Cache for 10 seconds
    if (this.redisClient) {
      await this.redisClient.setex(cacheKey, 10, JSON.stringify(leaderboard))
    }

    return leaderboard
  }

  async getUserRank(userId: string, category: string, cycleId = "current"): Promise<DegenScore | null> {
    return this.degenScoreRepo.findOne({
      where: { userId, category, cycleId },
    })
  }

  async awardBadge(dto: AwardBadgeDto): Promise<LeaderboardBadge> {
    const badge = this.badgeRepo.create({
      userId: dto.userId,
      badgeType: dto.badgeType,
      badgeName: this.getBadgeName(dto.badgeType, dto.tier),
      description: this.getBadgeDescription(dto.badgeType, dto.tier),
      tier: dto.tier,
      awardedAt: new Date(),
      awardedBy: dto.awardedBy,
    })

    const saved = await this.badgeRepo.save(badge)

    // Update user's badge in score
    await this.degenScoreRepo.update({ userId: dto.userId }, { badge: dto.badgeType })

    // Create event
    await this.createEvent({
      userId: dto.userId,
      eventType: "badge_awarded",
      data: { badgeType: dto.badgeType },
      description: `Awarded ${badge.badgeName} badge`,
    })

    return saved
  }

  async resetCycle(dto: ResetCycleDto): Promise<{ archived: number; newCycleId: string }> {
    const { category, newCycleId = `cycle_${Date.now()}` } = dto

    // Archive current cycle
    const currentScores = await this.degenScoreRepo.find({
      where: { category, cycleId: "current" },
    })

    // Update to archived cycle
    await this.degenScoreRepo.update({ category, cycleId: "current" }, { cycleId: `archived_${Date.now()}` })

    // Create events
    for (const score of currentScores) {
      await this.createEvent({
        userId: score.userId,
        eventType: "cycle_reset",
        category,
        data: { oldCycleId: "current", newCycleId },
        description: `Cycle reset for ${category}`,
      })
    }

    // Invalidate cache
    await this.invalidateCache(category, "current")

    return { archived: currentScores.length, newCycleId }
  }

  async getUserBadges(userId: string): Promise<LeaderboardBadge[]> {
    return this.badgeRepo.find({
      where: { userId, isActive: true },
      order: { awardedAt: "DESC" },
    })
  }

  async getEvents(userId: string, limit = 50): Promise<LeaderboardEvent[]> {
    return this.eventRepo.find({
      where: { userId },
      order: { createdAt: "DESC" },
      take: limit,
    })
  }

  async exportEvents(category: string, startDate: Date, endDate: Date): Promise<LeaderboardEvent[]> {
    return this.eventRepo.find({
      where: {
        category,
        createdAt: MoreThan(startDate) && LessThan(endDate),
      },
      order: { createdAt: "DESC" },
    })
  }

  private calculateRiskScore(avgBetSize: number, totalWagered: number, winRate: number): number {
    // Higher bet size and total wagered = higher risk
    const betSizeScore = Math.min((avgBetSize / 1000) * 30, 30)
    const volumeScore = Math.min((totalWagered / 100000) * 40, 40)
    const winRateScore = Math.abs(50 - winRate) * 0.6 // Deviation from 50% = higher risk

    return Math.min(betSizeScore + volumeScore + winRateScore, 100)
  }

  private calculateDegenScore(totalWagered: number, totalBets: number, riskScore: number, winRate: number): number {
    // Weighted score calculation
    const volumeWeight = 0.4
    const frequencyWeight = 0.3
    const riskWeight = 0.2
    const performanceWeight = 0.1

    const volumeScore = Math.log10(totalWagered + 1) * 1000
    const frequencyScore = Math.log10(totalBets + 1) * 500
    const performanceScore = winRate * 10

    return (
      volumeScore * volumeWeight +
      frequencyScore * frequencyWeight +
      riskScore * riskWeight +
      performanceScore * performanceWeight
    )
  }

  private async updateRanks(category: string, cycleId: string): Promise<void> {
    const scores = await this.degenScoreRepo.find({
      where: { category, cycleId },
      order: { score: "DESC" },
    })

    for (let i = 0; i < scores.length; i++) {
      scores[i].rank = i + 1
      await this.degenScoreRepo.save(scores[i])
    }
  }

  private async invalidateCache(category: string, cycleId?: string): Promise<void> {
    if (!this.redisClient) return

    const pattern = `leaderboard:${category}:${cycleId || "*"}:*`
    const keys = await this.redisClient.keys(pattern)
    if (keys.length > 0) {
      await this.redisClient.del(...keys)
    }
  }

  private getBadgeName(badgeType: string, tier: string): string {
    const names: Record<string, string> = {
      whale: "Whale",
      degen: "Degen",
      risk_master: "Risk Master",
      high_roller: "High Roller",
      streak_king: "Streak King",
    }
    return `${tier.charAt(0).toUpperCase() + tier.slice(1)} ${names[badgeType] || badgeType}`
  }

  private getBadgeDescription(badgeType: string, tier: string): string {
    return `Awarded for exceptional ${badgeType} performance at ${tier} tier`
  }

  private async createEvent(data: Partial<LeaderboardEvent>): Promise<LeaderboardEvent> {
    const event = this.eventRepo.create(data)
    return this.eventRepo.save(event)
  }
}
