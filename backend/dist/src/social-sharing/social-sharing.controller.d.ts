import { SocialSharingService } from './social-sharing.service';
import { CreateShareDto } from './dto/create-share.dto';
import { ShareQueryDto } from './dto/share-query.dto';
import { ShareResponseDto } from './dto/create-share.dto';
import { User } from '../users/entities/user.entity';
export declare class SocialSharingController {
    private readonly socialSharingService;
    constructor(socialSharingService: SocialSharingService);
    createShare(createShareDto: CreateShareDto, user: User): Promise<ShareResponseDto>;
    getSharesByUser(userId: string, query: ShareQueryDto): Promise<{
        shares: ShareResponseDto[];
        total: number;
    }>;
    getMyShares(user: User, query: ShareQueryDto): Promise<{
        shares: ShareResponseDto[];
        total: number;
    }>;
    getAllShares(query: ShareQueryDto): Promise<{
        shares: ShareResponseDto[];
        total: number;
    }>;
    getShareById(id: string): Promise<ShareResponseDto>;
    getShareStats(): Promise<{
        totalShares: number;
        totalXpAwarded: number;
        platformBreakdown: Record<string, number>;
        contentTypeBreakdown: Record<string, number>;
    }>;
    getMyShareStats(user: User): Promise<{
        totalShares: number;
        totalXpAwarded: number;
        platformBreakdown: Record<string, number>;
        contentTypeBreakdown: Record<string, number>;
    }>;
    generateMockShare(contentType: string, user: User): Promise<{
        shareText: string;
        metadata: Record<string, any>;
        suggestedPlatforms: string[];
    }>;
}
