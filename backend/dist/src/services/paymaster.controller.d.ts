import { PaymasterService, PaymasterStatus } from './paymaster.service';
import { SendChatMessageDto, SubmitIntentDto, SponsorUserOpDto, UserOpRequestDto, UserOpResponseDto, PaymasterStatusDto, RateLimitStatusDto, GasEstimateDto } from './dto/paymaster.dto';
export declare class PaymasterController {
    private readonly paymasterService;
    constructor(paymasterService: PaymasterService);
    sponsorUserOperation(sponsorDto: SponsorUserOpDto, req: any): Promise<UserOpResponseDto>;
    sendGaslessChatMessage(chatDto: SendChatMessageDto, req: any): Promise<UserOpResponseDto>;
    submitGaslessIntent(intentDto: SubmitIntentDto, req: any): Promise<UserOpResponseDto>;
    getPaymasterStatus(): Promise<PaymasterStatusDto>;
    canSponsor(): Promise<{
        canSponsor: boolean;
    }>;
    getRateLimitStatus(userId: string): Promise<RateLimitStatusDto>;
    estimateGas(userOpRequest: UserOpRequestDto): Promise<GasEstimateDto>;
    testBaseSepolia(): Promise<{
        network: string;
        chainId: number;
        rpcUrl: string;
        paymasterStatus: PaymasterStatus;
        canSponsor: boolean;
        testPassed: boolean;
        timestamp: string;
    }>;
}
