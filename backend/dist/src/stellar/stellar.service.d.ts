import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as StellarSdk from 'stellar-sdk';
export interface StellarAccount {
    publicKey: string;
    secretKey: string;
}
export interface TransactionResult {
    hash: string;
    successful: boolean;
    ledger: number;
    envelope_xdr: string;
}
export interface ContractEvent {
    id: string;
    type: string;
    contractId: string;
    topic: string[];
    value: any;
    ledger: number;
    txHash: string;
}
export declare class StellarService implements OnModuleInit {
    private configService;
    private readonly logger;
    private server;
    private network;
    private networkPassphrase;
    private isInitialized;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private initializeSdk;
    getStatus(): {
        initialized: boolean;
        network: string;
        horizonUrl: string;
    };
    createAccount(): StellarAccount;
    fundTestnetAccount(publicKey: string): Promise<boolean>;
    loadAccount(publicKey: string): Promise<StellarSdk.Horizon.AccountResponse>;
    getAccountBalance(publicKey: string, assetCode?: string): Promise<string>;
    submitTransaction(sourceSecretKey: string, operations: StellarSdk.Operation[], memo?: StellarSdk.Memo): Promise<TransactionResult>;
    sendPayment(sourceSecretKey: string, destinationPublicKey: string, amount: string, memo?: string): Promise<void>;
    sendAsset(sourceSecretKey: string, destinationPublicKey: string, assetCode: string, issuerPublicKey: string, amount: string, memo?: string): Promise<void>;
    listenForContractEvents(contractId: string, eventTypes: string[] | undefined, callback: (event: ContractEvent) => void): Promise<void>;
    executeDummyTransaction(): Promise<{
        success: boolean;
        message: string;
        data?: any;
    }>;
    mintBadgeToken(userId: number, type: string, metadata?: any): Promise<void>;
    distributeReward(userId: string, amount: number): Promise<void>;
    verifyPremiumThemeOwnership(userId: string, themeId: string): Promise<boolean>;
}
