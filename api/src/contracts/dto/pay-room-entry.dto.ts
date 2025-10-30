import {
  IsString,
  IsNotEmpty,
  IsNumberString,
  IsEthereumAddress,
} from 'class-validator';

export class PayRoomEntryDto {
  @IsNumberString()
  roomId: string;

  @IsEthereumAddress()
  roomCreator: string;

  @IsNumberString()
  entryFee: string;

  @IsEthereumAddress()
  token: string;

  @IsString()
  @IsNotEmpty()
  username: string;
}
