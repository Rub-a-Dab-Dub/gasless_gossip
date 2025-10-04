import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional, IsInt, IsArray, IsDateString, IsObject } from 'class-validator';
import { RoomType } from '../entities/room.entity';

export class CreateRoomDto {
  @ApiProperty({ example: 'Secret Gossip Room' })
  @IsString()
  name: string;

  @ApiProperty({ enum: RoomType, example: RoomType.SECRET })
  @IsEnum(RoomType)
  type: RoomType;

  @ApiProperty({ required: false, example: '2025-10-30T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiProperty({ required: false, example: 50 })
  @IsOptional()
  @IsInt()
  maxParticipants?: number;

  @ApiProperty({ required: false, example: 'dimly lit' })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiProperty({ required: false, type: [String], example: ['mod-user-id-1'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  moderatorIds?: string[];

  @ApiProperty({ required: false, type: 'object' })
  @IsOptional()
  @IsObject()
  accessRules?: Record<string, any>;
}