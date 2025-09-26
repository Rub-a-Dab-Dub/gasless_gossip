import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MemecoinsController } from './controllers/memecoins.controller';
import { MemecoinsService } from './services/memecoins.service';
import { StellarService } from './services/stellar.service';
import { MemecoinDrop } from './entities/memecoin-drop.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemecoinDrop]),
    ConfigModule,
  ],
  controllers: [MemecoinsController],
  providers: [MemecoinsService, StellarService],
  exports: [MemecoinsService, StellarService],
})
export class MemecoinsModule {}
