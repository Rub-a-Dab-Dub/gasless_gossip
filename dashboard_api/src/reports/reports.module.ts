import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { BulkReport } from './entities/bulk-report.entity';
import { User } from '../user/entities/user.entity';
import { Room } from '../../entities/room.entity';
import { Message } from '../../entities/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BulkReport, User, Room, Message]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}