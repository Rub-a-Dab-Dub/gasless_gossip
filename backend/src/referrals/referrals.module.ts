import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ReferralsController } from './referrals.controller';
import { ReferralsService } from './services/referrals.service';
import { StellarService } from './services/stellar.service';
import { Referral } from './entities/referral.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Referral]),
    ConfigModule,
  ],
  controllers: [ReferralsController],
  providers: [ReferralsService, StellarService],
  exports: [ReferralsService, StellarService],
})
export class ReferralsModule {}
