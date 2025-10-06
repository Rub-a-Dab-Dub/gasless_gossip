import { ApiProperty } from "@nestjs/swagger"

export class DauBreakdownDto {
  @ApiProperty()
  date: string

  @ApiProperty()
  featureName: string

  @ApiProperty()
  uniqueUsers: number

  @ApiProperty()
  totalSessions: number

  @ApiProperty()
  averageSessionDuration: number

  @ApiProperty()
  newUsers: number

  @ApiProperty()
  returningUsers: number

  @ApiProperty({ required: false })
  benchmarkGoal?: number

  @ApiProperty({ required: false })
  goalAchievement?: number
}

export class HistoricalTrendDto {
  @ApiProperty()
  date: string

  @ApiProperty()
  totalDau: number

  @ApiProperty()
  changeFromPrevious: number

  @ApiProperty()
  changePercentage: number

  @ApiProperty()
  trend: "up" | "down" | "stable"
}

export class FeatureDrilldownDto {
  @ApiProperty()
  featureName: string

  @ApiProperty()
  totalUsers: number

  @ApiProperty()
  totalSessions: number

  @ApiProperty()
  averageDuration: number

  @ApiProperty()
  userPercentage: number

  @ApiProperty()
  sessionPercentage: number
}

export class AlertDropDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  alertDate: Date

  @ApiProperty()
  featureName: string

  @ApiProperty()
  alertType: string

  @ApiProperty()
  severity: string

  @ApiProperty()
  currentValue: number

  @ApiProperty()
  expectedValue: number

  @ApiProperty()
  dropPercentage: number

  @ApiProperty()
  message: string

  @ApiProperty()
  isResolved: boolean
}
