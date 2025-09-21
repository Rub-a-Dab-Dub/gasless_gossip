export class BadgeUnlockedEvent {
  constructor(
    public readonly userId: string,
    public readonly badgeId: string,
    public readonly level: number,
    public readonly stellarTransactionId?: string,
  ) {}
}
