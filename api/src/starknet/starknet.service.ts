import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Contract,
  Account,
  RpcProvider,
  CallData,
  cairo,
  uint256,
  constants,
} from 'starknet';
import {
  StarknetConnectionException,
  StarknetTransactionException,
  StarknetContractException,
} from './exceptions/starknet.exceptions';
import { RetryUtil } from './utils/retry.util';
import { ContractCallResult, TransactionStatus } from './types/starknet.types';

@Injectable()
export class StarknetService implements OnModuleInit {
  private readonly logger = new Logger(StarknetService.name);
  private provider: RpcProvider;
  private account: Account;
  private contract: Contract;
  private readonly maxRetries: number;
  private readonly retryDelayMs: number;

  constructor(private configService: ConfigService) {
    this.maxRetries =
      this.configService.get<number>('starknet.maxRetries') ?? 3;
    this.retryDelayMs =
      this.configService.get<number>('starknet.retryDelayMs') ?? 2000;
  }

  async onModuleInit() {
    await this.initialize();
    const abi = this.configService.get<any[]>('starknet.contractAbi') ?? null;
    if (abi) {
      await this.initializeContract(abi);
    }
  }

  private async initialize(): Promise<void> {
    try {
      this.logger.log('Initializing StarkNet connection...');
      const {
        rpcUrl,
        accountAddress,
        privateKey,
        contractAddress,
        contractAbi,
        txVersion,
      } = this.configService.get('starknet');

      if (!rpcUrl || !accountAddress || !privateKey || !contractAddress) {
        throw new Error('Missing required StarkNet configuration');
      }

      // Initialize provider
      this.provider = new RpcProvider({ nodeUrl: rpcUrl });

      // Initialize account
      this.account = new Account(
        this.provider,
        accountAddress,
        privateKey,
        txVersion,
      );

      // Test connection
      await this.testConnection();

      this.logger.log('StarkNet connection initialized successfully');
    } catch (error) {
      this.logger.error(
        'Failed to initialize StarkNet connection',
        error.stack,
      );
      throw new StarknetConnectionException(error.message);
    }
  }

  private async testConnection(): Promise<void> {
    try {
      await RetryUtil.withRetry(
        async () => await this.provider.getBlockNumber(),
        this.maxRetries,
        this.retryDelayMs,
        'Connection Test',
      );
    } catch (error) {
      throw new StarknetConnectionException(
        'Unable to connect to StarkNet network',
      );
    }
  }

  /**
   * Initialize contract with ABI
   */
  async initializeContract(abi: any[]): Promise<void> {
    try {
      const contractAddress = this.configService.get<string>(
        'starknet.contractAddress',
      );
      if (!contractAddress)
        throw new StarknetContractException('Contract Address is required');
      this.contract = new Contract(abi, contractAddress, this.provider);
      this.contract.connect(this.account);
      this.logger.log(`Contract initialized at ${contractAddress}`);
    } catch (error) {
      this.logger.error('Failed to initialize contract', error.stack);
      throw new StarknetContractException(error.message);
    }
  }

  /**
   * Read from contract (no transaction required)
   */
  async read(
    functionName: string,
    args: any[] = [],
  ): Promise<ContractCallResult> {
    try {
      this.validateContract();

      this.logger.log(`Reading from contract: ${functionName}`);

      const result = await RetryUtil.withRetry(
        async () => await this.contract[functionName](...args),
        this.maxRetries,
        this.retryDelayMs,
        `Read ${functionName}`,
      );

      this.logger.log(`Successfully read from ${functionName}`);

      return {
        success: true,
        message: 'OK',
        data: this.formatResult(result),
      };
    } catch (error: any) {
      const msg = error?.message ?? '';
      const reason = this.extractRevertReason(msg);

      this.logger.warn(`[Contract Error] ${reason}`);

      return {
        success: false,
        message: reason,
        data: null,
      };
    }
  }

  /**
   * Write to contract (creates transaction)
   */
  async write(
    functionName: string,
    args: any[] = [],
  ): Promise<ContractCallResult> {
    try {
      this.validateContract();

      this.logger.log(`🟢 Writing to contract: ${functionName}`);
      this.logger.debug(`📦 Call args: ${JSON.stringify(args)}`);

      // Build call object for V3 transaction
      const call = {
        contractAddress: this.contract.address,
        entrypoint: functionName,
        calldata: args,
      };

      // Execute with retry and proper resource bounds
      const result = await RetryUtil.withRetry(
        async () =>
          await this.account.execute(call, undefined, {
            version: constants.TRANSACTION_VERSION.V3,
          }),
        this.maxRetries,
        this.retryDelayMs,
        `Write ${functionName}`,
      );

      // Extract tx hash
      const transactionHash = result.transaction_hash;
      this.logger.log(`✅ Transaction submitted: ${transactionHash}`);

      // Wait for confirmation
      await this.waitForTransaction(transactionHash);

      return {
        success: true,
        transactionHash,
        data: this.formatResult(result),
      };
    } catch (error: any) {
      const msg = error?.message || 'Unknown error';
      this.logger.error(`❌ Failed to write ${functionName}: ${msg}`);
      this.logger.debug(error.stack);
      throw new StarknetTransactionException(msg);
    }
  }

  /**
   * Execute multiple calls in a single transaction
   */
  async multiCall(
    calls: Array<{
      contractAddress: string;
      entrypoint: string;
      calldata: any[];
    }>,
  ): Promise<ContractCallResult> {
    try {
      this.logger.log(`Executing multi-call with ${calls.length} calls`);

      const result = await RetryUtil.withRetry(
        async () => await this.account.execute(calls),
        this.maxRetries,
        this.retryDelayMs,
        'Multi-call',
      );

      const transactionHash = result.transaction_hash;
      this.logger.log(`Multi-call transaction submitted: ${transactionHash}`);

      await this.waitForTransaction(transactionHash);

      return {
        success: true,
        transactionHash,
      };
    } catch (error) {
      this.logger.error('Failed to execute multi-call:', error.stack);
      throw new StarknetTransactionException(error.message);
    }
  }

  /**
   * Wait for transaction to be accepted
   */
  async waitForTransaction(
    transactionHash: string,
    timeout: number = 300000,
  ): Promise<void> {
    try {
      this.logger.log(`Waiting for transaction: ${transactionHash}`);

      const startTime = Date.now();

      while (Date.now() - startTime < timeout) {
        const receipt =
          await this.provider.getTransactionReceipt(transactionHash);

        // Check if receipt is successful (not rejected)
        if ('execution_status' in receipt) {
          if (receipt.execution_status === 'SUCCEEDED') {
            this.logger.log(`Transaction ${transactionHash} succeeded`);
            return;
          }

          if (receipt.execution_status === 'REVERTED') {
            const revertReason =
              'revert_reason' in receipt
                ? receipt.revert_reason
                : 'Unknown reason';
            throw new Error(
              `Transaction reverted: ${transactionHash}. Reason: ${revertReason}`,
            );
          }
        }

        // Check finality status
        if (
          'finality_status' in receipt &&
          receipt.finality_status === 'ACCEPTED_ON_L1'
        ) {
          this.logger.log(`Transaction ${transactionHash} accepted on L1`);
          return;
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
      }

      throw new Error(`Transaction timeout: ${transactionHash}`);
    } catch (error) {
      this.logger.error(`Transaction wait failed:`, error.stack);
      throw new StarknetTransactionException(error.message);
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(
    transactionHash: string,
  ): Promise<TransactionStatus> {
    try {
      const receipt =
        await this.provider.getTransactionReceipt(transactionHash);

      let status: TransactionStatus['status'] = 'PENDING';
      let blockNumber: number | undefined;
      let blockHash: string | undefined;

      if ('execution_status' in receipt) {
        if (receipt.execution_status === 'SUCCEEDED') {
          status = 'ACCEPTED_ON_L2';
        } else if (receipt.execution_status === 'REVERTED') {
          status = 'REJECTED';
        }
      }

      if ('finality_status' in receipt) {
        if (receipt.finality_status === 'ACCEPTED_ON_L1') {
          status = 'ACCEPTED_ON_L1';
        } else if (receipt.finality_status === 'ACCEPTED_ON_L2') {
          status = 'ACCEPTED_ON_L2';
        }
      }

      // Extract block info if available
      if (
        'block_number' in receipt &&
        typeof receipt.block_number === 'number'
      ) {
        blockNumber = receipt.block_number;
      }

      if ('block_hash' in receipt && typeof receipt.block_hash === 'string') {
        blockHash = receipt.block_hash;
      }

      return {
        status,
        transactionHash,
        blockNumber,
        blockHash,
      };
    } catch (error) {
      this.logger.error(`Failed to get transaction status:`, error.stack);
      throw new StarknetTransactionException(error.message);
    }
  }

  /**
   * Utility: Convert Cairo uint256 to BigInt
   */
  uint256ToBigInt(uint256: any): bigint {
    return uint256.toBigInt();
  }

  /**
   * Utility: Convert BigInt to Cairo uint256
   */
  bigIntToUint256(value: bigint): any {
    return cairo.uint256(value);
  }

  /**
   * Utility: Validate contract is initialized
   */
  private validateContract(): void {
    if (!this.contract) {
      throw new StarknetContractException(
        'Contract not initialized. Call initializeContract first.',
      );
    }
  }

  /**
   * Format result for response
   */
  private formatResult(result: any): any {
    if (typeof result === 'bigint') {
      return result.toString();
    }

    if (Array.isArray(result)) {
      return result.map((item) => this.formatResult(item));
    }

    if (typeof result === 'object' && result !== null) {
      const formatted: any = {};
      for (const [key, value] of Object.entries(result)) {
        formatted[key] = this.formatResult(value);
      }
      return formatted;
    }

    return result;
  }

  private extractRevertReason(msg: string): string {
    const match = msg.match(/\('([^']+)'\)/);
    return match ? match[1] : 'Contract reverted';
  }

  /**
   * Get current block number
   */
  async getBlockNumber(): Promise<number> {
    try {
      return await this.provider.getBlockNumber();
    } catch (error) {
      throw new StarknetConnectionException('Failed to get block number');
    }
  }

  /**
   * Get account balance
   */
  async getBalance(address?: string): Promise<string> {
    try {
      const targetAddress = address || this.account.address;

      // Use ETH token contract to get balance
      const ETH_TOKEN_ADDRESS =
        '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';

      const result = await this.provider.callContract({
        contractAddress: ETH_TOKEN_ADDRESS,
        entrypoint: 'balanceOf',
        calldata: [targetAddress],
      });

      // Convert result to BigInt and then to string
      const balance = uint256.uint256ToBN({ low: result[0], high: result[1] });
      return balance.toString();
    } catch (error) {
      throw new StarknetConnectionException('Failed to get balance');
    }
  }
}
