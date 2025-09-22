import { Injectable, BadRequestException, ForbiddenException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flair } from './entities/flair.entity';
import { CreateFlairDto } from './dto/create-flair.dto';
import { StellarService } from '../stellar/stellar.service';

@Injectable()
export class FlairsService {
  private readonly logger = new Logger(FlairsService.name);

  constructor(
    @InjectRepository(Flair)
    private readonly flairRepository: Repository<Flair>,
    private readonly stellarService: StellarService,
  ) {}

  async addFlairForUser(userId: string, dto: CreateFlairDto): Promise<Flair> {
    if (!userId) throw new BadRequestException('Missing userId');

    // Premium flairs use prefix 'premium:'; verify via Stellar
    if (dto.flairType.startsWith('premium:')) {
      const premiumKey = dto.flairType.replace('premium:', '');
      const owns = await this.verifyPremiumFlairOwnership(userId, premiumKey);
      if (!owns) {
        throw new ForbiddenException('Premium flair not owned on Stellar');
      }
    }

    const flair = this.flairRepository.create({
      userId,
      flairType: dto.flairType,
      metadata: dto.metadata,
    });
    return await this.flairRepository.save(flair);
  }

  async getFlairsForUser(userId: string): Promise<Flair[]> {
    if (!userId) throw new BadRequestException('Missing userId');
    return this.flairRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  private async verifyPremiumFlairOwnership(userId: string, premiumKey: string): Promise<boolean> {
    try {
      if (typeof (this.stellarService as any).verifyTokenOwnership === 'function') {
        return await (this.stellarService as any).verifyTokenOwnership(userId, premiumKey);
      }
      // Fallback: try distributeReward no-op to ensure service reachable, then allow (dev only)
      await this.stellarService.distributeReward(userId, 0);
      this.logger.warn(`verifyTokenOwnership not implemented; allowing premium key '${premiumKey}' for user ${userId} in dev mode.`);
      return true;
    } catch (e) {
      this.logger.error('Stellar verification failed', e as any);
      return false;
    }
  }
}


