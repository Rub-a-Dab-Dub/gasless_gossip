import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { BulkReport, ReportStatus, ReportFormat } from './entities/bulk-report.entity';
import { CreateBulkReportDto } from './dto/create-bulk-report.dto';
import { User } from '../user/entities/user.entity';
import { Room } from '../../entities/room.entity';
import { Message } from '../../entities/message.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Readable } from 'stream';

@Injectable()
export class ReportsService {
  private readonly MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

  constructor(
    @InjectRepository(BulkReport)
    private bulkReportRepository: Repository<BulkReport>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async createBulkReport(adminId: string, dto: CreateBulkReportDto): Promise<BulkReport> {
    const report = this.bulkReportRepository.create({
      adminId,
      resources: dto.resources,
      filters: { startDate: dto.startDate, endDate: dto.endDate, ...dto.filters },
      format: dto.format || ReportFormat.JSON,
    });

    const savedReport = await this.bulkReportRepository.save(report);
    this.processReportAsync(savedReport.id);
    return savedReport;
  }

  async getReportStatus(reportId: string): Promise<BulkReport> {
    return this.bulkReportRepository.findOne({ where: { id: reportId } });
  }

  async getReports(adminId: string): Promise<BulkReport[]> {
    return this.bulkReportRepository.find({
      where: { adminId },
      order: { createdAt: 'DESC' },
    });
  }

  private async processReportAsync(reportId: string): Promise<void> {
    try {
      await this.updateReportStatus(reportId, ReportStatus.PROCESSING, 0);
      const report = await this.bulkReportRepository.findOne({ where: { id: reportId } });
      if (!report) return;

      const data = await this.aggregateData(report);
      const filePath = await this.generateFile(report, data);

      const stats = fs.statSync(filePath);
      if (stats.size > this.MAX_FILE_SIZE) {
        throw new Error(`File size exceeds 500MB limit`);
      }

      await this.bulkReportRepository.update(reportId, {
        status: ReportStatus.COMPLETED,
        progress: 100,
        downloadUrl: filePath,
        fileSizeBytes: stats.size,
      });
    } catch (error) {
      await this.bulkReportRepository.update(reportId, {
        status: ReportStatus.FAILED,
        errorMessage: error.message,
      });
    }
  }

  private async updateReportStatus(reportId: string, status: ReportStatus, progress: number): Promise<void> {
    await this.bulkReportRepository.update(reportId, { status, progress });
  }

  private async aggregateData(report: BulkReport): Promise<any> {
    const result = {};
    const { startDate, endDate } = report.filters;
    const dateFilter = startDate && endDate ? { createdAt: Between(new Date(startDate), new Date(endDate)) } : {};

    for (const resource of report.resources) {
      await this.updateReportStatus(report.id, ReportStatus.PROCESSING, 50);
      
      switch (resource) {
        case 'users':
          result[resource] = await this.userRepository.find({ where: dateFilter });
          break;
        case 'rooms':
          result[resource] = await this.roomRepository.find({ where: dateFilter });
          break;
        case 'messages':
          result[resource] = await this.messageRepository.find({ where: dateFilter });
          break;
      }
    }
    return result;
  }

  private async generateFile(report: BulkReport, data: any): Promise<string> {
    const uploadsDir = path.join(process.cwd(), 'uploads', 'reports');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileName = `report_${report.id}.${report.format}`;
    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return filePath;
  }

  createDownloadStream(filePath: string): Readable {
    return fs.createReadStream(filePath);
  }
}