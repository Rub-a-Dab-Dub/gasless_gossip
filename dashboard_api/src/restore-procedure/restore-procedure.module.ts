import { Module } from '@nestjs/common';
import { RestoreProcedureService } from './restore-procedure.service';
import { RestoreProcedureController } from './restore-procedure.controller';
import { ConfigModule } from '@nestjs/config';
import { S3Module } from '../shared/s3/s3.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    ConfigModule,
    S3Module,
    LoggerModule,
  ],
  controllers: [RestoreProcedureController],
  providers: [RestoreProcedureService],
  exports: [RestoreProcedureService],
})
export class RestoreProcedureModule {}