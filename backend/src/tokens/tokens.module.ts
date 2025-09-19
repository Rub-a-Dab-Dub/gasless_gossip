import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import { TokenTransaction } from './token-transaction.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([TokenTransaction])],
  controllers: [TokensController],
  providers: [TokensService],
})
export class TokensModule {}


