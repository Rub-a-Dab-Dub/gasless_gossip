import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MemecoinDrop } from '../entities/memecoin-drop.entity';
import { CreateDropDto } from '../dto/create-drop.dto';
import { StellarService } from './stellar.service';

@Injectable()
export class MemecoinsService {
  private readonly logger = new Logger(MemecoinsService.name);

  constructor(
    @InjectRepository(MemecoinDrop)
    private memecoinDropRepository: Repository<MemecoinDrop>,
    private stellarService: StellarService,
  ) {}

  async createDrop(createDropDto: CreateDropDto): Promise<MemecoinDrop> {
    try {
      // Create initial drop record
      const drop = this.memecoinDropRepository.create({
        recipients: createDropDto.recipients,
        amount: createDropDto.amount,
        assetCode: createDropDto.assetCode || 'MEME',
        dropType: createDropDto.dropType || 'reward',
        assetIssuer: this.stellarService.getIssuerPublicKey(),
        status: 'pending',
      });

      const savedDrop = await this.memecoinDropRepository.save(drop);

      // Attempt distribution
      try {
        const txId = await this.stellarService.distributeToRecipients(
          createDropDto.recipients,
          createDropDto.amount,
          createDropDto.assetCode
        );

        // Update drop with success
        savedDrop.txId = txId;
        savedDrop.status = 'completed';
        await this.memecoinDropRepository.save(savedDrop);

        this.logger.log(`Drop ${savedDrop.id} completed successfully with tx: ${txId}`);
        return savedDrop;

      } catch (distributionError) {
        // Update drop with failure
        savedDrop.status = 'failed';
        savedDrop.failureReason = distributionError.message;
        await this.memecoinDropRepository.save(savedDrop);

        throw new BadRequestException(`Distribution failed: ${distributionError.message}`);
      }

    } catch (error) {
      this.logger.error(`Failed to create drop: ${error.message}`);
      throw error;
    }
  }

  async getUserDrops(userId: string, page: number = 1, limit: number = 10): Promise<{
    drops: MemecoinDrop[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const [drops, total] = await this.memecoinDropRepository.findAndCount({
        where: {
          recipients: userId, // This assumes recipients contains the userId
        },
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      const totalPages = Math.ceil(total / limit);

      return {
        drops,
        total,
        page,
        totalPages,
      };

    } catch (error) {
      this.logger.error(`Failed to get user drops: ${error.message}`);
      throw new BadRequestException('Failed to retrieve user drops');
    }
  }

  async getAllDrops(page: number = 1, limit: number = 10): Promise<{
    drops: MemecoinDrop[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const [drops, total] = await this.memecoinDropRepository.findAndCount({
        order: { createdAt: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });

      const totalPages = Math.ceil(total / limit);

      return {
        drops,
        total,
        page,
        totalPages,
      };

    } catch (error) {
      this.logger.error(`Failed to get all drops: ${error.message}`);
      throw new BadRequestException('Failed to retrieve drops');
    }
  }

  async getDropById(id: string): Promise<MemecoinDrop> {
    const drop = await this.memecoinDropRepository.findOne({ where: { id } });
    
    if (!drop) {
      throw new NotFoundException(`Drop with ID ${id} not found`);
    }

    return drop;
  }

  async retryFailedDrop(id: string): Promise<MemecoinDrop> {
    const drop = await this.getDropById(id);

    if (drop.status !== 'failed') {
      throw new BadRequestException('Can only retry failed drops');
    }

    try {
      const txId = await this.stellarService.distributeToRecipients(
        drop.recipients,
        drop.amount,
        drop.assetCode
      );

      drop.txId = txId;
      drop.status = 'completed';
      drop.failureReason = null;
      
      return await this.memecoinDropRepository.save(drop);

    } catch (error) {
      drop.failureReason = error.message;
      await this.memecoinDropRepository.save(drop);
      throw new BadRequestException(`Retry failed: ${error.message}`);
    }
  }
}