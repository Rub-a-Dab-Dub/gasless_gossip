import { Injectable, ForbiddenException } from "@nestjs/common"
import type { Repository } from "typeorm"
import { type RoomParticipant, ParticipantRole, ParticipantStatus } from "../entities/room-participant.entity"

@Injectable()
export class RoomAccessService {
  private participantRepository: Repository<RoomParticipant>

  constructor(participantRepository: Repository<RoomParticipant>) {
    this.participantRepository = participantRepository
  }

  async verifyRoomAccess(roomId: string, userId: string): Promise<RoomParticipant> {
    const participant = await this.participantRepository.findOne({
      where: { roomId, userId, status: ParticipantStatus.ACTIVE },
      relations: ["user"],
    })

    if (!participant) {
      throw new ForbiddenException("Access denied to this room")
    }

    return participant
  }

  async verifyInvitePermission(roomId: string, userId: string): Promise<RoomParticipant> {
    const participant = await this.verifyRoomAccess(roomId, userId)

    if (!participant.canInvite) {
      throw new ForbiddenException("You do not have permission to invite users to this room")
    }

    return participant
  }

  async verifyRoomAdmin(roomId: string, userId: string): Promise<RoomParticipant> {
    const participant = await this.verifyRoomAccess(roomId, userId)

    if (!participant.canManage) {
      throw new ForbiddenException("You do not have admin permissions for this room")
    }

    return participant
  }

  async getRoomParticipants(roomId: string, userId: string): Promise<RoomParticipant[]> {
    // Verify user has access to room first
    await this.verifyRoomAccess(roomId, userId)

    return this.participantRepository.find({
      where: { roomId, status: ParticipantStatus.ACTIVE },
      relations: ["user"],
      order: { joinedAt: "ASC" },
    })
  }

  async isRoomOwner(roomId: string, userId: string): Promise<boolean> {
    const participant = await this.participantRepository.findOne({
      where: { roomId, userId, role: ParticipantRole.OWNER, status: ParticipantStatus.ACTIVE },
    })

    return !!participant
  }

  async getRoomStats(
    roomId: string,
    userId: string,
  ): Promise<{
    totalParticipants: number
    activeParticipants: number
    adminCount: number
    memberCount: number
  }> {
    await this.verifyRoomAccess(roomId, userId)

    const participants = await this.participantRepository.find({
      where: { roomId },
    })

    const active = participants.filter((p) => p.status === ParticipantStatus.ACTIVE)
    const admins = active.filter((p) => p.role === ParticipantRole.OWNER || p.role === ParticipantRole.ADMIN)
    const members = active.filter((p) => p.role === ParticipantRole.MEMBER || p.role === ParticipantRole.GUEST)

    return {
      totalParticipants: participants.length,
      activeParticipants: active.length,
      adminCount: admins.length,
      memberCount: members.length,
    }
  }
}
