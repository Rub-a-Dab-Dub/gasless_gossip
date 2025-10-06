import { Kyc, KycStatus } from './kyc.entity';
export declare enum AuditAction {
    CREATED = "created",
    STATUS_CHANGED = "status_changed",
    DOCUMENT_UPLOADED = "document_uploaded",
    VERIFIED_ON_CHAIN = "verified_on_chain",
    FLAGGED = "flagged",
    BULK_UPDATED = "bulk_updated"
}
export declare class KycAudit {
    id: string;
    kycId: string;
    action: AuditAction;
    oldStatus: KycStatus;
    newStatus: KycStatus;
    performedBy: string;
    metadata: Record<string, any>;
    notes: string;
    createdAt: Date;
    kyc: Kyc;
}
