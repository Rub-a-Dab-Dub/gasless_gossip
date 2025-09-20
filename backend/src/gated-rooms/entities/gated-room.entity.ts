import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export interface GateRule {
  type: 'token' | 'nft';
  assetCode: string;
  issuer: string;
  minAmount?: number;
  requiredNftId?: string;
}

@Entity('gated_rooms')
export class GatedRoom {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'room_id', unique: true })
  roomId!: string;

  @Column({ type: 'jsonb', name: 'gate_rules' })
  gateRules!: GateRule[];

  @Column({ name: 'room_name', nullable: true })
  roomName?: string;

  @Column({ name: 'description', nullable: true })
  description?: string;

  @Column({ name: 'created_by' })
  createdBy!: string;

  @Column({ default: true, name: 'is_active' })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}