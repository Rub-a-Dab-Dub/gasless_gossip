"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bulk_report_entity_1 = require("./entities/bulk-report.entity");
const user_entity_1 = require("../user/entities/user.entity");
const room_entity_1 = require("../../entities/room.entity");
const message_entity_1 = require("../../entities/message.entity");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let ReportsService = class ReportsService {
    bulkReportRepository;
    userRepository;
    roomRepository;
    messageRepository;
    MAX_FILE_SIZE = 500 * 1024 * 1024;
    constructor(bulkReportRepository, userRepository, roomRepository, messageRepository) {
        this.bulkReportRepository = bulkReportRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.messageRepository = messageRepository;
    }
    async createBulkReport(adminId, dto) {
        const report = this.bulkReportRepository.create({
            adminId,
            resources: dto.resources,
            filters: { startDate: dto.startDate, endDate: dto.endDate, ...dto.filters },
            format: dto.format || bulk_report_entity_1.ReportFormat.JSON,
        });
        const savedReport = await this.bulkReportRepository.save(report);
        this.processReportAsync(savedReport.id);
        return savedReport;
    }
    async getReportStatus(reportId) {
        return this.bulkReportRepository.findOne({ where: { id: reportId } });
    }
    async getReports(adminId) {
        return this.bulkReportRepository.find({
            where: { adminId },
            order: { createdAt: 'DESC' },
        });
    }
    async processReportAsync(reportId) {
        try {
            await this.updateReportStatus(reportId, bulk_report_entity_1.ReportStatus.PROCESSING, 0);
            const report = await this.bulkReportRepository.findOne({ where: { id: reportId } });
            if (!report)
                return;
            const data = await this.aggregateData(report);
            const filePath = await this.generateFile(report, data);
            const stats = fs.statSync(filePath);
            if (stats.size > this.MAX_FILE_SIZE) {
                throw new Error(`File size exceeds 500MB limit`);
            }
            await this.bulkReportRepository.update(reportId, {
                status: bulk_report_entity_1.ReportStatus.COMPLETED,
                progress: 100,
                downloadUrl: filePath,
                fileSizeBytes: stats.size,
            });
        }
        catch (error) {
            await this.bulkReportRepository.update(reportId, {
                status: bulk_report_entity_1.ReportStatus.FAILED,
                errorMessage: error.message,
            });
        }
    }
    async updateReportStatus(reportId, status, progress) {
        await this.bulkReportRepository.update(reportId, { status, progress });
    }
    async aggregateData(report) {
        const result = {};
        const { startDate, endDate } = report.filters;
        const dateFilter = startDate && endDate ? { createdAt: (0, typeorm_2.Between)(new Date(startDate), new Date(endDate)) } : {};
        for (const resource of report.resources) {
            await this.updateReportStatus(report.id, bulk_report_entity_1.ReportStatus.PROCESSING, 50);
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
    async generateFile(report, data) {
        const uploadsDir = path.join(process.cwd(), 'uploads', 'reports');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const fileName = `report_${report.id}.${report.format}`;
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return filePath;
    }
    createDownloadStream(filePath) {
        return fs.createReadStream(filePath);
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bulk_report_entity_1.BulkReport)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(room_entity_1.Room)),
    __param(3, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map