export class ReputationChangedEvent {
  constructor(
    public readonly userId: Address,
    public readonly oldReputation: number,
    public readonly newReputation: number,
    public readonly amount: number,
    public readonly reason: ReputationReason,
    public readonly description?: string
  ) {}
}