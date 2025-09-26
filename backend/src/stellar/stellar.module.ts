import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StellarController } from './stellar.controller';
import { StellarService } from './stellar.service';

@Module({
  imports: [ConfigModule],
  controllers: [StellarController],
  providers: [StellarService],
  exports: [StellarService],
})
export class StellarModule {}
