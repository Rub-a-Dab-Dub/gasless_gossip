import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GiftLog } from './entities/gift-log.entity';
import { CreateGiftLogDto } from './dto/create-gift-log.dto';
import { GiftHistoryQueryDto } from './dto/gift-history-query.dto';
export declare class GiftsGivenService {
    private readonly giftLogRepository;
    private readonly eventEmitter;
    private readonly logger;
    constructor(giftLogRepository: Repository<GiftLog>, eventEmitter: EventEmitter2);
    logGift(createGiftLogDto: CreateGiftLogDto): Promise<GiftLog>;
    getUserGiftHistory(userId: string, query: GiftHistoryQueryDto): Promise<{
        gifts: GiftLog[];
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
        recentActivity: GiftLog[];
    }>;
    private emitGiftEvents;
}
