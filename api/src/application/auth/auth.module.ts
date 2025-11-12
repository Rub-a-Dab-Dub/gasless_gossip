import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ContractsService } from 'src/contracts/contracts.service';
import { StarknetService } from 'src/contracts/starknet.service';
import { EvmService } from 'src/contracts/evm.service';
import { WalletService } from '../wallets/wallet.service';
import { Wallet } from '../wallets/entities/wallet.entity';
import { StringValue } from 'ms';
import { UserEventListeners } from '@/events/user-listeners';
import { HttpModule } from '@nestjs/axios';
import { UserVerificationService } from '../users/user-verification.service';
import { UserVerification } from '../users/entities/user-verification.entity';
import { EmailTemplateService } from '@/notification/core/email';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([User, Wallet, UserVerification]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'G4ZL3ZZ_G0ZZ1P',
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '1d') as StringValue,
      },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    ContractsService,
    StarknetService,
    EvmService,
    WalletService,
    UserEventListeners,
    UserVerificationService,
    EmailTemplateService,
  ],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
