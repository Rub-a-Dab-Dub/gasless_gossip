import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsArray,
  ArrayMaxSize,
  Length,
} from 'class-validator';

export class SearchRoomsByTagDto {
  @IsString()
  @Length(1, 50)
  tag!: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number = 0;
}

export class SearchRoomsByMultipleTagsDto {
  @IsArray()
  @ArrayMaxSize(5) // Limit search to 5 tags
  @IsString({ each: true })
  @Length(1, 50, { each: true })
  tags!: string[];

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number = 0;

  @IsOptional()
  @IsString()
  operator?: 'AND' | 'OR' = 'OR'; // Whether to match all tags or any tag
}