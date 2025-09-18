import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('xp')
export class Xp {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'int', default: 0 })
  xpValue!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
