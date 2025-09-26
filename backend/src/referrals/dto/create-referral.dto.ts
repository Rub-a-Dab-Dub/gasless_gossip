import { IsUUID, IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReferralDto {
  @ApiProperty({ description: 'The referral code used by the new user' })
  @IsString()
  @Length(6, 20)
  referralCode!: string;

  @ApiProperty({ description: 'ID of the user being referred' })
  @IsUUID()
  refereeId!: string;
}