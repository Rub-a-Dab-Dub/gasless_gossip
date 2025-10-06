import { WalletType } from '../entities/wallet-connection.entity';
export declare class ConnectWalletDto {
    walletType: WalletType;
    address: string;
    publicKey?: string;
    signature?: string;
    metadata?: Record<string, any>;
}
