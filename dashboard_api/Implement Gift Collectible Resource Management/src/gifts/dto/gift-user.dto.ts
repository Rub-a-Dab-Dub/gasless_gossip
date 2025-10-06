import { IsUUID, IsInt, Min, IsOptional, IsString } from "class-validator";

export class GiftUserDto {
  @IsUUID()
  fromUserId: string;

  @IsUUID()
  toUserId: string;

  @IsUUID()
  giftId: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsUUID()
  @IsOptional()
  roomId?: string;

  @IsString()
  @IsOptional()
  message?: string;
}
