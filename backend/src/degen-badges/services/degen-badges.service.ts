import { Injectable, ConflictException, Logger } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { EventEmitter2 } from "@nestjs/event-emitter"
import { type DegenBadge, DegenBadgeType, DegenBadgeRarity } from "../entities/degen-badge.entity"
import type { AwardBadgeDto, BatchAwardBadgeDto } from "../dto/award-badge.dto"
import type { DegenBadgeResponseDto, DegenBadgeStatsDto } from "../dto/degen-badge-response.dto"
import type { StellarBadgeService } from "./stellar-badge.service"
import { BadgeAwardedEvent } from "../events/badge-awarded.event"

@Injectable()
export class DegenBadgesService {
  private readonly logger = new Logger(DegenBadgesService.name)

  constructor(
    private readonly degenBadgeRepository: Repository<DegenBadge>,
    private readonly stellarBadgeService: StellarBadgeService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async awardBadge(awardBadgeDto: AwardBadgeDto): Promise<DegenBadgeResponseDto> {
    const { userId, badgeType, achievementData, mintToken = true, customRewardAmount } = awardBadgeDto

    // Check if user already has this badge type
    const existingBadge = await this.degenBadgeRepository.findOne({
      where: { userId, badgeType, isActive: true },
    })

    if (existingBadge) {
      throw new ConflictException(`User already has ${badgeType} badge`)
    }

    // Get badge configuration
    const badgeConfig = this.getBadgeConfiguration(badgeType)

    // Create badge criteria based on achievement data
    const criteria = this.buildCriteria(badgeType, achievementData)

    // Create badge entity
    const badge = this.degenBadgeRepository.create({
      userId,
      badgeType,
      rarity: badgeConfig.rarity,
      criteria,
      description: badgeConfig.description,
      imageUrl: badgeConfig.imageUrl,
      rewardAmount: customRewardAmount || badgeConfig.rewardAmount,
    })

    // Save badge to database
    const savedBadge = await this.degenBadgeRepository.save(badge)

    // Mint Stellar token if requested
    if (mintToken) {
      try {
        const stellarResult = await this.stellarBadgeService.mintBadgeToken(
          userId,
          badgeType,
          savedBadge.rewardAmount || 0,
        )

        savedBadge.txId = stellarResult.transactionId
        savedBadge.stellarAssetCode = stellarResult.assetCode
        savedBadge.stellarAssetIssuer = stellarResult.assetIssuer

        await this.degenBadgeRepository.save(savedBadge)
      } catch (error) {
        this.logger.error(`Failed to mint Stellar token for badge ${savedBadge.id}:`, error)
        // Don't fail the badge award if Stellar minting fails
      }
    }

    // Emit badge awarded event
    this.eventEmitter.emit("badge.awarded", new BadgeAwardedEvent(savedBadge, achievementData))

    this.logger.log(`Awarded ${badgeType} badge to user ${userId}`)
    return this.mapToResponseDto(savedBadge)
  }

  async batchAwardBadges(batchAwardDto: BatchAwardBadgeDto): Promise<DegenBadgeResponseDto[]> {
    const { userIds, badgeType, mintTokens = false } = batchAwardDto
    const results: DegenBadgeResponseDto[] = []

    for (const userId of userIds) {
      try {
        const badge = await this.awardBadge({
          userId,
          badgeType,
          mintToken: mintTokens,
        })
        results.push(badge)
      } catch (error) {
        this.logger.error(`Failed to award badge to user ${userId}:`, error)
        // Continue with other users
      }
    }

    return results
  }

  async getUserBadges(userId: string): Promise<DegenBadgeResponseDto[]> {
    const badges = await this.degenBadgeRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: "DESC" },
    })

    return badges.map((badge) => this.mapToResponseDto(badge))
  }

  async getUserBadgeStats(userId: string): Promise<DegenBadgeStatsDto> {
    const badges = await this.degenBadgeRepository.find({
      where: { userId, isActive: true },
    })

    const badgesByType = badges.reduce(
      (acc, badge) => {
        acc[badge.badgeType] = (acc[badge.badgeType] || 0) + 1
        return acc
      },
      {} as Record<DegenBadgeType, number>,
    )

    const badgesByRarity = badges.reduce(
      (acc, badge) => {
        acc[badge.rarity] = (acc[badge.rarity] || 0) + 1
        return acc
      },
      {} as Record<DegenBadgeRarity, number>,
    )

    const totalRewards = badges.reduce((sum, badge) => sum + (badge.rewardAmount || 0), 0)
    const latestBadge = badges.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
    const rarestBadge = this.findRarestBadge(badges)

    return {
      totalBadges: badges.length,
      badgesByType,
      badgesByRarity,
      totalRewards,
      latestBadge: latestBadge ? this.mapToResponseDto(latestBadge) : undefined,
      rarestBadge: rarestBadge ? this.mapToResponseDto(rarestBadge) : undefined,
    }
  }

  async checkBadgeEligibility(userId: string, badgeType: DegenBadgeType, userActivity: any): Promise<boolean> {
    const badgeConfig = this.getBadgeConfiguration(badgeType)

    // Check if user already has this badge
    const existingBadge = await this.degenBadgeRepository.findOne({
      where: { userId, badgeType, isActive: true },
    })

    if (existingBadge) {
      return false
    }

    // Check eligibility based on badge type and user activity
    return this.evaluateBadgeCriteria(badgeType, badgeConfig.criteria, userActivity)
  }

  private getBadgeConfiguration(badgeType: DegenBadgeType) {
    const configs = {
      [DegenBadgeType.HIGH_ROLLER]: {
        rarity: DegenBadgeRarity.RARE,
        description: "Awarded for placing high-value bets",
        imageUrl: "/badges/high-roller.png",
        rewardAmount: 100,
        criteria: { minAmount: 10000 },
      },
      [DegenBadgeType.RISK_TAKER]: {
        rarity: DegenBadgeRarity.COMMON,
        description: "Awarded for taking high-risk positions",
        imageUrl: "/badges/risk-taker.png",
        rewardAmount: 50,
        criteria: { riskLevel: 8 },
      },
      [DegenBadgeType.STREAK_MASTER]: {
        rarity: DegenBadgeRarity.EPIC,
        description: "Awarded for consecutive wins",
        imageUrl: "/badges/streak-master.png",
        rewardAmount: 500,
        criteria: { streakLength: 10 },
      },
      [DegenBadgeType.WHALE_HUNTER]: {
        rarity: DegenBadgeRarity.EPIC,
        description: "Awarded for defeating whale opponents",
        imageUrl: "/badges/whale-hunter.png",
        rewardAmount: 750,
        criteria: { minAmount: 50000, conditions: ["beat_whale"] },
      },
      [DegenBadgeType.DIAMOND_HANDS]: {
        rarity: DegenBadgeRarity.RARE,
        description: "Awarded for holding positions under pressure",
        imageUrl: "/badges/diamond-hands.png",
        rewardAmount: 200,
        criteria: { timeframe: "24h", conditions: ["hold_under_pressure"] },
      },
      [DegenBadgeType.DEGEN_LEGEND]: {
        rarity: DegenBadgeRarity.LEGENDARY,
        description: "The ultimate degen achievement",
        imageUrl: "/badges/degen-legend.png",
        rewardAmount: 2500,
        criteria: { minAmount: 100000, streakLength: 20, riskLevel: 10 },
      },
    }

    return configs[badgeType]
  }

  private buildCriteria(badgeType: DegenBadgeType, achievementData?: any) {
    const baseConfig = this.getBadgeConfiguration(badgeType)

    return {
      ...baseConfig.criteria,
      achievedAt: new Date(),
      achievementData: achievementData || {},
    }
  }

  private evaluateBadgeCriteria(badgeType: DegenBadgeType, criteria: any, userActivity: any): boolean {
    switch (badgeType) {
      case DegenBadgeType.HIGH_ROLLER:
        return userActivity.maxBetAmount >= criteria.minAmount

      case DegenBadgeType.RISK_TAKER:
        return userActivity.maxRiskLevel >= criteria.riskLevel

      case DegenBadgeType.STREAK_MASTER:
        return userActivity.currentStreak >= criteria.streakLength

      case DegenBadgeType.WHALE_HUNTER:
        return userActivity.maxBetAmount >= criteria.minAmount && userActivity.defeatedWhales > 0

      case DegenBadgeType.DIAMOND_HANDS:
        return userActivity.holdDuration >= 24 * 60 * 60 * 1000 // 24 hours

      case DegenBadgeType.DEGEN_LEGEND:
        return (
          userActivity.maxBetAmount >= criteria.minAmount &&
          userActivity.currentStreak >= criteria.streakLength &&
          userActivity.maxRiskLevel >= criteria.riskLevel
        )

      default:
        return false
    }
  }

  private findRarestBadge(badges: DegenBadge[]): DegenBadge | undefined {
    const rarityOrder = {
      [DegenBadgeRarity.LEGENDARY]: 4,
      [DegenBadgeRarity.EPIC]: 3,
      [DegenBadgeRarity.RARE]: 2,
      [DegenBadgeRarity.COMMON]: 1,
    }

    return badges.reduce(
      (rarest, current) => {
        if (!rarest || rarityOrder[current.rarity] > rarityOrder[rarest.rarity]) {
          return current
        }
        return rarest
      },
      undefined as DegenBadge | undefined,
    )
  }

  private mapToResponseDto(badge: DegenBadge): DegenBadgeResponseDto {
    return {
      id: badge.id,
      userId: badge.userId,
      badgeType: badge.badgeType,
      rarity: badge.rarity,
      criteria: badge.criteria,
      txId: badge.txId,
      stellarAssetCode: badge.stellarAssetCode,
      stellarAssetIssuer: badge.stellarAssetIssuer,
      description: badge.description,
      imageUrl: badge.imageUrl,
      rewardAmount: badge.rewardAmount,
      isActive: badge.isActive,
      createdAt: badge.createdAt,
      updatedAt: badge.updatedAt,
    }
  }
}
