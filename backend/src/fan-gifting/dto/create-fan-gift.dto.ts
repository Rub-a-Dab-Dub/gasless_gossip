import { IsUUID, IsString, IsOptional, IsNumber, Min, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFanGiftDto {
  @ApiProperty({ description: 'Unique identifier for the gift type' })
  @IsUUID()
  giftId: string;

  @ApiProperty({ description: 'Creator receiving the gift' })
  @IsUUID()
  creatorId: string;

  @ApiProperty({ description: 'Type of gift being sent' })
  @IsString()
  @MaxLength(100)
  giftType: string;

  @ApiProperty({ description: 'Amount to gift', minimum: 0.0000001 })
  @IsNumber({ maxDecimalPlaces: 7 })
  @Min(0.0000001)
  amount: number;

  @ApiProperty({ description: 'Stellar asset code', default: 'XLM' })
  @IsString()
  @MaxLength(56)
  stellarAsset: string = 'XLM';

  @ApiProperty({ description: 'Optional message with the gift', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}
