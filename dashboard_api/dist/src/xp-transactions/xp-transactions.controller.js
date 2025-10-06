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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.XPTransactionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const xp_transaction_service_1 = require("./xp-transaction.service");
const create_xp_transaction_dto_1 = require("./dto/create-xp-transaction.dto");
const update_xp_transaction_dto_1 = require("./dto/update-xp-transaction.dto");
const void_xp_transaction_dto_1 = require("./dto/void-xp-transaction.dto");
const query_xp_transaction_dto_1 = require("./dto/query-xp-transaction.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const admin_guard_1 = require("../auth/guards/admin.guard");
let XPTransactionController = class XPTransactionController {
    xpService;
    constructor(xpService) {
        this.xpService = xpService;
    }
    async create(dto) {
        return this.xpService.create(dto);
    }
    async findAll(query) {
        return this.xpService.findAll(query);
    }
    async getAggregates(startDate, endDate) {
        return this.xpService.getAggregates(startDate, endDate);
    }
    async getUserTotal(userId) {
        const total = await this.xpService.getUserTotal(userId);
        return { userId, totalXP: total };
    }
    async exportCSV(query, anonymize, res) {
        const shouldAnonymize = anonymize === 'true';
        const data = await this.xpService.exportToCSV(query, shouldAnonymize);
        const csv = [
            Object.keys(data[0] || {}).join(','),
            ...data.map((row) => Object.values(row)
                .map((v) => `"${v}"`)
                .join(',')),
        ].join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=xp-transactions.csv');
        res.send(csv);
    }
    async findOne(id) {
        return this.xpService.findOne(id);
    }
    async update(id, dto) {
        return this.xpService.update(id, dto);
    }
    async void(id, dto) {
        return this.xpService.void(id, dto);
    }
};
exports.XPTransactionController = XPTransactionController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create manual XP award',
        description: 'Award XP manually for events with optional multipliers',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'XP transaction created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_xp_transaction_dto_1.CreateXPTransactionDto]),
    __metadata("design:returntype", Promise)
], XPTransactionController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get paginated XP transactions' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, example: 50 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_xp_transaction_dto_1.QueryXPTransactionDto]),
    __metadata("design:returntype", Promise)
], XPTransactionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('aggregates'),
    (0, swagger_1.ApiOperation)({ summary: 'Get XP aggregates and statistics' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], XPTransactionController.prototype, "getAggregates", null);
__decorate([
    (0, common_1.Get)('user/:userId/total'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total XP for a user' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], XPTransactionController.prototype, "getUserTotal", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, swagger_1.ApiOperation)({ summary: 'Export XP transactions to CSV' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('anonymize')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_xp_transaction_dto_1.QueryXPTransactionDto, String, Object]),
    __metadata("design:returntype", Promise)
], XPTransactionController.prototype, "exportCSV", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get XP transaction by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], XPTransactionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Retroactively adjust XP' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_xp_transaction_dto_1.UpdateXPTransactionDto]),
    __metadata("design:returntype", Promise)
], XPTransactionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Void fraudulent XP transaction' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, void_xp_transaction_dto_1.VoidXPTransactionDto]),
    __metadata("design:returntype", Promise)
], XPTransactionController.prototype, "void", null);
exports.XPTransactionController = XPTransactionController = __decorate([
    (0, swagger_1.ApiTags)('XP Transactions (Admin)'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('admin/xp-transactions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, admin_guard_1.AdminGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof xp_transaction_service_1.XPTransactionService !== "undefined" && xp_transaction_service_1.XPTransactionService) === "function" ? _a : Object])
], XPTransactionController);
//# sourceMappingURL=xp-transactions.controller.js.map