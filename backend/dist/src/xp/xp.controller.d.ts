import { XpService } from './xp.service';
import { AddXpDto, StellarEventDto, MapStellarAccountDto } from './dto/add-xp.dto';
import { Repository } from 'typeorm';
import { StellarAccount } from './stellar-account.entity';
export declare class XpController {
    private readonly xpService;
    private readonly stellarAccountRepo;
    constructor(xpService: XpService, stellarAccountRepo: Repository<StellarAccount>);
    getXp(userId: string): Promise<{
        userId: string;
        xp: number;
    }>;
    addXp(body: AddXpDto): Promise<{
        userId: string;
        xp: number;
    }>;
    handleEvent(event: StellarEventDto): Promise<{
        processed: boolean;
    }>;
    mapAccount(body: MapStellarAccountDto): Promise<StellarAccount>;
}
