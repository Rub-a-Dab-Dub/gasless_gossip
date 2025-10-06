import { Repository } from 'typeorm';
import { Tip } from './entities/tip.entity';
import { CreateTipDto } from './dto/create-tip.dto';
import { TipResponseDto } from './dto/tip-response.dto';
import { TipsAnalyticsDto } from './dto/tips-analytics.dto';
import { StellarService } from './services/stellar.service';
import { AnalyticsService } from './services/analytics.service';
export declare class TipsService {
    private tipsRepository;
    private stellarService;
    private analyticsService;
    constructor(tipsRepository: Repository<Tip>, stellarService: StellarService, analyticsService: AnalyticsService);
    createTip(createTipDto: CreateTipDto, senderId: string): Promise<TipResponseDto>;
    getUserTips(userId: string, requestingUserId?: string): Promise<TipResponseDto[]>;
    getTipAnalytics(userId: string): Promise<TipsAnalyticsDto>;
    private validateUser;
    private mapToResponseDto;
}
