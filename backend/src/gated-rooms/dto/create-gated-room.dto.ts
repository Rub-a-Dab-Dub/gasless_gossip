import {
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsEnum,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GateRuleDto {
  @IsEnum(['token', 'nft'])
  type!: 'token' | 'nft';

  @IsString()
  @IsNotEmpty()
  assetCode!: string;

  @IsString()
  @IsNotEmpty()
  issuer!: string;

  @IsOptional()
  @IsNumber()
  minAmount?: number;

  @IsOptional()
  @IsString()
  requiredNftId?: string;
}

export class CreateGatedRoomDto {
  @IsString()
  @IsNotEmpty()
  roomId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GateRuleDto)
  gateRules!: GateRuleDto[];

  @IsOptional()
  @IsString()
  roomName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  createdBy!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
