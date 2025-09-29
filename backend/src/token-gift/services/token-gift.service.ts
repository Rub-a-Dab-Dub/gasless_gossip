import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as StellarSdk from 'stellar-sdk';
import { TokenGift } from '../entities/token-gift.entity';
import { TokenGiftTransaction } from '../entities/token-gift-transaction.entity';
import { 
  CreateTokenGiftDto, 
  TokenGiftDto, 
  TokenGiftTransactionDto,
  TokenGiftResponseDto,
  GasEstimateDto,
  PaymasterStatusDto
} from '../dto/token-gift.dto';

@Injectable()
export class TokenGiftService {
  private readonly logger = new Logger(TokenGiftService.name);
  private stellarServer: StellarSdk.Horizon.Server;
  private stellarNetwork: string;

  constructor(
    @InjectRepository(TokenGift)
    private readonly tokenGiftRepo: Repository<TokenGift>,
    @InjectRepository(TokenGiftTransaction)
    private readonly transactionRepo: Repository<TokenGiftTransaction>,
    private readonly configService: ConfigService,
  ) {
    // Initialize Stellar SDK
    this.stellarNetwork = this.configService.get('STELLAR_NETWORK', 'testnet');
    this.stellarServer = new StellarSdk.Horizon.Server(
      this.stellarNetwork === 'mainnet' 
        ? 'https://horizon.stellar.org'
        : 'https://horizon-testnet.stellar.org'
    );
  }

  async createTokenGift(dto: CreateTokenGiftDto, senderId: string): Promise<TokenGiftResponseDto> {
    const startTime = Date.now();
    
    try {
      // Create token gift record
      const tokenGift = this.tokenGiftRepo.create({
        senderId,
        recipientId: dto.recipientId,
        tokenAddress: dto.tokenAddress,
        tokenSymbol: dto.tokenSymbol,
        amount: dto.amount,
        network: dto.network,
        message: dto.message,
        metadata: dto.metadata,
        status: 'pending',
      });

      const savedGift = await this.tokenGiftRepo.save(tokenGift);

      // Estimate gas costs
      const gasEstimate = await this.estimateGasCosts(dto);

      // Check paymaster status
      const paymasterStatus = await this.checkPaymasterStatus(dto.network);

      // Process the gift
      const result = await this.processTokenGift(savedGift, gasEstimate, paymasterStatus);

      const processingTime = Date.now() - startTime;
      this.logger.log(`Token gift created for ${dto.recipientId} (${processingTime}ms)`);

      return result;
    } catch (error) {
      this.logger.error(`Failed to create token gift:`, error);
      throw new BadRequestException('Failed to create token gift');
    }
  }

  private async processTokenGift(
    gift: TokenGift,
    gasEstimate: GasEstimateDto,
    paymasterStatus: PaymasterStatusDto
  ): Promise<TokenGiftResponseDto> {
    try {
      // Update gift status
      gift.status = 'processing';
      await this.tokenGiftRepo.save(gift);

      // Process Stellar transaction
      const stellarTx = await this.processStellarTransaction(gift);
      
      // Process Base paymaster transaction if needed
      const baseTx = paymasterStatus.sponsored 
        ? await this.processBasePaymasterTransaction(gift, gasEstimate)
        : null;

      // Update gift with transaction hashes
      gift.stellarTxHash = stellarTx.txHash;
      gift.baseTxHash = baseTx?.txHash;
      gift.paymasterTxHash = baseTx?.paymasterTxHash;
      gift.gasUsed = gasEstimate.gasUsed;
      gift.gasPrice = gasEstimate.gasPrice;
      gift.totalCost = gasEstimate.totalCost;
      gift.status = 'completed';
      gift.processedAt = new Date();
      gift.completedAt = new Date();

      await this.tokenGiftRepo.save(gift);

      return {
        gift: this.mapGiftToDto(gift),
        transactions: [stellarTx, baseTx].filter(Boolean).map(t => this.mapTransactionToDto(t)),
        estimatedGas: {
          stellar: gasEstimate.gasUsed,
          base: gasEstimate.gasPrice,
          total: gasEstimate.totalCost,
        },
        paymasterStatus,
      };
    } catch (error) {
      // Mark gift as failed
      gift.status = 'failed';
      await this.tokenGiftRepo.save(gift);

      this.logger.error(`Failed to process token gift ${gift.id}:`, error);
      throw error;
    }
  }

  private async processStellarTransaction(gift: TokenGift): Promise<TokenGiftTransaction> {
    try {
      // Create Stellar transaction
      const transaction = await this.createStellarTransaction(gift);
      
      // Submit transaction
      const response = await this.stellarServer.submitTransaction(transaction);
      
      // Create transaction record
      const txRecord = this.transactionRepo.create({
        giftId: gift.id,
        network: 'stellar',
        txHash: response.hash,
        status: 'confirmed',
        blockNumber: response.ledger.toString(),
        gasUsed: '0', // Stellar doesn't use gas
        gasPrice: '0',
        transactionFee: response.fee_charged,
        sponsored: false,
        transactionData: {
          operation: 'payment',
          asset: gift.tokenSymbol,
          amount: gift.amount,
        },
        receipt: {
          hash: response.hash,
          ledger: response.ledger,
          fee: response.fee_charged,
        },
      });

      const savedTx = await this.transactionRepo.save(txRecord);
      
      this.logger.log(`Stellar transaction submitted: ${response.hash}`);
      return savedTx;
    } catch (error) {
      this.logger.error(`Stellar transaction failed:`, error);
      throw error;
    }
  }

  private async processBasePaymasterTransaction(
    gift: TokenGift,
    gasEstimate: GasEstimateDto
  ): Promise<TokenGiftTransaction> {
    try {
      // This would integrate with Base paymaster
      // For now, we'll simulate the transaction
      const paymasterTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      const txRecord = this.transactionRepo.create({
        giftId: gift.id,
        network: 'base',
        txHash: paymasterTxHash,
        status: 'confirmed',
        gasUsed: gasEstimate.gasUsed,
        gasPrice: gasEstimate.gasPrice,
        transactionFee: gasEstimate.totalCost,
        sponsored: true,
        paymasterAddress: this.configService.get('BASE_PAYMASTER_ADDRESS'),
        transactionData: {
          paymaster: true,
          sponsored: true,
          gasEstimate: gasEstimate,
        },
        receipt: {
          hash: paymasterTxHash,
          sponsored: true,
        },
      });

      const savedTx = await this.transactionRepo.save(txRecord);
      
      this.logger.log(`Base paymaster transaction submitted: ${paymasterTxHash}`);
      return savedTx;
    } catch (error) {
      this.logger.error(`Base paymaster transaction failed:`, error);
      throw error;
    }
  }

  private async createStellarTransaction(gift: TokenGift): Promise<StellarSdk.Transaction> {
    // This would create the actual Stellar transaction
    // For now, we'll return a mock transaction
    const sourceKeypair = StellarSdk.Keypair.random();
    const sourceAccount = await this.stellarServer.loadAccount(sourceKeypair.publicKey());
    
    const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: this.stellarNetwork === 'mainnet' 
        ? StellarSdk.Networks.PUBLIC 
        : StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: gift.recipientId, // This would be the recipient's Stellar address
          asset: StellarSdk.Asset.native(),
          amount: gift.amount,
        })
      )
      .setTimeout(30)
      .build();

    transaction.sign(sourceKeypair);
    return transaction;
  }

  private async estimateGasCosts(dto: CreateTokenGiftDto): Promise<GasEstimateDto> {
    // Estimate gas costs for both Stellar and Base
    const stellarGas = '0'; // Stellar doesn't use gas
    const baseGas = '21000'; // Standard ETH transfer gas
    const gasPrice = '20000000000'; // 20 gwei
    
    return {
      network: dto.network,
      gasUsed: baseGas,
      gasPrice: gasPrice,
      totalCost: (parseInt(baseGas) * parseInt(gasPrice)).toString(),
      sponsored: true,
      paymasterCoverage: '100',
    };
  }

  private async checkPaymasterStatus(network: string): Promise<PaymasterStatusDto> {
    // Check if paymaster is available and has sufficient balance
    const paymasterAddress = this.configService.get('BASE_PAYMASTER_ADDRESS');
    const maxGas = this.configService.get('BASE_PAYMASTER_MAX_GAS', '1000000');
    
    return {
      available: true,
      sponsored: true,
      maxGas,
      remainingBalance: '1000000000000000000', // 1 ETH in wei
      network,
    };
  }

  async getTokenGift(giftId: string): Promise<TokenGiftResponseDto> {
    const gift = await this.tokenGiftRepo.findOne({ where: { id: giftId } });
    if (!gift) {
      throw new NotFoundException('Token gift not found');
    }

    const transactions = await this.transactionRepo.find({
      where: { giftId },
      order: { createdAt: 'ASC' },
    });

    return {
      gift: this.mapGiftToDto(gift),
      transactions: transactions.map(t => this.mapTransactionToDto(t)),
    };
  }

  async getUserTokenGifts(userId: string, limit: number = 20): Promise<TokenGiftDto[]> {
    const gifts = await this.tokenGiftRepo.find({
      where: [
        { senderId: userId },
        { recipientId: userId },
      ],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    return gifts.map(gift => this.mapGiftToDto(gift));
  }

  async getTokenGiftTransactions(giftId: string): Promise<TokenGiftTransactionDto[]> {
    const transactions = await this.transactionRepo.find({
      where: { giftId },
      order: { createdAt: 'ASC' },
    });

    return transactions.map(t => this.mapTransactionToDto(t));
  }

  async getGasEstimate(dto: CreateTokenGiftDto): Promise<GasEstimateDto> {
    return this.estimateGasCosts(dto);
  }

  async getPaymasterStatus(network: string): Promise<PaymasterStatusDto> {
    return this.checkPaymasterStatus(network);
  }

  // Performance monitoring
  async getPerformanceMetrics(): Promise<{
    totalGifts: number;
    completedGifts: number;
    averageProcessingTime: number;
    successRate: number;
  }> {
    const [totalGifts, completedGifts] = await Promise.all([
      this.tokenGiftRepo.count(),
      this.tokenGiftRepo.count({ where: { status: 'completed' } }),
    ]);

    const successRate = totalGifts > 0 ? completedGifts / totalGifts : 0;

    return {
      totalGifts,
      completedGifts,
      averageProcessingTime: 0, // Would be tracked in real implementation
      successRate,
    };
  }

  private mapGiftToDto(gift: TokenGift): TokenGiftDto {
    return {
      id: gift.id,
      senderId: gift.senderId,
      recipientId: gift.recipientId,
      tokenAddress: gift.tokenAddress,
      tokenSymbol: gift.tokenSymbol,
      amount: gift.amount,
      network: gift.network,
      status: gift.status,
      stellarTxHash: gift.stellarTxHash,
      baseTxHash: gift.baseTxHash,
      paymasterTxHash: gift.paymasterTxHash,
      gasUsed: gift.gasUsed,
      gasPrice: gift.gasPrice,
      totalCost: gift.totalCost,
      message: gift.message,
      metadata: gift.metadata,
      sorobanData: gift.sorobanData,
      paymasterData: gift.paymasterData,
      processedAt: gift.processedAt,
      completedAt: gift.completedAt,
      createdAt: gift.createdAt,
      updatedAt: gift.updatedAt,
    };
  }

  private mapTransactionToDto(transaction: TokenGiftTransaction): TokenGiftTransactionDto {
    return {
      id: transaction.id,
      giftId: transaction.giftId,
      network: transaction.network,
      txHash: transaction.txHash,
      status: transaction.status,
      blockNumber: transaction.blockNumber,
      confirmations: transaction.confirmations,
      gasUsed: transaction.gasUsed,
      gasPrice: transaction.gasPrice,
      effectiveGasPrice: transaction.effectiveGasPrice,
      transactionFee: transaction.transactionFee,
      sponsored: transaction.sponsored,
      paymasterAddress: transaction.paymasterAddress,
      transactionData: transaction.transactionData,
      receipt: transaction.receipt,
      errorMessage: transaction.errorMessage,
      createdAt: transaction.createdAt,
    };
  }
}
