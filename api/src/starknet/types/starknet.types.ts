export interface ContractCallResult {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
  transactionHash?: string;
}

export interface TransactionStatus {
  status: 'PENDING' | 'ACCEPTED_ON_L2' | 'ACCEPTED_ON_L1' | 'REJECTED';
  transactionHash: string;
  blockNumber?: number;
  blockHash?: string;
}

export enum TransactionState {
  PENDING = 'PENDING',
  ACCEPTED_ON_L2 = 'ACCEPTED_ON_L2',
  ACCEPTED_ON_L1 = 'ACCEPTED_ON_L1',
  REJECTED = 'REJECTED',
}
