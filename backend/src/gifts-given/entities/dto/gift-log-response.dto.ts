import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GiftLogResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  giftId: string;

  @ApiProperty()
  userId: string;

  @ApiPropertyOptional()
  recipientId?: string;

  @ApiPropertyOptional()
  giftType?: string;

  @ApiPropertyOptional()
  giftValue?: number;

  @ApiProperty()
  createdAt: Date;
}