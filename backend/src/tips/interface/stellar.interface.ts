export interface StellarTransaction {
    hash: string;
    amount: string;
    from: string;
    to: string;
    timestamp: Date;
  }
  
  export interface StellarTransferRequest {
    amount: number;
    receiverPublicKey: string;
    senderPrivateKey: string;
    memo?: string;
  }