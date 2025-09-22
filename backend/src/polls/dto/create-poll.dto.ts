import { IsArray, IsNotEmpty, IsString, IsUUID, ArrayMinSize, MaxLength } from 'class-validator';

export class CreatePollDto {
  @IsUUID()
  roomId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  question!: string;

  @IsArray()
  @ArrayMinSize(2)
  options!: string[];
}


