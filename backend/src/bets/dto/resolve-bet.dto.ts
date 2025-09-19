import { IsString, IsBoolean } from 'class-validator';

export class ResolveBetDto {
  @IsString()
  betId!: string;

  @IsBoolean()
  won!: boolean;
}