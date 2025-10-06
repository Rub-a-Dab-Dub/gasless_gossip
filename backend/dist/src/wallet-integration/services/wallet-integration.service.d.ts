import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { WalletConnection, WalletType } from '../entities/wallet-connection.entity';
import { ConnectWalletDto } from '../dto/connect-wallet.dto';
import { TransactionRequestDto } from '../dto/transaction-request.dto';
import { StellarTransactionResult, WalletBalance } from '../interfaces/wallet.interface';
export declare class WalletIntegrationService {
    private readonly walletConnectionRepository;
    private readonly configService;
    private readonly logger;
    private readonly server;
    private readonly networkPassphrase;
    constructor(walletConnectionRepository: Repository<WalletConnection>, configService: ConfigService);
    connectWallet(userId: string, connectWalletDto: ConnectWalletDto): Promise<WalletConnection>;
    getUserWallets(userId: string): Promise<WalletConnection[]>;
    getWalletById(walletId: string, userId: string): Promise<WalletConnection>;
    disconnectWallet(walletId: string, userId: string): Promise<void>;
    sendTransaction(walletId: string, userId: string, transactionDto: TransactionRequestDto): Promise<StellarTransactionResult>;
    getWalletBalance(walletId: string, userId: string): Promise<WalletBalance[]>;
    getWalletStats(userId: string): Promise<{
        totalWallets: number;
        activeWallets: number;
        walletTypes: Record<WalletType, number>;
        lastConnectedAt: Date | null;
    }>;
    private validateWalletAuth;
    private validateAlbedoAuth;
    private validateFreighterAuth;
    private validateRabetAuth;
    private validateLumensAuth;
    private processStellarTransaction;
    private isValidStellarAddress;
    private getWalletVersion;
}
