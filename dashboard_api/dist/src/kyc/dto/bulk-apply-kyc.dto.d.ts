import { KycStatus, VerificationLevel } from '../entities/kyc.entity';
export declare class BulkApplyKycDto {
    userIds: string[];
    status: KycStatus;
    verificationLevel?: VerificationLevel;
    notes?: string;
}
