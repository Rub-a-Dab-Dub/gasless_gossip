import { Module } from '@nestjs/common';
import { scheduleProviders } from './schedules';
import { UsersService } from '@/application/users/users.service';
import { DatabaseModule } from '@/infrastructure/database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/application/users/entities/user.entity';
import { Post } from '@/application/posts/entities/post.entity';
import { Chat } from '@/application/chats/entities/chat.entity';
import { PostsService } from '@/application/posts/posts.service';
import { ChatsService } from '@/application/chats/chats.service';
import { UserVerificationService } from '@/application/users/user-verification.service';
import { Comment } from '@/application/posts/entities/comment.entity';
import { Like } from '@/application/posts/entities/like.entity';
import { UserVerification } from '@/application/users/entities/user-verification.entity';

@Module({
  imports: [
    DatabaseModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      User,
      Post,
      Chat,
      Comment,
      Like,
      UserVerification,
    ]),
  ],
  providers: [
    ...scheduleProviders,
    UsersService,
    PostsService,
    ChatsService,
    UserVerificationService,
  ],
})
export class Schedule {}
