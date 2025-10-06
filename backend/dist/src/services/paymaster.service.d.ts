import { ConfigService } from '@nestjs/config';
import { BiconomySmartAccountV2 } from '@biconomy/account';
export interface UserOpRequest {
    to: string;
    data: string;
    value?: string;
    gasLimit?: string;
}
export interface UserOpResponse {
    success: boolean;
    userOpHash?: string;
    txHash?: string;
    error?: string;
    gasUsed?: string;
    gasPrice?: string;
}
export interface PaymasterStatus {
    isActive: boolean;
    balance: string;
    network: string;
    chainId: number;
    lastChecked: Date;
}
export declare class PaymasterService {
    private readonly configService;
    private readonly logger;
    private readonly bundler;
    private readonly paymaster;
    private readonly provider;
    private readonly chainId;
    private readonly entryPointAddress;
    private readonly accountFactoryAddress;
    private readonly biconomyApiKey;
    private readonly paymasterApiKey;
    private readonly bundlerUrl;
    private readonly paymasterUrl;
    private readonly rpcUrl;
    private readonly isTestnet;
    private readonly rateLimitMap;
    private readonly maxUserOpsPerMinute;
    constructor(configService: ConfigService);
    createSmartAccount(privateKey: string): Promise<BiconomySmartAccountV2>;
    sponsorUserOperation(smartAccount: BiconomySmartAccountV2, userOpRequest: UserOpRequest, userId: string): Promise<UserOpResponse>;
    sendGaslessChatMessage(smartAccount: BiconomySmartAccountV2, messageData: string, roomId: string, userId: string): Promise<UserOpResponse>;
    submitGaslessIntent(smartAccount: BiconomySmartAccountV2, intentData: string, intentType: string, userId: string): Promise<UserOpResponse>;
    getPaymasterStatus(): Promise<PaymasterStatus>;
    canSponsor(): Promise<boolean>;
    estimateGas(userOpRequest: UserOpRequest): Promise<{
        callGasLimit: string;
        verificationGasLimit: string;
        preVerificationGas: string;
    }>;
    private checkRateLimit;
    getRateLimitStatus(userId: string): {
        remaining: number;
        resetTime: number;
        limit: number;
    };
    cleanupRateLimits(): void;
}
