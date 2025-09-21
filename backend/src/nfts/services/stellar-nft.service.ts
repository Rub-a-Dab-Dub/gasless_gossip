import { Injectable, Logger, InternalServerErrorException } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import { Server, Keypair, TransactionBuilder, Networks, Operation, Asset, BASE_FEE } from "stellar-sdk"
import type { NftMetadata } from "../entities/nft.entity"

export interface MintNftResult {
  transactionId: string
  assetCode: string
  assetIssuer: string
  contractAddress: string
  tokenId: string
}

@Injectable()
export class StellarNftService {
  private readonly logger = new Logger(StellarNftService.name)
  private readonly server: Server
  private readonly networkPassphrase: string
  private readonly sourceKeypair: Keypair

  constructor(private configService: ConfigService) {
    const horizonUrl = this.configService.get<string>("STELLAR_HORIZON_URL", "https://horizon-testnet.stellar.org")
    this.server = new Server(horizonUrl)
    this.networkPassphrase = this.configService.get<string>("STELLAR_NETWORK_PASSPHRASE", Networks.TESTNET)

    const sourceSecret = this.configService.get<string>("STELLAR_SOURCE_SECRET")
    if (!sourceSecret) {
      throw new Error("STELLAR_SOURCE_SECRET environment variable is required")
    }
    this.sourceKeypair = Keypair.fromSecret(sourceSecret)
  }

  async mintNft(
    recipientPublicKey: string,
    metadata: NftMetadata,
    collectionSymbol = "WHISPER",
  ): Promise<MintNftResult> {
    try {
      this.logger.log(`Minting NFT for recipient: ${recipientPublicKey}`)

      // Generate unique asset code for this NFT
      const assetCode = this.generateAssetCode(collectionSymbol)
      const asset = new Asset(assetCode, this.sourceKeypair.publicKey())

      // Load source account
      const sourceAccount = await this.server.loadAccount(this.sourceKeypair.publicKey())

      // Create transaction to mint NFT
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        // Create the asset (NFT)
        .addOperation(
          Operation.changeTrust({
            asset: asset,
            source: recipientPublicKey,
          }),
        )
        // Mint exactly 1 unit of the NFT to the recipient
        .addOperation(
          Operation.payment({
            destination: recipientPublicKey,
            asset: asset,
            amount: "1",
          }),
        )
        // Set metadata as manage data operations
        .addOperation(
          Operation.manageData({
            name: `nft_metadata_${assetCode}`,
            value: JSON.stringify(metadata),
          }),
        )
        // Lock the asset by setting auth required and removing master weight
        .addOperation(
          Operation.setOptions({
            setFlags: 2, // AUTH_REQUIRED_FLAG
          }),
        )
        .setTimeout(300)
        .build()

      // Sign transaction
      transaction.sign(this.sourceKeypair)

      // Submit transaction
      const result = await this.server.submitTransaction(transaction)

      this.logger.log(`NFT minted successfully. Transaction ID: ${result.hash}`)

      return {
        transactionId: result.hash,
        assetCode: assetCode,
        assetIssuer: this.sourceKeypair.publicKey(),
        contractAddress: this.sourceKeypair.publicKey(),
        tokenId: assetCode,
      }
    } catch (error) {
      this.logger.error(`Failed to mint NFT: ${error.message}`, error.stack)
      throw new InternalServerErrorException(`Failed to mint NFT: ${error.message}`)
    }
  }

  async transferNft(
    fromPublicKey: string,
    toPublicKey: string,
    assetCode: string,
    assetIssuer: string,
  ): Promise<string> {
    try {
      this.logger.log(`Transferring NFT ${assetCode} from ${fromPublicKey} to ${toPublicKey}`)

      const asset = new Asset(assetCode, assetIssuer)
      const sourceAccount = await this.server.loadAccount(fromPublicKey)

      const transaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        // Ensure recipient trusts the asset
        .addOperation(
          Operation.changeTrust({
            asset: asset,
            source: toPublicKey,
          }),
        )
        // Transfer the NFT
        .addOperation(
          Operation.payment({
            destination: toPublicKey,
            asset: asset,
            amount: "1",
            source: fromPublicKey,
          }),
        )
        .setTimeout(300)
        .build()

      // Note: In a real implementation, you'd need the sender's private key
      // This is a simplified version for demonstration
      const result = await this.server.submitTransaction(transaction)

      this.logger.log(`NFT transferred successfully. Transaction ID: ${result.hash}`)
      return result.hash
    } catch (error) {
      this.logger.error(`Failed to transfer NFT: ${error.message}`, error.stack)
      throw new InternalServerErrorException(`Failed to transfer NFT: ${error.message}`)
    }
  }

  async getNftMetadata(assetCode: string, assetIssuer: string): Promise<NftMetadata | null> {
    try {
      const account = await this.server.loadAccount(assetIssuer)
      const dataKey = `nft_metadata_${assetCode}`

      if (account.data_attr && account.data_attr[dataKey]) {
        const metadataBuffer = Buffer.from(account.data_attr[dataKey], "base64")
        return JSON.parse(metadataBuffer.toString())
      }

      return null
    } catch (error) {
      this.logger.error(`Failed to get NFT metadata: ${error.message}`)
      return null
    }
  }

  async verifyNftOwnership(publicKey: string, assetCode: string, assetIssuer: string): Promise<boolean> {
    try {
      const account = await this.server.loadAccount(publicKey)
      const asset = new Asset(assetCode, assetIssuer)

      const balance = account.balances.find(
        (balance) =>
          balance.asset_type !== "native" &&
          balance.asset_code === asset.getCode() &&
          balance.asset_issuer === asset.getIssuer(),
      )

      return balance && Number.parseFloat(balance.balance) >= 1
    } catch (error) {
      this.logger.error(`Failed to verify NFT ownership: ${error.message}`)
      return false
    }
  }

  private generateAssetCode(collectionSymbol: string): string {
    // Generate a unique 12-character asset code
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 6)
    return `${collectionSymbol}${timestamp}${random}`.substring(0, 12).toUpperCase()
  }

  async getTransactionDetails(transactionId: string) {
    try {
      return await this.server.transactions().transaction(transactionId).call()
    } catch (error) {
      this.logger.error(`Failed to get transaction details: ${error.message}`)
      return null
    }
  }
}
