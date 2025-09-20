import { IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PlaceBidDto {
  @IsString()
  auctionId: string;

  @IsNumber()
  @Min(0.01)
  @Type(() => Number)
  amount: number;

  @IsString()
  bidderId: string;
}