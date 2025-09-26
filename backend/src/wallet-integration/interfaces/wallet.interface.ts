export interface WalletAuthResult {
  success: boolean;
  address?: string;
  publicKey?: string;
  signature?: string;
  error?: string;
}

export interface StellarTransactionResult {
  success: boolean;
  transactionId?: string;
  ledger?: number;
  error?: string;
}

export interface WalletBalance {
  assetCode: string;
  balance: string;
  limit?: string;
}

export interface AlbedoAuthData {
  address: string;
  publicKey: string;
  signature: string;
  message: string;
}

export interface WalletConnectionInfo {
  id: string;
  walletType: string;
  address: string;
  status: string;
  lastUsedAt?: Date;
  createdAt: Date;
}
