export class LevelUpEvent {
  constructor(
    public readonly userId: string,
    public readonly previousLevel: number,
    public readonly newLevel: number,
    public readonly totalXp: number,
    public readonly badgesUnlocked: string[] = [],
  ) {}
}
