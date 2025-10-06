export declare enum WalletType {
    FREIGHTER = "freighter",
    ALBEDO = "albedo",
    RABET = "rabet",
    LUMENS = "lumens"
}
export declare enum ConnectionStatus {
    ACTIVE = "active",
    DISCONNECTED = "disconnected",
    PENDING = "pending",
    FAILED = "failed"
}
export declare class WalletConnection {
    id: string;
    userId: string;
    walletType: WalletType;
    address: string;
    status: ConnectionStatus;
    publicKey?: string;
    signature?: string;
    metadata?: Record<string, any>;
    lastUsedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
