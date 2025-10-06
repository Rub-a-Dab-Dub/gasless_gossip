import { BetsService } from './bets.service';
import { PlaceBetDto } from './dto/place-bet.dto';
import { ResolveBetDto } from './dto/resolve-bet.dto';
export declare class BetsController {
    private betsService;
    constructor(betsService: BetsService);
    placeBet(req: any, placeBetDto: PlaceBetDto): Promise<import("./bet.entity").Bet>;
    resolveBet(resolveBetDto: ResolveBetDto): Promise<import("./bet.entity").Bet>;
}
