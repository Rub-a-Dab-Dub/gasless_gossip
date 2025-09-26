import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Server, Asset, Networks } from 'stellar-sdk';

@Injectable()
export class StellarService {
  private readonly logger = new Logger(StellarService.name);
  private server: Server;
  private networkPassphrase: string;

  constructor(private configService: ConfigService) {
    const horizonUrl = this.configService.get<string>('STELLAR_HORIZON_URL');
    const network = this.configService.get<string>('STELLAR_NETWORK');
    
    this.server = new Server(horizonUrl);
    this.networkPassphrase = network === 'testnet' 
      ? Networks.TESTNET 
      : Networks.PUBLIC;
      
    this.logger.log(`Stellar service initialized for ${network} network`);
  }

  async validateTransaction(transactionId: string): Promise<boolean> {
    try {
      const transaction = await this.server.transactions().transaction(transactionId).call();
      return transaction.successful;
    } catch (error) {
      this.logger.error(`Failed to validate transaction ${transactionId}: ${error.message}`);
      return false;
    }
  }

  async getAccountDetails(accountId: string): Promise<any> {
    try {
      const account = await this.server.loadAccount(accountId);
      return {
        id: account.id,
        sequence: account.sequence,
        balances: account.balances,
        signers: account.signers,
      };
    } catch (error) {
      this.logger.error(`Failed to get account details for ${accountId}: ${error.message}`);
      throw error;
    }
  }

  async getTransactionDetails(transactionId: string): Promise<any> {
    try {
      const transaction = await this.server.transactions().transaction(transactionId).call();
      const operations = await this.server.operations().forTransaction(transactionId).call();
      
      return {
        id: transaction.id,
        hash: transaction.hash,
        successful: transaction.successful,
        ledger: transaction.ledger,
        createdAt: transaction.created_at,
        sourceAccount: transaction.source_account,
        operations: operations.records,
      };
    } catch (error) {
      this.logger.error(`Failed to get transaction details for ${transactionId}: ${error.message}`);
      throw error;
    }
  }

  getNetworkPassphrase(): string {
    return this.networkPassphrase;
  }
}