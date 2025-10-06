import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { KycController } from './kyc.controller';
import { KycService } from './services/kyc.service';
import { DocumentStorageService } from './services/document-storage.service';
import { BlockchainVerifyService } from './services/blockchain-verify.service';
import { KycThresholdService } from './services/kyc-threshold.service';
import { AdminKycGuard } from './guards/admin-kyc.guard';
import { Kyc } from './entities/kyc.entity';
import { KycAudit } from './entities/kyc-audit.entity';
import kycConfig from '../config/kyc-thresholds.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kyc, KycAudit]),
    ConfigModule.forFeature(kycConfig),
  ],
  controllers: [KycController],
  providers: [
    KycService,
    DocumentStorageService,
    BlockchainVerifyService,
    KycThresholdService,
    AdminKycGuard,
  ],
  exports: [KycService, KycThresholdService],
})
export class KycModule {}