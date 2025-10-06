import { TokensService } from './tokens.service';
import { SendTokenDto } from './dto/send-token.dto';
export declare class TokensController {
    private readonly tokensService;
    constructor(tokensService: TokensService);
    send(dto: SendTokenDto): Promise<{
        hash: any;
        ledger: any;
        successful: boolean;
    }>;
    history(userId: string): Promise<{
        userId: string;
        entries: import("./token-transaction.entity").TokenTransaction[];
    }>;
}
