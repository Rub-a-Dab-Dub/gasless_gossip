import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avatar } from './entities/avatar.entity';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { AvatarResponseDto } from './dto/avatar-response.dto';
import { StellarNftService } from './services/stellar-nft.service';

@Injectable()
export class AvatarsService {
  private readonly logger = new Logger(AvatarsService.name);

  constructor(
    @InjectRepository(Avatar)
    private avatarRepository: Repository<Avatar>,
    private stellarNftService: StellarNftService,
  ) {}

  async mintAvatar(
    userId: string,
    createAvatarDto: CreateAvatarDto,
    userStellarPublicKey: string,
  ): Promise<AvatarResponseDto> {
    // Check if user already has an avatar
    const existingAvatar = await this.avatarRepository.findOne({ 
      where: { userId, isActive: true } 
    });
    
    if (existingAvatar) {
      throw new ConflictException('User already has an active avatar');
    }

    try {
      // Generate unique asset code
      const assetCode = this.stellarNftService.generateUniqueAssetCode(
        userId, 
        createAvatarDto.level
      );

      // Mint NFT on Stellar
      const { txId, issuer } = await this.stellarNftService.mintNFT(
        userStellarPublicKey,
        assetCode,
        createAvatarDto,
      );

      // Save to database
      const avatar = this.avatarRepository.create({
        userId,
        metadata: createAvatarDto,
        txId,
        stellarAssetCode: assetCode,
        stellarIssuer: issuer,
      });

      const savedAvatar = await this.avatarRepository.save(avatar);
      
      this.logger.log(`Avatar created for user ${userId}: ${savedAvatar.id}`);
      
      return this.mapToResponseDto(savedAvatar);
    } catch (error) {
      this.logger.error(`Failed to mint avatar for user ${userId}:`, error);
      throw error;
    }
  }

  async getUserAvatar(userId: string): Promise<AvatarResponseDto> {
    const avatar = await this.avatarRepository.findOne({
      where: { userId, isActive: true },
    });

    if (!avatar) {
      throw new NotFoundException('Avatar not found for this user');
    }

    return this.mapToResponseDto(avatar);
  }

  async getAllAvatars(): Promise<AvatarResponseDto[]> {
    const avatars = await this.avatarRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });

    return avatars.map(avatar => this.mapToResponseDto(avatar));
  }

  async deactivateAvatar(userId: string): Promise<void> {
    const result = await this.avatarRepository.update(
      { userId, isActive: true },
      { isActive: false }
    );

    if (result.affected === 0) {
      throw new NotFoundException('No active avatar found for this user');
    }
  }

  private mapToResponseDto(avatar: Avatar): AvatarResponseDto {
    return {
      id: avatar.id,
      userId: avatar.userId,
      metadata: avatar.metadata,
      txId: avatar.txId,
      stellarAssetCode: avatar.stellarAssetCode,
      stellarIssuer: avatar.stellarIssuer,
      isActive: avatar.isActive,
      createdAt: avatar.createdAt,
      updatedAt: avatar.updatedAt,
    };
  }
}