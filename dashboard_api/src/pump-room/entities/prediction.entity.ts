export class Prediction {
  id: string
  pumpRoomId: string
  userId: string
  username: string
  predictionText: string
  targetPrice?: number
  targetDate?: Date
  confidence: number
  alphaScore: number
  isVerified: boolean
  verifiedAt?: Date
  verifiedBy?: string
  totalVotes: number
  weightedVoteScore: number
  outcome?: "correct" | "incorrect" | "pending"
  rewardAmount?: number
  createdAt: Date
  updatedAt: Date
}
