import { IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  senderId: number;

  @IsNumber()
  receiverId: number;

  @IsOptional()
  @IsBoolean()
  isGroup?: boolean;
}
