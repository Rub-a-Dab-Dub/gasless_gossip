import { ApiProperty } from "@nestjs/swagger"

export class VisitStatsDto {
  @ApiProperty({
    description: "Room identifier",
    example: "room-123",
  })
  roomId: string

  @ApiProperty({
    description: "Total number of visits",
    example: 150,
  })
  totalVisits: number

  @ApiProperty({
    description: "Number of unique visitors",
    example: 75,
  })
  uniqueVisitors: number

  @ApiProperty({
    description: "Average visit duration in seconds",
    example: 245,
  })
  averageDuration: number

  @ApiProperty({
    description: "Most recent visit timestamp",
    example: "2024-01-15T10:30:00Z",
  })
  lastVisit: Date

  @ApiProperty({
    description: "Daily visit counts for the last 7 days",
    example: [12, 15, 8, 22, 18, 25, 20],
  })
  dailyVisits: number[]

  @ApiProperty({
    description: "Peak visit hour (0-23)",
    example: 14,
  })
  peakHour: number
}
