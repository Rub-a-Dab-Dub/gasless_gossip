import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GossipGateway } from './gossip.gateway';
import { GossipService } from './services/gossip.service';
import { GossipIntent } from './entities/gossip-intent.entity';
import { GossipUpdate } from './entities/gossip-update.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GossipIntent, GossipUpdate]),
    AuthModule,
    UsersModule,
    RoomsModule,
  ],
  providers: [GossipGateway, GossipService],
  exports: [GossipService, GossipGateway],
})
export class GossipModule {}
