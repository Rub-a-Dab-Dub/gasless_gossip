import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddRoomMemberDto {
  @IsNumber()
  roomId: number;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  role?: 'member' | 'admin' | 'owner' | 'moderator';
}
