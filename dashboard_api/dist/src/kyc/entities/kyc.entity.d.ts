import { KycAudit } from './kyc-audit.entity';
export declare enum KycStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    FLAGGED = "flagged"
}
export declare enum VerificationLevel {
    NONE = 0,
    BASIC = 1,
    ADVANCED = 2,
    PREMIUM = 3
}
export declare class Kyc {
    id: string;
    userId: string;
    status: KycStatus;
    verificationLevel: VerificationLevel;
    documents: {
        type: string;
        url: string;
        hash: string;
        uploadedAt: string;
    }[];
    blockchainProof: string;
    onChainTxHash: string;
    isVerifiedOnChain: boolean;
    rejectionReason: string;
    reviewedBy: string;
    reviewedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    audits: KycAudit[];
}
