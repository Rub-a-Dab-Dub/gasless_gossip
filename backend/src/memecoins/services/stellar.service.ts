import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as StellarSdk from 'stellar-sdk';

@Injectable()
export class StellarService {
  private readonly logger = new Logger(StellarService.name);
  private readonly server: StellarSdk.Server;
  private readonly issuerKeypair: StellarSdk.Keypair;
  private readonly distributorKeypair: StellarSdk.Keypair;

  constructor(private configService: ConfigService) {
    // Initialize Stellar server (testnet for development)
    const networkType = this.configService.get('STELLAR_NETWORK', 'testnet');
    this.server = networkType === 'mainnet' 
      ? new StellarSdk.Server('https://horizon.stellar.org')
      : new StellarSdk.Server('https://horizon-testnet.stellar.org');

    // Set network
    if (networkType === 'mainnet') {
      StellarSdk.Networks.PUBLIC;
    } else {
      StellarSdk.Networks.TESTNET;
    }

    // Initialize keypairs from environment
    const issuerSecret = this.configService.get('STELLAR_ISSUER_SECRET');
    const distributorSecret = this.configService.get('STELLAR_DISTRIBUTOR_SECRET');

    if (!issuerSecret || !distributorSecret) {
      throw new Error('Stellar keypairs must be configured in environment variables');
    }

    this.issuerKeypair = StellarSdk.Keypair.fromSecret(issuerSecret);
    this.distributorKeypair = StellarSdk.Keypair.fromSecret(distributorSecret);
  }

  async createMemecoinAsset(assetCode: string): Promise<StellarSdk.Asset> {
    try {
      return new StellarSdk.Asset(assetCode, this.issuerKeypair.publicKey());
    } catch (error) {
      this.logger.error(`Failed to create asset: ${error.message}`);
      throw new BadRequestException('Invalid asset parameters');
    }
  }

  async distributeToRecipients(
    recipients: string[],
    amount: number,
    assetCode: string = 'MEME'
  ): Promise<string> {
    try {
      const asset = await this.createMemecoinAsset(assetCode);
      const distributorAccount = await this.server.loadAccount(this.distributorKeypair.publicKey());

      const transaction = new StellarSdk.TransactionBuilder(distributorAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.configService.get('STELLAR_NETWORK') === 'mainnet' 
          ? StellarSdk.Networks.PUBLIC 
          : StellarSdk.Networks.TESTNET,
      });

      // Add payment operations for each recipient
      for (const recipient of recipients) {
        transaction.addOperation(
          StellarSdk.Operation.payment({
            destination: recipient,
            asset: asset,
            amount: amount.toString(),
          })
        );
      }

      const builtTransaction = transaction.setTimeout(30).build();
      builtTransaction.sign(this.distributorKeypair);

      const result = await this.server.submitTransaction(builtTransaction);
      
      this.logger.log(`Successfully distributed ${amount} ${assetCode} to ${recipients.length} recipients`);
      return result.hash;

    } catch (error) {
      this.logger.error(`Distribution failed: ${error.message}`);
      throw new BadRequestException(`Failed to distribute memecoins: ${error.message}`);
    }
  }

  async establishTrustline(userPublicKey: string, assetCode: string): Promise<string> {
    try {
      const asset = await this.createMemecoinAsset(assetCode);
      const userAccount = await this.server.loadAccount(userPublicKey);

      const transaction = new StellarSdk.TransactionBuilder(userAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.configService.get('STELLAR_NETWORK') === 'mainnet' 
          ? StellarSdk.Networks.PUBLIC 
          : StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.changeTrust({
            asset: asset,
          })
        )
        .setTimeout(30)
        .build();

      // Note: In production, the user would sign this transaction
      // For demo purposes, we're returning the XDR
      return transaction.toXDR();

    } catch (error) {
      this.logger.error(`Failed to establish trustline: ${error.message}`);
      throw new BadRequestException('Failed to establish trustline');
    }
  }

  getIssuerPublicKey(): string {
    return this.issuerKeypair.publicKey();
  }

  getDistributorPublicKey(): string {
    return this.distributorKeypair.publicKey();
  }
}