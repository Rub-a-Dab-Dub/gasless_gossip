import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsInt,
  Min,
  MaxLength,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePodcastRoomDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  roomId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  audioHash!: string;

  @IsString()
  @IsNotEmpty()
  creatorId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @IsOptional()
  @IsString()
  @IsIn(['mp3', 'wav', 'ogg', 'm4a', 'flac'])
  audioFormat?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  fileSize?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    value?.filter((tag: string) => tag.trim().length > 0),
  )
  tags?: string[];
}
