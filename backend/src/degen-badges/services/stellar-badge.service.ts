import { Injectable, Logger } from "@nestjs/common"
import type { ConfigService } from "@nestjs/config"
import * as StellarSdk from "stellar-sdk"
import { DegenBadgeType } from "../entities/degen-badge.entity"

interface StellarMintResult {
  transactionId: string
  assetCode: string
  assetIssuer: string
  amount: string
}

@Injectable()
export class StellarBadgeService {
  private readonly logger = new Logger(StellarBadgeService.name)
  private readonly server: StellarSdk.Horizon.Server
  private readonly sourceKeypair: StellarSdk.Keypair
  private readonly networkPassphrase: string

  constructor(private readonly configService: ConfigService) {
    const horizonUrl = this.configService.get<string>("STELLAR_HORIZON_URL", "https://horizon-testnet.stellar.org")
    const sourceSecret = this.configService.get<string>("STELLAR_SOURCE_SECRET")
    this.networkPassphrase = this.configService.get<string>("STELLAR_NETWORK_PASSPHRASE", StellarSdk.Networks.TESTNET)

    this.server = new StellarSdk.Horizon.Server(horizonUrl)

    if (!sourceSecret) {
      throw new Error("STELLAR_SOURCE_SECRET environment variable is required")
    }

    this.sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecret)
  }

  async mintBadgeToken(userId: string, badgeType: DegenBadgeType, rewardAmount: number): Promise<StellarMintResult> {
    try {
      // Generate asset code based on badge type
      const assetCode = this.generateAssetCode(badgeType)
      const assetIssuer = this.sourceKeypair.publicKey()

      // Create custom asset
      const badgeAsset = new StellarSdk.Asset(assetCode, assetIssuer)

      // Get user's Stellar account (assuming it's stored in user entity)
      const userPublicKey = await this.getUserStellarAccount(userId)

      if (!userPublicKey) {
        throw new Error(`No Stellar account found for user ${userId}`)
      }

      // Load source account
      const sourceAccount = await this.server.loadAccount(this.sourceKeypair.publicKey())

      // Build transaction
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: this.configService.get<string>("STELLAR_BASE_FEE", "100"),
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination: userPublicKey,
            asset: badgeAsset,
            amount: rewardAmount.toString(),
          }),
        )
        .addMemo(StellarSdk.Memo.text(`Degen Badge: ${badgeType}`))
        .setTimeout(this.configService.get<number>("STELLAR_TIMEOUT", 180))
        .build()

      // Sign transaction
      transaction.sign(this.sourceKeypair)

      // Submit transaction
      const result = await this.server.submitTransaction(transaction)

      this.logger.log(`Successfully minted ${assetCode} badge token for user ${userId}. TX: ${result.hash}`)

      return {
        transactionId: result.hash,
        assetCode,
        assetIssuer,
        amount: rewardAmount.toString(),
      }
    } catch (error) {
      this.logger.error(`Failed to mint badge token for user ${userId}:`, error)
      throw error
    }
  }

  async createBadgeAsset(badgeType: DegenBadgeType): Promise<StellarSdk.Asset> {
    const assetCode = this.generateAssetCode(badgeType)
    const assetIssuer = this.sourceKeypair.publicKey()

    try {
      // Load source account
      const sourceAccount = await this.server.loadAccount(this.sourceKeypair.publicKey())

      // Build transaction to create asset
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: this.configService.get<string>("STELLAR_BASE_FEE", "100"),
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          StellarSdk.Operation.changeTrust({
            asset: new StellarSdk.Asset(assetCode, assetIssuer),
            limit: "1000000", // Set trust limit
          }),
        )
        .addMemo(StellarSdk.Memo.text(`Create Degen Badge Asset: ${badgeType}`))
        .setTimeout(this.configService.get<number>("STELLAR_TIMEOUT", 180))
        .build()

      // Sign and submit
      transaction.sign(this.sourceKeypair)
      await this.server.submitTransaction(transaction)

      this.logger.log(`Created badge asset ${assetCode} for ${badgeType}`)
      return new StellarSdk.Asset(assetCode, assetIssuer)
    } catch (error) {
      this.logger.error(`Failed to create badge asset for ${badgeType}:`, error)
      throw error
    }
  }

  async getBadgeBalance(userPublicKey: string, badgeType: DegenBadgeType): Promise<string> {
    try {
      const assetCode = this.generateAssetCode(badgeType)
      const assetIssuer = this.sourceKeypair.publicKey()

      const account = await this.server.loadAccount(userPublicKey)
      const balance = account.balances.find(
        (balance) =>
          balance.asset_type !== "native" && balance.asset_code === assetCode && balance.asset_issuer === assetIssuer,
      )

      return balance ? balance.balance : "0"
    } catch (error) {
      this.logger.error(`Failed to get badge balance for user ${userPublicKey}:`, error)
      return "0"
    }
  }

  private generateAssetCode(badgeType: DegenBadgeType): string {
    const assetCodes = {
      [DegenBadgeType.HIGH_ROLLER]: "DGNHR",
      [DegenBadgeType.RISK_TAKER]: "DGNRT",
      [DegenBadgeType.STREAK_MASTER]: "DGNSM",
      [DegenBadgeType.WHALE_HUNTER]: "DGNWH",
      [DegenBadgeType.DIAMOND_HANDS]: "DGNDH",
      [DegenBadgeType.DEGEN_LEGEND]: "DGNLG",
    }

    return assetCodes[badgeType]
  }

  private async getUserStellarAccount(userId: string): Promise<string | null> {
    // This would typically query your user database to get the Stellar public key
    // For now, returning a placeholder - implement based on your user entity structure
    try {
      // Example: const user = await this.userService.findById(userId);
      // return user.stellarAccountId;

      // Placeholder implementation
      this.logger.warn(`getUserStellarAccount not fully implemented for user ${userId}`)
      return null
    } catch (error) {
      this.logger.error(`Failed to get Stellar account for user ${userId}:`, error)
      return null
    }
  }
}
