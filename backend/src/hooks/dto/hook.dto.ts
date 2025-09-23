import { IsEnum, IsObject, IsOptional, IsString, IsBoolean } from 'class-validator';
import { EventType } from '../entities/hook.entity';

export class CreateHookDto {
  @IsEnum(EventType)
  eventType: EventType;

  @IsObject()
  data: Record<string, any>;

  @IsOptional()
  @IsString()
  stellarTransactionId?: string;

  @IsOptional()
  @IsString()
  stellarAccountId?: string;
}

export class StellarEventDto {
  @IsString()
  transactionId: string;

  @IsString()
  accountId: string;

  @IsEnum(EventType)
  eventType: EventType;

  @IsObject()
  eventData: Record<string, any>;

  @IsOptional()
  @IsString()
  contractId?: string;
}

export class HookResponseDto {
  id: string;
  eventType: EventType;
  data: Record<string, any>;
  stellarTransactionId?: string;
  stellarAccountId?: string;
  processed: boolean;
  createdAt: Date;
  processedAt?: Date;
  errorMessage?: string;
}
