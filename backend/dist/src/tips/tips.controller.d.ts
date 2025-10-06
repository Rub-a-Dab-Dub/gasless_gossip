import { TipsService } from './tips.service';
import { CreateTipDto } from './dto/create-tip.dto';
import { TipResponseDto } from './dto/tip-response.dto';
import { TipsAnalyticsDto } from './dto/tips-analytics.dto';
export declare class TipsController {
    private readonly tipsService;
    constructor(tipsService: TipsService);
    createTip(createTipDto: CreateTipDto, req: any): Promise<TipResponseDto>;
    getUserTips(userId: string, req: any): Promise<TipResponseDto[]>;
    getUserTipAnalytics(userId: string, req: any): Promise<TipsAnalyticsDto>;
}
export declare class TipsModule {
}
