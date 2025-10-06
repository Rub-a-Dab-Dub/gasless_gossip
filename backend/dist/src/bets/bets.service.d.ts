import { Repository } from 'typeorm';
import { Bet } from './bet.entity';
import { PlaceBetDto } from './dto/place-bet.dto';
import { ResolveBetDto } from './dto/resolve-bet.dto';
export declare class BetsService {
    private betRepo;
    constructor(betRepo: Repository<Bet>);
    placeBet(userId: string, placeBetDto: PlaceBetDto): Promise<Bet>;
    resolveBet(resolveBetDto: ResolveBetDto): Promise<Bet>;
    private createEscrow;
    private resolveEscrow;
}
