import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeleteRoomTagDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  roomId!: string;

  @IsNotEmpty()
  @IsString()
  tagName!: string;
}