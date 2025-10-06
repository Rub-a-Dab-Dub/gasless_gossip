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
var EnhancedInvitationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedInvitationsService = void 0;
const common_1 = require("@nestjs/common");
const invitations_service_1 = require("./invitations.service");
let EnhancedInvitationsService = EnhancedInvitationsService_1 = class EnhancedInvitationsService extends invitations_service_1.InvitationsService {
    stellarService;
    logger = new common_1.Logger(EnhancedInvitationsService_1.name);
    constructor(stellarService) {
        super();
        this.stellarService = stellarService;
    }
    async acceptInvitationWithStellarVerification(acceptDto, userId) {
        this.logger.log(`Accepting invitation with Stellar verification: ${acceptDto.code}`);
        const result = await super.acceptInvitation(acceptDto, userId);
        try {
            const contractData = {
                invitationId: result.invitation.id,
                roomId: result.invitation.roomId,
                inviterId: result.invitation.inviterId,
                inviteeId: userId,
                code: result.invitation.code,
                timestamp: Date.now(),
            };
            const stellarTxId = await this.stellarService.recordInvitationAcceptance(contractData);
            result.invitation.stellarTxId = stellarTxId;
            await this.invitationRepository.save(result.invitation);
            this.logger.log(`Invitation acceptance recorded on Stellar: ${stellarTxId}`);
            return {
                ...result,
                stellarTxId,
            };
        }
        catch (stellarError) {
            this.logger.error(`Failed to record on Stellar, but invitation was accepted: ${stellarError.message}`);
            return {
                ...result,
                stellarTxId: null,
            };
        }
    }
    async verifyInvitationIntegrity(invitationId) {
        this.logger.log(`Verifying invitation integrity: ${invitationId}`);
        const databaseRecord = await this.invitationRepository.findOne({
            where: { id: invitationId },
            relations: ["inviter", "invitee"],
        });
        const stellarRecord = await this.stellarService.verifyInvitationOnChain(invitationId);
        const discrepancies = [];
        let isConsistent = true;
        if (databaseRecord && stellarRecord) {
            if (databaseRecord.roomId !== stellarRecord.roomId) {
                discrepancies.push("Room ID mismatch");
                isConsistent = false;
            }
            if (databaseRecord.inviterId !== stellarRecord.inviterId) {
                discrepancies.push("Inviter ID mismatch");
                isConsistent = false;
            }
            if (databaseRecord.inviteeId !== stellarRecord.inviteeId) {
                discrepancies.push("Invitee ID mismatch");
                isConsistent = false;
            }
            if (databaseRecord.code !== stellarRecord.code) {
                discrepancies.push("Invitation code mismatch");
                isConsistent = false;
            }
        }
        else if (databaseRecord && !stellarRecord) {
            discrepancies.push("Record exists in database but not on Stellar");
            isConsistent = false;
        }
        else if (!databaseRecord && stellarRecord) {
            discrepancies.push("Record exists on Stellar but not in database");
            isConsistent = false;
        }
        return {
            databaseRecord,
            stellarRecord,
            isConsistent,
            discrepancies,
        };
    }
    async verifyRoomAccessOnChain(roomId, userId) {
        return this.stellarService.verifyRoomAccess(roomId, userId);
    }
    async revokeInvitationWithStellarUpdate(invitationId, userId) {
        this.logger.log(`Revoking invitation with Stellar update: ${invitationId}`);
        const invitation = await super.revokeInvitation(invitationId, userId);
        try {
            const stellarTxId = await this.stellarService.revokeInvitationOnChain(invitationId);
            this.logger.log(`Invitation revoked on Stellar: ${stellarTxId}`);
            return {
                invitation,
                stellarTxId,
            };
        }
        catch (stellarError) {
            this.logger.error(`Failed to revoke on Stellar: ${stellarError.message}`);
            return {
                invitation,
                stellarTxId: null,
            };
        }
    }
    async getInvitationAuditTrail(invitationId) {
        this.logger.log(`Getting audit trail for invitation: ${invitationId}`);
        const databaseEvents = [];
        const stellarEvents = await this.stellarService.getInvitationHistory(invitationId);
        const combinedTimeline = [...databaseEvents, ...stellarEvents].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        return {
            databaseEvents,
            stellarEvents,
            combinedTimeline,
        };
    }
};
exports.EnhancedInvitationsService = EnhancedInvitationsService;
exports.EnhancedInvitationsService = EnhancedInvitationsService = EnhancedInvitationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function])
], EnhancedInvitationsService);
//# sourceMappingURL=enhanced-invitations.service.js.map