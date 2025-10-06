import { ProposeTradeDto } from './dto/propose-trade.dto';
import { AcceptTradeDto } from './dto/accept-trade.dto';
import { TradesService } from './trade.service';
export declare class TradesController {
    private readonly tradesService;
    constructor(tradesService: TradesService);
    proposeTrade(dto: ProposeTradeDto): Promise<import("./entities/trade.entity").Trade>;
    acceptTrade(dto: AcceptTradeDto): Promise<import("./entities/trade.entity").Trade>;
}
