import { ApiProperty } from '@nestjs/swagger';

export class ReferralResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  referrerId: string;

  @ApiProperty()
  refereeId: string;

  @ApiProperty()
  reward: number;

  @ApiProperty()
  referralCode: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  completedAt?: Date;

  @ApiProperty({ required: false })
  stellarTransactionId?: string;
}