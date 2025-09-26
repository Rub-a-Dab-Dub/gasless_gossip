import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('podcast_rooms')
@Index(['creatorId'])
@Index(['roomId'], { unique: true })
export class PodcastRoom {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, length: 100 })
  roomId!: string;

  @Column({ length: 500 })
  audioHash!: string;

  @Column('uuid')
  creatorId!: string;

  @Column({ length: 200 })
  title!: string;

  @Column('text', { nullable: true })
  description!: string;

  @Column('int', { default: 0 })
  duration!: number; // in seconds

  @Column({ length: 100, nullable: true })
  audioFormat!: string;

  @Column('bigint', { nullable: true })
  fileSize!: number;

  @Column({ length: 500, nullable: true })
  stellarHash!: string;

  @Column({ length: 500, nullable: true })
  ipfsHash!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column('simple-array', { nullable: true })
  tags!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
