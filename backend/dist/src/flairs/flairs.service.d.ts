import { Repository } from 'typeorm';
import { Flair } from './entities/flair.entity';
import { CreateFlairDto } from './dto/create-flair.dto';
import { StellarService } from '../stellar/stellar.service';
export declare class FlairsService {
    private readonly flairRepository;
    private readonly stellarService;
    private readonly logger;
    constructor(flairRepository: Repository<Flair>, stellarService: StellarService);
    addFlairForUser(userId: string, dto: CreateFlairDto): Promise<Flair>;
    getFlairsForUser(userId: string): Promise<Flair[]>;
    private verifyPremiumFlairOwnership;
}
