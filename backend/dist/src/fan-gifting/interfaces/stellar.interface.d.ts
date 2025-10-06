export interface StellarTransferResult {
    success: boolean;
    transactionId?: string;
    error?: string;
    ledger?: number;
}
export interface StellarAccount {
    publicKey: string;
    secretKey?: string;
}
