import { IsEmail, IsString, Length, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 50)
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(1, 100)
  pseudonym!: string;

  @IsOptional()
  @IsString()
  stellarAccountId?: string;
}
