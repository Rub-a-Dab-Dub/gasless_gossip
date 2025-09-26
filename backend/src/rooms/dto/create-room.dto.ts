import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { RoomType } from '../entities/room.entity';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(RoomType)
  type!: RoomType;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  maxMembers?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  minLevel?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minXp?: number;
}
