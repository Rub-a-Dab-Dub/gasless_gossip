import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Secret } from './entities/secret.entity';
import { CreateSecretDto } from './dto/create-secret.dto';
import { SecretResponseDto } from './dto/secret-response.dto';
import * as crypto from 'crypto';

@Injectable()
export class SecretsService {
  constructor(
    @InjectRepository(Secret)
    private secretsRepository: Repository<Secret>,
  ) {}

  async createSecret(createSecretDto: CreateSecretDto): Promise<SecretResponseDto> {
    // Hash the content for anonymity
    const contentHash = crypto
      .createHash('sha256')
      .update(createSecretDto.content + Date.now().toString())
      .digest('hex');

    const secret = this.secretsRepository.create({
      roomId: createSecretDto.roomId,
      contentHash,
      reactionCount: 0,
    });

    const savedSecret = await this.secretsRepository.save(secret);
    return this.toResponseDto(savedSecret);
  }

  async getTopSecrets(roomId: string, limit: number = 10): Promise<SecretResponseDto[]> {
    const secrets = await this.secretsRepository.find({
      where: { roomId },
      order: { reactionCount: 'DESC', createdAt: 'DESC' },
      take: limit,
    });

    return secrets.map(secret => this.toResponseDto(secret));
  }

  async incrementReaction(secretId: string): Promise<SecretResponseDto> {
    const secret = await this.secretsRepository.findOne({ where: { id: secretId } });
    
    if (!secret) {
      throw new NotFoundException('Secret not found');
    }

    secret.reactionCount += 1;
    const updatedSecret = await this.secretsRepository.save(secret);
    
    return this.toResponseDto(updatedSecret);
  }

  private toResponseDto(secret: Secret): SecretResponseDto {
    return {
      id: secret.id,
      roomId: secret.roomId,
      contentHash: secret.contentHash,
      reactionCount: secret.reactionCount,
      createdAt: secret.createdAt,
    };
  }
}