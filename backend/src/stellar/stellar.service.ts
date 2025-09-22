import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as StellarSdk from 'stellar-sdk';

export interface StellarAccount {
  publicKey: string;
  secretKey: string;
}

export interface TransactionResult {
  hash: string;
  successful: boolean;
  ledger: number;
  envelope_xdr: string;
}

export interface ContractEvent {
  id: string;
  type: string;
  contractId: string;
  topic: string[];
  value: any;
  ledger: number;
  txHash: string;
}

@Injectable()
export class StellarService implements OnModuleInit {
  private readonly logger = new Logger(StellarService.name);
  private server: StellarSdk.Horizon.Server;
  private network: string;
  private networkPassphrase: string;
  private isInitialized = false;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeSdk();
  }

  /**
   * Initialize the Stellar SDK with network configuration
   */
  private async initializeSdk(): Promise<void> {
    try {
      this.network = this.configService.get<string>('STELLAR_NETWORK', 'testnet');
      
      if (this.network === 'testnet') {
        this.server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
        this.networkPassphrase = StellarSdk.Networks.TESTNET;
        StellarSdk.Networks.TESTNET;
      } else if (this.network === 'mainnet') {
        this.server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');
        this.networkPassphrase = StellarSdk.Networks.PUBLIC;
      } else {
        throw new Error(`Unsupported network: ${this.network}`);
      }

      // Test connection
      await this.server.ledgers().limit(1).call();
      this.isInitialized = true;
      this.logger.log(`Stellar SDK initialized successfully on ${this.network} network`);
    } catch (error) {
      this.logger.error('Failed to initialize Stellar SDK:', error);
      throw error;
    }
  }

  /**
   * Get SDK initialization status
   */
  getStatus(): { initialized: boolean; network: string; horizonUrl: string } {
    return {
      initialized: this.isInitialized,
      network: this.network,
      horizonUrl: this.server?.serverURL?.toString() || 'Not initialized',
    };
  }

  /**
   * Create a new Stellar account (keypair)
   */
  createAccount(): StellarAccount {
    const keypair = StellarSdk.Keypair.random();
    return {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
    };
  }

  /**
   * Fund a testnet account using Friendbot
   */
  async fundTestnetAccount(publicKey: string): Promise<boolean> {
    if (this.network !== 'testnet') {
      throw new Error('Account funding is only available on testnet');
    }

    try {
      const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`);
      if (response.ok) {
        this.logger.log(`Successfully funded testnet account: ${publicKey}`);
        return true;
      } else {
        this.logger.error(`Failed to fund account: ${response.statusText}`);
        return false;
      }
    } catch (error) {
      this.logger.error('Error funding testnet account:', error);
      return false;
    }
  }

  /**
   * Load account information from Stellar network
   */
  async loadAccount(publicKey: string): Promise<StellarSdk.ServerApi.AccountRecord> {
    try {
      return await this.server.loadAccount(publicKey);
    } catch (error) {
      this.logger.error(`Failed to load account ${publicKey}:`, error);
      throw error;
    }
  }

  /**
   * Get account balance for a specific asset
   */
  async getAccountBalance(publicKey: string, assetCode?: string): Promise<string> {
    try {
      const account = await this.loadAccount(publicKey);
      const balance = account.balances.find(b => 
        assetCode ? b.asset_code === assetCode : b.asset_type === 'native'
      );
      return balance ? balance.balance : '0';
    } catch (error) {
      this.logger.error(`Failed to get balance for ${publicKey}:`, error);
      throw error;
    }
  }

  /**
   * Submit a transaction to the Stellar network
   */
  async submitTransaction(
    sourceSecretKey: string,
    operations: StellarSdk.Operation[],
    memo?: StellarSdk.Memo
  ): Promise<TransactionResult> {
    try {
      const sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
      const sourceAccount = await this.loadAccount(sourceKeypair.publicKey());

      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      });

      // Add operations
      operations.forEach(op => transaction.addOperation(op));

      // Add memo if provided
      if (memo) {
        transaction.addMemo(memo);
      }

      const builtTransaction = transaction.setTimeout(30).build();
      builtTransaction.sign(sourceKeypair);

      const result = await this.server.submitTransaction(builtTransaction);
      
      this.logger.log(`Transaction submitted successfully: ${result.hash}`);
      
      return {
        hash: result.hash,
        successful: result.successful,
        ledger: result.ledger,
        envelope_xdr: result.envelope_xdr,
      };
    } catch (error) {
      this.logger.error('Failed to submit transaction:', error);
      throw error;
    }
  }

  /**
   * Send XLM payment between accounts
   */
  async sendPayment(
    sourceSecretKey: string,
    destinationPublicKey: string,
    amount: string,
    memo?: string
  ): Promise<TransactionResult> {
    const paymentOperation = StellarSdk.Operation.payment({
      destination: destinationPublicKey,
      asset: StellarSdk.Asset.native(),
      amount: amount,
    });

    const memoObj = memo ? StellarSdk.Memo.text(memo) : undefined;

    return this.submitTransaction(sourceSecretKey, [paymentOperation], memoObj);
  }

  /**
   * Create and send a custom asset
   */
  async sendAsset(
    sourceSecretKey: string,
    destinationPublicKey: string,
    assetCode: string,
    issuerPublicKey: string,
    amount: string,
    memo?: string
  ): Promise<TransactionResult> {
    const asset = new StellarSdk.Asset(assetCode, issuerPublicKey);
    const paymentOperation = StellarSdk.Operation.payment({
      destination: destinationPublicKey,
      asset: asset,
      amount: amount,
    });

    const memoObj = memo ? StellarSdk.Memo.text(memo) : undefined;

    return this.submitTransaction(sourceSecretKey, [paymentOperation], memoObj);
  }

  /**
   * Listen for contract events (Soroban)
   */
  async listenForContractEvents(
    contractId: string,
    eventTypes: string[] = [],
    callback: (event: ContractEvent) => void
  ): Promise<void> {
    try {
      this.logger.log(`Starting to listen for events from contract: ${contractId}`);
      
      // Note: This is a simplified implementation
      // In a real implementation, you would use Stellar's event streaming
      const eventStream = this.server
        .effects()
        .cursor('now')
        .stream({
          onmessage: (effect: any) => {
            // Filter for contract-related effects
            if (effect.type_i === 33) { // Contract event type
              const event: ContractEvent = {
                id: effect.id,
                type: effect.type,
                contractId: contractId,
                topic: effect.topic || [],
                value: effect.value,
                ledger: effect.ledger,
                txHash: effect.transaction_hash,
              };

              if (eventTypes.length === 0 || eventTypes.includes(event.type)) {
                callback(event);
              }
            }
          },
          onerror: (error: any) => {
            this.logger.error('Error in contract event stream:', error);
          },
        });

      // Store the stream reference for cleanup if needed
      return eventStream;
    } catch (error) {
      this.logger.error('Failed to start contract event listener:', error);
      throw error;
    }
  }

  /**
   * Execute a dummy transaction for testing
   */
  async executeDummyTransaction(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      // Create a test account
      const testAccount = this.createAccount();
      
      if (this.network === 'testnet') {
        // Fund the account on testnet
        const funded = await this.fundTestnetAccount(testAccount.publicKey);
        if (!funded) {
          return {
            success: false,
            message: 'Failed to fund test account',
          };
        }

        // Wait a moment for the account to be created
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Query the account balance
        const balance = await this.getAccountBalance(testAccount.publicKey);
        
        return {
          success: true,
          message: 'Dummy transaction executed successfully',
          data: {
            accountCreated: testAccount.publicKey,
            balance: balance,
            network: this.network,
          },
        };
      } else {
        // On mainnet, just return account creation info
        return {
          success: true,
          message: 'Dummy transaction executed successfully (account created only)',
          data: {
            accountCreated: testAccount.publicKey,
            network: this.network,
            note: 'Account not funded on mainnet',
          },
        };
      }
    } catch (error) {
      this.logger.error('Dummy transaction failed:', error);
      return {
        success: false,
        message: `Dummy transaction failed: ${error.message}`,
      };
    }
  }

  /**
   * Mint a badge token for a user on Stellar
   */
  async mintBadgeToken(
    userId!: number,
    type!: string,
    metadata?: any,
  ): Promise<void> {
    // TODO: Implement actual Stellar asset minting logic here
    // Example: create a custom asset and send it to the user's Stellar account
    // You may need to map userId to a Stellar public key
    this.logger.log(
      `Minted badge token for user ${userId}: ${type} with metadata ${JSON.stringify(metadata)}`,
    );
  }

  /**
   * Distribute reward tokens to a user on Stellar
   */
  async distributeReward(userId: string, amount: number): Promise<void> {
    // TODO: Implement actual Stellar token distribution logic here
    // Example: send custom tokens to the user's Stellar account
    // You may need to map userId to a Stellar public key
    this.logger.log(`Distributed ${amount} reward tokens to user ${userId}`);

    // Mock implementation - in production, this would:
    // 1. Get user's Stellar public key from their profile
    // 2. Create a transaction to send tokens to their account
    // 3. Sign and submit the transaction
    // 4. Return the transaction hash for tracking
  }

  /**
   * Check if a user owns a premium theme token
   */
  async verifyPremiumThemeOwnership(userId: string, themeId: string): Promise<boolean> {
    // TODO: Implement actual Stellar token ownership check
    // Example: query the user's Stellar account for specific theme tokens
    // For now, mock: assume 'premium' themes require ownership
    if (themeId.startsWith('premium-')) {
      this.logger.log(`Verifying premium theme ownership for user ${userId}, theme ${themeId}`);
      // Mock: return true for demo purposes
      return true;
    }
    return false;
  }
}
    return true; // Free themes always allowed
  }
}
