import { IsString, IsEnum, IsInt, IsNumber, IsDateString, IsOptional, Min, MaxLength, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChallengeType } from '../entities/challenge.entity';

export class CreateChallengeDto {
  @ApiProperty({ 
    description: 'Challenge title',
    example: 'Send 10 Gifts',
    maxLength: 200
  })
  @IsString()
  @Length(1, 200)
  title!: string;

  @ApiProperty({ 
    description: 'Challenge description',
    example: 'Send 10 gifts to other users to complete this challenge',
    required: false,
    maxLength: 1000
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ 
    description: 'Type of challenge',
    enum: ChallengeType,
    example: ChallengeType.GIFT_SENDING
  })
  @IsEnum(ChallengeType)
  type!: ChallengeType;

  @ApiProperty({ 
    description: 'Goal number to achieve',
    example: 10,
    minimum: 1
  })
  @IsInt()
  @Min(1)
  goal!: number;

  @ApiProperty({ 
    description: 'Reward amount in Stellar tokens',
    example: 5.5,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  reward!: number;

  @ApiProperty({ 
    description: 'Challenge expiration date',
    example: '2024-12-31T23:59:59Z'
  })
  @IsDateString()
  expiresAt!: string;

  @ApiProperty({ 
    description: 'Additional challenge metadata',
    required: false,
    example: { difficulty: 'medium', category: 'social' }
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
