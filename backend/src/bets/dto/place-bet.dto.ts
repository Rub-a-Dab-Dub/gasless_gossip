import { IsString, IsNumber, Min } from 'class-validator';

export class PlaceBetDto {
  @IsString()
  outcome!: string;

  @IsNumber()
  @Min(0.01)
  stakes!: number;
}