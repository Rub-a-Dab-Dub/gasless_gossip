import { IsUUID, IsInt, Min } from "class-validator";

export class BattleRewardDto {
  @IsUUID()
  battleId: string;

  @IsUUID()
  winnerId: string;

  @IsInt()
  @Min(1)
  battleTier: number;
}
