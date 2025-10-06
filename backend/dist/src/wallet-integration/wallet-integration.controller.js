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
exports.WalletIntegrationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const wallet_integration_service_1 = require("./services/wallet-integration.service");
const connect_wallet_dto_1 = require("./dto/connect-wallet.dto");
const transaction_request_dto_1 = require("./dto/transaction-request.dto");
const wallet_response_dto_1 = require("./dto/wallet-response.dto");
const auth_guard_1 = require("../auth/auth.guard");
let WalletIntegrationController = class WalletIntegrationController {
    walletIntegrationService;
    constructor(walletIntegrationService) {
        this.walletIntegrationService = walletIntegrationService;
    }
    async connectWallet(req, connectWalletDto) {
        const userId = req.user.sub;
        return await this.walletIntegrationService.connectWallet(userId, connectWalletDto);
    }
    async getUserWallets(req) {
        const userId = req.user.sub;
        return await this.walletIntegrationService.getUserWallets(userId);
    }
    async getWalletStats(req) {
        const userId = req.user.sub;
        return await this.walletIntegrationService.getWalletStats(userId);
    }
    async getWalletById(req, walletId) {
        const userId = req.user.sub;
        return await this.walletIntegrationService.getWalletById(walletId, userId);
    }
    async getWalletBalance(req, walletId) {
        const userId = req.user.sub;
        return await this.walletIntegrationService.getWalletBalance(walletId, userId);
    }
    async sendTransaction(req, walletId, transactionDto) {
        const userId = req.user.sub;
        return await this.walletIntegrationService.sendTransaction(walletId, userId, transactionDto);
    }
    async disconnectWallet(req, walletId) {
        const userId = req.user.sub;
        return await this.walletIntegrationService.disconnectWallet(walletId, userId);
    }
};
exports.WalletIntegrationController = WalletIntegrationController;
__decorate([
    (0, common_1.Post)('connect'),
    (0, swagger_1.ApiOperation)({ summary: 'Connect a new wallet' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Wallet connected successfully',
        type: wallet_response_dto_1.WalletResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid wallet data or validation failed',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Wallet address already connected',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, connect_wallet_dto_1.ConnectWalletDto]),
    __metadata("design:returntype", Promise)
], WalletIntegrationController.prototype, "connectWallet", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get user wallets' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Wallets retrieved successfully',
        type: [wallet_response_dto_1.WalletResponseDto],
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletIntegrationController.prototype, "getUserWallets", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wallet statistics' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Wallet stats retrieved successfully',
        type: wallet_response_dto_1.WalletStatsDto,
    }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WalletIntegrationController.prototype, "getWalletStats", null);
__decorate([
    (0, common_1.Get)(':walletId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific wallet details' }),
    (0, swagger_1.ApiParam)({ name: 'walletId', description: 'Wallet ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Wallet details retrieved successfully',
        type: wallet_response_dto_1.WalletResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Wallet not found',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('walletId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WalletIntegrationController.prototype, "getWalletById", null);
__decorate([
    (0, common_1.Get)(':walletId/balance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get wallet balance' }),
    (0, swagger_1.ApiParam)({ name: 'walletId', description: 'Wallet ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Wallet balance retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Wallet not found',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('walletId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WalletIntegrationController.prototype, "getWalletBalance", null);
__decorate([
    (0, common_1.Post)(':walletId/send'),
    (0, swagger_1.ApiOperation)({ summary: 'Send transaction from wallet' }),
    (0, swagger_1.ApiParam)({ name: 'walletId', description: 'Wallet ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Transaction sent successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid transaction data or wallet not active',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Wallet not found',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('walletId', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, transaction_request_dto_1.TransactionRequestDto]),
    __metadata("design:returntype", Promise)
], WalletIntegrationController.prototype, "sendTransaction", null);
__decorate([
    (0, common_1.Delete)(':walletId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Disconnect wallet' }),
    (0, swagger_1.ApiParam)({ name: 'walletId', description: 'Wallet ID' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'Wallet disconnected successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Wallet not found',
    }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('walletId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WalletIntegrationController.prototype, "disconnectWallet", null);
exports.WalletIntegrationController = WalletIntegrationController = __decorate([
    (0, swagger_1.ApiTags)('wallet-integration'),
    (0, common_1.Controller)('wallets'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [wallet_integration_service_1.WalletIntegrationService])
], WalletIntegrationController);
//# sourceMappingURL=wallet-integration.controller.js.map