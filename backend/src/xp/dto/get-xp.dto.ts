import { IsUUID } from 'class-validator';

export class GetXpDto {
  @IsUUID()
  userId!: string;
}
