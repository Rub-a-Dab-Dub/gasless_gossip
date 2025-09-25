import { Injectable, Logger, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as StellarSdk from 'stellar-sdk';
import { WalletConnection, WalletType, ConnectionStatus } from '../entities/wallet-connection.entity';
import { ConnectWalletDto } from '../dto/connect-wallet.dto';
import { TransactionRequestDto } from '../dto/transaction-request.dto';
import { WalletAuthResult, StellarTransactionResult, WalletBalance, AlbedoAuthData } from '../interfaces/wallet.interface';

@Injectable()
export class WalletIntegrationService {
  private readonly logger = new Logger(WalletIntegrationService.name);
  private readonly server: StellarSdk.Server;
  private readonly networkPassphrase: string;

  constructor(
    @InjectRepository(WalletConnection)
    private readonly walletConnectionRepository: Repository<WalletConnection>,
    private readonly configService: ConfigService,
  ) {
    const horizonUrl = this.configService.get<string>('STELLAR_HORIZON_URL', 'https://horizon-testnet.stellar.org');
    const network = this.configService.get<string>('STELLAR_NETWORK', 'testnet');
    
    this.server = new StellarSdk.Server(horizonUrl);
    this.networkPassphrase = network === 'testnet' 
      ? StellarSdk.Networks.TESTNET 
      : StellarSdk.Networks.PUBLIC;
  }

  async connectWallet(userId: string, connectWalletDto: ConnectWalletDto): Promise<WalletConnection> {
    const { walletType, address, publicKey, signature, metadata } = connectWalletDto;

    // Check if wallet is already connected
    const existingConnection = await this.walletConnectionRepository.findOne({
      where: { address }
    });

    if (existingConnection) {
      throw new ConflictException('Wallet address is already connected');
    }

    // Validate wallet based on type
    const authResult = await this.validateWalletAuth(walletType, address, publicKey, signature);
    
    if (!authResult.success) {
      throw new BadRequestException(`Wallet validation failed: ${authResult.error}`);
    }

    // Create wallet connection
    const walletConnection = this.walletConnectionRepository.create({
      userId,
      walletType,
      address: authResult.address!,
      publicKey: authResult.publicKey,
      signature: authResult.signature,
      status: ConnectionStatus.ACTIVE,
      metadata: {
        ...metadata,
        connectedAt: new Date().toISOString(),
        walletVersion: this.getWalletVersion(walletType)
      }
    });

    const savedConnection = await this.walletConnectionRepository.save(walletConnection);
    
    this.logger.log(`Wallet connected: ${walletType} - ${address} for user ${userId}`);
    
    return savedConnection;
  }

  async getUserWallets(userId: string): Promise<WalletConnection[]> {
    return this.walletConnectionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async getWalletById(walletId: string, userId: string): Promise<WalletConnection> {
    const wallet = await this.walletConnectionRepository.findOne({
      where: { id: walletId, userId }
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  async disconnectWallet(walletId: string, userId: string): Promise<void> {
    const wallet = await this.getWalletById(walletId, userId);
    
    await this.walletConnectionRepository.update(walletId, {
      status: ConnectionStatus.DISCONNECTED
    });

    this.logger.log(`Wallet disconnected: ${wallet.walletType} - ${wallet.address}`);
  }

  async sendTransaction(
    walletId: string, 
    userId: string, 
    transactionDto: TransactionRequestDto
  ): Promise<StellarTransactionResult> {
    const wallet = await this.getWalletById(walletId, userId);

    if (wallet.status !== ConnectionStatus.ACTIVE) {
      throw new BadRequestException('Wallet is not active');
    }

    try {
      // For Albedo, we would typically use the Albedo SDK on the frontend
      // Here we simulate the transaction process
      const result = await this.processStellarTransaction(wallet, transactionDto);
      
      // Update last used timestamp
      await this.walletConnectionRepository.update(walletId, {
        lastUsedAt: new Date()
      });

      return result;
    } catch (error) {
      this.logger.error(`Transaction failed for wallet ${walletId}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getWalletBalance(walletId: string, userId: string): Promise<WalletBalance[]> {
    const wallet = await this.getWalletById(walletId, userId);

    try {
      const account = await this.server.loadAccount(wallet.address);
      
      return account.balances.map(balance => ({
        assetCode: balance.asset_type === 'native' ? 'XLM' : (balance as any).asset_code,
        balance: balance.balance,
        limit: (balance as any).limit
      }));
    } catch (error) {
      this.logger.error(`Failed to get balance for wallet ${walletId}:`, error);
      throw new BadRequestException('Failed to retrieve wallet balance');
    }
  }

  async getWalletStats(userId: string) {
    const wallets = await this.getUserWallets(userId);
    
    const stats = {
      totalWallets: wallets.length,
      activeWallets: wallets.filter(w => w.status === ConnectionStatus.ACTIVE).length,
      walletTypes: {} as Record<WalletType, number>,
      lastConnectedAt: wallets.length > 0 ? wallets[0].createdAt : null
    };

    // Count by wallet type
    Object.values(WalletType).forEach(type => {
      stats.walletTypes[type] = wallets.filter(w => w.walletType === type).length;
    });

    return stats;
  }

  private async validateWalletAuth(
    walletType: WalletType,
    address: string,
    publicKey?: string,
    signature?: string
  ): Promise<WalletAuthResult> {
    try {
      switch (walletType) {
        case WalletType.ALBEDO:
          return await this.validateAlbedoAuth(address, publicKey, signature);
        case WalletType.FREIGHTER:
          return await this.validateFreighterAuth(address, publicKey, signature);
        case WalletType.RABET:
          return await this.validateRabetAuth(address, publicKey, signature);
        case WalletType.LUMENS:
          return await this.validateLumensAuth(address, publicKey, signature);
        default:
          return { success: false, error: 'Unsupported wallet type' };
      }
    } catch (error) {
      this.logger.error(`Wallet validation failed for ${walletType}:`, error);
      return { success: false, error: error.message };
    }
  }

  private async validateAlbedoAuth(
    address: string,
    publicKey?: string,
    signature?: string
  ): Promise<WalletAuthResult> {
    // For Albedo, we would typically verify the signature against a challenge
    // For now, we'll do basic validation
    if (!this.isValidStellarAddress(address)) {
      return { success: false, error: 'Invalid Stellar address' };
    }

    // In a real implementation, you would:
    // 1. Generate a challenge message
    // 2. Verify the signature against the challenge
    // 3. Ensure the public key matches the address

    return {
      success: true,
      address,
      publicKey: publicKey || address,
      signature
    };
  }

  private async validateFreighterAuth(
    address: string,
    publicKey?: string,
    signature?: string
  ): Promise<WalletAuthResult> {
    if (!this.isValidStellarAddress(address)) {
      return { success: false, error: 'Invalid Stellar address' };
    }

    return {
      success: true,
      address,
      publicKey: publicKey || address,
      signature
    };
  }

  private async validateRabetAuth(
    address: string,
    publicKey?: string,
    signature?: string
  ): Promise<WalletAuthResult> {
    if (!this.isValidStellarAddress(address)) {
      return { success: false, error: 'Invalid Stellar address' };
    }

    return {
      success: true,
      address,
      publicKey: publicKey || address,
      signature
    };
  }

  private async validateLumensAuth(
    address: string,
    publicKey?: string,
    signature?: string
  ): Promise<WalletAuthResult> {
    if (!this.isValidStellarAddress(address)) {
      return { success: false, error: 'Invalid Stellar address' };
    }

    return {
      success: true,
      address,
      publicKey: publicKey || address,
      signature
    };
  }

  private async processStellarTransaction(
    wallet: WalletConnection,
    transactionDto: TransactionRequestDto
  ): Promise<StellarTransactionResult> {
    try {
      // In a real implementation, this would use the appropriate wallet SDK
      // For now, we'll simulate a successful transaction
      
      const mockTransactionId = `stellar_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      this.logger.log(`Simulated transaction: ${transactionDto.amount} ${transactionDto.assetCode} from ${wallet.address} to ${transactionDto.toAddress}`);
      
      return {
        success: true,
        transactionId: mockTransactionId,
        ledger: Math.floor(Math.random() * 1000000) + 50000000
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  private isValidStellarAddress(address: string): boolean {
    return /^G[0-9A-Z]{55}$/.test(address);
  }

  private getWalletVersion(walletType: WalletType): string {
    const versions = {
      [WalletType.ALBEDO]: '1.0.0',
      [WalletType.FREIGHTER]: '2.0.0',
      [WalletType.RABET]: '1.5.0',
      [WalletType.LUMENS]: '1.0.0'
    };
    
    return versions[walletType] || '1.0.0';
  }
}
