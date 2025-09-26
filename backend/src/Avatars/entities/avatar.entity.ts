import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('avatars')
@Index(['userId'], { unique: true }) // One avatar per user
export class Avatar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @Column({ type: 'jsonb' })
  metadata: {
    name: string;
    description: string;
    image: string;
    level: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };

  @Column({ type: 'varchar', length: 64 })
  @Index()
  txId: string; // Stellar transaction ID

  @Column({ type: 'varchar', length: 56 })
  stellarAssetCode: string; // Stellar asset code

  @Column({ type: 'varchar', length: 56 })
  stellarIssuer: string; // Stellar issuer account

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// src/avatars/dto/create-avatar.dto.ts
import {
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  IsUrl,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AttributeDto {
  @IsString()
  trait_type: string;

  @IsString()
  value: string | number;
}

export class CreateAvatarDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsUrl()
  image: string;

  @IsNumber()
  @Min(1)
  @Max(100)
  level: number;

  @IsEnum(['common', 'rare', 'epic', 'legendary'])
  rarity: 'common' | 'rare' | 'epic' | 'legendary';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeDto)
  attributes: AttributeDto[];
}
