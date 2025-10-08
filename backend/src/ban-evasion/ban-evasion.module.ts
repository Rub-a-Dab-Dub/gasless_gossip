import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BanEvasionService } from './ban-evasion.service';
import { BanEvasionController } from './ban-evasion.controller';
import { BanRecord } from './entities/ban-record.entity';
import { EvasionEvidence } from './entities/evasion-evidence.entity';
import { Appeal } from './entities/appeal.entity';
import { IpLog } from './entities/ip-log.entity';
import { WalletBlacklist } from './entities/wallet-blacklist.entity';
import { IpAnonymizationService } from './ip-anonymization.service';
import { WalletBlacklistService } from './wallet-blacklist.service';
import { PatternDetectionService } from './pattern-detection.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BanRecord,
      EvasionEvidence,
      Appeal,
      IpLog,
      WalletBlacklist
    ])
  ],
  controllers: [BanEvasionController],
  providers: [
    BanEvasionService,
    IpAnonymizationService,
    WalletBlacklistService,
    PatternDetectionService
  ],
  exports: [BanEvasionService]
})
export class BanEvasionModule {}