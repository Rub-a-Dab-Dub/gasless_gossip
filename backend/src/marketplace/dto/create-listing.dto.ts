import { IsString, IsNumber, Min } from 'class-validator';

export class CreateListingDto {
  @IsString()
  giftId!: string;

  @IsNumber()
  @Min(0)
  price!: number;
}
