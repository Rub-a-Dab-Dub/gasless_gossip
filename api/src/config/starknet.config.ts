import { registerAs } from '@nestjs/config';
import { constants } from 'starknet';

export default registerAs('starknet', () => ({
  rpcUrl: process.env.STARKNET_RPC_URL,
  accountAddress: process.env.STARKNET_ACCOUNT_ADDRESS,
  privateKey: process.env.STARKNET_PRIVATE_KEY,
  contractAddress: process.env.STARKNET_CONTRACT_ADDRESS,
  network: process.env.STARKNET_NETWORK || 'mainnet-alpha',
  maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
  retryDelayMs: parseInt(process.env.RETRY_DELAY_MS || '2000', 10),
  txVersion: constants.TRANSACTION_VERSION.V3,
}));
