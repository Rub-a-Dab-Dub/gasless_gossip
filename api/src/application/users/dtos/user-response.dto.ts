import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WalletInfoDto {
  @ApiProperty({
    description: 'Celo blockchain address',
    example: '0xCeloAddress123',
    nullable: true,
  })
  celo_address: string | null;

  @ApiProperty({
    description: 'Celo balance',
    example: '100.50',
  })
  celo_balance: string;

  @ApiProperty({
    description: 'Base blockchain address',
    example: '0xBaseAddress456',
    nullable: true,
  })
  base_address: string | null;

  @ApiProperty({
    description: 'Base balance',
    example: '50.25',
  })
  base_balance: string;

  @ApiProperty({
    description: 'Starknet blockchain address',
    example: '0xStarknetAddress789',
    nullable: true,
  })
  starknet_address: string | null;

  @ApiProperty({
    description: 'Starknet balance',
    example: '75.00',
  })
  starknet_balance: string;
}

export class UserStatsDto {
  @ApiProperty({
    description: 'Number of posts',
    example: 25,
  })
  posts: number;

  @ApiProperty({
    description: 'Number of followers',
    example: 100,
  })
  followers: number;

  @ApiProperty({
    description: 'Number of users following',
    example: 75,
  })
  following: number;
}

export class SafeUserDto {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'Profile photo URL',
    example: 'https://example.com/photo.jpg',
    nullable: true,
  })
  photo: string | null;

  @ApiPropertyOptional({
    description: 'Email address (only visible to profile owner)',
    example: 'john@example.com',
    nullable: true,
  })
  email?: string | null;

  @ApiPropertyOptional({
    description: 'Email verification status (only visible to profile owner)',
    example: true,
  })
  is_verified?: boolean;

  @ApiPropertyOptional({
    description: 'Wallet address',
    example: '0x1234567890abcdef',
    nullable: true,
  })
  address?: string | null;

  @ApiProperty({
    description: 'Experience points for gamification',
    example: 150,
  })
  xp: number;

  @ApiProperty({
    description: 'User title/tagline',
    example: 'Crypto Enthusiast',
    nullable: true,
  })
  title: string | null;

  @ApiProperty({
    description: 'User bio/about section',
    example: 'Love blockchain technology',
    nullable: true,
  })
  about: string | null;

  @ApiPropertyOptional({
    description: 'Account creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at?: Date;
}

export class UserProfileDto extends SafeUserDto {
  @ApiProperty({
    description: 'User statistics',
    type: UserStatsDto,
  })
  stats: {
    posts: number;
    followers: number;
    following: number;
  };

  @ApiPropertyOptional({
    description: 'Wallet information with balances (only visible to profile owner)',
    type: WalletInfoDto,
  })
  wallet?: {
    celo_address: string | null;
    celo_balance: string;
    base_address: string | null;
    base_balance: string;
    starknet_address: string | null;
    starknet_balance: string;
  };
}

export class PublicUserDto {
  @ApiProperty({
    description: 'User ID',
    example: 2,
  })
  id: number;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'Profile photo URL',
    example: 'https://example.com/photo.jpg',
    nullable: true,
  })
  photo: string | null;

  @ApiProperty({
    description: 'User title/tagline',
    example: 'Crypto Enthusiast',
    nullable: true,
  })
  title: string | null;

  @ApiProperty({
    description: 'User bio/about section',
    example: 'Love blockchain technology',
    nullable: true,
  })
  about: string | null;

  @ApiProperty({
    description: 'Experience points',
    example: 150,
  })
  xp: number;
}
