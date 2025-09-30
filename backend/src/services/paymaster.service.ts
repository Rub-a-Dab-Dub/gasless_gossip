import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { 
  BiconomySmartAccountV2, 
  createSmartAccountClient, 
  PaymasterMode,
  IHybridPaymaster,
  SponsorUserOperationDto,
  IPaymaster,
  BiconomyPaymaster
} from '@biconomy/account';
import { 
  Bundler, 
  IBundler,
  UserOperationResponse,
  UserOperationReceipt
} from '@biconomy/bundler';
import { ethers } from 'ethers';
import { ChainId } from '@biconomy/core-types';

export interface UserOpRequest {
  to: string;
  data: string;
  value?: string;
  gasLimit?: string;
}

export interface UserOpResponse {
  success: boolean;
  userOpHash?: string;
  txHash?: string;
  error?: string;
  gasUsed?: string;
  gasPrice?: string;
}

export interface PaymasterStatus {
  isActive: boolean;
  balance: string;
  network: string;
  chainId: number;
  lastChecked: Date;
}

@Injectable()
export class PaymasterService {
  private readonly logger = new Logger(PaymasterService.name);
  private readonly bundler: IBundler;
  private readonly paymaster: IPaymaster;
  private readonly provider: ethers.JsonRpcProvider;
  private readonly chainId: ChainId;
  private readonly entryPointAddress: string;
  private readonly accountFactoryAddress: string;
  private readonly biconomyApiKey: string;
  private readonly paymasterApiKey: string;
  private readonly bundlerUrl: string;
  private readonly paymasterUrl: string;
  private readonly rpcUrl: string;
  private readonly isTestnet: boolean;
  private readonly rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  private readonly maxUserOpsPerMinute = 100;

  constructor(private readonly configService: ConfigService) {
    // Configuration
    this.isTestnet = this.configService.get<string>('NODE_ENV') !== 'production';
    this.chainId = this.isTestnet ? ChainId.BASE_SEPOLIA_TESTNET : ChainId.BASE_MAINNET;
    this.rpcUrl = this.configService.get<string>('BASE_RPC_URL', 'https://sepolia.base.org');
    this.biconomyApiKey = this.configService.get<string>('BICONOMY_API_KEY');
    this.paymasterApiKey = this.configService.get<string>('BICONOMY_PAYMASTER_API_KEY');
    
    if (!this.biconomyApiKey || !this.paymasterApiKey) {
      throw new Error('Biconomy API keys are required');
    }

    // URLs for different environments
    this.bundlerUrl = this.isTestnet 
      ? `https://bundler.biconomy.io/api/v2/${this.chainId}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`
      : `https://bundler.biconomy.io/api/v2/${this.chainId}/${this.biconomyApiKey}`;
    
    this.paymasterUrl = this.isTestnet
      ? `https://paymaster.biconomy.io/api/v2/${this.chainId}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`
      : `https://paymaster.biconomy.io/api/v2/${this.chainId}/${this.paymasterApiKey}`;

    // Entry point and account factory addresses for Base
    this.entryPointAddress = this.isTestnet 
      ? '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789' // Base Sepolia
      : '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'; // Base Mainnet
    
    this.accountFactoryAddress = this.isTestnet
      ? '0x9406Cc1155c5fbe1f4A56D8D4d4C4Da4e4f4f4f4' // Base Sepolia (placeholder)
      : '0x9406Cc1155c5fbe1f4A56D8D4d4C4Da4e4f4f4f4'; // Base Mainnet (placeholder)

    // Initialize provider
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);

    // Initialize Biconomy services
    this.bundler = new Bundler({
      bundlerUrl: this.bundlerUrl,
      chainId: this.chainId,
      entryPointAddress: this.entryPointAddress,
    });

    this.paymaster = new BiconomyPaymaster({
      paymasterUrl: this.paymasterUrl,
      strictMode: true,
    });

    this.logger.log(`PaymasterService initialized for ${this.isTestnet ? 'Base Sepolia' : 'Base Mainnet'} (Chain ID: ${this.chainId})`);
  }

  /**
   * Create a smart account for a user
   */
  async createSmartAccount(privateKey: string): Promise<BiconomySmartAccountV2> {
    try {
      const provider = new ethers.Wallet(privateKey, this.provider);
      
      const smartAccount = await createSmartAccountClient({
        signer: provider,
        bundlerUrl: this.bundlerUrl,
        paymasterUrl: this.paymasterUrl,
        entryPointAddress: this.entryPointAddress,
        chainId: this.chainId,
      });

      this.logger.log(`Smart account created: ${await smartAccount.getAccountAddress()}`);
      return smartAccount;
    } catch (error) {
      this.logger.error('Failed to create smart account:', error);
      throw new InternalServerErrorException('Failed to create smart account');
    }
  }

  /**
   * Sponsor a UserOperation for gasless transactions
   */
  async sponsorUserOperation(
    smartAccount: BiconomySmartAccountV2,
    userOpRequest: UserOpRequest,
    userId: string
  ): Promise<UserOpResponse> {
    try {
      // Rate limiting check
      if (!this.checkRateLimit(userId)) {
        throw new BadRequestException('Rate limit exceeded. Maximum 100 UserOps per minute.');
      }

      // Build the UserOperation
      const userOp = await smartAccount.buildUserOperation([{
        to: userOpRequest.to,
        data: userOpRequest.data,
        value: userOpRequest.value || '0',
      }]);

      // Set gas limits if provided
      if (userOpRequest.gasLimit) {
        userOp.callGasLimit = userOpRequest.gasLimit;
      }

      // Get paymaster and data
      const biconomyPaymaster = smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;
      
      // Get paymaster data for sponsoring
      const paymasterAndDataResponse = await biconomyPaymaster.getPaymasterAndData(userOp, PaymasterMode.SPONSORED);
      
      if (paymasterAndDataResponse) {
        userOp.paymasterAndData = paymasterAndDataResponse.paymasterAndData;
      }

      // Send the UserOperation
      const userOpResponse = await smartAccount.sendUserOperation(userOp);
      
      this.logger.log(`UserOperation sent: ${userOpResponse.userOpHash}`);

      // Wait for the transaction to be mined
      const transactionDetails = await userOpResponse.wait();

      this.logger.log(`UserOperation completed: ${transactionDetails.receipt.transactionHash}`);

      return {
        success: true,
        userOpHash: userOpResponse.userOpHash,
        txHash: transactionDetails.receipt.transactionHash,
        gasUsed: transactionDetails.receipt.gasUsed?.toString(),
        gasPrice: transactionDetails.receipt.gasPrice?.toString(),
      };
    } catch (error) {
      this.logger.error('Failed to sponsor UserOperation:', error);
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  /**
   * Send a gasless chat message
   */
  async sendGaslessChatMessage(
    smartAccount: BiconomySmartAccountV2,
    messageData: string,
    roomId: string,
    userId: string
  ): Promise<UserOpResponse> {
    try {
      // Encode the chat message data
      const chatInterface = new ethers.Interface([
        'function sendMessage(string memory message, string memory roomId) external'
      ]);
      
      const data = chatInterface.encodeFunctionData('sendMessage', [messageData, roomId]);
      
      // For now, we'll use a mock contract address
      // In production, this would be your actual chat contract address
      const chatContractAddress = this.isTestnet 
        ? '0x1234567890123456789012345678901234567890' // Mock Base Sepolia address
        : '0x1234567890123456789012345678901234567890'; // Mock Base Mainnet address

      return await this.sponsorUserOperation(
        smartAccount,
        {
          to: chatContractAddress,
          data: data,
          value: '0',
        },
        userId
      );
    } catch (error) {
      this.logger.error('Failed to send gasless chat message:', error);
      return {
        success: false,
        error: error.message || 'Failed to send gasless chat message',
      };
    }
  }

  /**
   * Submit a gasless intent
   */
  async submitGaslessIntent(
    smartAccount: BiconomySmartAccountV2,
    intentData: string,
    intentType: string,
    userId: string
  ): Promise<UserOpResponse> {
    try {
      // Encode the intent data
      const intentInterface = new ethers.Interface([
        'function submitIntent(string memory intentData, string memory intentType) external'
      ]);
      
      const data = intentInterface.encodeFunctionData('submitIntent', [intentData, intentType]);
      
      // Mock intent contract address
      const intentContractAddress = this.isTestnet 
        ? '0x2345678901234567890123456789012345678901' // Mock Base Sepolia address
        : '0x2345678901234567890123456789012345678901'; // Mock Base Mainnet address

      return await this.sponsorUserOperation(
        smartAccount,
        {
          to: intentContractAddress,
          data: data,
          value: '0',
        },
        userId
      );
    } catch (error) {
      this.logger.error('Failed to submit gasless intent:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit gasless intent',
      };
    }
  }

  /**
   * Get paymaster status and balance
   */
  async getPaymasterStatus(): Promise<PaymasterStatus> {
    try {
      // Get paymaster balance (this would be the actual paymaster contract balance)
      const balance = await this.provider.getBalance(this.paymasterUrl);
      
      return {
        isActive: true,
        balance: ethers.formatEther(balance),
        network: this.isTestnet ? 'base-sepolia' : 'base',
        chainId: Number(this.chainId),
        lastChecked: new Date(),
      };
    } catch (error) {
      this.logger.error('Failed to get paymaster status:', error);
      return {
        isActive: false,
        balance: '0',
        network: this.isTestnet ? 'base-sepolia' : 'base',
        chainId: Number(this.chainId),
        lastChecked: new Date(),
      };
    }
  }

  /**
   * Check if paymaster can sponsor transactions
   */
  async canSponsor(): Promise<boolean> {
    try {
      const status = await this.getPaymasterStatus();
      return status.isActive && parseFloat(status.balance) > 0;
    } catch (error) {
      this.logger.error('Failed to check sponsorship capability:', error);
      return false;
    }
  }

  /**
   * Get estimated gas for a UserOperation
   */
  async estimateGas(userOpRequest: UserOpRequest): Promise<{
    callGasLimit: string;
    verificationGasLimit: string;
    preVerificationGas: string;
  }> {
    try {
      // This would typically use the bundler's estimateUserOperationGas method
      // For now, we'll return mock values
      return {
        callGasLimit: '100000',
        verificationGasLimit: '100000',
        preVerificationGas: '50000',
      };
    } catch (error) {
      this.logger.error('Failed to estimate gas:', error);
      throw new InternalServerErrorException('Failed to estimate gas');
    }
  }

  /**
   * Rate limiting implementation
   */
  private checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const userLimit = this.rateLimitMap.get(userId);

    if (!userLimit) {
      this.rateLimitMap.set(userId, { count: 1, resetTime: now + 60000 });
      return true;
    }

    if (now > userLimit.resetTime) {
      // Reset the counter
      this.rateLimitMap.set(userId, { count: 1, resetTime: now + 60000 });
      return true;
    }

    if (userLimit.count >= this.maxUserOpsPerMinute) {
      return false;
    }

    userLimit.count++;
    return true;
  }

  /**
   * Get rate limit status for a user
   */
  getRateLimitStatus(userId: string): {
    remaining: number;
    resetTime: number;
    limit: number;
  } {
    const userLimit = this.rateLimitMap.get(userId);
    const now = Date.now();

    if (!userLimit || now > userLimit.resetTime) {
      return {
        remaining: this.maxUserOpsPerMinute,
        resetTime: now + 60000,
        limit: this.maxUserOpsPerMinute,
      };
    }

    return {
      remaining: Math.max(0, this.maxUserOpsPerMinute - userLimit.count),
      resetTime: userLimit.resetTime,
      limit: this.maxUserOpsPerMinute,
    };
  }

  /**
   * Clean up expired rate limit entries
   */
  cleanupRateLimits(): void {
    const now = Date.now();
    for (const [userId, limit] of this.rateLimitMap.entries()) {
      if (now > limit.resetTime) {
        this.rateLimitMap.delete(userId);
      }
    }
  }
}
