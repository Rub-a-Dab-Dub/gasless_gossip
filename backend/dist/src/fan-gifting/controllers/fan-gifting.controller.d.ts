import { FanGiftingService } from '../services/fan-gifting.service';
import { CreateFanGiftDto } from '../dto/create-fan-gift.dto';
import { GiftHistoryQueryDto } from '../dto/gift-history-query.dto';
import { FanGiftResponseDto } from '../dto/fan-gift-response.dto';
export declare class FanGiftingController {
    private readonly fanGiftingService;
    constructor(fanGiftingService: FanGiftingService);
    createGift(createGiftDto: CreateFanGiftDto, req: any): Promise<FanGiftResponseDto>;
    getGiftHistory(userId: string, query: GiftHistoryQueryDto): Promise<{
        data: import("../entities/fan-gift.entity").FanGift[];
        total: number;
        page: number | undefined;
        totalPages: number;
    }>;
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
    getGiftById(giftId: string): Promise<FanGiftResponseDto>;
}
