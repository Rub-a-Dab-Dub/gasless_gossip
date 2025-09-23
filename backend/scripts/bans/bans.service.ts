import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Ban } from './entities/ban.entity';
import { Report, ReportStatus } from './entities/report.entity';
import { CreateBanDto } from './dto/create-ban.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { BanCheckResponseDto } from './dto/ban-check-response.dto';

@Injectable()
export class BansService {
  constructor(
    @InjectRepository(Ban)
    private banRepository: Repository<Ban>,
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  // Ban Management
  async createBan(createBanDto: CreateBanDto): Promise<Ban> {
    // Check if user is already banned
    const existingBan = await this.getActiveBan(createBanDto.userId);
    if (existingBan) {
      throw new BadRequestException('User is already banned');
    }

    const ban = this.banRepository.create({
      ...createBanDto,
      expiresAt: createBanDto.expiresAt ? new Date(createBanDto.expiresAt) : null,
    });

    const savedBan = await this.banRepository.save(ban);
    
    // TODO: Integrate with notification service
    await this.notifyUserBanned(createBanDto.userId, savedBan);
    
    return savedBan;
  }

  async getBanByUserId(userId: string): Promise<BanCheckResponseDto> {
    const activeBan = await this.getActiveBan(userId);
    
    if (!activeBan) {
      return { isBanned: false };
    }

    return {
      isBanned: true,
      banDetails: {
        id: activeBan.id,
        reason: activeBan.reason,
        createdAt: activeBan.createdAt,
        expiresAt: activeBan.expiresAt,
        bannedBy: activeBan.bannedBy,
      },
    };
  }

  async getAllBans(page: number = 1, limit: number = 10) {
    const [bans, total] = await this.banRepository.findAndCount({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: bans,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async liftBan(banId: string, liftedBy?: string): Promise<void> {
    const ban = await this.banRepository.findOne({ 
      where: { id: banId, isActive: true } 
    });
    
    if (!ban) {
      throw new NotFoundException('Active ban not found');
    }

    await this.banRepository.update(banId, { 
      isActive: false,
      updatedAt: new Date(),
    });

    // TODO: Integrate with notification service
    await this.notifyUserBanLifted(ban.userId, ban);
  }

  async isUserBanned(userId: string): Promise<boolean> {
    const ban = await this.getActiveBan(userId);
    return !!ban;
  }

  private async getActiveBan(userId: string): Promise<Ban | null> {
    const now = new Date();
    
    return await this.banRepository.findOne({
      where: [
        { userId, isActive: true, expiresAt: null }, // Permanent bans
        { userId, isActive: true, expiresAt: MoreThan(now) }, // Temporary bans not yet expired
      ],
    });
  }

  // Report Management
  async createReport(reporterId: string, createReportDto: CreateReportDto): Promise<Report> {
    // Prevent self-reporting
    if (reporterId === createReportDto.reportedUserId) {
      throw new BadRequestException('Cannot report yourself');
    }

    // Check for duplicate reports
    const existingReport = await this.reportRepository.findOne({
      where: {
        reporterId,
        reportedUserId: createReportDto.reportedUserId,
        status: ReportStatus.PENDING,
      },
    });

    if (existingReport) {
      throw new BadRequestException('You have already reported this user');
    }

    const report = this.reportRepository.create({
      ...createReportDto,
      reporterId,
    });

    return await this.reportRepository.save(report);
  }

  async getReports(page: number = 1, limit: number = 10, status?: ReportStatus) {
    const where = status ? { status } : {};
    
    const [reports, total] = await this.reportRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: reports,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getReportById(id: string): Promise<Report> {
    const report = await this.reportRepository.findOne({ where: { id } });
    
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    
    return report;
  }

  async updateReport(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    const report = await this.getReportById(id);
    
    Object.assign(report, updateReportDto);
    return await this.reportRepository.save(report);
  }

  async getUserReports(userId: string, page: number = 1, limit: number = 10) {
    const [reports, total] = await this.reportRepository.findAndCount({
      where: { reportedUserId: userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: reports,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Utility methods for notifications (implement based on your notification service)
  private async notifyUserBanned(userId: string, ban: Ban): Promise<void> {
    // TODO: Implement notification logic
    console.log(`User ${userId} has been banned. Reason: ${ban.reason}`);
  }

  private async notifyUserBanLifted(userId: string, ban: Ban): Promise<void> {
    // TODO: Implement notification logic
    console.log(`Ban lifted for user ${userId}`);
  }
}