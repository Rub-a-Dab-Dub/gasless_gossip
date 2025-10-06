export interface QueryPumpRoomsDto {
  status?: "active" | "paused" | "completed" | "cancelled"
  creatorId?: string
  limit?: number
  offset?: number
}
