import { GiftsGivenService } from './gifts-given.service';
import { CreateGiftLogDto } from './dto/create-gift-log.dto';
import { GiftLogResponseDto } from './dto/gift-log-response.dto';
import { GiftHistoryQueryDto } from './dto/gift-history-query.dto';
export declare class GiftsGivenController {
    private readonly giftsGivenService;
    constructor(giftsGivenService: GiftsGivenService);
    logGift(createGiftLogDto: CreateGiftLogDto): Promise<GiftLogResponseDto>;
    getUserGiftHistory(userId: string, query: GiftHistoryQueryDto): Promise<{
        gifts: import("./entities/gift-log.entity").GiftLog[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getGiftAnalytics(userId: string): Promise<{
        totalGifts: number;
        totalValue: number;
        giftsByType: Array<{
            giftType: string;
            count: number;
            totalValue: number;
        }>;
        recentActivity: import("./entities/gift-log.entity").GiftLog[];
    }>;
}
