import { IsString, IsNumberString } from 'class-validator';

export class CreateTokenLogDto {
  @IsString()
  txId!: string;

  @IsString()
  fromId!: string;

  @IsString()
  toId!: string;

  @IsNumberString()
  amount!: string;
}
