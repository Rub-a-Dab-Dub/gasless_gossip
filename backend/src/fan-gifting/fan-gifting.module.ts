import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { FanGift } from './entities/fan-gift.entity';
import { FanGiftingController } from './controllers/fan-gifting.controller';
import { FanGiftingService } from './services/fan-gifting.service';
import { StellarService } from './services/stellar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([FanGift]),
    ConfigModule
  ],
  controllers: [FanGiftingController],
  providers: [FanGiftingService, StellarService],
  exports: [FanGiftingService, StellarService]
})
export class FanGiftingModule {}

