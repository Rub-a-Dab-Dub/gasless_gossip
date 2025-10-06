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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarInvitationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let StellarInvitationsController = class StellarInvitationsController {
    stellarService;
    enhancedInvitationsService;
    constructor(stellarService, enhancedInvitationsService) {
        this.stellarService = stellarService;
        this.enhancedInvitationsService = enhancedInvitationsService;
    }
    async getStellarHealth() {
        return this.stellarService.healthCheck();
    }
    async getAccountBalance() {
        return this.stellarService.getAccountBalance();
    }
    async verifyInvitationIntegrity(invitationId) {
        return this.enhancedInvitationsService.verifyInvitationIntegrity(invitationId);
    }
    async getInvitationAuditTrail(invitationId) {
        return this.enhancedInvitationsService.getInvitationAuditTrail(invitationId);
    }
    async verifyRoomAccess(roomId, userId) {
        const hasAccess = await this.enhancedInvitationsService.verifyRoomAccessOnChain(roomId, userId);
        return { hasAccess, roomId, userId };
    }
    async getInvitationHistory(invitationId) {
        return this.stellarService.getInvitationHistory(invitationId);
    }
};
exports.StellarInvitationsController = StellarInvitationsController;
__decorate([
    (0, common_1.Get)("health"),
    (0, swagger_1.ApiOperation)({ summary: "Check Stellar service health" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Stellar service health status" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StellarInvitationsController.prototype, "getStellarHealth", null);
__decorate([
    (0, common_1.Get)("balance"),
    (0, swagger_1.ApiOperation)({ summary: "Get Stellar account balance" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Account balance information" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StellarInvitationsController.prototype, "getAccountBalance", null);
__decorate([
    (0, common_1.Get)("verify/:invitationId"),
    (0, swagger_1.ApiOperation)({ summary: "Verify invitation integrity between database and Stellar" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Invitation integrity verification result" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StellarInvitationsController.prototype, "verifyInvitationIntegrity", null);
__decorate([
    (0, common_1.Get)("audit/:invitationId"),
    (0, swagger_1.ApiOperation)({ summary: "Get complete audit trail for an invitation" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Invitation audit trail" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StellarInvitationsController.prototype, "getInvitationAuditTrail", null);
__decorate([
    (0, common_1.Get)("room-access/:roomId/:userId"),
    (0, swagger_1.ApiOperation)({ summary: "Verify room access on Stellar blockchain" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Room access verification result" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StellarInvitationsController.prototype, "verifyRoomAccess", null);
__decorate([
    (0, common_1.Get)("history/:invitationId"),
    (0, swagger_1.ApiOperation)({ summary: "Get Stellar transaction history for an invitation" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Stellar transaction history" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StellarInvitationsController.prototype, "getInvitationHistory", null);
exports.StellarInvitationsController = StellarInvitationsController = __decorate([
    (0, swagger_1.ApiTags)("stellar-invitations"),
    (0, common_1.Controller)("stellar-invitations"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [Function, Function])
], StellarInvitationsController);
//# sourceMappingURL=stellar-invitations.controller.js.map