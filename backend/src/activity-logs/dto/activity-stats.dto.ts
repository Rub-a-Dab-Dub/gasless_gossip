import { ApiProperty } from "@nestjs/swagger"
import type { ActivityAction } from "../entities/activity-log.entity"

export class ActivityStatsDto {
  @ApiProperty({ description: "Total number of activities" })
  totalActivities: number

  @ApiProperty({ description: "Activities by action type" })
  actionCounts: Record<ActivityAction, number>

  @ApiProperty({ description: "Activities in the last 24 hours" })
  last24Hours: number

  @ApiProperty({ description: "Activities in the last 7 days" })
  last7Days: number

  @ApiProperty({ description: "Activities in the last 30 days" })
  last30Days: number

  @ApiProperty({ description: "Most active day" })
  mostActiveDay: {
    date: string
    count: number
  }

  @ApiProperty({ description: "Average activities per day" })
  averagePerDay: number

  @ApiProperty({ description: "Most common action" })
  mostCommonAction: {
    action: ActivityAction
    count: number
    percentage: number
  }
}
