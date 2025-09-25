import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateCodeDto {
  @ApiProperty({ description: 'ID of the user generating the referral code' })
  @IsUUID()
  userId!: string;
}