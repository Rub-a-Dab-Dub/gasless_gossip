import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Post } from '../posts/entities/post.entity';
import { Chat } from '../chats/entities/chat.entity';
import { ChatsService } from '../chats/chats.service';
import { UserVerificationService } from './user-verification.service';
import { UserVerification } from './entities/user-verification.entity';
import { EmailTemplateService } from '@/notification/core/email';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Chat, UserVerification])],
  providers: [
    UsersService,
    ChatsService,
    UserVerificationService,
    EmailTemplateService,
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
