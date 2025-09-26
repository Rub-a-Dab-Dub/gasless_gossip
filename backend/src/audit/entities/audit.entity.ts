/* eslint-disable prettier/prettier */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
     id!: string;

  @Column()
     userId!: string;

  @Column()
     action!: string; //  "USER_BANNED", "WALLET_CONNECTED"

  @Column({ type: 'jsonb', nullable: true })
     details!: Record<string, any>;

  @CreateDateColumn()
     createdAt!: Date;
}
