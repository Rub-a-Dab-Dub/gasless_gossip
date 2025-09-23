import { Entity, Column, PrimaryGeneratedColumn, Unique, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('pseudonyms')
@Unique('uq_room_user', ['roomId', 'userId'])
@Unique('uq_room_pseudonym', ['roomId', 'pseudonym'])
export class Pseudonym {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'room_id', type: 'uuid' })
  @Index('idx_pseudonyms_room_id')
  roomId!: string;

  @Column({ name: 'user_id', type: 'uuid' })
  @Index('idx_pseudonyms_user_id')
  userId!: string;

  @Column({ length: 100 })
  pseudonym!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}


