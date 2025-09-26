import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum TwoFactorMethod {
  EMAIL = 'email',
  TOTP = 'totp',
}

@Entity('two_factors')
@Index(['userId'], { unique: true })
export class TwoFactor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: TwoFactorMethod,
    default: TwoFactorMethod.TOTP,
  })
  method: TwoFactorMethod;

  @Column({ type: 'text', nullable: true })
  secret: string;

  @Column({ default: false })
  isEnabled: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastUsedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
