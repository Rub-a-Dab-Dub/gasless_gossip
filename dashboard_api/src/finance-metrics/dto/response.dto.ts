import { ApiProperty } from '@nestjs/swagger';

export class ROIComparisonResponse {
  @ApiProperty()
  period1ROI: number;

  @ApiProperty()
  period2ROI: number;

  @ApiProperty()
  difference: number;

  @ApiProperty()
  percentageChange: number;
}

export class TopUserResponse {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  totalVolume: number;

  @ApiProperty()
  transactionCount: number;

  @ApiProperty()
  lastActive: Date;
}

export class TrendForecastResponse {
  @ApiProperty()
  predictedVolume: number;

  @ApiProperty()
  confidence: number;

  @ApiProperty()
  growthRate: number;
}