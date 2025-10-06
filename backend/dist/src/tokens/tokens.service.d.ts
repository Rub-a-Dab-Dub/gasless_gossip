import { Repository } from 'typeorm';
import { TokenTransaction } from './token-transaction.entity';
import { SendTokenDto } from './dto/send-token.dto';
import { ConfigService } from '@nestjs/config';
import { StellarAccount } from '../xp/stellar-account.entity';
export declare class TokensService {
    private readonly tokenTxRepo;
    private readonly stellarAccountRepo;
    private readonly config;
    private readonly logger;
    constructor(tokenTxRepo: Repository<TokenTransaction>, stellarAccountRepo: Repository<StellarAccount>, config: ConfigService);
    send(dto: SendTokenDto): Promise<{
        hash: any;
        ledger: any;
        successful: boolean;
    }>;
    history(userId: string): Promise<TokenTransaction[]>;
}
