import { registerAs } from '@nestjs/config';

export default registerAs('kyc', () => ({
  thresholds: {
    none: {
      maxTransaction: parseInt(process.env.KYC_NONE_MAX_TX || '100', 10),
      maxDaily: parseInt(process.env.KYC_NONE_MAX_DAILY || '500', 10),
    },
    basic: {
      maxTransaction: parseInt(process.env.KYC_BASIC_MAX_TX || '1000', 10),
      maxDaily: parseInt(process.env.KYC_BASIC_MAX_DAILY || '5000', 10),
    },
    advanced: {
      maxTransaction: parseInt(process.env.KYC_ADVANCED_MAX_TX || '10000', 10),
      maxDaily: parseInt(process.env.KYC_ADVANCED_MAX_DAILY || '50000', 10),
    },
    premium: {
      maxTransaction: Infinity,
      maxDaily: Infinity,
    },
  },
  storage: {
    s3Bucket: process.env.KYC_S3_BUCKET || 'kyc-documents',
    region: process.env.AWS_REGION || 'us-east-1',
  },
  blockchain: {
    contractAddress: process.env.KYC_CONTRACT_ADDRESS,
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'https://mainnet.infura.io',
    privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY,
  },
  document: {
    maxFileSize: parseInt(process.env.KYC_MAX_FILE_SIZE || '10485760', 10), // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    expirySeconds: parseInt(process.env.KYC_DOC_EXPIRY || '3600', 10),
  },
}));