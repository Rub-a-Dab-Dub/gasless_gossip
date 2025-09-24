export interface StellarReward {
  transactionHash: string;
  amount: number;
  recipientAddress: string;
}

export interface VoteResult {
  voteId: string;
  roomId: string;
  predictionId: string;
  userId: string;
  confidence: number;
  stellarReward?: StellarReward;
  timestamp: Date;
}
