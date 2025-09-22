import { Injectable, Logger } from "@nestjs/common"
import { OnEvent } from "@nestjs/event-emitter"
import type { BadgeAwardedEvent, BadgeMintedEvent } from "../events/badge-awarded.event"

@Injectable()
export class BadgeAnalyticsListener {
  private readonly logger = new Logger(BadgeAnalyticsListener.name)

  @OnEvent("badge.awarded")
  async handleBadgeAwarded(event: BadgeAwardedEvent) {
    this.logger.log(`Badge awarded: ${event.badge.badgeType} to user ${event.badge.userId}`)

    // Track badge award analytics
    await this.trackBadgeAward(event)

    // Send notification to user
    await this.sendBadgeNotification(event)

    // Update user achievements
    await this.updateUserAchievements(event)
  }

  @OnEvent("badge.minted")
  async handleBadgeMinted(event: BadgeMintedEvent) {
    this.logger.log(`Badge token minted: ${event.assetCode} for user ${event.userId}`)

    // Track Stellar minting analytics
    await this.trackStellarMinting(event)
  }

  private async trackBadgeAward(event: BadgeAwardedEvent) {
    // Implement analytics tracking
    // This could integrate with analytics services like Mixpanel, Amplitude, etc.
    const analyticsData = {
      event!: "badge_awarded",
      userId!: event.badge.userId,
      badgeType: event.badge.badgeType,
      rarity: event.badge.rarity,
      rewardAmount: event.badge.rewardAmount,
      timestamp: event.timestamp,
      achievementData: event.achievementData,
    }

    this.logger.debug("Badge award analytics:", analyticsData)
    // await this.analyticsService.track(analyticsData);
  }

  private async sendBadgeNotification(event: BadgeAwardedEvent) {
    // Send real-time notification to user
    const notification = {
      type: "badge_awarded",
      userId: event.badge.userId,
      title: "New Badge Earned!",
      message: `You've earned the ${event.badge.badgeType} badge!`,
      data: {
        badgeId: event.badge.id,
        badgeType: event.badge.badgeType,
        rarity: event.badge.rarity,
        rewardAmount: event.badge.rewardAmount,
      },
    }

    this.logger.debug("Sending badge notification:", notification)
    // await this.notificationService.send(notification);
  }

  private async updateUserAchievements(event: BadgeAwardedEvent) {
    // Update user's achievement progress
    // This could trigger other achievements or unlock new content
    this.logger.debug(`Updating achievements for user ${event.badge.userId}`)
    // await this.achievementService.updateProgress(event.badge.userId, event.badge.badgeType);
  }

  private async trackStellarMinting(event: BadgeMintedEvent) {
    // Track Stellar blockchain interactions
    const stellarData = {
      event!: "badge_token_minted",
      userId!: event.userId,
      transactionId: event.transactionId,
      assetCode: event.assetCode,
      amount: event.amount,
      timestamp: event.timestamp,
    }

    this.logger.debug("Stellar minting analytics:", stellarData)
    // await this.analyticsService.track(stellarData);
  }
}
