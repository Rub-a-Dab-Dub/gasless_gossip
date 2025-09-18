import { Module } from '@nestjs/common';
import { StellarController } from './stellar.controller';

@Module({
  controllers: [StellarController],
})
export class StellarModule {}
