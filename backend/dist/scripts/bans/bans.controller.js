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
exports.ReportsController = exports.BansController = void 0;
const common_1 = require("@nestjs/common");
const bans_service_1 = require("./bans.service");
const create_ban_dto_1 = require("./dto/create-ban.dto");
const create_report_dto_1 = require("./dto/create-report.dto");
const update_report_dto_1 = require("./dto/update-report.dto");
const report_entity_1 = require("./entities/report.entity");
let BansController = class BansController {
    bansService;
    constructor(bansService) {
        this.bansService = bansService;
    }
    async createBan(createBanDto) {
        return await this.bansService.createBan(createBanDto);
    }
    async checkBanStatus(userId) {
        return await this.bansService.getBanByUserId(userId);
    }
    async getAllBans(page = 1, limit = 10) {
        return await this.bansService.getAllBans(page, limit);
    }
    async liftBan(id) {
        await this.bansService.liftBan(id);
    }
};
exports.BansController = BansController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ban_dto_1.CreateBanDto]),
    __metadata("design:returntype", Promise)
], BansController.prototype, "createBan", null);
__decorate([
    (0, common_1.Get)('check/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BansController.prototype, "checkBanStatus", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BansController.prototype, "getAllBans", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BansController.prototype, "liftBan", null);
exports.BansController = BansController = __decorate([
    (0, common_1.Controller)('bans'),
    __metadata("design:paramtypes", [bans_service_1.BansService])
], BansController);
let ReportsController = class ReportsController {
    bansService;
    constructor(bansService) {
        this.bansService = bansService;
    }
    async createReport(createReportDto) {
        const reporterId = 'temp-reporter-id';
        return await this.bansService.createReport(reporterId, createReportDto);
    }
    async getReports(page = 1, limit = 10, status) {
        return await this.bansService.getReports(page, limit, status);
    }
    async getReport(id) {
        return await this.bansService.getReportById(id);
    }
    async updateReport(id, updateReportDto) {
        return await this.bansService.updateReport(id, updateReportDto);
    }
    async getUserReports(userId, page = 1, limit = 10) {
        return await this.bansService.getUserReports(userId, page, limit);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_report_dto_1.CreateReportDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "createReport", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReports", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getReport", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_report_dto_1.UpdateReportDto]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "updateReport", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('page', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "getUserReports", null);
exports.ReportsController = ReportsController = __decorate([
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [bans_service_1.BansService])
], ReportsController);
//# sourceMappingURL=bans.controller.js.map