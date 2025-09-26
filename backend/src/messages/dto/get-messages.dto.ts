import { IsString, IsNotEmpty } from 'class-validator';

export class GetMessagesDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;
}
