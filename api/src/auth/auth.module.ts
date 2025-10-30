import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ContractsService } from '../contracts/contracts.service';
import { StarknetService } from '../contracts/starknet.service';
import { EvmService } from '../contracts/evm.service';
import { WalletService } from '../wallets/wallet.service';
import { BullModule } from '@nestjs/bullmq';
import { Wallet } from '../wallets/entities/wallet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wallet]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'G4ZL3ZZ_G0ZZ1P',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ?? '1d' },
    }),
    BullModule.registerQueue({
      name: 'wallet-queue',
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    ContractsService,
    StarknetService,
    EvmService,
    WalletService,
  ],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
