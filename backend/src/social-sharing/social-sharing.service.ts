import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Share, ContentType, Platform } from './entities/share.entity';
import { CreateShareDto } from './dto/create-share.dto';
import { ShareQueryDto } from './dto/share-query.dto';
import { XpService } from '../xp/xp.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SocialSharingService {
  private readonly logger = new Logger(SocialSharingService.name);

  // XP rewards for different content types
  private readonly XP_REWARDS = {
    [ContentType.SECRET]: 15,
    [ContentType.GIFT]: 10,
    [ContentType.ACHIEVEMENT]: 20,
    [ContentType.NFT]: 25,
    [ContentType.LEVEL_UP]: 30,
    [ContentType.BADGE]: 20,
  };

  // Platform-specific multipliers
  private readonly PLATFORM_MULTIPLIERS = {
    [Platform.X]: 1.5, // Twitter/X gets 50% bonus
    [Platform.TWITTER]: 1.5,
    [Platform.FACEBOOK]: 1.2,
    [Platform.LINKEDIN]: 1.3,
    [Platform.DISCORD]: 1.0,
    [Platform.TELEGRAM]: 1.0,
    [Platform.REDDIT]: 1.1,
    [Platform.OTHER]: 1.0,
  };

  constructor(
    @InjectRepository(Share)
    private readonly shareRepository: Repository<Share>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly xpService: XpService,
  ) {}

  async createShare(createShareDto: CreateShareDto, userId: string): Promise<Share> {
    try {
      // Verify user exists
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Calculate XP reward
      const baseXp = this.XP_REWARDS[createShareDto.contentType] || 5;
      const platformMultiplier = this.PLATFORM_MULTIPLIERS[createShareDto.platform] || 1.0;
      const xpReward = Math.floor(baseXp * platformMultiplier);

      // Generate shareable URL
      const shareUrl = await this.generateShareableUrl(createShareDto, userId);
      const externalUrl = this.generateExternalUrl(createShareDto.platform, shareUrl);

      // Create share record
      const share = this.shareRepository.create({
        ...createShareDto,
        userId,
        shareUrl,
        externalUrl,
        xpAwarded: xpReward,
        isSuccessful: true,
      });

      const savedShare = await this.shareRepository.save(share);

      // Award XP to user
      try {
        await this.xpService.addXp(userId, xpReward, 'social_share');
        this.logger.log(`Awarded ${xpReward} XP to user ${userId} for sharing ${createShareDto.contentType} on ${createShareDto.platform}`);
      } catch (xpError) {
        this.logger.error(`Failed to award XP to user ${userId}:`, xpError);
        // Update share record to reflect XP failure
        savedShare.isSuccessful = false;
        savedShare.errorMessage = 'XP award failed';
        await this.shareRepository.save(savedShare);
      }

      this.logger.log(`Share created successfully for user ${userId}: ${savedShare.id}`);
      return savedShare;

    } catch (error) {
      this.logger.error(`Failed to create share for user ${userId}:`, error);
      throw error;
    }
  }

  async getSharesByUser(userId: string, query: ShareQueryDto): Promise<{ shares: Share[]; total: number }> {
    const queryBuilder = this.shareRepository
      .createQueryBuilder('share')
      .leftJoinAndSelect('share.user', 'user')
      .where('share.userId = :userId', { userId });

    if (query.contentType) {
      queryBuilder.andWhere('share.contentType = :contentType', { contentType: query.contentType });
    }

    if (query.platform) {
      queryBuilder.andWhere('share.platform = :platform', { platform: query.platform });
    }

    if (query.startDate) {
      queryBuilder.andWhere('share.createdAt >= :startDate', { startDate: query.startDate });
    }

    if (query.endDate) {
      queryBuilder.andWhere('share.createdAt <= :endDate', { endDate: query.endDate });
    }

    queryBuilder
      .orderBy('share.createdAt', 'DESC')
      .limit(query.limit || 20)
      .offset(query.offset || 0);

    const [shares, total] = await queryBuilder.getManyAndCount();

    return { shares, total };
  }

  async getAllShares(query: ShareQueryDto): Promise<{ shares: Share[]; total: number }> {
    const queryBuilder = this.shareRepository
      .createQueryBuilder('share')
      .leftJoinAndSelect('share.user', 'user');

    if (query.userId) {
      queryBuilder.where('share.userId = :userId', { userId: query.userId });
    }

    if (query.contentType) {
      queryBuilder.andWhere('share.contentType = :contentType', { contentType: query.contentType });
    }

    if (query.platform) {
      queryBuilder.andWhere('share.platform = :platform', { platform: query.platform });
    }

    if (query.startDate) {
      queryBuilder.andWhere('share.createdAt >= :startDate', { startDate: query.startDate });
    }

    if (query.endDate) {
      queryBuilder.andWhere('share.createdAt <= :endDate', { endDate: query.endDate });
    }

    queryBuilder
      .orderBy('share.createdAt', 'DESC')
      .limit(query.limit || 20)
      .offset(query.offset || 0);

    const [shares, total] = await queryBuilder.getManyAndCount();

    return { shares, total };
  }

  async getShareById(shareId: string): Promise<Share> {
    const share = await this.shareRepository.findOne({
      where: { id: shareId },
      relations: ['user'],
    });

    if (!share) {
      throw new NotFoundException('Share not found');
    }

    return share;
  }

  async getShareStats(userId?: string): Promise<{
    totalShares: number;
    totalXpAwarded: number;
    platformBreakdown: Record<string, number>;
    contentTypeBreakdown: Record<string, number>;
  }> {
    const queryBuilder = this.shareRepository.createQueryBuilder('share');

    if (userId) {
      queryBuilder.where('share.userId = :userId', { userId });
    }

    const shares = await queryBuilder.getMany();

    const stats = {
      totalShares: shares.length,
      totalXpAwarded: shares.reduce((sum, share) => sum + share.xpAwarded, 0),
      platformBreakdown: {} as Record<string, number>,
      contentTypeBreakdown: {} as Record<string, number>,
    };

    shares.forEach(share => {
      stats.platformBreakdown[share.platform] = (stats.platformBreakdown[share.platform] || 0) + 1;
      stats.contentTypeBreakdown[share.contentType] = (stats.contentTypeBreakdown[share.contentType] || 0) + 1;
    });

    return stats;
  }

  private async generateShareableUrl(createShareDto: CreateShareDto, userId: string): Promise<string> {
    const baseUrl = this.configService.get<string>('APP_BASE_URL', 'https://whspr.app');
    
    // Generate different URLs based on content type
    switch (createShareDto.contentType) {
      case ContentType.SECRET:
        return `${baseUrl}/secrets/${createShareDto.contentId || 'shared'}`;
      case ContentType.GIFT:
        return `${baseUrl}/gifts/${createShareDto.contentId || 'shared'}`;
      case ContentType.ACHIEVEMENT:
        return `${baseUrl}/achievements/${createShareDto.contentId || 'shared'}`;
      case ContentType.NFT:
        return `${baseUrl}/nfts/${createShareDto.contentId || 'shared'}`;
      case ContentType.LEVEL_UP:
        return `${baseUrl}/profile/${userId}?highlight=level`;
      case ContentType.BADGE:
        return `${baseUrl}/profile/${userId}?highlight=badge&badge=${createShareDto.contentId}`;
      default:
        return `${baseUrl}/profile/${userId}`;
    }
  }

  private generateExternalUrl(platform: Platform, shareUrl: string): string {
    const encodedUrl = encodeURIComponent(shareUrl);
    const defaultText = encodeURIComponent('Check this out on Whspr! 🚀');

    switch (platform) {
      case Platform.X:
      case Platform.TWITTER:
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${defaultText}`;
      case Platform.FACEBOOK:
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      case Platform.LINKEDIN:
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      case Platform.REDDIT:
        return `https://reddit.com/submit?url=${encodedUrl}&title=${defaultText}`;
      case Platform.DISCORD:
      case Platform.TELEGRAM:
      case Platform.OTHER:
      default:
        return shareUrl; // Return the direct URL for platforms that don't have sharing endpoints
    }
  }

  async generateMockShareContent(contentType: ContentType, userId: string): Promise<{
    shareText: string;
    metadata: Record<string, any>;
  }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    const username = user?.username || 'Anonymous';

    switch (contentType) {
      case ContentType.SECRET:
        return {
          shareText: `🔐 I just discovered an amazing secret on Whspr! Check it out and see what you can find! #WhsprSecrets #Crypto`,
          metadata: { type: 'secret_discovery', userLevel: 'explorer' },
        };
      case ContentType.GIFT:
        return {
          shareText: `🎁 Just received an awesome gift on Whspr! The community here is incredible! #WhsprGifts #Community`,
          metadata: { type: 'gift_received', giftValue: 'high' },
        };
      case ContentType.ACHIEVEMENT:
        return {
          shareText: `🏆 Achievement unlocked! I've reached a new milestone on Whspr! Join me on this journey! #WhsprAchievements #Milestone`,
          metadata: { type: 'milestone_reached', achievementLevel: 'rare' },
        };
      case ContentType.NFT:
        return {
          shareText: `🎨 Just minted/collected an amazing NFT on Whspr! The artwork is incredible! Check out my collection! #WhsprNFTs #DigitalArt`,
          metadata: { type: 'nft_collected', rarity: 'epic' },
        };
      case ContentType.LEVEL_UP:
        return {
          shareText: `📈 Level up! I've grown stronger on Whspr! The XP system here really rewards engagement! #WhsprLevelUp #Growth`,
          metadata: { type: 'level_progression', newLevel: 5 },
        };
      case ContentType.BADGE:
        return {
          shareText: `🏅 New badge earned! I'm building my reputation on Whspr! Join the community and earn yours too! #WhsprBadges #Community`,
          metadata: { type: 'badge_earned', badgeType: 'community' },
        };
      default:
        return {
          shareText: `🌟 Amazing things happening on Whspr! Join me in this incredible community! #Whspr #Community`,
          metadata: { type: 'general_share' },
        };
    }
  }
}
