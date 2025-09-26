import { IsString, IsUUID, Length } from 'class-validator';

export class Verify2FADto {
  @IsUUID()
  userId: string;

  @IsString()
  @Length(6, 6)
  code: string;
}
