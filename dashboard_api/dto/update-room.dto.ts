import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsArray, IsString, IsObject, IsBoolean } from 'class-validator';

export class UpdateRoomDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiProperty({ required: false, type: 'object' })
  @IsOptional()
  @IsObject()
  accessRules?: Record<string, any>;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  moderatorIds?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  pinnedMessageId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isClosed?: boolean;
}