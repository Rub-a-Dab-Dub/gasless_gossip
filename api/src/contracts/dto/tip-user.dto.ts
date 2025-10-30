import {
  IsString,
  IsNotEmpty,
  IsEthereumAddress,
  IsNumberString,
} from 'class-validator';

export class TipUserDto {
  @IsString()
  @IsNotEmpty()
  recipientUsername: string;

  @IsNumberString()
  amount: string;

  @IsEthereumAddress()
  token: string;

  @IsString()
  @IsNotEmpty()
  context: string;

  @IsString()
  @IsNotEmpty()
  senderUsername: string;
}
