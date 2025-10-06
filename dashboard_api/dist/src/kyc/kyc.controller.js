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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KycController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const kyc_service_1 = require("./services/kyc.service");
const kyc_threshold_service_1 = require("./services/kyc-threshold.service");
const create_kyc_dto_1 = require("./dto/create-kyc.dto");
const update_kyc_status_dto_1 = require("./dto/update-kyc-status.dto");
const query_kyc_dto_1 = require("./dto/query-kyc.dto");
const bulk_apply_kyc_dto_1 = require("./dto/bulk-apply-kyc.dto");
const admin_kyc_guard_1 = require("./guards/admin-kyc.guard");
let KycController = class KycController {
    kycService;
    thresholdService;
    constructor(kycService, thresholdService) {
        this.kycService = kycService;
        this.thresholdService = thresholdService;
    }
    async create(dto, req) {
        const adminId = req.user.id;
        return this.kycService.create(dto, adminId);
    }
    async findAll(query) {
        return this.kycService.findAll(query);
    }
    async getThresholds() {
        return {
            thresholds: this.thresholdService.getAllThresholds(),
        };
    }
    async findByUserId(userId) {
        return this.kycService.findByUserId(userId);
    }
    async findOne(id) {
        return this.kycService.findOne(id);
    }
    async updateStatus(id, dto, req) {
        const adminId = req.user.id;
        return this.kycService.updateStatus(id, dto, adminId);
    }
    async uploadDocument(id, file, docType, req) {
        const adminId = req.user.id;
        return this.kycService.uploadDocument(id, file, docType, adminId);
    }
    async verifyOnChain(id, req) {
        const adminId = req.user.id;
        return this.kycService.verifyOnChain(id, adminId);
    }
    async bulkApply(dto, req) {
        const adminId = req.user.id;
        return this.kycService.bulkApply(dto, adminId);
    }
};
exports.KycController = KycController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Flag user for KYC' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kyc_dto_1.CreateKycDto, Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all KYC records with filters' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_kyc_dto_1.QueryKycDto]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('thresholds'),
    (0, swagger_1.ApiOperation)({ summary: 'Get KYC threshold configuration' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KycController.prototype, "getThresholds", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get KYC record by user ID' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get KYC record by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update KYC status' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_kyc_status_dto_1.UpdateKycStatusDto, Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':id/upload'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload KYC document' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('docType')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_b = typeof Express !== "undefined" && (_a = Express.Multer) !== void 0 && _a.File) === "function" ? _b : Object, String, Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Post)(':id/verify-onchain'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit KYC proof to blockchain' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "verifyOnChain", null);
__decorate([
    (0, common_1.Post)('bulk-apply'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk apply KYC status to multiple users' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_apply_kyc_dto_1.BulkApplyKycDto, Object]),
    __metadata("design:returntype", Promise)
], KycController.prototype, "bulkApply", null);
exports.KycController = KycController = __decorate([
    (0, swagger_1.ApiTags)('kyc'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('kyc'),
    (0, common_1.UseGuards)(admin_kyc_guard_1.AdminKycGuard),
    __metadata("design:paramtypes", [kyc_service_1.KycService,
        kyc_threshold_service_1.KycThresholdService])
], KycController);
//# sourceMappingURL=kyc.controller.js.map