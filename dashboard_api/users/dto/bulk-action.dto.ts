import { IsArray, IsEnum, IsBoolean, IsOptional, IsString, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum BulkActionType {
  BAN = 'ban',
  UNBAN = 'unban',
  MIGRATE = 'migrate',
  DELETE = 'delete',
  UPDATE_ROLE = 'update_role',
}

export class BulkActionPreviewDto {
  @ApiProperty({ type: [String], description: 'Array of user IDs' })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  userIds: string[];

  @ApiProperty({ enum: BulkActionType })
  @IsEnum(BulkActionType)
  action: BulkActionType;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class BulkActionExecuteDto extends BulkActionPreviewDto {
  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  dryRun?: boolean = false;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsOptional()
  sendNotifications?: boolean = true;
}

export class BulkActionResultDto {
  batchId: string;
  action: BulkActionType;
  totalUsers: number;
  successful: number;
  failed: number;
  dryRun: boolean;
  executionTime: number;
  errors: Array<{ userId: string; error: string }>;
  timestamp: Date;
}