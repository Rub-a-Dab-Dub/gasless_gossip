import { ConfigService } from '@nestjs/config';
import { StellarHashResult } from '../interfaces/ipfs.interface';
export declare class StellarService {
    private configService;
    private readonly logger;
    constructor(configService: ConfigService);
    createStellarHash(audioHash: string, metadata: any): Promise<StellarHashResult>;
}
