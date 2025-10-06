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
exports.PaymasterController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const paymaster_service_1 = require("./paymaster.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const paymaster_dto_1 = require("./dto/paymaster.dto");
let PaymasterController = class PaymasterController {
    paymasterService;
    constructor(paymasterService) {
        this.paymasterService = paymasterService;
    }
    async sponsorUserOperation(sponsorDto, req) {
        try {
            const smartAccount = await this.paymasterService.createSmartAccount(sponsorDto.privateKey);
            const userOpRequest = {
                to: sponsorDto.to,
                data: sponsorDto.data,
                value: sponsorDto.value || '0',
                gasLimit: sponsorDto.gasLimit,
            };
            return await this.paymasterService.sponsorUserOperation(smartAccount, userOpRequest, req.user.id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async sendGaslessChatMessage(chatDto, req) {
        try {
            const smartAccount = await this.paymasterService.createSmartAccount(chatDto.privateKey);
            return await this.paymasterService.sendGaslessChatMessage(smartAccount, chatDto.message, chatDto.roomId, req.user.id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async submitGaslessIntent(intentDto, req) {
        try {
            const smartAccount = await this.paymasterService.createSmartAccount(intentDto.privateKey);
            return await this.paymasterService.submitGaslessIntent(smartAccount, intentDto.intentData, intentDto.intentType, req.user.id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async getPaymasterStatus() {
        return await this.paymasterService.getPaymasterStatus();
    }
    async canSponsor() {
        const canSponsor = await this.paymasterService.canSponsor();
        return { canSponsor };
    }
    async getRateLimitStatus(userId) {
        return this.paymasterService.getRateLimitStatus(userId);
    }
    async estimateGas(userOpRequest) {
        return await this.paymasterService.estimateGas(userOpRequest);
    }
    async testBaseSepolia() {
        const status = await this.paymasterService.getPaymasterStatus();
        const canSponsor = await this.paymasterService.canSponsor();
        return {
            network: 'base-sepolia',
            chainId: 84532,
            rpcUrl: 'https://sepolia.base.org',
            paymasterStatus: status,
            canSponsor,
            testPassed: status.isActive && canSponsor,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.PaymasterController = PaymasterController;
__decorate([
    (0, common_1.Post)('sponsor-userop'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Sponsor a UserOperation for gasless transaction' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'UserOperation sponsored successfully', type: paymaster_dto_1.UserOpResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request or rate limit exceeded' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paymaster_dto_1.SponsorUserOpDto, Object]),
    __metadata("design:returntype", Promise)
], PaymasterController.prototype, "sponsorUserOperation", null);
__decorate([
    (0, common_1.Post)('send-chat-message'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Send a gasless chat message' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Chat message sent successfully', type: paymaster_dto_1.UserOpResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request or rate limit exceeded' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paymaster_dto_1.SendChatMessageDto, Object]),
    __metadata("design:returntype", Promise)
], PaymasterController.prototype, "sendGaslessChatMessage", null);
__decorate([
    (0, common_1.Post)('submit-intent'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a gasless intent' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Intent submitted successfully', type: paymaster_dto_1.UserOpResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request or rate limit exceeded' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paymaster_dto_1.SubmitIntentDto, Object]),
    __metadata("design:returntype", Promise)
], PaymasterController.prototype, "submitGaslessIntent", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get paymaster status and balance' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paymaster status retrieved successfully', type: paymaster_dto_1.PaymasterStatusDto }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymasterController.prototype, "getPaymasterStatus", null);
__decorate([
    (0, common_1.Get)('can-sponsor'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if paymaster can sponsor transactions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sponsorship capability checked' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymasterController.prototype, "canSponsor", null);
__decorate([
    (0, common_1.Get)('rate-limit/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rate limit status for a user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Rate limit status retrieved', type: paymaster_dto_1.RateLimitStatusDto }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymasterController.prototype, "getRateLimitStatus", null);
__decorate([
    (0, common_1.Post)('estimate-gas'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Estimate gas for a UserOperation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gas estimation completed', type: paymaster_dto_1.GasEstimateDto }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paymaster_dto_1.UserOpRequestDto]),
    __metadata("design:returntype", Promise)
], PaymasterController.prototype, "estimateGas", null);
__decorate([
    (0, common_1.Get)('test/base-sepolia'),
    (0, swagger_1.ApiOperation)({ summary: 'Test paymaster integration on Base Sepolia' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test completed successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymasterController.prototype, "testBaseSepolia", null);
exports.PaymasterController = PaymasterController = __decorate([
    (0, swagger_1.ApiTags)('Paymaster'),
    (0, common_1.Controller)('paymaster'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [paymaster_service_1.PaymasterService])
], PaymasterController);
//# sourceMappingURL=paymaster.controller.js.map