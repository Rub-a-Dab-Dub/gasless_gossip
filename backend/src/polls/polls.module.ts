import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { PollVote } from './entities/poll-vote.entity';
import { PollsService } from './services/polls.service';
import { PollsController } from './polls.controller';
import { InvitationsModule } from '../invitations/invitations.module';
import { UsersModule } from '../users/users.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoomAccessGuard } from '../auth/guards/room-access.guard';
import { RoomAdminGuard } from '../auth/guards/room-admin.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Poll, PollVote]),
    InvitationsModule,
    UsersModule,
  ],
  controllers: [PollsController],
  providers: [PollsService, JwtAuthGuard, RoomAccessGuard, RoomAdminGuard],
  exports: [PollsService],
})
export class PollsModule {}


