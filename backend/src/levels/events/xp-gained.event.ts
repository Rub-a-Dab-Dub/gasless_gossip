export class XpGainedEvent {
  constructor(
    public readonly userId: string,
    public readonly xpAmount: number,
    public readonly source: string, // e.g., 'quest_completion', 'daily_login', 'achievement'
    public readonly metadata?: Record<string, any>,
  ) {}
}
