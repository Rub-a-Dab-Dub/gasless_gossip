import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlairsService } from './flairs.service';
import { FlairsController } from './flairs.controller';
import { Flair } from './entities/flair.entity';
import { StellarService } from '../stellar/stellar.service';

@Module({
  imports: [TypeOrmModule.forFeature([Flair])],
  controllers: [FlairsController],
  providers: [FlairsService, StellarService],
  exports: [FlairsService],
})
export class FlairsModule {}


