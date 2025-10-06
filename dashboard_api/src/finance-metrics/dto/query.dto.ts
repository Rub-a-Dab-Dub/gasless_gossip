import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class DateRangeQuery {
  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty()
  @IsDateString()
  endDate: string;
}

export class TopUsersQuery extends DateRangeQuery {
  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  limit?: number;
}

export class ComparePeriodsQuery {
  @ApiProperty()
  @IsDateString()
  period1Start: string;

  @ApiProperty()
  @IsDateString()
  period1End: string;

  @ApiProperty()
  @IsDateString()
  period2Start: string;

  @ApiProperty()
  @IsDateString()
  period2End: string;
}