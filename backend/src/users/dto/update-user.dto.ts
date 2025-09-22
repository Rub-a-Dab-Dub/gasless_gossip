import { IsEmail, IsString, Length, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  pseudonym?: string;

  @IsOptional()
  @IsString()
  stellarAccountId?: string;
}
