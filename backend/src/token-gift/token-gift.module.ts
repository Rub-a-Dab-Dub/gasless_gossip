import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenGift } from './entities/token-gift.entity';
import { TokenGiftTransaction } from './entities/token-gift-transaction.entity';
import { TokenGiftService } from './services/token-gift.service';
import { TokenGiftController } from './token-gift.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenGift, TokenGiftTransaction]),
    AuthModule,
    UsersModule,
    ConfigModule,
  ],
  controllers: [TokenGiftController],
  providers: [TokenGiftService],
  exports: [TokenGiftService],
})
export class TokenGiftModule {}
