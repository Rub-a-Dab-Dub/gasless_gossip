import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  Res,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { CreateBulkReportDto } from './dto/create-bulk-report.dto';
import { BulkReport } from './entities/bulk-report.entity';
import * as fs from 'fs';
import * as path from 'path';

@Controller('admin/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('bulk')
  async createBulkReport(
    @Body() createBulkReportDto: CreateBulkReportDto,
    @Query('adminId') adminId: string,
  ): Promise<BulkReport> {
    if (!adminId) throw new BadRequestException('Admin ID required');

    const validResources = ['users', 'rooms', 'messages'];
    const invalid = createBulkReportDto.resources.filter(r => !validResources.includes(r));
    if (invalid.length) throw new BadRequestException(`Invalid resources: ${invalid.join(', ')}`);

    return this.reportsService.createBulkReport(adminId, createBulkReportDto);
  }

  @Get()
  async getReports(@Query('adminId') adminId: string): Promise<BulkReport[]> {
    if (!adminId) throw new BadRequestException('Admin ID required');
    return this.reportsService.getReports(adminId);
  }

  @Get(':id/status')
  async getReportStatus(@Param('id') id: string): Promise<BulkReport> {
    const report = await this.reportsService.getReportStatus(id);
    if (!report) throw new NotFoundException('Report not found');
    return report;
  }

  @Get(':id/download')
  async downloadReport(
    @Param('id') id: string,
    @Query('adminId') adminId: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!adminId) throw new BadRequestException('Admin ID required');

    const report = await this.reportsService.getReportStatus(id);
    if (!report || report.adminId !== adminId) throw new NotFoundException('Report not found');
    if (!report.downloadUrl || !fs.existsSync(report.downloadUrl)) throw new NotFoundException('File not found');

    const fileName = path.basename(report.downloadUrl);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Length', report.fileSizeBytes);

    const stream = this.reportsService.createDownloadStream(report.downloadUrl);
    stream.pipe(res);
  }
}