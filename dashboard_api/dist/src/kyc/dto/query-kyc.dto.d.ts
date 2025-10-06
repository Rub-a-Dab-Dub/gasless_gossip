import { KycStatus, VerificationLevel } from '../entities/kyc.entity';
export declare class QueryKycDto {
    page?: number;
    limit?: number;
    status?: KycStatus;
    verificationLevel?: VerificationLevel;
    userId?: string;
    reviewedBy?: string;
}
