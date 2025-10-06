export class Vote {
  id: string
  pumpRoomId: string
  predictionId: string
  userId: string
  username: string
  voteType: "upvote" | "downvote"
  weight: number
  alphaScore: number
  stakeAmount?: number
  createdAt: Date
}
