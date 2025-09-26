import { IsNotEmpty, IsPositive, IsUUID, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTipDto {
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 7 })
  @IsPositive()
  @Min(0.0000001) // Minimum tip amount (1 stroop)
  @Max(1000000) // Maximum tip amount
  @Transform(({ value }) => parseFloat(value))
  amount: number;

  @IsNotEmpty()
  @IsUUID()
  receiverId: string;
}

// src/tips/dto/tip-response.dto.ts
export class TipResponseDto {
  id: string;
  amount: number;
  receiverId: string;
  senderId: string;
  txId: string;
  createdAt: Date;
  receiver?: {
    id: string;
    username: string;
  };
  sender?: {
    id: string;
    username: string;
  };
}