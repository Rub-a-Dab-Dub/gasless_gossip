import { WalletIntegrationService } from './services/wallet-integration.service';
import { ConnectWalletDto } from './dto/connect-wallet.dto';
import { TransactionRequestDto } from './dto/transaction-request.dto';
import { WalletResponseDto, WalletStatsDto } from './dto/wallet-response.dto';
export declare class WalletIntegrationController {
    private readonly walletIntegrationService;
    constructor(walletIntegrationService: WalletIntegrationService);
    connectWallet(req: any, connectWalletDto: ConnectWalletDto): Promise<WalletResponseDto>;
    getUserWallets(req: any): Promise<WalletResponseDto[]>;
    getWalletStats(req: any): Promise<WalletStatsDto>;
    getWalletById(req: any, walletId: string): Promise<WalletResponseDto>;
    getWalletBalance(req: any, walletId: string): Promise<import("./interfaces/wallet.interface").WalletBalance[]>;
    sendTransaction(req: any, walletId: string, transactionDto: TransactionRequestDto): Promise<import("./interfaces/wallet.interface").StellarTransactionResult>;
    disconnectWallet(req: any, walletId: string): Promise<void>;
}
