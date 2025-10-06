export class PumpRoom {
  id: string
  roomName: string
  description: string
  creatorId: string
  status: "active" | "paused" | "completed" | "cancelled"
  startTime: Date
  endTime?: Date
  totalPredictions: number
  totalVotes: number
  totalParticipants: number
  verificationRequired: boolean
  minAlphaScore?: number
  rewardPool: number
  rewardDistributed: boolean
  createdAt: Date
  updatedAt: Date
}
