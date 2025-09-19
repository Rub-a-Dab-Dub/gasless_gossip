import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class SendTokenDto {
  @IsString()
  @IsNotEmpty()
  fromId!: string; // sender internal userId or Stellar address

  @IsString()
  @IsNotEmpty()
  toId!: string; // receiver internal userId or Stellar address

  @IsString()
  @IsNotEmpty()
  // positive decimal with up to 7 decimal places
  @Matches(/^(?:0|[1-9]\d*)(?:\.\d{1,7})?$/)
  amount!: string;
}


