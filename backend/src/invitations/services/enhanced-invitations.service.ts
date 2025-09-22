import { Injectable, Logger } from "@nestjs/common"
import { InvitationsService } from "./invitations.service"
import type { StellarInvitationService, InvitationContractData } from "./stellar-invitation.service"
import type { AcceptInvitationDto } from "../dto/accept-invitation.dto"
import type { Invitation } from "../entities/invitation.entity"
import type { RoomParticipant } from "../entities/room-participant.entity"

@Injectable()
export class EnhancedInvitationsService extends InvitationsService {
  private readonly logger = new Logger(EnhancedInvitationsService.name)

  constructor(
    // ... existing dependencies from parent class
    private readonly stellarService: StellarInvitationService,
  ) {
    super(/* pass parent dependencies */)
  }

  async acceptInvitationWithStellarVerification(
    acceptDto: AcceptInvitationDto,
    userId: string,
  ): Promise<{ invitation: Invitation; participant: RoomParticipant; stellarTxId: string }> {
    this.logger.log(`Accepting invitation with Stellar verification: ${acceptDto.code}`)

    // First, accept the invitation using the base service
    const result = await super.acceptInvitation(acceptDto, userId)

    try {
      // Record the acceptance on Stellar blockchain
      const contractData: InvitationContractData = {
        invitationId: result.invitation.id,
        roomId: result.invitation.roomId,
        inviterId: result.invitation.inviterId,
        inviteeId: userId,
        code: result.invitation.code,
        timestamp: Date.now(),
      }

      const stellarTxId = await this.stellarService.recordInvitationAcceptance(contractData)

      // Update the invitation with the Stellar transaction ID
      result.invitation.stellarTxId = stellarTxId
      await this.invitationRepository.save(result.invitation)

      this.logger.log(`Invitation acceptance recorded on Stellar: ${stellarTxId}`)

      return {
        ...result,
        stellarTxId,
      }
    } catch (stellarError) {
      this.logger.error(`Failed to record on Stellar, but invitation was accepted: ${stellarError.message}`)

      // Even if Stellar fails, the invitation acceptance should still be valid
      // This ensures the system remains functional even if blockchain is temporarily unavailable
      return {
        ...result,
        stellarTxId: null,
      }
    }
  }

  async verifyInvitationIntegrity(invitationId: string): Promise<{
    databaseRecord: Invitation | null
    stellarRecord: InvitationContractData | null
    isConsistent: boolean
    discrepancies: string[]
  }> {
    this.logger.log(`Verifying invitation integrity: ${invitationId}`)

    // Get database record
    const databaseRecord = await this.invitationRepository.findOne({
      where: { id: invitationId },
      relations: ["inviter", "invitee"],
    })

    // Get Stellar record
    const stellarRecord = await this.stellarService.verifyInvitationOnChain(invitationId)

    // Compare records
    const discrepancies: string[] = []
    let isConsistent = true

    if (databaseRecord && stellarRecord) {
      if (databaseRecord.roomId !== stellarRecord.roomId) {
        discrepancies.push("Room ID mismatch")
        isConsistent = false
      }
      if (databaseRecord.inviterId !== stellarRecord.inviterId) {
        discrepancies.push("Inviter ID mismatch")
        isConsistent = false
      }
      if (databaseRecord.inviteeId !== stellarRecord.inviteeId) {
        discrepancies.push("Invitee ID mismatch")
        isConsistent = false
      }
      if (databaseRecord.code !== stellarRecord.code) {
        discrepancies.push("Invitation code mismatch")
        isConsistent = false
      }
    } else if (databaseRecord && !stellarRecord) {
      discrepancies.push("Record exists in database but not on Stellar")
      isConsistent = false
    } else if (!databaseRecord && stellarRecord) {
      discrepancies.push("Record exists on Stellar but not in database")
      isConsistent = false
    }

    return {
      databaseRecord,
      stellarRecord,
      isConsistent,
      discrepancies,
    }
  }

  async verifyRoomAccessOnChain(roomId: string, userId: string): Promise<boolean> {
    return this.stellarService.verifyRoomAccess(roomId, userId)
  }

  async revokeInvitationWithStellarUpdate(
    invitationId: string,
    userId: string,
  ): Promise<{
    invitation: Invitation
    stellarTxId: string | null
  }> {
    this.logger.log(`Revoking invitation with Stellar update: ${invitationId}`)

    // Revoke in database first
    const invitation = await super.revokeInvitation(invitationId, userId)

    try {
      // Revoke on Stellar blockchain
      const stellarTxId = await this.stellarService.revokeInvitationOnChain(invitationId)

      this.logger.log(`Invitation revoked on Stellar: ${stellarTxId}`)

      return {
        invitation,
        stellarTxId,
      }
    } catch (stellarError) {
      this.logger.error(`Failed to revoke on Stellar: ${stellarError.message}`)

      return {
        invitation,
        stellarTxId: null,
      }
    }
  }

  async getInvitationAuditTrail(invitationId: string): Promise<{
    databaseEvents: any[]
    stellarEvents: any[]
    combinedTimeline: any[]
  }> {
    this.logger.log(`Getting audit trail for invitation: ${invitationId}`)

    // Get database events (you might need to implement audit logging)
    const databaseEvents = [] // Implement based on your audit system

    // Get Stellar events
    const stellarEvents = await this.stellarService.getInvitationHistory(invitationId)

    // Combine and sort by timestamp
    const combinedTimeline = [...databaseEvents, ...stellarEvents].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )

    return {
      databaseEvents,
      stellarEvents,
      combinedTimeline,
    }
  }
}
