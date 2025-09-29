import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecretRoom } from './entities/secret-room.entity';
import { RoomInvitation } from './entities/room-invitation.entity';
import { RoomMember } from './entities/room-member.entity';
import { SecretRoomsService } from './services/secret-rooms.service';
import { SecretRoomsController } from './secret-rooms.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([SecretRoom, RoomInvitation, RoomMember]),
    AuthModule,
    UsersModule,
    ConfigModule,
  ],
  controllers: [SecretRoomsController],
  providers: [SecretRoomsService],
  exports: [SecretRoomsService],
})
export class SecretRoomsModule {}
