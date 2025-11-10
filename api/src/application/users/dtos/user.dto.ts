import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Profile photo URL',
    example: 'https://example.com/photo.jpg',
  })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiPropertyOptional({
    description: 'Wallet address',
    example: '0x1234567890abcdef',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'User title/tagline',
    example: 'Blockchain Developer',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'User bio/about section',
    example: 'Building the future of web3',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({
    description: 'Username - must be unique',
    example: 'newusername',
    minLength: 3,
    maxLength: 30,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @ApiPropertyOptional({
    description: 'Email address - must be unique',
    example: 'newemail@example.com',
  })
  @IsOptional()
  @IsString()
  email?: string;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current password',
    example: 'OldPassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  old_password: string;

  @ApiProperty({
    description: 'New password - must be at least 8 characters and different from old password',
    example: 'NewSecurePassword456',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  new_password: string;
}

