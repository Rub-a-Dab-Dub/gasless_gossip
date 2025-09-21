import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecretsController } from './secrets.controller';
import { SecretsService } from './secrets.service';
import { Secret } from './entities/secret.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Secret])],
  controllers: [SecretsController],
  providers: [SecretsService],
  exports: [SecretsService],
})
export class SecretsModule {}