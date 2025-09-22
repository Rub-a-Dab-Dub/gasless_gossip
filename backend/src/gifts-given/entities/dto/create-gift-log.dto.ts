import { IsUUID, IsOptional, IsString, IsNumber, IsPositive, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGiftLogDto {
  @ApiProperty({ description: 'Gift identifier' })
  @IsUUID()
  giftId: string;

  @ApiProperty({ description: 'User who sent the gift' })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ description: 'Gift recipient identifier' })
  @IsOptional()
  @IsUUID()
  recipientId?: string;

  @ApiPropertyOptional({ description: 'Type of gift sent', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  giftType?: string;

  @ApiPropertyOptional({ description: 'Monetary value of the gift' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  giftValue?: number;
}