import { ApiProperty } from '@nestjs/swagger';
import { ReferralStatus } from '../entities/referral.entity';

export class ReferralResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  referrerId!: string;

  @ApiProperty()
  refereeId!: string;

  @ApiProperty()
  reward!: number;

  @ApiProperty()
  referralCode!: string;

  @ApiProperty({ enum: ReferralStatus })
  status!: ReferralStatus;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ required: false })
  completedAt?: Date;

  @ApiProperty({ required: false })
  stellarTransactionId?: string;
}