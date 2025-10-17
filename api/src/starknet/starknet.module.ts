import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import starknetConfig from '../config/starknet.config';
import { StarknetService } from './starknet.service';

@Module({
  imports: [ConfigModule.forFeature(starknetConfig)],
  providers: [StarknetService],
  exports: [StarknetService],
})
export class StarknetModule {}
