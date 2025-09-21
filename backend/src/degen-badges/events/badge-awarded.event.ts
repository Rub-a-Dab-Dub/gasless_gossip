import type { DegenBadge } from "../entities/degen-badge.entity"

export class BadgeAwardedEvent {
  constructor(
    public readonly badge: DegenBadge,
    public readonly achievementData?: any,
    public readonly timestamp: Date = new Date(),
  ) {}
}

export class BadgeMintedEvent {
  constructor(
    public readonly badgeId: string,
    public readonly userId: string,
    public readonly transactionId: string,
    public readonly assetCode: string,
    public readonly amount: string,
    public readonly timestamp: Date = new Date(),
  ) {}
}
