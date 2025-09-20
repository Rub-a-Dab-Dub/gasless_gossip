import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Badge } from './entities/badge.entity';
import { BadgesService } from './badges.service';
import { BadgesController } from './badges.controller';
import { StellarModule } from '../stellar/stellar.module';

@Module({
  imports: [TypeOrmModule.forFeature([Badge]), StellarModule],
  providers: [BadgesService],
  controllers: [BadgesController],
})
export class BadgesModule {}
