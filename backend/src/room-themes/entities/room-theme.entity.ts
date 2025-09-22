import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('room_themes')
@Index(['roomId'])
export class RoomTheme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  roomId: string;

  @Column()
  themeId: string;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}