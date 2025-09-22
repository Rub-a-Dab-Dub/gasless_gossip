import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class CreateRoomThemeDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsNotEmpty()
  @IsString()
  themeId: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}