import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  chatId: number;

  @IsNumber()
  senderId: number;

  @IsString()
  content: string;
}
