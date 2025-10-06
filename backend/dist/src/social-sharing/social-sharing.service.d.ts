import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Share, ContentType } from './entities/share.entity';
import { CreateShareDto } from './dto/create-share.dto';
import { ShareQueryDto } from './dto/share-query.dto';
import { XpService } from '../xp/xp.service';
import { User } from '../users/entities/user.entity';
export declare class SocialSharingService {
    private readonly shareRepository;
    private readonly userRepository;
    private readonly configService;
    private readonly xpService;
    private readonly logger;
    private readonly XP_REWARDS;
    private readonly PLATFORM_MULTIPLIERS;
    constructor(shareRepository: Repository<Share>, userRepository: Repository<User>, configService: ConfigService, xpService: XpService);
    createShare(createShareDto: CreateShareDto, userId: string): Promise<Share>;
    getSharesByUser(userId: string, query: ShareQueryDto): Promise<{
        shares: Share[];
        total: number;
    }>;
    getAllShares(query: ShareQueryDto): Promise<{
        shares: Share[];
        total: number;
    }>;
    getShareById(shareId: string): Promise<Share>;
    getShareStats(userId?: string): Promise<{
        totalShares: number;
        totalXpAwarded: number;
        platformBreakdown: Record<string, number>;
        contentTypeBreakdown: Record<string, number>;
    }>;
    private generateShareableUrl;
    private generateExternalUrl;
    generateMockShareContent(contentType: ContentType, userId: string): Promise<{
        shareText: string;
        metadata: Record<string, any>;
    }>;
}
