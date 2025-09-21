import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PodcastRoomsService } from './services/podcast-rooms.service';
import { PodcastRoom } from './entities/podcast-room.entity';
import { StellarService } from './services/stellar.service';
import { IPFSService } from './services/ipfs.service';
import { PodcastRoomsController } from './podcast-rooms.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PodcastRoom])],
  controllers: [PodcastRoomsController],
  providers: [PodcastRoomsService, StellarService, IPFSService],
  exports: [PodcastRoomsService, StellarService, IPFSService],
})
export class PodcastRoomsModule {}
