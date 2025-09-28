import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntentGossipService } from './intent-gossip.service';
import { GossipController } from './gossip.controller';
import { IntentLog } from './entities/intent-log.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([IntentLog]),
    AuthModule,
    UsersModule,
  ],
  controllers: [GossipController],
  providers: [IntentGossipService],
  exports: [IntentGossipService],
})
export class IntentGossipModule {}