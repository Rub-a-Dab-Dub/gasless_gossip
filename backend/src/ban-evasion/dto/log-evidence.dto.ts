import { IsString, IsNumber, IsEnum, IsObject, IsOptional } from 'class-validator';

export enum EvidenceType {
  IP_MATCH = 'IP_MATCH',
  BEHAVIOR_PATTERN = 'BEHAVIOR_PATTERN',
  WALLET_ASSOCIATION = 'WALLET_ASSOCIATION',
  CUSTOM = 'CUSTOM'
}

export class LogEvidenceDto {
  @IsEnum(EvidenceType)
  evidenceType: EvidenceType;

  @IsObject()
  data: Record<string, any>;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  confidence: number;
}