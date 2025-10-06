import { KycStatus, VerificationLevel } from '../entities/kyc.entity';
export declare class CreateKycDto {
    userId: string;
    status?: KycStatus;
    verificationLevel?: VerificationLevel;
    notes?: string;
}
