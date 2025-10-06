export declare class SendChatMessageDto {
    message: string;
    roomId: string;
    privateKey: string;
}
export declare class SubmitIntentDto {
    intentData: string;
    intentType: string;
    privateKey: string;
}
export declare class SponsorUserOpDto {
    to: string;
    data: string;
    value?: string;
    gasLimit?: string;
    privateKey: string;
}
export declare class UserOpRequestDto {
    to: string;
    data: string;
    value?: string;
    gasLimit?: string;
}
export declare class UserOpResponseDto {
    success: boolean;
    userOpHash?: string;
    txHash?: string;
    error?: string;
    gasUsed?: string;
    gasPrice?: string;
}
export declare class PaymasterStatusDto {
    isActive: boolean;
    balance: string;
    network: string;
    chainId: number;
    lastChecked: Date;
}
export declare class RateLimitStatusDto {
    remaining: number;
    resetTime: number;
    limit: number;
}
export declare class GasEstimateDto {
    callGasLimit: string;
    verificationGasLimit: string;
    preVerificationGas: string;
}
