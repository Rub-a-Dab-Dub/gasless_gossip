import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuctionsController } from './auctions.controller';
import { AuctionsService } from './auctions.service';
import { StellarService } from './stellar.service';
import { Auction } from './entities/auction.entity';
import { Bid } from './entities/bid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auction, Bid]), ScheduleModule.forRoot()],
  controllers: [AuctionsController],
  providers: [AuctionsService, StellarService],
  exports: [AuctionsService],
})
export class AuctionsModule {}
