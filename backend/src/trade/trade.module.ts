import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './entities/trade.entity';
import { TradesService } from './trade.service';
import { TradesController } from './trade.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Trade])],
  providers: [TradesService],
  controllers: [TradesController],
})
export class TradesModule {}
