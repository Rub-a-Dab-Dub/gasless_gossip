import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('blurred_avatars')
@Index(['userId'], { unique: false })
export class BlurredAvatar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Index()
  userId: string;

  @Column({ type: 'int', default: 5 })
  blurLevel: number;

  @Column({ type: 'varchar', length: 500, nullable: false })
  imageUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  originalImageUrl: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
