import { IsNotEmpty, IsString, IsArray, ValidateNested, IsOptional, IsDateString } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class PredictionDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreatePumpRoomDto {
  @IsNotEmpty()
  @IsString()
  roomId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PredictionDto)
  predictions: PredictionDto[];

  @IsOptional()
  @IsDateString()
  endDate?: string;
}