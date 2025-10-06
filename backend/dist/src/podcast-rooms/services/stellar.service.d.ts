import { IStellarService } from '../interfaces/stellar-service.interface';
export declare class StellarService implements IStellarService {
    private readonly logger;
    generateHash(data: string): Promise<string>;
    verifyHash(data: string, hash: string): Promise<boolean>;
    storeMetadata(metadata: any): Promise<string>;
}
