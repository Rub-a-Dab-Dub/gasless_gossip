import { Badge } from '../../badges/entities/badge.entity';
import { Reputation } from '../../reputation/entities/reputation.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 50 })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ length: 100 })
  pseudonym!: string;

  @Column({ name: 'stellar_account_id', unique: true, nullable: true })
  stellarAccountId!: string;

  @OneToMany(() => Badge, (badge) => badge.user)
  badges!: Badge[];

  @OneToMany(() => Reputation, (reputation) => reputation.user)
  reputations!: Reputation[];

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
