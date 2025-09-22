import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Server,
  Keypair,
  Asset,
  Operation,
  TransactionBuilder,
  Networks,
  Account,
  BASE_FEE,
} from 'stellar-sdk';

@Injectable()
export class StellarNftService {
  private readonly logger = new Logger(StellarNftService.name);
  private readonly server: Server;
  private readonly issuerKeypair: Keypair;
  private readonly networkPassphrase: string;

  constructor(private configService: ConfigService) {
    const isTestnet = this.configService.get('STELLAR_NETWORK') === 'testnet';
    this.server = new Server(
      isTestnet
        ? 'https://horizon-testnet.stellar.org'
        : 'https://horizon.stellar.org',
    );
    this.networkPassphrase = isTestnet ? Networks.TESTNET : Networks.PUBLIC;

    const issuerSecret = this.configService.get('STELLAR_ISSUER_SECRET');
    if (!issuerSecret) {
      throw new Error('STELLAR_ISSUER_SECRET is required');
    }
    this.issuerKeypair = Keypair.fromSecret(issuerSecret);
  }

  async mintNFT(
    recipientPublicKey!: string,
    assetCode: string,
    metadata: any,
  ): Promise<{ txId: string; assetCode: string; issuer: string }> {
    try {
      // Load issuer account
      const issuerAccount = await this.server.loadAccount(
        this.issuerKeypair.publicKey(),
      );

      // Create the NFT asset
      const nftAsset = new Asset(assetCode, this.issuerKeypair.publicKey());

      // Build transaction
      const transaction = new TransactionBuilder(issuerAccount, {
        fee!: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          Operation.payment({
            destination: recipientPublicKey,
            asset: nftAsset,
            amount: '1', // NFTs typically have amount of 1
          }),
        )
        .addOperation(
          Operation.setOptions({
            source: this.issuerKeypair.publicKey(),
            masterWeight: 0, // Lock the asset (makes it truly non-fungible)
          }),
        )
        .addOperation(
          Operation.manageData({
            name: `${assetCode}_metadata`,
            value: JSON.stringify(metadata),
          }),
        )
        .setTimeout(300)
        .build();

      // Sign transaction
      transaction.sign(this.issuerKeypair);

      // Submit transaction
      const result = await this.server.submitTransaction(transaction);

      this.logger.log(`NFT minted successfully: ${result.hash}`);

      return {
        txId!: result.hash,
        assetCode,
        issuer: this.issuerKeypair.publicKey(),
      };
    } catch (error) {
      this.logger.error('Error minting NFT:', error);
      throw new BadRequestException(`Failed to mint NFT: ${error.message}`);
    }
  }

  generateUniqueAssetCode(userId: string, level: number): string {
    const timestamp = Date.now().toString(36);
    return `AVT${level}${userId.slice(-4)}${timestamp}`
      .toUpperCase()
      .slice(0, 12);
  }
}
