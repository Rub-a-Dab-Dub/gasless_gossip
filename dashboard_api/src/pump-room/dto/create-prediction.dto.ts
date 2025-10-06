export interface CreatePredictionDto {
  pumpRoomId: string
  userId: string
  username: string
  predictionText: string
  targetPrice?: number
  targetDate?: Date
  confidence: number
  alphaScore: number
}
