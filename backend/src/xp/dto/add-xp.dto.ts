import { IsUUID, IsInt, Min, IsString, IsOptional } from 'class-validator';

export class AddXpDto {
  @IsUUID()
  userId!: string;

  @IsInt()
  @Min(0)
  amount!: number;

  // optional reason or source (e.g., "message", "token_send")
  source?: string;
}

export class StellarEventDto {
  @IsString()
  eventId!: string;

  @IsString()
  type!: string;

  // This represents the Stellar account (e.g. G...) or an internal userId;
  // accept string here because events from Horizon will use Stellar public keys.
  @IsString()
  userId!: string;

  data?: any;
}

export class MapStellarAccountDto {
  @IsString()
  stellarAccount!: string;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
