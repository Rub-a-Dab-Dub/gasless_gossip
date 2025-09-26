import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AvatarsController } from './avatars.controller';
import { AvatarsService } from './avatars.service';
import { StellarNftService } from './services/stellar-nft.service';
import { Avatar } from './entities/avatar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Avatar]), ConfigModule],
  controllers: [AvatarsController],
  providers: [AvatarsService, StellarNftService],
  exports: [AvatarsService], // Export if other modules need to use it
})
export class AvatarsModule {}
