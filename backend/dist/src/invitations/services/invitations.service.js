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
exports.InvitationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const invitation_entity_1 = require("../entities/invitation.entity");
const room_participant_entity_1 = require("../entities/room-participant.entity");
const create_invitation_dto_1 = require("../dto/create-invitation.dto");
const invitation_created_event_1 = require("../events/invitation-created.event");
const invitation_accepted_event_1 = require("../events/invitation-accepted.event");
let InvitationsService = class InvitationsService {
    invitationRepository;
    participantRepository;
    codeGenerator;
    roomAccess;
    eventEmitter;
    constructor(invitationRepository, participantRepository, codeGenerator, roomAccess, eventEmitter) {
        this.invitationRepository = invitationRepository;
        this.participantRepository = participantRepository;
        this.codeGenerator = codeGenerator;
        this.roomAccess = roomAccess;
        this.eventEmitter = eventEmitter;
    }
    async createInvitation(createDto, inviterId) {
        await this.roomAccess.verifyInvitePermission(createDto.roomId, inviterId);
        const code = await this.generateUniqueCode();
        const expiresAt = this.calculateExpiryDate(createDto.duration, createDto.customExpiry);
        const invitation = this.invitationRepository.create({
            roomId: createDto.roomId,
            inviterId,
            code,
            message: createDto.message,
            expiresAt,
            maxUsage: createDto.maxUsage || 1,
            metadata: createDto.metadata,
        });
        const savedInvitation = await this.invitationRepository.save(invitation);
        this.eventEmitter.emit("invitation.created", new invitation_created_event_1.InvitationCreatedEvent(savedInvitation));
        return this.invitationRepository.findOne({
            where: { id: savedInvitation.id },
            relations: ["inviter"],
        });
    }
    async acceptInvitation(acceptDto, userId) {
        const invitation = await this.invitationRepository.findOne({
            where: { code: acceptDto.code },
            relations: ["inviter"],
        });
        if (!invitation) {
            throw new common_1.NotFoundException("Invitation not found");
        }
        this.validateInvitation(invitation);
        const existingParticipant = await this.participantRepository.findOne({
            where: { roomId: invitation.roomId, userId },
        });
        if (existingParticipant && existingParticipant.isActive) {
            throw new common_1.ConflictException("User is already a member of this room");
        }
        let participant;
        if (existingParticipant) {
            existingParticipant.status = room_participant_entity_1.ParticipantStatus.ACTIVE;
            existingParticipant.joinedAt = new Date();
            existingParticipant.invitationId = invitation.id;
            participant = await this.participantRepository.save(existingParticipant);
        }
        else {
            participant = this.participantRepository.create({
                roomId: invitation.roomId,
                userId,
                role: room_participant_entity_1.ParticipantRole.MEMBER,
                status: room_participant_entity_1.ParticipantStatus.ACTIVE,
                invitationId: invitation.id,
                joinedAt: new Date(),
            });
            participant = await this.participantRepository.save(participant);
        }
        invitation.inviteeId = userId;
        invitation.usageCount += 1;
        invitation.acceptedAt = new Date();
        invitation.stellarTxId = acceptDto.stellarTxId;
        if (invitation.usageCount >= invitation.maxUsage) {
            invitation.status = invitation_entity_1.InvitationStatus.ACCEPTED;
        }
        const updatedInvitation = await this.invitationRepository.save(invitation);
        this.eventEmitter.emit("invitation.accepted", new invitation_accepted_event_1.InvitationAcceptedEvent(updatedInvitation, participant));
        return { invitation: updatedInvitation, participant };
    }
    async getInvitationsByRoom(roomId, userId) {
        await this.roomAccess.verifyRoomAccess(roomId, userId);
        return this.invitationRepository.find({
            where: { roomId },
            relations: ["inviter", "invitee"],
            order: { createdAt: "DESC" },
        });
    }
    async getInvitationsByUser(userId) {
        return this.invitationRepository.find({
            where: { inviterId: userId },
            relations: ["inviter", "invitee"],
            order: { createdAt: "DESC" },
        });
    }
    async getInvitationByCode(code) {
        const invitation = await this.invitationRepository.findOne({
            where: { code },
            relations: ["inviter"],
        });
        if (!invitation) {
            throw new common_1.NotFoundException("Invitation not found");
        }
        return invitation;
    }
    async revokeInvitation(invitationId, userId) {
        const invitation = await this.invitationRepository.findOne({
            where: { id: invitationId },
            relations: ["inviter"],
        });
        if (!invitation) {
            throw new common_1.NotFoundException("Invitation not found");
        }
        if (invitation.inviterId !== userId) {
            await this.roomAccess.verifyRoomAdmin(invitation.roomId, userId);
        }
        invitation.status = invitation_entity_1.InvitationStatus.REVOKED;
        return this.invitationRepository.save(invitation);
    }
    async cleanupExpiredInvitations() {
        const result = await this.invitationRepository.update({
            status: invitation_entity_1.InvitationStatus.PENDING,
            expiresAt: (0, typeorm_1.MoreThan)(new Date()),
        }, { status: invitation_entity_1.InvitationStatus.EXPIRED });
        return result.affected || 0;
    }
    async generateUniqueCode() {
        let attempts = 0;
        const maxAttempts = 10;
        while (attempts < maxAttempts) {
            const code = this.codeGenerator.generateInvitationCode();
            const existing = await this.invitationRepository.findOne({ where: { code } });
            if (!existing) {
                return code;
            }
            attempts++;
        }
        throw new Error("Failed to generate unique invitation code");
    }
    calculateExpiryDate(duration, customExpiry) {
        const now = new Date();
        if (duration === create_invitation_dto_1.InvitationDuration.CUSTOM) {
            if (!customExpiry) {
                throw new common_1.BadRequestException("Custom expiry date is required when duration is custom");
            }
            const expiry = new Date(customExpiry);
            if (expiry <= now) {
                throw new common_1.BadRequestException("Expiry date must be in the future");
            }
            return expiry;
        }
        const durationMap = {
            [create_invitation_dto_1.InvitationDuration.ONE_HOUR]: 1 * 60 * 60 * 1000,
            [create_invitation_dto_1.InvitationDuration.SIX_HOURS]: 6 * 60 * 60 * 1000,
            [create_invitation_dto_1.InvitationDuration.ONE_DAY]: 24 * 60 * 60 * 1000,
            [create_invitation_dto_1.InvitationDuration.THREE_DAYS]: 3 * 24 * 60 * 60 * 1000,
            [create_invitation_dto_1.InvitationDuration.ONE_WEEK]: 7 * 24 * 60 * 60 * 1000,
            [create_invitation_dto_1.InvitationDuration.ONE_MONTH]: 30 * 24 * 60 * 60 * 1000,
        };
        const milliseconds = durationMap[duration] || durationMap[create_invitation_dto_1.InvitationDuration.ONE_DAY];
        return new Date(now.getTime() + milliseconds);
    }
    validateInvitation(invitation) {
        if (invitation.status !== invitation_entity_1.InvitationStatus.PENDING) {
            throw new common_1.BadRequestException(`Invitation is ${invitation.status}`);
        }
        if (invitation.isExpired) {
            throw new common_1.BadRequestException("Invitation has expired");
        }
        if (!invitation.isUsable) {
            throw new common_1.BadRequestException("Invitation has reached maximum usage");
        }
    }
};
exports.InvitationsService = InvitationsService;
exports.InvitationsService = InvitationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function, Function, Function, Function, Object])
], InvitationsService);
//# sourceMappingURL=invitations.service.js.map