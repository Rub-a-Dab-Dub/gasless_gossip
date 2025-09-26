export interface StellarRewardConfig {
  baseReward: number;
  assetCode: string;
  issuerPublicKey: string;
  distributorSecretKey: string;
}

export interface StellarTransactionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}
