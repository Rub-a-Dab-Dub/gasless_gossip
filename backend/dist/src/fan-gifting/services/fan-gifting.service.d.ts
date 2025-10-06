import { Repository } from 'typeorm';
import { FanGift } from '../entities/fan-gift.entity';
import { CreateFanGiftDto } from '../dto/create-fan-gift.dto';
import { GiftHistoryQueryDto } from '../dto/gift-history-query.dto';
import { StellarService } from './stellar.service';
export declare class FanGiftingService {
    private fanGiftRepository;
    private stellarService;
    private readonly logger;
    constructor(fanGiftRepository: Repository<FanGift>, stellarService: StellarService);
    createGift(fanId: string, createGiftDto: CreateFanGiftDto): Promise<FanGift>;
    getGiftHistory(userId: string, query: GiftHistoryQueryDto): Promise<{
        data: FanGift[];
        total: number;
        page: number | undefined;
        totalPages: number;
    }>;
    getGiftById(giftId: string): Promise<FanGift>;
    getGiftStats(userId: string): Promise<{
        sent: {
            count: number;
            totalAmount: any;
        };
        received: {
            count: number;
            totalAmount: any;
        };
    }>;
    private triggerAnalyticsHooks;
}
