import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomTagsController } from './room-tags.controller';
import { RoomTagsService } from './room-tags.service';
import { RoomTag } from './entities/room-tag.entity';
import { Room } from '../rooms/entities/room.entity';
import { RoomMembership } from '../rooms/entities/room-membership.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomTag, Room, RoomMembership]),
    AuthModule,
  ],
  controllers: [RoomTagsController],
  providers: [RoomTagsService],
  exports: [RoomTagsService],
})
export class RoomTagsModule {}