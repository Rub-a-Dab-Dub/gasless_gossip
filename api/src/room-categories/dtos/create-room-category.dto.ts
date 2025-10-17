import { IsString } from 'class-validator';

export class CreateRoomCategoryDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;
}
