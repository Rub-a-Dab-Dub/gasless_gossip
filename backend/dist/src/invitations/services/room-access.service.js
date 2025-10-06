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
exports.RoomAccessService = void 0;
const common_1 = require("@nestjs/common");
const room_participant_entity_1 = require("../entities/room-participant.entity");
let RoomAccessService = class RoomAccessService {
    participantRepository;
    constructor(participantRepository) {
        this.participantRepository = participantRepository;
    }
    async verifyRoomAccess(roomId, userId) {
        const participant = await this.participantRepository.findOne({
            where: { roomId, userId, status: room_participant_entity_1.ParticipantStatus.ACTIVE },
            relations: ["user"],
        });
        if (!participant) {
            throw new common_1.ForbiddenException("Access denied to this room");
        }
        return participant;
    }
    async verifyInvitePermission(roomId, userId) {
        const participant = await this.verifyRoomAccess(roomId, userId);
        if (!participant.canInvite) {
            throw new common_1.ForbiddenException("You do not have permission to invite users to this room");
        }
        return participant;
    }
    async verifyRoomAdmin(roomId, userId) {
        const participant = await this.verifyRoomAccess(roomId, userId);
        if (!participant.canManage) {
            throw new common_1.ForbiddenException("You do not have admin permissions for this room");
        }
        return participant;
    }
    async getRoomParticipants(roomId, userId) {
        await this.verifyRoomAccess(roomId, userId);
        return this.participantRepository.find({
            where: { roomId, status: room_participant_entity_1.ParticipantStatus.ACTIVE },
            relations: ["user"],
            order: { joinedAt: "ASC" },
        });
    }
    async isRoomOwner(roomId, userId) {
        const participant = await this.participantRepository.findOne({
            where: { roomId, userId, role: room_participant_entity_1.ParticipantRole.OWNER, status: room_participant_entity_1.ParticipantStatus.ACTIVE },
        });
        return !!participant;
    }
    async getRoomStats(roomId, userId) {
        await this.verifyRoomAccess(roomId, userId);
        const participants = await this.participantRepository.find({
            where: { roomId },
        });
        const active = participants.filter((p) => p.status === room_participant_entity_1.ParticipantStatus.ACTIVE);
        const admins = active.filter((p) => p.role === room_participant_entity_1.ParticipantRole.OWNER || p.role === room_participant_entity_1.ParticipantRole.ADMIN);
        const members = active.filter((p) => p.role === room_participant_entity_1.ParticipantRole.MEMBER || p.role === room_participant_entity_1.ParticipantRole.GUEST);
        return {
            totalParticipants: participants.length,
            activeParticipants: active.length,
            adminCount: admins.length,
            memberCount: members.length,
        };
    }
};
exports.RoomAccessService = RoomAccessService;
exports.RoomAccessService = RoomAccessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Function])
], RoomAccessService);
//# sourceMappingURL=room-access.service.js.map