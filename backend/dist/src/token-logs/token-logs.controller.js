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
exports.TokenLogsController = void 0;
const common_1 = require("@nestjs/common");
const token_logs_service_1 = require("./token-logs.service");
const get_token_logs_query_dto_1 = require("./dto/get-token-logs-query.dto");
let TokenLogsController = class TokenLogsController {
    tokenLogsService;
    constructor(tokenLogsService) {
        this.tokenLogsService = tokenLogsService;
    }
    async getLogs(userId, query) {
        if (query.page && query.page < 1)
            throw new common_1.BadRequestException('Page must be >= 1');
        if (query.limit && (query.limit < 1 || query.limit > 100))
            throw new common_1.BadRequestException('Limit must be 1-100');
        return this.tokenLogsService.getLogsForUser(userId, query);
    }
    async getSummary(userId) {
        return this.tokenLogsService.getSummaryForUser(userId);
    }
};
exports.TokenLogsController = TokenLogsController;
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, get_token_logs_query_dto_1.GetTokenLogsQueryDto]),
    __metadata("design:returntype", Promise)
], TokenLogsController.prototype, "getLogs", null);
__decorate([
    (0, common_1.Get)(':userId/summary'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TokenLogsController.prototype, "getSummary", null);
exports.TokenLogsController = TokenLogsController = __decorate([
    (0, common_1.Controller)('token-logs'),
    __metadata("design:paramtypes", [token_logs_service_1.TokenLogsService])
], TokenLogsController);
//# sourceMappingURL=token-logs.controller.js.map