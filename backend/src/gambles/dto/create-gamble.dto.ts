// src/gambles/dto/create-gamble.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsIn } from 'class-validator';

export class CreateGambleDto {
  @IsNotEmpty()
  @IsString()
  gossipId!: string;

  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsNotEmpty()
  @IsNumber()
  amount!: number;

  @IsNotEmpty()
  @IsIn(['truth', 'fake'])
  choice!: 'truth' | 'fake';

  @IsNotEmpty()
  @IsString()
  txId!: string;
}

// src/gambles/dto/resolve-gamble.dto.ts
import { IsNotEmpty, IsIn } from 'class-validator';

export class ResolveGambleDto {
  @IsNotEmpty()
  gambleId!: string;

  @IsNotEmpty()
  @IsIn(['truth', 'fake'])
  outcome!: 'truth' | 'fake';
}
