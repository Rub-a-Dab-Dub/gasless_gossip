/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit.entity';
import { AuditLogsService } from './audit.service';
import { AuditLogsController } from './audit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditLogsService],
  controllers: [AuditLogsController],
  exports: [AuditLogsService], // ✅ So other modules can log actions
})
export class AuditLogsModule {}
