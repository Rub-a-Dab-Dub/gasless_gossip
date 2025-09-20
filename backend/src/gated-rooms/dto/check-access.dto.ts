import { IsString, IsNotEmpty } from 'class-validator';

export class CheckAccessDto {
  @IsString()
  @IsNotEmpty()
  roomId!: string;

  @IsString()
  @IsNotEmpty()
  stellarAccountId!: string;
}

export class AccessStatusDto {
  hasAccess!: boolean;
  roomId!: string;
  stellarAccountId!: string;
  gateRules!: any[];
  verificationResults!: any[];
}