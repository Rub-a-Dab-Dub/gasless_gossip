import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Post } from '../posts/entities/post.entity';
import { Chat } from '../chats/entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Chat])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
