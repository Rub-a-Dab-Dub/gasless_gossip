import { KycStatus, VerificationLevel } from '../entities/kyc.entity';
export declare class UpdateKycStatusDto {
    status: KycStatus;
    verificationLevel?: VerificationLevel;
    rejectionReason?: string;
    notes?: string;
}
