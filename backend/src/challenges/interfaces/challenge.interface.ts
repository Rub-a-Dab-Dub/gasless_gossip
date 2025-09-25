export interface ChallengeProgressUpdate {
  userId: string;
  challengeId: string;
  progress: number;
  progressData?: Record<string, any>;
}

export interface ChallengeCompletionResult {
  success: boolean;
  participationId?: string;
  rewardAmount?: number;
  stellarTransactionId?: string;
  error?: string;
}

export interface ChallengeRewardResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface ChallengeStats {
  totalChallenges: number;
  activeChallenges: number;
  completedChallenges: number;
  totalRewardsEarned: number;
  participationRate: number;
}

export interface UserChallengeProgress {
  challengeId: string;
  challengeTitle: string;
  progress: number;
  goal: number;
  status: string;
  reward: number;
  expiresAt: Date;
}
