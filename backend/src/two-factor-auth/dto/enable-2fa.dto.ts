import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TwoFactorMethod } from '../entities/two-factor.entity';

export class Enable2FADto {
  @IsUUID()
  userId: string;

  @IsEnum(TwoFactorMethod)
  method: TwoFactorMethod;

  @IsOptional()
  @IsString()
  secret?: string;
}
