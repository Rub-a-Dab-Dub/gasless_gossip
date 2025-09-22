import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GiftsGivenController } from './gifts-given.controller';
import { GiftsGivenService } from './gifts-given.service';
import { GiftLog } from './entities/gift-log.entity';
import { GiftAnalyticsListener } from './listeners/gift-analytics.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([GiftLog]),
    EventEmitterModule.forRoot(),
  ],
  controllers: [GiftsGivenController],
  providers: [GiftsGivenService, GiftAnalyticsListener],
  exports: [GiftsGivenService],
})
export class GiftsGivenModule {}