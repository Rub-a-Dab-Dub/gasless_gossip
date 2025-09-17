import { Injectable, Logger } from '@nestjs/common';
import StellarSdk, {
  Keypair,
  Networks,
  TransactionBuilder,
  Operation,
  BASE_FEE,
  Contract,
  rpc as SorobanRpc,
  xdr,
  Asset,
  rpc
} from '@stellar/stellar-sdk'; 

export interface AccountBalance {
  asset: string;
  balance: string;
  limit?: string;
}

export interface CreateAccountResult {
  publicKey: string;
  secret: string;
  funded: any;
}

export interface NetworkStatus {
  network: string;
  url: string;
  soroban: any;
}

@Injectable()
export class StellarService {
  private readonly logger = new Logger(StellarService.name);
  private server: rpc.Server;
  private soroban: SorobanRpc.Server;
  private networkPassphrase: string;

  constructor() {
  const rpcUrl = process.env.STELLAR_RPC_URL;
  const network = process.env.STELLAR_NETWORK;
  const horizonUrl = process.env.STELLAR_HORIZON_URL; // Add Horizon URL for account data

  if (!rpcUrl || !network) {
    throw new Error('STELLAR_RPC_URL and STELLAR_NETWORK environment variables are required');
  }

  this.server = new rpc.Server(horizonUrl || (network === 'testnet' ? 'https://horizon-testnet.stellar.org' : 'https://horizon.stellar.org'));
  this.soroban = new StellarSdk.rpc.Server(rpcUrl, { allowHttp: true });
  
  // Set network passphrase based on environment
  this.networkPassphrase = network === 'testnet' ? StellarSdk.Networks.TESTNET : StellarSdk.Networks.PUBLIC;
}

  // 🔹 Verify SDK + Soroban with error handling
  async getStatus(): Promise<NetworkStatus> {
    console.log('Getting Stellar network status...');
    console.log('STELLAR_NETWORK:', process.env.STELLAR_NETWORK);
    console.log('STELLAR_RPC_URL:', process.env.STELLAR_RPC_URL);  
    console.log('HORIZON', this.server) 
    
    try {
      return {
        network: process.env.STELLAR_NETWORK!,
        url: process.env.STELLAR_RPC_URL!,
        soroban: await this.soroban.getNetwork(),
      };
    } catch (error) {
      this.logger.error('Failed to get network status', error);
      throw new Error('Unable to connect to Stellar network');
    }
  }

 
  // 🔹 Create new account using friendbot (testnet only)
  async createAccount(): Promise<CreateAccountResult> {
    if (process.env.STELLAR_NETWORK !== 'testnet') {
      throw new Error('Account creation via friendbot is only available on testnet');
    }

    const pair = Keypair.random();
    const friendbotUrl = `${process.env.STELLAR_FRIEND_BOT}?addr=${pair.publicKey()}`;
    
    try {
      const response = await fetch(friendbotUrl);
      
      if (!response.ok) {
        throw new Error(`Friendbot funding failed: ${response.status} ${response.statusText}`);
      }

      const funded = await response.json();
      
      this.logger.log(`Created and funded account: ${pair.publicKey()}`);
      
      return {
        publicKey: pair.publicKey(),
        secret: pair.secret(),
        funded,
      };
    } catch (error) {
      this.logger.error('Account creation failed', error);
      throw error;
    }
  }

}