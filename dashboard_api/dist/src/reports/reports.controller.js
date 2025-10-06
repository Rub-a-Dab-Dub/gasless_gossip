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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const reports_service_1 = require("./reports.service");
const create_bulk_report_dto_1 = require("./dto/create-bulk-report.dto");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async createBulkReport(createBulkReportDto, adminId) {
        if (!adminId)
            throw new common_1.BadRequestException('Admin ID required');
        const validResources = ['users', 'rooms', 'messages'];
        const invalid = createBulkReportDto.resources.filter(r => !validResources.includes(r));
        if (invalid.length)
            throw new common_1.BadRequestException(`Invalid resources: ${invalid.join(', ')}`);
        return this.reportsService.createBulkReport(adminId, createBulkReportDto);
    }
    async getReports(adminId) {
        if (!adminId)
            throw new common_1.BadRequestException('Admin ID required');
        return this.reportsService.getReports(adminId);
    }
    async getReportStatus(id) {
        const report = await this.reportsService.getReportStatus(id);
        if (!report)
            throw new common_1.NotFoundException('Report not found');
        return report;
    }
    async downloadReport(id, adminId, res) {
        if (!adminId)
            throw new common_1.BadRequestException('Admin ID required');
        const report = await this.reportsService.getReportStatus(id);
        if (!report || report.adminId !== adminId)
            throw new common_1.NotFoundException('Report not found');
        if (!report.downloadUrl || !fs.existsSync(report.downloadUrl))
            throw new common_1.NotFoundException('File not found');
        const fileName = path.basename(report.downloadUrl);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Length', report.fileSizeBytes);
        const stream = this.reportsService.createDownloadStream(report.downloadUrl);
        stream.pipe(res);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('adminId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bulk_report_dto_1.CreateBulkReportDto, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "createBulkReport", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('adminId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReports", null);
__decorate([
    (0, common_1.Get)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReportStatus", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('adminId')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "downloadReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('admin/reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map