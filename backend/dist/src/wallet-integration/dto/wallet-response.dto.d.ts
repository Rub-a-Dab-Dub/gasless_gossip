import { WalletType, ConnectionStatus } from '../entities/wallet-connection.entity';
export declare class WalletResponseDto {
    id: string;
    userId: string;
    walletType: WalletType;
    address: string;
    status: ConnectionStatus;
    publicKey?: string;
    metadata?: Record<string, any>;
    lastUsedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare class WalletStatsDto {
    totalWallets: number;
    activeWallets: number;
    walletTypes: Record<WalletType, number>;
    lastConnectedAt?: Date;
}
