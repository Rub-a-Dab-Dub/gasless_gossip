import { IsString, IsEnum, IsObject, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoomAuditAction } from '../entities/room-audit.entity';

export class CreateRoomAuditDto {
  @ApiProperty()
  @IsString()
  roomId: string;

  @ApiProperty()
  @IsString()
  creatorId: string;

  @ApiProperty({ enum: RoomAuditAction })
  @IsEnum(RoomAuditAction)
  action: RoomAuditAction;

  @ApiProperty()
  @IsObject()
  metadata: {
    roomType: string;
    settings: Record<string, any>;
    maxParticipants?: number;
    xpRequired?: number;
    reasonForAction?: string;
  };

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAnomalous?: boolean;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  anomalyScore?: number;
}

export class SearchRoomAuditDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  roomId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  creatorId?: string;

  @ApiProperty({ required: false, enum: RoomAuditAction })
  @IsEnum(RoomAuditAction)
  @IsOptional()
  action?: RoomAuditAction;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isAnomalous?: boolean;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  startDate?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  endDate?: number;
}

export class ExportRoomAuditDto extends SearchRoomAuditDto {
  @ApiProperty({ enum: ['csv', 'json'], default: 'csv' })
  @IsString()
  format: 'csv' | 'json';
}