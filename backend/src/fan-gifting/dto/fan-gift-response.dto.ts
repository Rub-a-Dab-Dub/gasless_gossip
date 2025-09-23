import { ApiProperty } from '@nestjs/swagger';

export class FanGiftResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  giftId: string;

  @ApiProperty()
  fanId: string;

  @ApiProperty()
  creatorId: string;

  @ApiProperty()
  txId: string;

  @ApiProperty()
  giftType: string;

  @ApiProperty()
  amount: string;

  @ApiProperty()
  stellarAsset: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
