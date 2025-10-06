export interface CreateVoteDto {
  pumpRoomId: string
  predictionId: string
  userId: string
  username: string
  voteType: "upvote" | "downvote"
  alphaScore: number
  stakeAmount?: number
}
