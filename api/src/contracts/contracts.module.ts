import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { StarknetService } from './starknet.service';
import { EvmService } from './evm.service';

@Module({
  imports: [ConfigModule],
  controllers: [ContractsController],
  providers: [ContractsService, StarknetService, EvmService],
  exports: [ContractsService],
})
export class ContractsModule {}
