import { IsString, IsArray, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class BroadcastIntentDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsObject()
  @IsNotEmpty()
  payload: any;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  chains: string[];
}