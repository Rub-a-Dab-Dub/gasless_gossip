import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blurred_avatars')
export class BlurredAvatar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  blurLevel: number;

  @Column()
  imageUrl: string;
}
