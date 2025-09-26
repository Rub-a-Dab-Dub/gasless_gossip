import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Xp } from './xp.entity';
import { ProcessedEvent } from './processed-event.entity';
import { StellarAccount } from './stellar-account.entity';
import { XpService } from './xp.service';
import { XpController } from './xp.controller';
import { StellarListenerService } from './stellar-listener.service';

@Module({
  imports: [TypeOrmModule.forFeature([Xp, ProcessedEvent, StellarAccount])],
  providers: [XpService, StellarListenerService],
  controllers: [XpController],
  exports: [XpService],
})
export class XpModule {}
