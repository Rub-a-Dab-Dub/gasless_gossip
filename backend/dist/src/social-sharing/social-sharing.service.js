"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SocialSharingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialSharingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const share_entity_1 = require("./entities/share.entity");
const xp_service_1 = require("../xp/xp.service");
const user_entity_1 = require("../users/entities/user.entity");
let SocialSharingService = SocialSharingService_1 = class SocialSharingService {
    shareRepository;
    userRepository;
    configService;
    xpService;
    logger = new common_1.Logger(SocialSharingService_1.name);
    XP_REWARDS = {
        [share_entity_1.ContentType.SECRET]: 15,
        [share_entity_1.ContentType.GIFT]: 10,
        [share_entity_1.ContentType.ACHIEVEMENT]: 20,
        [share_entity_1.ContentType.NFT]: 25,
        [share_entity_1.ContentType.LEVEL_UP]: 30,
        [share_entity_1.ContentType.BADGE]: 20,
    };
    PLATFORM_MULTIPLIERS = {
        [share_entity_1.Platform.X]: 1.5,
        [share_entity_1.Platform.TWITTER]: 1.5,
        [share_entity_1.Platform.FACEBOOK]: 1.2,
        [share_entity_1.Platform.LINKEDIN]: 1.3,
        [share_entity_1.Platform.DISCORD]: 1.0,
        [share_entity_1.Platform.TELEGRAM]: 1.0,
        [share_entity_1.Platform.REDDIT]: 1.1,
        [share_entity_1.Platform.OTHER]: 1.0,
    };
    constructor(shareRepository, userRepository, configService, xpService) {
        this.shareRepository = shareRepository;
        this.userRepository = userRepository;
        this.configService = configService;
        this.xpService = xpService;
    }
    async createShare(createShareDto, userId) {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const baseXp = this.XP_REWARDS[createShareDto.contentType] || 5;
            const platformMultiplier = this.PLATFORM_MULTIPLIERS[createShareDto.platform] || 1.0;
            const xpReward = Math.floor(baseXp * platformMultiplier);
            const shareUrl = await this.generateShareableUrl(createShareDto, userId);
            const externalUrl = this.generateExternalUrl(createShareDto.platform, shareUrl);
            const share = this.shareRepository.create({
                ...createShareDto,
                userId,
                shareUrl,
                externalUrl,
                xpAwarded: xpReward,
                isSuccessful: true,
            });
            const savedShare = await this.shareRepository.save(share);
            try {
                await this.xpService.addXp(userId, xpReward, 'social_share');
                this.logger.log(`Awarded ${xpReward} XP to user ${userId} for sharing ${createShareDto.contentType} on ${createShareDto.platform}`);
            }
            catch (xpError) {
                this.logger.error(`Failed to award XP to user ${userId}:`, xpError);
                savedShare.isSuccessful = false;
                savedShare.errorMessage = 'XP award failed';
                await this.shareRepository.save(savedShare);
            }
            this.logger.log(`Share created successfully for user ${userId}: ${savedShare.id}`);
            return savedShare;
        }
        catch (error) {
            this.logger.error(`Failed to create share for user ${userId}:`, error);
            throw error;
        }
    }
    async getSharesByUser(userId, query) {
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
    async getAllShares(query) {
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
    async getShareById(shareId) {
        const share = await this.shareRepository.findOne({
            where: { id: shareId },
            relations: ['user'],
        });
        if (!share) {
            throw new common_1.NotFoundException('Share not found');
        }
        return share;
    }
    async getShareStats(userId) {
        const queryBuilder = this.shareRepository.createQueryBuilder('share');
        if (userId) {
            queryBuilder.where('share.userId = :userId', { userId });
        }
        const shares = await queryBuilder.getMany();
        const stats = {
            totalShares: shares.length,
            totalXpAwarded: shares.reduce((sum, share) => sum + share.xpAwarded, 0),
            platformBreakdown: {},
            contentTypeBreakdown: {},
        };
        shares.forEach(share => {
            stats.platformBreakdown[share.platform] = (stats.platformBreakdown[share.platform] || 0) + 1;
            stats.contentTypeBreakdown[share.contentType] = (stats.contentTypeBreakdown[share.contentType] || 0) + 1;
        });
        return stats;
    }
    async generateShareableUrl(createShareDto, userId) {
        const baseUrl = this.configService.get('APP_BASE_URL', 'https://whspr.app');
        switch (createShareDto.contentType) {
            case share_entity_1.ContentType.SECRET:
                return `${baseUrl}/secrets/${createShareDto.contentId || 'shared'}`;
            case share_entity_1.ContentType.GIFT:
                return `${baseUrl}/gifts/${createShareDto.contentId || 'shared'}`;
            case share_entity_1.ContentType.ACHIEVEMENT:
                return `${baseUrl}/achievements/${createShareDto.contentId || 'shared'}`;
            case share_entity_1.ContentType.NFT:
                return `${baseUrl}/nfts/${createShareDto.contentId || 'shared'}`;
            case share_entity_1.ContentType.LEVEL_UP:
                return `${baseUrl}/profile/${userId}?highlight=level`;
            case share_entity_1.ContentType.BADGE:
                return `${baseUrl}/profile/${userId}?highlight=badge&badge=${createShareDto.contentId}`;
            default:
                return `${baseUrl}/profile/${userId}`;
        }
    }
    generateExternalUrl(platform, shareUrl) {
        const encodedUrl = encodeURIComponent(shareUrl);
        const defaultText = encodeURIComponent('Check this out on Whspr! 🚀');
        switch (platform) {
            case share_entity_1.Platform.X:
            case share_entity_1.Platform.TWITTER:
                return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${defaultText}`;
            case share_entity_1.Platform.FACEBOOK:
                return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            case share_entity_1.Platform.LINKEDIN:
                return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
            case share_entity_1.Platform.REDDIT:
                return `https://reddit.com/submit?url=${encodedUrl}&title=${defaultText}`;
            case share_entity_1.Platform.DISCORD:
            case share_entity_1.Platform.TELEGRAM:
            case share_entity_1.Platform.OTHER:
            default:
                return shareUrl;
        }
    }
    async generateMockShareContent(contentType, userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });
        const username = user?.username || 'Anonymous';
        switch (contentType) {
            case share_entity_1.ContentType.SECRET:
                return {
                    shareText: `🔐 I just discovered an amazing secret on Whspr! Check it out and see what you can find! #WhsprSecrets #Crypto`,
                    metadata: { type: 'secret_discovery', userLevel: 'explorer' },
                };
            case share_entity_1.ContentType.GIFT:
                return {
                    shareText: `🎁 Just received an awesome gift on Whspr! The community here is incredible! #WhsprGifts #Community`,
                    metadata: { type: 'gift_received', giftValue: 'high' },
                };
            case share_entity_1.ContentType.ACHIEVEMENT:
                return {
                    shareText: `🏆 Achievement unlocked! I've reached a new milestone on Whspr! Join me on this journey! #WhsprAchievements #Milestone`,
                    metadata: { type: 'milestone_reached', achievementLevel: 'rare' },
                };
            case share_entity_1.ContentType.NFT:
                return {
                    shareText: `🎨 Just minted/collected an amazing NFT on Whspr! The artwork is incredible! Check out my collection! #WhsprNFTs #DigitalArt`,
                    metadata: { type: 'nft_collected', rarity: 'epic' },
                };
            case share_entity_1.ContentType.LEVEL_UP:
                return {
                    shareText: `📈 Level up! I've grown stronger on Whspr! The XP system here really rewards engagement! #WhsprLevelUp #Growth`,
                    metadata: { type: 'level_progression', newLevel: 5 },
                };
            case share_entity_1.ContentType.BADGE:
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
};
exports.SocialSharingService = SocialSharingService;
exports.SocialSharingService = SocialSharingService = SocialSharingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(share_entity_1.Share)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        config_1.ConfigService,
        xp_service_1.XpService])
], SocialSharingService);
//# sourceMappingURL=social-sharing.service.js.map