import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge } from './entities/badge.entity';
import { AssignBadgeDto } from './dto/assign-badge.dto';
import { StellarService } from '../stellar/stellar.service';

@Injectable()
export class BadgesService {
  constructor(
    @InjectRepository(Badge)
    private readonly badgeRepository: Repository<Badge>,
    private readonly stellarService: StellarService,
  ) {}

  async assignBadge(dto: AssignBadgeDto): Promise<Badge> {
    // Mint badge token on Stellar
    await this.stellarService.mintBadgeToken(
      dto.userId,
      dto.type,
      dto.metadata,
    );
    // Store badge in DB
    const badge = this.badgeRepository.create(dto);
    return this.badgeRepository.save(badge);
  }

  async getBadgesByUser(userId: number): Promise<Badge[]> {
    return this.badgeRepository.find({ where: { userId } });
  }
}
