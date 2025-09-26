import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('stellar_account')
export class StellarAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  stellarAccount!: string; // e.g., G... public address

  @Column({ nullable: true })
  userId?: string; // internal user uuid or identifier

  @CreateDateColumn()
  createdAt!: Date;
}
