import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';

import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../posts/entities/comment.entity';
import { Like } from '../../posts/entities/like.entity';
import { Message } from 'src/chat/entities/message.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  address: string;

  @Column({ default: 0 })
  xp: number;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  about: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];
}
