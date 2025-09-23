import { IsUUID, IsString, Length } from 'class-validator';

export class SetPseudonymDto {
  @IsUUID()
  roomId!: string;

  @IsUUID()
  userId!: string;

  @IsString()
  @Length(2, 100)
  pseudonym!: string;
}


