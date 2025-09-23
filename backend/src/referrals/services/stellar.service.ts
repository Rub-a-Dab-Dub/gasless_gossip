import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as StellarSdk from 'stellar-sdk';
import { StellarRewardConfig, StellarTransactionResult } from '../interfaces/stellar.interface';

@Injectable()
export class StellarService {
  private readonly logger = new Logger(StellarService.name);
  private server: StellarSdk.Server;
  private rewardConfig: StellarRewardConfig;

  constructor(private configService: ConfigService) {
    const isTestnet = this.configService.get<boolean>('STELLAR_TESTNET', true);
    
    this.server = new StellarSdk.Server(
      isTestnet 
        ? 'https://horizon-testnet.stellar.org'
        : 'https://horizon.stellar.org'
    );

    if (isTestnet) {
      StellarSdk.Networks.TESTNET;
    } else {
      StellarSdk.Networks.PUBLIC;
    }

    this.rewardConfig = {
      baseReward: this.configService.get<number>('STELLAR_BASE_REWARD', 10),
      assetCode: this.configService.get<string>('STELLAR_ASSET_CODE', 'WHISPER'),
      issuerPublicKey: this.configService.get<string>('STELLAR_ISSUER_PUBLIC_KEY'),
      distributorSecretKey: this.configService.get<string>('STELLAR_DISTRIBUTOR_SECRET_KEY'),
    };
  }

  async distributeReward(
    recipientPublicKey: string, 
    amount: number = this.rewardConfig.baseReward
  ): Promise<StellarTransactionResult> {
    try {
      const distributorKeypair = StellarSdk.Keypair.fromSecret(this.rewardConfig.distributorSecretKey);
      const distributorAccount = await this.server.loadAccount(distributorKeypair.publicKey());

      // Create custom asset or use native XLM
      const asset = this.rewardConfig.assetCode === 'XLM' 
        ? StellarSdk.Asset.native()
        : new StellarSdk.Asset(this.rewardConfig.assetCode, this.rewardConfig.issuerPublicKey);

      const transaction = new StellarSdk.TransactionBuilder(distributorAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.configService.get<boolean>('STELLAR_TESTNET', true)
          ? StellarSdk.Networks.TESTNET
          : StellarSdk.Networks.PUBLIC,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: recipientPublicKey,
            asset: asset,
            amount: amount.toString(),
          })
        )
        .addMemo(StellarSdk.Memo.text('Whisper Referral Reward'))
        .setTimeout(30)
        .build();

      transaction.sign(distributorKeypair);

      const result = await this.server.submitTransaction(transaction);
      
      this.logger.log(`Stellar reward distributed: ${result.hash}`);
      
      return {
        success: true,
        transactionId: result.hash,
      };
    } catch (error) {
      this.logger.error('Failed to distribute Stellar reward', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async validateStellarAccount(publicKey: string): Promise<boolean> {
    try {
      await this.server.loadAccount(publicKey);
      return true;
    } catch (error) {
      this.logger.warn(`Invalid Stellar account: ${publicKey}`);
      return false;
    }
  }
}