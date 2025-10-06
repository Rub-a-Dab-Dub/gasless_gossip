import { Repository } from 'typeorm';
import { Trade } from './entities/trade.entity';
import { ProposeTradeDto } from './dto/propose-trade.dto';
import { AcceptTradeDto } from './dto/accept-trade.dto';
export declare class TradesService {
    private tradeRepo;
    private server;
    private issuerKeypair;
    constructor(tradeRepo: Repository<Trade>);
    proposeTrade(dto: ProposeTradeDto): Promise<Trade>;
    acceptTrade(dto: AcceptTradeDto): Promise<Trade>;
}
