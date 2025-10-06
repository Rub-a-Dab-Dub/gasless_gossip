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
exports.ReferralsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const referrals_service_1 = require("./services/referrals.service");
const create_referral_dto_1 = require("./dto/create-referral.dto");
const generate_code_dto_1 = require("./dto/generate-code.dto");
const referral_response_dto_1 = require("./dto/referral-response.dto");
let ReferralsController = class ReferralsController {
    referralsService;
    constructor(referralsService) {
        this.referralsService = referralsService;
    }
    async createReferral(createReferralDto) {
        return await this.referralsService.createReferral(createReferralDto);
    }
    async generateReferralCode(generateCodeDto) {
        const referralCode = await this.referralsService.generateReferralCode(generateCodeDto.userId);
        return { referralCode };
    }
    async getReferralHistory(userId) {
        return await this.referralsService.findReferralsByUser(userId);
    }
    async getReferralStats(userId) {
        return await this.referralsService.getReferralStats(userId);
    }
};
exports.ReferralsController = ReferralsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new referral' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Referral created successfully',
        type: referral_response_dto_1.ReferralResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid referral data',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'User already referred or invalid referral code',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_referral_dto_1.CreateReferralDto]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "createReferral", null);
__decorate([
    (0, common_1.Post)('generate-code'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a referral code for a user' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Referral code generated successfully',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_code_dto_1.GenerateCodeDto]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "generateReferralCode", null);
__decorate([
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get referral history for a user' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Referral history retrieved successfully',
        type: [referral_response_dto_1.ReferralResponseDto],
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "getReferralHistory", null);
__decorate([
    (0, common_1.Get)(':userId/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get referral statistics for a user' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Referral stats retrieved successfully',
    }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReferralsController.prototype, "getReferralStats", null);
exports.ReferralsController = ReferralsController = __decorate([
    (0, swagger_1.ApiTags)('referrals'),
    (0, common_1.Controller)('referrals'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [referrals_service_1.ReferralsService])
], ReferralsController);
//# sourceMappingURL=referrals.controller.js.map