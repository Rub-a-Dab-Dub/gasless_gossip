import { StellarService } from './stellar.service';
export declare class StellarController {
    private readonly stellarService;
    constructor(stellarService: StellarService);
    getStatus(): {
        initialized: boolean;
        network: string;
        horizonUrl: string;
    };
    getAccount(publicKey: string): Promise<{
        publicKey: string;
        balances: (import("node_modules/stellar-sdk/lib/horizon").HorizonApi.BalanceLineNative | import("node_modules/stellar-sdk/lib/horizon").HorizonApi.BalanceLineAsset<"credit_alphanum4"> | import("node_modules/stellar-sdk/lib/horizon").HorizonApi.BalanceLineAsset<"credit_alphanum12"> | import("node_modules/stellar-sdk/lib/horizon").HorizonApi.BalanceLineLiquidityPool)[];
        sequence: string;
        subentryCount: number;
        error?: undefined;
    } | {
        error: any;
        publicKey?: undefined;
        balances?: undefined;
        sequence?: undefined;
        subentryCount?: undefined;
    }>;
    getAccountBalance(publicKey: string, assetCode?: string): Promise<{
        balance: string;
        assetCode: string;
        error?: undefined;
    } | {
        error: any;
        balance?: undefined;
        assetCode?: undefined;
    }>;
    createKeypair(): import("./stellar.service").StellarAccount;
    fundTestnetAccount(publicKey: string): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        error: any;
        success?: undefined;
        message?: undefined;
    }>;
    sendPayment(body: {
        sourceSecretKey: string;
        destinationPublicKey: string;
        amount: string;
        memo?: string;
    }): Promise<{
        success: boolean;
        transaction: void;
        error?: undefined;
    } | {
        error: any;
        success?: undefined;
        transaction?: undefined;
    }>;
    testTransaction(): Promise<{
        success: boolean;
        message: string;
        data?: any;
    }>;
}
