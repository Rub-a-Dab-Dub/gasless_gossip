import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  Length,
  IsArray,
  ArrayMaxSize,
  ArrayUnique,
} from 'class-validator';

export class CreateRoomTagDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  roomId!: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'Tag name can only contain letters, numbers, underscores, and hyphens',
  })
  tagName!: string;
}

export class CreateMultipleRoomTagsDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  roomId!: string;

  @IsArray()
  @ArrayMaxSize(10) // Limit to 10 tags per room
  @ArrayUnique()
  @IsString({ each: true })
  @Length(1, 50, { each: true })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    each: true,
    message: 'Each tag name can only contain letters, numbers, underscores, and hyphens',
  })
  tagNames!: string[];
}