import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('voice_drops')
@Index(['roomId', 'createdAt'])
export class VoiceDrop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @Index()
  roomId: string;

  @Column({ type: 'varchar', length: 128 })
  audioHash: string;

  @Column('uuid')
  @Index()
  creatorId: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  stellarHash: string;

  @Column({ type: 'varchar', length: 100 })
  fileName: string;

  @Column({ type: 'int' })
  duration: number; // in seconds

  @Column({ type: 'int' })
  fileSize: number; // in bytes

  @Column({ type: 'varchar', length: 50 })
  mimeType: string;

  @CreateDateColumn()
  createdAt: Date;
}
