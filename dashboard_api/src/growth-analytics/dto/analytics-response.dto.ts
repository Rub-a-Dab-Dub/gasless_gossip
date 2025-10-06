import { ApiProperty } from "@nestjs/swagger"

export class AverageLevelsDto {
  @ApiProperty({ description: "Date" })
  date: string

  @ApiProperty({ description: "Average level" })
  averageLevel: number

  @ApiProperty({ description: "Total users" })
  totalUsers: number

  @ApiProperty({ description: "Cohort ID (if filtered)" })
  cohortId?: string
}

export class UnlockRatesDto {
  @ApiProperty({ description: "Date" })
  date: string

  @ApiProperty({ description: "Total unlocks" })
  totalUnlocks: number

  @ApiProperty({ description: "Unique users" })
  uniqueUsers: number

  @ApiProperty({ description: "Unlock rate (unlocks per user)" })
  unlockRate: number

  @ApiProperty({ description: "Cohort ID (if filtered)" })
  cohortId?: string
}

export class DropOffAnalysisDto {
  @ApiProperty({ description: "Level" })
  level: number

  @ApiProperty({ description: "Drop-off count" })
  dropOffCount: number

  @ApiProperty({ description: "Drop-off percentage" })
  dropOffPercentage: number
}

export class CohortAnalysisDto {
  @ApiProperty({ description: "Cohort ID" })
  cohortId: string

  @ApiProperty({ description: "Cohort name" })
  cohortName: string

  @ApiProperty({ description: "Total users" })
  totalUsers: number

  @ApiProperty({ description: "Average level" })
  averageLevel: number

  @ApiProperty({ description: "Total unlocks" })
  totalUnlocks: number

  @ApiProperty({ description: "Retention rate" })
  retentionRate: number
}

export class PlateauPredictionDto {
  @ApiProperty({ description: "Predicted plateau level" })
  plateauLevel: number

  @ApiProperty({ description: "Confidence score (0-1)" })
  confidence: number

  @ApiProperty({ description: "Days to plateau" })
  daysToPlateauEstimate: number

  @ApiProperty({ description: "Current trend" })
  trend: "increasing" | "stable" | "decreasing"
}
