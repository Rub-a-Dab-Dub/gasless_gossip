import { Injectable, NotFoundException, BadRequestException, ConflictException } from "@nestjs/common"
import { type Repository, MoreThan } from "typeorm"
import type { EventEmitter2 } from "@nestjs/event-emitter"
import { type Invitation, InvitationStatus } from "../entities/invitation.entity"
import { type RoomParticipant, ParticipantRole, ParticipantStatus } from "../entities/room-participant.entity"
import { type CreateInvitationDto, InvitationDuration } from "../dto/create-invitation.dto"
import type { AcceptInvitationDto } from "../dto/accept-invitation.dto"
import { InvitationCreatedEvent } from "../events/invitation-created.event"
import { InvitationAcceptedEvent } from "../events/invitation-accepted.event"
import type { CodeGeneratorService } from "./code-generator.service"
import type { RoomAccessService } from "./room-access.service"

@Injectable()
export class InvitationsService {
  private invitationRepository: Repository<Invitation>
  private participantRepository: Repository<RoomParticipant>
  private codeGenerator: CodeGeneratorService
  private roomAccess: RoomAccessService
  private eventEmitter: EventEmitter2

  constructor(
    invitationRepository: Repository<Invitation>,
    participantRepository: Repository<RoomParticipant>,
    codeGenerator: CodeGeneratorService,
    roomAccess: RoomAccessService,
    eventEmitter: EventEmitter2,
  ) {
    this.invitationRepository = invitationRepository
    this.participantRepository = participantRepository
    this.codeGenerator = codeGenerator
    this.roomAccess = roomAccess
    this.eventEmitter = eventEmitter
  }

  async createInvitation(createDto: CreateInvitationDto, inviterId: string): Promise<Invitation> {
    // Verify user can invite to this room
    await this.roomAccess.verifyInvitePermission(createDto.roomId, inviterId)

    // Generate unique invitation code
    const code = await this.generateUniqueCode()

    // Calculate expiry date
    const expiresAt = this.calculateExpiryDate(createDto.duration, createDto.customExpiry)

    // Create invitation
    const invitation = this.invitationRepository.create({
      roomId: createDto.roomId,
      inviterId,
      code,
      message: createDto.message,
      expiresAt,
      maxUsage: createDto.maxUsage || 1,
      metadata: createDto.metadata,
    })

    const savedInvitation = await this.invitationRepository.save(invitation)

    // Emit event for analytics and notifications
    this.eventEmitter.emit("invitation.created", new InvitationCreatedEvent(savedInvitation))

    return this.invitationRepository.findOne({
      where: { id: savedInvitation.id },
      relations: ["inviter"],
    })
  }

  async acceptInvitation(
    acceptDto: AcceptInvitationDto,
    userId: string,
  ): Promise<{ invitation: Invitation; participant: RoomParticipant }> {
    // Find invitation by code
    const invitation = await this.invitationRepository.findOne({
      where: { code: acceptDto.code },
      relations: ["inviter"],
    })

    if (!invitation) {
      throw new NotFoundException("Invitation not found")
    }

    // Validate invitation
    this.validateInvitation(invitation)

    // Check if user is already a participant
    const existingParticipant = await this.participantRepository.findOne({
      where: { roomId: invitation.roomId, userId },
    })

    if (existingParticipant && existingParticipant.isActive) {
      throw new ConflictException("User is already a member of this room")
    }

    // Create or update participant
    let participant: RoomParticipant
    if (existingParticipant) {
      // Reactivate existing participant
      existingParticipant.status = ParticipantStatus.ACTIVE
      existingParticipant.joinedAt = new Date()
      existingParticipant.invitationId = invitation.id
      participant = await this.participantRepository.save(existingParticipant)
    } else {
      // Create new participant
      participant = this.participantRepository.create({
        roomId: invitation.roomId,
        userId,
        role: ParticipantRole.MEMBER,
        status: ParticipantStatus.ACTIVE,
        invitationId: invitation.id,
        joinedAt: new Date(),
      })
      participant = await this.participantRepository.save(participant)
    }

    // Update invitation
    invitation.inviteeId = userId
    invitation.usageCount += 1
    invitation.acceptedAt = new Date()
    invitation.stellarTxId = acceptDto.stellarTxId

    // Mark as accepted if single-use or max usage reached
    if (invitation.usageCount >= invitation.maxUsage) {
      invitation.status = InvitationStatus.ACCEPTED
    }

    const updatedInvitation = await this.invitationRepository.save(invitation)

    // Emit event for analytics and notifications
    this.eventEmitter.emit("invitation.accepted", new InvitationAcceptedEvent(updatedInvitation, participant))

    return { invitation: updatedInvitation, participant }
  }

  async getInvitationsByRoom(roomId: string, userId: string): Promise<Invitation[]> {
    // Verify user has access to this room
    await this.roomAccess.verifyRoomAccess(roomId, userId)

    return this.invitationRepository.find({
      where: { roomId },
      relations: ["inviter", "invitee"],
      order: { createdAt: "DESC" },
    })
  }

  async getInvitationsByUser(userId: string): Promise<Invitation[]> {
    return this.invitationRepository.find({
      where: { inviterId: userId },
      relations: ["inviter", "invitee"],
      order: { createdAt: "DESC" },
    })
  }

  async getInvitationByCode(code: string): Promise<Invitation> {
    const invitation = await this.invitationRepository.findOne({
      where: { code },
      relations: ["inviter"],
    })

    if (!invitation) {
      throw new NotFoundException("Invitation not found")
    }

    return invitation
  }

  async revokeInvitation(invitationId: string, userId: string): Promise<Invitation> {
    const invitation = await this.invitationRepository.findOne({
      where: { id: invitationId },
      relations: ["inviter"],
    })

    if (!invitation) {
      throw new NotFoundException("Invitation not found")
    }

    // Only inviter or room admin can revoke
    if (invitation.inviterId !== userId) {
      await this.roomAccess.verifyRoomAdmin(invitation.roomId, userId)
    }

    invitation.status = InvitationStatus.REVOKED
    return this.invitationRepository.save(invitation)
  }

  async cleanupExpiredInvitations(): Promise<number> {
    const result = await this.invitationRepository.update(
      {
        status: InvitationStatus.PENDING,
        expiresAt: MoreThan(new Date()),
      },
      { status: InvitationStatus.EXPIRED },
    )

    return result.affected || 0
  }

  private async generateUniqueCode(): Promise<string> {
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
      const code = this.codeGenerator.generateInvitationCode()
      const existing = await this.invitationRepository.findOne({ where: { code } })

      if (!existing) {
        return code
      }

      attempts++
    }

    throw new Error("Failed to generate unique invitation code")
  }

  private calculateExpiryDate(duration: InvitationDuration, customExpiry?: string): Date {
    const now = new Date()

    if (duration === InvitationDuration.CUSTOM) {
      if (!customExpiry) {
        throw new BadRequestException("Custom expiry date is required when duration is custom")
      }
      const expiry = new Date(customExpiry)
      if (expiry <= now) {
        throw new BadRequestException("Expiry date must be in the future")
      }
      return expiry
    }

    const durationMap = {
      [InvitationDuration.ONE_HOUR]: 1 * 60 * 60 * 1000,
      [InvitationDuration.SIX_HOURS]: 6 * 60 * 60 * 1000,
      [InvitationDuration.ONE_DAY]: 24 * 60 * 60 * 1000,
      [InvitationDuration.THREE_DAYS]: 3 * 24 * 60 * 60 * 1000,
      [InvitationDuration.ONE_WEEK]: 7 * 24 * 60 * 60 * 1000,
      [InvitationDuration.ONE_MONTH]: 30 * 24 * 60 * 60 * 1000,
    }

    const milliseconds = durationMap[duration] || durationMap[InvitationDuration.ONE_DAY]
    return new Date(now.getTime() + milliseconds)
  }

  private validateInvitation(invitation: Invitation): void {
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException(`Invitation is ${invitation.status}`)
    }

    if (invitation.isExpired) {
      throw new BadRequestException("Invitation has expired")
    }

    if (!invitation.isUsable) {
      throw new BadRequestException("Invitation has reached maximum usage")
    }
  }
}
