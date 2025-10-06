import { IsUUID, IsInt, Min, IsString, IsOptional } from "class-validator";

export class AssignGiftDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  giftId: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  reason?: string;
}
