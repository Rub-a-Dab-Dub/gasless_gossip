import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { WalletIntegrationController } from './wallet-integration.controller';
import { WalletIntegrationService } from './services/wallet-integration.service';
import { WalletConnection } from './entities/wallet-connection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletConnection]),
    ConfigModule,
  ],
  controllers: [WalletIntegrationController],
  providers: [WalletIntegrationService],
  exports: [WalletIntegrationService],
})
export class WalletIntegrationModule {}
