export class PumpReward {
  id: string
  pumpRoomId: string
  userId: string
  username: string
  rewardType: "prediction_winner" | "top_voter" | "participation" | "alpha_bonus"
  amount: number
  rank?: number
  distributedAt: Date
  transactionHash?: string
  status: "pending" | "completed" | "failed"
}
