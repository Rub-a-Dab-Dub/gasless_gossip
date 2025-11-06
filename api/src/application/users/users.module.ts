import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Post } from '../posts/entities/post.entity';
import { Chat } from '../chats/entities/chat.entity';
import { ChatsService } from '../chats/chats.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Chat])],
  providers: [UsersService, ChatsService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
