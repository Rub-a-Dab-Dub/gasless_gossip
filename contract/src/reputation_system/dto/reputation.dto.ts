import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class AddReputationDto {
  @IsString()
  user: Address;

  @IsInt()
  @Min(-1000, { message: 'Reputation change cannot be less than -1000' })
  @Max(1000, { message: 'Reputation change cannot be more than 1000 in single operation' })
  amount: number;

  @IsEnum(ReputationReason)
  reason: ReputationReason;

  @IsOptional()
  @IsString()
  description?: string;
}