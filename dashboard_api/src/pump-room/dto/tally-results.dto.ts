export interface TallyResultsDto {
  pumpRoomId: string
  adminId: string
  outcomes: Array<{
    predictionId: string
    outcome: "correct" | "incorrect"
  }>
}
