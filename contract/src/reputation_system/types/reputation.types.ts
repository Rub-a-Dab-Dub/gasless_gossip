export enum ReputationReason {
  // Positive actions
  PositiveContribution = 'POSITIVE_CONTRIBUTION',
  HelpfulAnswer = 'HELPFUL_ANSWER',
  QualityContent = 'QUALITY_CONTENT',
  CommunitySupport = 'COMMUNITY_SUPPORT',
  
  // Negative actions
  SpamPenalty = 'SPAM_PENALTY',
  InappropriateContent = 'INAPPROPRIATE_CONTENT',
  ViolationWarning = 'VIOLATION_WARNING',
  Abusivebehavior = 'ABUSIVE_BEHAVIOR',
}

export interface ReputationChange {
  userId: Address;
  oldReputation: number;
  newReputation: number;
  amount: number;
  reason: ReputationReason;
  timestamp: Date;
}

export interface ReputationHistory {
  id: string;
  userId: Address;
  amount: number;
  reason: ReputationReason;
  description?: string;
  timestamp: Date;
}