import {
  IsString,
  IsDateString,
  IsOptional,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StartAuctionDto {
  @IsString()
  giftId: string;

  @IsDateString()
  endTime: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  startingBid?: number = 0;
}
