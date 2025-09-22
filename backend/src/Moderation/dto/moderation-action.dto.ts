import { IsUUID, IsEnum, IsOptional, IsString, IsDateString, MaxLength } from 'class-validator';
import { ActionType } from '../entities/moderation-action.entity';

export class CreateModerationActionDto {
  @IsUUID()
  roomId: string;

  @IsUUID()
  targetId: string;

  @IsEnum(ActionType)
  actionType: ActionType;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class ReverseModerationActionDto {
  @IsUUID()
  roomId: string;

  @IsUUID()
  targetId: string;

  @IsEnum(ActionType)
  actionType: ActionType;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}