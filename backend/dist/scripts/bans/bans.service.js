"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ban_entity_1 = require("./entities/ban.entity");
const report_entity_1 = require("./entities/report.entity");
let BansService = class BansService {
    banRepository;
    reportRepository;
    constructor(banRepository, reportRepository) {
        this.banRepository = banRepository;
        this.reportRepository = reportRepository;
    }
    async createBan(createBanDto) {
        const existingBan = await this.getActiveBan(createBanDto.userId);
        if (existingBan) {
            throw new common_1.BadRequestException('User is already banned');
        }
        const ban = this.banRepository.create({
            ...createBanDto,
            expiresAt: createBanDto.expiresAt ? new Date(createBanDto.expiresAt) : null,
        });
        const savedBan = await this.banRepository.save(ban);
        await this.notifyUserBanned(createBanDto.userId, savedBan);
        return savedBan;
    }
    async getBanByUserId(userId) {
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
    async getAllBans(page = 1, limit = 10) {
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
    async liftBan(banId, liftedBy) {
        const ban = await this.banRepository.findOne({
            where: { id: banId, isActive: true }
        });
        if (!ban) {
            throw new common_1.NotFoundException('Active ban not found');
        }
        await this.banRepository.update(banId, {
            isActive: false,
            updatedAt: new Date(),
        });
        await this.notifyUserBanLifted(ban.userId, ban);
    }
    async isUserBanned(userId) {
        const ban = await this.getActiveBan(userId);
        return !!ban;
    }
    async getActiveBan(userId) {
        const now = new Date();
        return await this.banRepository.findOne({
            where: [
                { userId, isActive: true, expiresAt: null },
                { userId, isActive: true, expiresAt: (0, typeorm_2.MoreThan)(now) },
            ],
        });
    }
    async createReport(reporterId, createReportDto) {
        if (reporterId === createReportDto.reportedUserId) {
            throw new common_1.BadRequestException('Cannot report yourself');
        }
        const existingReport = await this.reportRepository.findOne({
            where: {
                reporterId,
                reportedUserId: createReportDto.reportedUserId,
                status: report_entity_1.ReportStatus.PENDING,
            },
        });
        if (existingReport) {
            throw new common_1.BadRequestException('You have already reported this user');
        }
        const report = this.reportRepository.create({
            ...createReportDto,
            reporterId,
        });
        return await this.reportRepository.save(report);
    }
    async getReports(page = 1, limit = 10, status) {
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
    async getReportById(id) {
        const report = await this.reportRepository.findOne({ where: { id } });
        if (!report) {
            throw new common_1.NotFoundException('Report not found');
        }
        return report;
    }
    async updateReport(id, updateReportDto) {
        const report = await this.getReportById(id);
        Object.assign(report, updateReportDto);
        return await this.reportRepository.save(report);
    }
    async getUserReports(userId, page = 1, limit = 10) {
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
    async notifyUserBanned(userId, ban) {
        console.log(`User ${userId} has been banned. Reason: ${ban.reason}`);
    }
    async notifyUserBanLifted(userId, ban) {
        console.log(`Ban lifted for user ${userId}`);
    }
};
exports.BansService = BansService;
exports.BansService = BansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ban_entity_1.Ban)),
    __param(1, (0, typeorm_1.InjectRepository)(report_entity_1.Report)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BansService);
//# sourceMappingURL=bans.service.js.map