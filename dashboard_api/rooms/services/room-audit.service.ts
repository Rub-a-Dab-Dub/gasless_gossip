import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, FindOptionsWhere } from 'typeorm';
import { RoomAudit, RoomAuditAction } from '../entities/room-audit.entity';
import { CreateRoomAuditDto, SearchRoomAuditDto } from '../dto/room-audit.dto';
import { Room } from '../entities/room.entity';

@Injectable()
export class RoomAuditService {
  constructor(
    @InjectRepository(RoomAudit)
    private roomAuditRepo: Repository<RoomAudit>,
    @InjectRepository(Room)
    private roomRepo: Repository<Room>,
  ) {}

  async create(dto: CreateRoomAuditDto): Promise<RoomAudit> {
    // Validate XP if required
    if (dto.metadata.xpRequired) {
      await this.validateXpRequirement(dto.metadata.xpRequired);
    }

    const audit = this.roomAuditRepo.create(dto);
    return this.roomAuditRepo.save(audit);
  }

  async search(searchDto: SearchRoomAuditDto): Promise<{ data: RoomAudit[]; total: number }> {
    const where: FindOptionsWhere<RoomAudit> = {};
    
    // Apply filters
    if (searchDto.roomId) {
      where.roomId = searchDto.roomId;
    }
    
    if (searchDto.creatorId) {
      where.creatorId = searchDto.creatorId;
    }
    
    if (searchDto.action) {
      where.action = searchDto.action;
    }
    
    if (searchDto.isAnomalous !== undefined) {
      where.isAnomalous = searchDto.isAnomalous;
    }
    
    if (searchDto.startDate && searchDto.endDate) {
      where.createdAt = Between(
        new Date(searchDto.startDate),
        new Date(searchDto.endDate)
      );
    }

    // Full-text search if searchTerm is provided
    const queryBuilder = this.roomAuditRepo.createQueryBuilder('audit');
    
    if (searchDto.searchTerm) {
      queryBuilder
        .where(where)
        .andWhere('audit.description ILIKE :searchTerm', {
          searchTerm: `%${searchDto.searchTerm}%`,
        });
    } else {
      queryBuilder.where(where);
    }

    // Add relations
    queryBuilder.leftJoinAndSelect('audit.room', 'room');

    const [data, total] = await queryBuilder
      .orderBy('audit.createdAt', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  private async validateXpRequirement(xpRequired: number): Promise<void> {
    // Implement XP validation logic
    // This could involve checking against system limits or user capabilities
    const MIN_XP = 0;
    const MAX_XP = 1000000; // Adjust based on your system's limits

    if (xpRequired < MIN_XP || xpRequired > MAX_XP) {
      throw new Error(`XP requirement must be between ${MIN_XP} and ${MAX_XP}`);
    }
  }

  async getAnomalyScore(audit: Partial<RoomAudit>): Promise<number> {
    // Calculate anomaly score based on various factors
    let score = 0;

    // Factor 1: Rapid creation by same creator
    const recentCreations = await this.roomAuditRepo.count({
      where: {
        creatorId: audit.creatorId,
        action: RoomAuditAction.CREATED,
        createdAt: Between(
          new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          new Date()
        ),
      },
    });

    if (recentCreations > 10) { // More than 10 rooms in 24 hours
      score += 0.3;
    }

    // Factor 2: Unusual XP requirements
    const xpRequired = audit.metadata?.xpRequired;
    if (xpRequired && (xpRequired > 100000 || xpRequired < 0)) {
      score += 0.3;
    }

    // Factor 3: Suspicious metadata patterns
    if (audit.metadata?.settings) {
      // Check for potential abuse patterns in settings
      const settingsStr = JSON.stringify(audit.metadata.settings).toLowerCase();
      const suspiciousTerms = ['hack', 'spam', 'bot', 'exploit'];
      if (suspiciousTerms.some(term => settingsStr.includes(term))) {
        score += 0.4;
      }
    }

    return Math.min(score, 1); // Normalize to 0-1 range
  }

  async logRoomAction(
    roomId: string,
    action: RoomAuditAction,
    creatorId: string,
    metadata: any,
    description: string
  ): Promise<RoomAudit> {
    const auditEntry = this.roomAuditRepo.create({
      roomId,
      action,
      creatorId,
      metadata,
      description,
    });

    // Calculate anomaly score
    auditEntry.anomalyScore = await this.getAnomalyScore(auditEntry);
    auditEntry.isAnomalous = auditEntry.anomalyScore > 0.6; // Threshold for anomaly

    return this.roomAuditRepo.save(auditEntry);
  }
}