import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity('reactions')
export class Reaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  messageId!: string;

  @Column()
  type!: string; // Emoji or reaction type

  @Column()
  userId!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
