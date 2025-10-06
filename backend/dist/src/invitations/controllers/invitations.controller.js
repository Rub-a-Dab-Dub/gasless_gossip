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
exports.InvitationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const invitation_response_dto_1 = require("../dto/invitation-response.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const room_access_guard_1 = require("../../auth/guards/room-access.guard");
const class_transformer_1 = require("class-transformer");
let InvitationsController = class InvitationsController {
    invitationsService;
    constructor(invitationsService) {
        this.invitationsService = invitationsService;
    }
    async createInvitation(createInvitationDto, req) {
        const invitation = await this.invitationsService.createInvitation(createInvitationDto, req.user.id);
        return (0, class_transformer_1.plainToClass)(invitation_response_dto_1.InvitationResponseDto, invitation, {
            excludeExtraneousValues: true,
        });
    }
    async acceptInvitation(acceptInvitationDto, req) {
        const result = await this.invitationsService.acceptInvitation(acceptInvitationDto, acceptInvitationDto.userId || req.user.id);
        return {
            invitation: (0, class_transformer_1.plainToClass)(invitation_response_dto_1.InvitationResponseDto, result.invitation, {
                excludeExtraneousValues: true,
            }),
            participant: result.participant,
        };
    }
    async getInvitationsByRoom(roomId, req) {
        const invitations = await this.invitationsService.getInvitationsByRoom(roomId, req.user.id);
        return invitations.map((invitation) => (0, class_transformer_1.plainToClass)(invitation_response_dto_1.InvitationResponseDto, invitation, {
            excludeExtraneousValues: true,
        }));
    }
    async getMyInvitations(req, status) {
        const invitations = await this.invitationsService.getInvitationsByUser(req.user.id);
        const filteredInvitations = status ? invitations.filter((inv) => inv.status === status) : invitations;
        return filteredInvitations.map((invitation) => (0, class_transformer_1.plainToClass)(invitation_response_dto_1.InvitationResponseDto, invitation, {
            excludeExtraneousValues: true,
        }));
    }
    async getInvitationByCode(code) {
        const invitation = await this.invitationsService.getInvitationByCode(code);
        return (0, class_transformer_1.plainToClass)(invitation_response_dto_1.InvitationResponseDto, invitation, {
            excludeExtraneousValues: true,
        });
    }
    async revokeInvitation(invitationId, req) {
        const invitation = await this.invitationsService.revokeInvitation(invitationId, req.user.id);
        return (0, class_transformer_1.plainToClass)(invitation_response_dto_1.InvitationResponseDto, invitation, {
            excludeExtraneousValues: true,
        });
    }
    async cleanupExpiredInvitations() {
        const cleanedUp = await this.invitationsService.cleanupExpiredInvitations();
        return { cleanedUp };
    }
    async getRoomInvitationStats(roomId, req) {
        const invitations = await this.invitationsService.getInvitationsByRoom(roomId, req.user.id);
        const stats = {
            totalInvitations: invitations.length,
            pendingInvitations: invitations.filter((inv) => inv.status === "pending").length,
            acceptedInvitations: invitations.filter((inv) => inv.status === "accepted").length,
            expiredInvitations: invitations.filter((inv) => inv.status === "expired").length,
            revokedInvitations: invitations.filter((inv) => inv.status === "revoked").length,
            totalAcceptances: invitations.reduce((sum, inv) => sum + inv.usageCount, 0),
            uniqueInvitees: new Set(invitations.filter((inv) => inv.inviteeId).map((inv) => inv.inviteeId)).size,
        };
        return stats;
    }
};
exports.InvitationsController = InvitationsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new invitation for a secret room" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Invitation created successfully",
        type: invitation_response_dto_1.InvitationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid input data" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "No permission to invite to this room" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Room not found" }),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "createInvitation", null);
__decorate([
    (0, common_1.Post)("accept"),
    (0, swagger_1.ApiOperation)({ summary: "Accept an invitation using invitation code" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Invitation accepted successfully",
        schema: {
            type: "object",
            properties: {
                invitation: { $ref: "#/components/schemas/InvitationResponseDto" },
                participant: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        roomId: { type: "string" },
                        userId: { type: "string" },
                        role: { type: "string" },
                        status: { type: "string" },
                        joinedAt: { type: "string", format: "date-time" },
                    },
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Invalid invitation code or invitation expired" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Invitation not found" }),
    (0, swagger_1.ApiResponse)({ status: 409, description: "User already member of room" }),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "acceptInvitation", null);
__decorate([
    (0, common_1.Get)("room/:roomId"),
    (0, swagger_1.ApiOperation)({ summary: "Get all invitations for a specific room" }),
    (0, swagger_1.ApiParam)({ name: "roomId", description: "Room ID to get invitations for" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "List of invitations for the room",
        type: [invitation_response_dto_1.InvitationResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "No access to this room" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Room not found" }),
    (0, common_1.UseGuards)(room_access_guard_1.RoomAccessGuard),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "getInvitationsByRoom", null);
__decorate([
    (0, common_1.Get)("my-invitations"),
    (0, swagger_1.ApiOperation)({ summary: "Get all invitations created by the current user" }),
    (0, swagger_1.ApiQuery)({
        name: "status",
        required: false,
        description: "Filter by invitation status",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "List of user's invitations",
        type: [invitation_response_dto_1.InvitationResponseDto],
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "getMyInvitations", null);
__decorate([
    (0, common_1.Get)('code/:code'),
    (0, swagger_1.ApiOperation)({ summary: 'Get invitation details by code (for preview before accepting)' }),
    (0, swagger_1.ApiParam)({ name: 'code', description: 'Invitation code' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Invitation details',
        type: invitation_response_dto_1.InvitationResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Invitation not found' }),
    __param(0, (0, common_1.Param)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "getInvitationByCode", null);
__decorate([
    (0, common_1.Patch)(":invitationId/revoke"),
    (0, swagger_1.ApiOperation)({ summary: "Revoke an invitation" }),
    (0, swagger_1.ApiParam)({ name: "invitationId", description: "Invitation ID to revoke" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Invitation revoked successfully",
        type: invitation_response_dto_1.InvitationResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "No permission to revoke this invitation" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Invitation not found" }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('invitationId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "revokeInvitation", null);
__decorate([
    (0, common_1.Delete)("cleanup-expired"),
    (0, swagger_1.ApiOperation)({ summary: "Clean up expired invitations (admin only)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Expired invitations cleaned up",
        schema: {
            type: "object",
            properties: {
                cleanedUp: { type: "number", description: "Number of invitations cleaned up" },
            },
        },
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "cleanupExpiredInvitations", null);
__decorate([
    (0, common_1.Get)("stats/room/:roomId"),
    (0, swagger_1.ApiOperation)({ summary: "Get invitation statistics for a room" }),
    (0, swagger_1.ApiParam)({ name: "roomId", description: "Room ID to get stats for" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Invitation statistics",
        schema: {
            type: "object",
            properties: {
                totalInvitations: { type: "number" },
                pendingInvitations: { type: "number" },
                acceptedInvitations: { type: "number" },
                expiredInvitations: { type: "number" },
                revokedInvitations: { type: "number" },
                totalAcceptances: { type: "number" },
                uniqueInvitees: { type: "number" },
            },
        },
    }),
    (0, common_1.UseGuards)(room_access_guard_1.RoomAccessGuard),
    __param(0, (0, common_1.Param)('roomId', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "getRoomInvitationStats", null);
exports.InvitationsController = InvitationsController = __decorate([
    (0, swagger_1.ApiTags)("invitations"),
    (0, common_1.Controller)("invitations"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [Function])
], InvitationsController);
//# sourceMappingURL=invitations.controller.js.map