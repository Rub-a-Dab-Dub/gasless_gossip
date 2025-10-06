export interface CreatePumpRoomDto {
  roomName: string
  description: string
  creatorId: string
  startTime: Date
  endTime?: Date
  verificationRequired?: boolean
  minAlphaScore?: number
  rewardPool?: number
}
