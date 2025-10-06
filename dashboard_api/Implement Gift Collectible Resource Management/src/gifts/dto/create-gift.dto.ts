import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  IsBoolean,
  IsObject,
  MaxLength,
} from "class-validator";
import { GiftType, GiftRarity } from "../entities/gift.entity";

export class CreateGiftDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEnum(GiftType)
  type: GiftType;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsEnum(GiftRarity)
  @IsOptional()
  rarity?: GiftRarity;

  @IsInt()
  @Min(0)
  @IsOptional()
  maxSupply?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  minLevelRequired?: number;

  @IsObject()
  @IsOptional()
  animationConfig?: {
    url?: string;
    duration?: number;
    loop?: boolean;
    effects?: string[];
  };

  @IsObject()
  @IsOptional()
  metadata?: {
    imageUrl?: string;
    thumbnailUrl?: string;
    tags?: string[];
    createdBy?: string;
  };

  @IsBoolean()
  @IsOptional()
  isBattleReward?: boolean;

  @IsInt()
  @Min(0)
  @IsOptional()
  battleTier?: number;
}
