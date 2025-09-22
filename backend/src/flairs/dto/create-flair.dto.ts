import { IsNotEmpty, IsString, IsOptional, IsObject, MaxLength } from 'class-validator';

export class CreateFlairDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  flairType!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}


